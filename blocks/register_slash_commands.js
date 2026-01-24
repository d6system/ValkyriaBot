module.exports = {
    name: "Register Slash Commands",

    description: "Registers Slash Commands (by @XCraftTM)",

    category: "Interaction Stuff",

    auto_execute: true,

    inputs: [],

    options: [
        {
            id: "text",
            name: "Commands",
            description:
                'The commands to register in JSON format.\nExample:\n{\n  "name": "ping",\n  "description": "Pong!",\n  "options": []\n}\n\nSeparate multiple commands with a comma.',
            type: "TEXT",
        },
    ],

    outputs: [],

    init(DBB, blockName) {
        /**
         * Discord Bot Builder's Discord.js Client Instance
         * @type {import('discord.js').Client}
         */
        const client = DBB.DiscordJS.client;
        const { readFileSync } = require("fs");
        const { ApplicationCommandType } = require('discord.js');

        function logError(x, e, commands) {
            DBB.Core.console(
                "WARN",
                `\n--- SLASH COMMAND JSON ERROR ---\nWorkspace: ${x.workspace}\nCommand: ${x.name} [#${parseInt(x.index) + 1}]\nError: ${e.message}`
            );
            if (e?.rawError?.errors) {
                const keys = getTopLevelKeys(e.rawError.errors);
                const cmd = commands?.[parseInt(Object.keys(e.rawError.errors)[0])];
                if (cmd) {
                    delete cmd.index;
                    delete cmd.workspace;
                    const display = JSON.stringify(cmd, null, 2);
                    const key = keys.at(-1);
                    if (key && display.includes(key)) {
                        console.log(
                            display.replace(new RegExp(`"${key}":\s*"[^"]+"`, "g"), (match) => `\x1b[31m${match}\x1b[0m  <<< Likely Error Here`)
                        );
                    } else {
                        console.log(display);
                    }
                }
            }
        }

        function getTopLevelKeys(obj) {
            const keys = [];
            let current = obj;
            while (typeof current === "object" && current !== null) {
                const key = Object.keys(current).find((k) => k !== "_errors");
                if (!key) break;
                keys.push(key);
                current = current[key];
            }
            return keys;
        }

        function collectBlocks() {
            const data = JSON.parse(readFileSync(DBB.File.paths.workspaces));
            const fullworkspaces = [];
            const blocks = [];

            for (const workspace of data) {
                if (!workspace.active && !workspace.hasOwnProperty("workspaces")) continue;
                if (workspace.hasOwnProperty("workspaces")) {
                    fullworkspaces.push(...workspace.workspaces);
                } else {
                    fullworkspaces.push(workspace);
                }
            }

            for (const workspace of fullworkspaces) {
                if (!workspace.active) continue;
                blocks.push(...workspace.blocks.map((block, index) => {
                    block.index = index;
                    block.workspace = workspace.info.title;
                    return block;
                }).filter((block) => block.name === blockName));
            }

            return blocks;
        }

        let valid = true;
        const blocks = collectBlocks();

        for (const block of blocks) {
            try {
                const commands =
                    block.options?.text?.startsWith("[") && block.options?.text?.endsWith("]")
                        ? JSON.parse(block.options.text)
                        : JSON.parse(`[${block.options.text}]`);
                const names = new Set();
                for (const cmd of commands) {
                    if (names.has(cmd.name)) {
                        DBB.Core.console("WARN", `Duplicate command name: ${cmd.name}`);
                    }
                    names.add(cmd.name);
                }
            } catch (e) {
                logError(block, e);
                valid = false;
            }
        }

        if (!valid) return;

        try {
            const allCommands = blocks.flatMap((block) => {
                const cmds = JSON.parse(`[${block.options.text}]`);
                return cmds.map((cmd) => ({ ...cmd, index: block.index, workspace: block.workspace }));
            });

            if (allCommands.length === 0) {
                client.application.commands
                    .fetch()
                    .then((commands) => {
                        if (commands.size > 0) {
                            commands.find((c) => c.type === ApplicationCommandType.PrimaryEntryPoint)?.delete().catch(() => {});
                        }
                    })
                    .catch(() => {});
                return;
            }

            client.application.commands
                .set(allCommands)
                .then((registered) => {
                    DBB.Core.console("SUCCESS", `Successfully registered ${registered.size} application (/) commands!`);
                    if(!DBB.Dependencies) DBB.Dependencies = {};
                    if(!DBB.Dependencies.RegisterSlashCommands) DBB.Dependencies.RegisterSlashCommands = {};
                    DBB.Dependencies.RegisterSlashCommands = { registeredAmount: registered.size, registeredCommands: Array.from(registered.values() || []) };
                })
                .catch((e) => {
                    if (!e?.rawError?.errors) {
                        console.error("Error registering commands:", e);
                        return;
                    }
                    const firstIndex = parseInt(Object.keys(e.rawError.errors)[0]);
                    logError(allCommands[firstIndex], e, allCommands);
                });
        } catch (e) {
            console.error("Unexpected error while registering commands:", e);
        }
    },

    code(cache) {},
};
