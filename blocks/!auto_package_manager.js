// Singleton instance
let packageManagerInstance = null;

class PackageManager {
    constructor(DBB, devmode = false) {
        this.DBB = DBB;
        this.devmode = devmode;
        this.execSync = require("child_process").execSync;
        this.fs = require("fs");
        this.requireRestart = false;
        this.queue = [];
        this.isProcessing = false;
        this.activeRequests = 0; // Track active requires() calls
    }

    async log(message, type = "INFO", force = false) {
        if (this.devmode || force) {
            if (type && message) {
                this.DBB.Core.console(type, message);
            }
        }
    }

        async getBranchVersion(packageName, branch) {
            try {
                const response = await fetch(`https://registry.npmjs.org/${packageName}`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const data = await response.json();
                return data["dist-tags"]?.[branch] || Object.keys(data["versions"]).filter((version) => version === branch || version.startsWith(branch)).reverse()?.[0] || null;
            } catch (error) {
                this.log(`Could not fetch ${branch} version for ${packageName}: ${error.message}`, "WARN", true);
                return null;
            }
        }

        async installPackages(packages, force = false) {
            if (!packages || packages.length === 0) return true;

            const packageStrings = packages.map((pkg) => (typeof pkg === "string" ? pkg : `${pkg.name}@${pkg.version || "latest"}`));

            const command = `npm install ${packageStrings.join(" ")}${force ? " --force" : ""}`;
            try {
                const stdout = this.execSync(command, { stdio: "pipe" });
                return stdout.toString();
            } catch (error) {
                throw new Error(`Error installing packages: ${error.stderr.toString()}`);
            }
        }

        async uninstallPackages(packages) {
            if (!packages || packages.length === 0) return true;

            const command = `npm uninstall ${packages.join(" ")}`;
            try {
                const stdout = this.execSync(command, { stdio: "pipe" });
                return stdout.toString();
            } catch (error) {
                throw new Error(`Error uninstalling packages: ${error.stderr.toString()}`);
            }
        }

        async getInstalledVersion(packageName) {
            try {
                const packageJson = JSON.parse(this.fs.readFileSync("./package.json", "utf-8"));
                return packageJson.dependencies?.[packageName] || packageJson.devDependencies?.[packageName] || null;
            } catch (error) {
                throw new Error(`Could not read package.json: ${error.message}`);
            }
        }

        async processQueue() {
            if (this.isProcessing || this.queue.length === 0) return;

            this.isProcessing = true;
            // Copy current queue items but DON'T clear the queue yet
            const currentBatch = [...this.queue];
            // Only remove the items we're about to process
            this.queue.splice(0, currentBatch.length);

            try {
                // Separate packages by action type
                const toUninstall = [];
                const toInstall = [];
                const toUpdate = [];
                const toCheck = [];

                for (const pkg of currentBatch) {
                    if (pkg.uninstall) {
                        toUninstall.push(pkg);
                    } else {
                        const installedVersion = await this.getInstalledVersion(pkg.name);

                        if (!installedVersion) {
                            toInstall.push(pkg);
                        } else if (pkg.force) {
                            toUpdate.push(pkg);
                        } else {
                            const branchVersion = await this.getBranchVersion(pkg.name, pkg.version || "latest");
                            if (branchVersion && installedVersion.replace(/\^/g, "") !== branchVersion) {
                                toUpdate.push(pkg);
                            } else {
                                toCheck.push(pkg);
                            }
                        }
                    }
                }

                // Handle uninstallations in batch
                if (toUninstall.length > 0) {
                    const packagesToUninstall = [];
                    for (const pkg of toUninstall) {
                        try {
                            require(pkg.name);
                            packagesToUninstall.push(pkg.name);
                            this.log(`${pkg.name} marked for uninstallation.`, "INFO", true);
                        } catch {
                            this.log(`${pkg.name} is not installed, skipping uninstallation.`, "INFO", false);
                        }
                    }

                    if (packagesToUninstall.length > 0) {
                        this.log(`Uninstalling packages: ${packagesToUninstall.join(", ")}...`, "INFO", true);
                        await this.uninstallPackages(packagesToUninstall);
                        this.log(`Packages uninstalled successfully.`, "SUCCESS", true);
                    }
                }

                // Handle installations in batch
                if (toInstall.length > 0) {
                    const packageStrings = toInstall.map((pkg) => `${pkg.name}@${pkg.version || "latest"}`);
                    this.log(`Installing packages: ${packageStrings.join(", ")}...`, "INFO", true);
                    await this.installPackages(packageStrings);
                    this.log(`Packages installed successfully.`, "SUCCESS", true);
                    this.requireRestart = toInstall.some((pkg) => !pkg.dnr);
                }

                // Handle updates in batch
                if (toUpdate.length > 0) {
                    const updateDetails = [];
                    for (const pkg of toUpdate) {
                        const installedVersion = await this.getInstalledVersion(pkg.name);
                        const targetVersion = pkg.version || "latest";
                        const branchVersion = await this.getBranchVersion(pkg.name, targetVersion);
                        const displayVersion = branchVersion || targetVersion;
                        updateDetails.push(`${pkg.name} (${installedVersion} → ${displayVersion})`);
                    }
                    const packageStrings = toUpdate.map((pkg) => `${pkg.name}@${pkg.version || "latest"}`);
                    this.log(`Updating packages: ${updateDetails.join(", ")}...`, "INFO", true);
                    await this.installPackages(packageStrings, true);
                    this.log(`Packages updated successfully.`, "SUCCESS", true);
                    this.requireRestart = true;
                }

                // Check packages that are up-to-date
                for (const pkg of toCheck) {
                    if (!pkg.dnr) {
                        try {
                            require(pkg.name);
                        } catch (e) {
                            const match = e.message.match(/Cannot find module ['"](.+?)['"]/);
                            if (match?.length > 1) {
                                const missingModule = match[1];
                                this.log(`Missing module: ${missingModule}. Attempting to install...`, "INFO", true);
                                try {
                                    await this.installPackages([`${missingModule}@${pkg.version || "latest"}`], true);
                                    this.log(`${missingModule} installed successfully.`, "SUCCESS", true);
                                    this.requireRestart = true;
                                } catch (installError) {
                                    this.log(`Failed to install ${missingModule}: ${installError.message}`, "WARN", true);
                                }
                            } else {
                                this.log(`Error requiring ${pkg.name}: ${e.message}. Attempting fix...`, "WARN", true);
                                await this.installPackages([`${pkg.name}@${pkg.version || "latest"}`], true);
                                this.requireRestart = true;
                            }
                        }
                    }
                    const installedVersion = await this.getInstalledVersion(pkg.name);
                    this.log(`${pkg.name} is already up-to-date (${installedVersion}).`, "INFO");
                }
            } catch (error) {
                this.log(`Error processing queue: ${error.message}`, "WARN", true);
            } finally {
                this.isProcessing = false;

                // Process any new items that were added while processing
                if (this.queue.length > 0) {
                    await this.processQueue();
                }
            }
        }

        async requires(...packages) {
            try {
                if (!packages || packages.length === 0) {
                    return true;
                }

                // Increment active request counter
                this.activeRequests++;

                // Add all packages to the queue
                for (const p of packages) {
                    if (!p) continue;
                    this.queue.push({
                        name: p.name,
                        version: p.version || "latest",
                        force: p.force || false,
                        dnr: p.dnr || false,
                        uninstall: p.uninstall || false,
                    });
                }

                // Wait for queue to be fully processed
                while (this.queue.length > 0 || this.isProcessing) {
                    await this.processQueue();
                    // Small delay to prevent tight loop
                    if (this.isProcessing) {
                        await new Promise((resolve) => setTimeout(resolve, 100));
                    }
                }

                // Only restart when ALL active requests are complete
                if (this.requireRestart) {
                    this.DBB.Core.restart();
                }

                return true;
            } catch (error) {
                this.log(`Error in requires method: ${error.message}`, "WARN", true);
                throw error;
            }
        }
}

// Export function to get singleton instance
/**
 * Get the singleton instance of the PackageManager.
 * @returns {PackageManager}
 */
module.exports.getPackageManager = () => packageManagerInstance;

// Block configuration for DBB
module.exports.name = "Package Manager Queue [Dependency]";
module.exports.description = "Starts the Package Manager Queue dependency required for other blocks to work.";
module.exports.category = "Dependencies";
module.exports.options = [
    {
        id: "devmode",
        name: "Developer Mode",
        description: "Description: If you are a developer and want to see more information in the console.",
        type: "CHECKBOX",
    },
];
module.exports.outputs = [];

module.exports.init = async function(DBB, blockName) {
    try {
        const fs = require("fs");
        
        // Clean up old package manager blocks
        if (DBB.Blocks.cache.has("package_manager")) fs.rmSync("./blocks/package_manager.js");
        if (DBB.Blocks.cache.has("auto_package_manager")) fs.rmSync("./blocks/auto_package_manager.js");
        
        // Initialize singleton if not already created
        if (!packageManagerInstance) {
            const values = JSON.parse(fs.readFileSync(DBB.File.paths.workspaces))
                .map((workspace) => {
                    if (workspace.workspaces) {
                        return workspace.workspaces.map((wpc) => wpc.blocks.filter((x) => x.name == blockName)).flat();
                    } else {
                        return workspace.blocks.filter((x) => x.name == blockName);
                    }
                })
                .filter((x) => x[0])
                .map((x) => x.map((x) => x.options).flat())
                .flat()[0];
            
            const devmode = values ? values.devmode : false;
            packageManagerInstance = new PackageManager(DBB, devmode);
        }
    } catch (error) {
        console.log(error);
    }
};
