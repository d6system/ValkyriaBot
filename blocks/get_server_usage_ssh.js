module.exports = {
    name: "Get Server Usage via SSH",

    description: "Connects to a server via SSH and retrieves CPU, RAM, and disk usage in percentage.",

    category: "Server Monitoring",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"],
            "required": true
        },
        {
            "id": "address",
            "name": "Server Address",
            "description": "Acceptable Types: Text\n\nDescription: The IP address or hostname of the server.",
            "types": ["text"],
            "required": true
        },
        {
            "id": "port",
            "name": "SSH Port",
            "description": "Acceptable Types: Number\n\nDescription: The port number for SSH connection (default: 22).",
            "types": ["number"],
            "required": false
        },
        {
            "id": "username",
            "name": "Username",
            "description": "Acceptable Types: Text\n\nDescription: The username for SSH authentication.",
            "types": ["text"],
            "required": true
        },
        {
            "id": "password",
            "name": "Password",
            "description": "Acceptable Types: Text\n\nDescription: The password for SSH authentication.",
            "types": ["text"],
            "required": true
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "cpu_usage",
            "name": "CPU Usage (%)",
            "description": "Type: Number\n\nDescription: The CPU usage percentage.",
            "types": ["number"]
        },
        {
            "id": "ram_usage",
            "name": "RAM Usage (%)",
            "description": "Type: Number\n\nDescription: The RAM usage percentage.",
            "types": ["number"]
        },
        {
            "id": "disk_usage",
            "name": "Disk Usage (%)",
            "description": "Type: Number\n\nDescription: The disk usage percentage.",
            "types": ["number"]
        }
    ],

    async code(cache) {
        const address = this.GetInputValue("address", cache);
        const port = this.GetInputValue("port", cache) || 22;
        const username = this.GetInputValue("username", cache);
        const password = this.GetInputValue("password", cache);

        // Check if ssh2 module is installed, and install it if not
        const isModuleInstalled = (name) => {
            try {
                require.resolve(name);
                return true;
            } catch (e) {
                return false;
            }
        };

        const installModule = (name) => {
            require("child_process").execSync(`npm install ${name}`, { stdio: "inherit" });
        };

        if (!isModuleInstalled("ssh2")) {
            installModule("ssh2");
        }

        const { Client } = require("ssh2");

        const conn = new Client();
        conn.on("ready", () => {
            conn.exec("top -bn1 | grep 'Cpu' | awk '{print $2 + $4}' && free | grep Mem | awk '{print $3/$2 * 100.0}' && df -h --total | grep 'total' | awk '{print $5}'", (err, stream) => {
                if (err) throw err;
                let output = "";
                stream.on("data", (data) => {
                    output += data.toString();
                }).on("close", () => {
                    const [cpuUsage, ramUsage, diskUsageRaw] = output.split("\n").map(line => line.trim());
                    const diskUsage = diskUsageRaw ? parseFloat(diskUsageRaw.replace("%", "")) : 0;

                    this.StoreOutputValue(parseFloat(cpuUsage), "cpu_usage", cache);
                    this.StoreOutputValue(parseFloat(ramUsage), "ram_usage", cache);
                    this.StoreOutputValue(diskUsage, "disk_usage", cache);
                    this.RunNextBlock("action", cache);
                    conn.end();
                });
            });
        }).connect({
            host: address,
            port: port,
            username: username,
            password: password
        });
    }
};
