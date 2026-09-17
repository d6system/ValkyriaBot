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
                'Description: The Commands you want to register!\n\nExample: \n{\n  "name": "ping", \n  "description": "Pong!"\n  "options": []\n}\n\nYou can resize this block by dragging the bottom right corner.\nYou can put in more Commands into here by using , after the Commands to split them like a list!',
            type: "TEXT",
        },
    ],

    outputs: [],

    init(DBB, blockName) {
        function logError(x, e, commands) {
            DBB.Core.console(
                "WARN",
                "\n______________________________________\n\n SLASH COMMAND JSON ERROR:\n\n Workspace: " +
                    x.workspace +
                    "\n Command: " +
                    x.name +
                    " [#" +
                    (parseInt(x.index) + 1) +
                    "]" +
                    "\n\n \u2193 The error will be displayed below \u2193\n\n______________________________________\n"
            );
            console.log(e.message);
            //console.log(JSON.stringify(e.rawError.errors, null, 2))
            let command = commands[parseInt(Object.keys(e.rawError.errors)[0])];
            delete command.index;
            delete command.workspace;
            let cmdstring = JSON.stringify(command, null, 2);
            const keys = getTopLevelKeys(e.rawError.errors);
            if (keys.length == 4) {
                console.log(
                    cmdstring.replace(
                        RegExp(`"${keys[3]}": "${command.options[parseInt(keys[2])][keys[3]]}",`, "gm"),
                        `"${keys[3]}": \x1b[31m"${command.options[parseInt(keys[2])][keys[3]]}"\n` +
                            " ".repeat(10 + keys[3].length) +
                            "↑↑↑ Error Probably Here\x1b[0m"
                    )
                );
            } else if (keys.length == 2) {
                console.log(
                    cmdstring.replace(
                        RegExp(`"${keys[1]}": "${command[keys[1]]}",`, "gm"),
                        `"${keys[1]}": \x1b[31m"${command[keys[1]]}"\n` + " ".repeat(6 + keys[1].length) + "↑↑↑ Error Probably Here\x1b[0m"
                    )
                );
            }
        }

        function getTopLevelKeys(obj) {
            const keys = [];
            let current = obj;

            while (typeof current === "object" && current !== null) {
                const key = Object.keys(current).find((k) => k !== "_errors");
                if (key) {
                    keys.push(key);
                    current = current[key];
                } else {
                    break;
                }
            }

            return keys;
        }

        const { readFileSync } = require("fs");
        let con = true;
        JSON.parse(readFileSync(DBB.File.paths.workspaces))
            .map((item, index) => {
                if (item.workspaces) {
                    return item.workspaces
                        .map((wpc) =>
                            wpc.blocks.filter((x, i) => {
                                x.index = i++;
                                x.workspace = item.info.title;
                                return x.name === blockName;
                            })
                        )
                        .flat();
                } else {
                    return item.blocks.filter((x, i) => {
                        x.index = i++;
                        x.workspace = item.info.title;
                        return x.name === blockName;
                    });
                }
            })
            .filter((x) => x[0])
            .flat()
            .map((x) => {
                try {
                    const commands = JSON.parse("[" + x.options.text + "]");
                    // Check if the commands have a double name
                    let names = [];
                    commands.map((command) => {
                        if (names.includes(command.name)) {
                            throw new Error("Duplicate command name: " + command.name);
                        }
                        names.push(command.name);
                    });
                } catch (e) {
                    logError(x, e);
                    con = false;
                }
            });
        try {
            if (!con) return;
            const commands = JSON.parse(readFileSync(DBB.File.paths.workspaces))
                .map((item, index) => {
                    if (item.workspaces) {
                        return item.workspaces
                            .map((wpc) =>
                                wpc.blocks.filter((x, i) => {
                                    x.index = i++;
                                    x.workspace = item.info.title;
                                    return x.name === blockName;
                                })
                            )
                            .flat();
                    } else {
                        return item.blocks.filter((x, i) => {
                            x.index = i++;
                            x.workspace = item.info.title;
                            return x.name === blockName;
                        });
                    }
                })
                .filter((x) => x[0])
                .map((x) =>
                    x
                        .map((x) => {
                            const t = JSON.parse("[" + x.options.text + "]");
                            return t.map((command) => {
                                command.index = x.index;
                                command.workspace = x.workspace;
                                return command;
                            });
                        })
                        .flat()
                )
                .flat();
            if (
                JSON.parse(readFileSync(DBB.File.paths.workspaces))
                    .map((workspace) => {
                        if (workspace.workspaces) {
                            return workspace.workspaces.map((wpc) => wpc.blocks.filter((x) => x.name == blockName)).flat();
                        } else {
                            return workspace.blocks.filter((x) => x.name == blockName);
                        }
                    })
                    .filter((x) => x[0])
                    .map((x) => x.map((x) => x.options).flat())
                    .flat()
            ) {
                DBB.DiscordJS.client.application.commands
                    .set(commands)
                    .catch((e) => {
                        logError(commands[parseInt(Object.keys(e.rawError.errors)[0])], e, commands);
                    })
                    .finally(() => {
                        DBB.Core.console("SUCCESS", "Successfully registered " + commands.length + " application (/) commands!");
                    });
            }
        } catch (e) {
            console.log(e)
        }
    },

    code(cache) {},
};
