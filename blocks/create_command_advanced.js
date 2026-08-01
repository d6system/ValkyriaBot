function getSubcommands(commandJSON) {
    const subcommands = new Map()

    if (Array.isArray(commandJSON.options)) {
        for (const option of commandJSON.options) {
            switch (option?.type) {
                case 1: // Subcommand
                    subcommands.set(option.name, null)
                    break
                case 2: // SubcommandGroup
                    const subcommandGroup = option
                    const subcommandGroupSet = new Set()

                    if (Array.isArray(subcommandGroup.options)) {
                        for (const suboption of subcommandGroup.options) {
                            if (suboption?.type === 1) {
                                subcommandGroupSet.add(suboption.name)
                            }
                        }
                    }

                    if (subcommandGroupSet.size > 0) {
                        subcommands.set(subcommandGroup.name, subcommandGroupSet)
                    }
                    break
            }
        }
    }

    return subcommands
}

module.exports = {
    name: "Create Command (Advanced)",

    description:
        "Creates a command for the user to execute, by providing the JSON object that contains data of it.",

    category: "Command Stuff",

    auto_execute: true,

    inputs: [
        {
            id: "command_server",
            name: "Server ID",
            description:
                "Acceptable Types: Text, Unspecified\n\nDescription: The ID of the server to create this command exclusively for.",
            types: ["text", "unspecified"]
        }
    ],

    options: [
        {
            id: "command_json",
            name: "Command JSON",
            description: "The JSON object of the command. Use an online tool to generate it.",
            type: "TEXT"
        }
    ],

    outputs: [
        {
            id: "action2",
            name: "Action",
            description:
                "Type: Action\n\nDescription: Executes the following blocks whenever this command is executed.",
            types: ["action"]
        },
        {
            id: "interaction",
            name: "Interaction",
            description:
                "Type: Object\n\nDescription: The interaction created by executing the command.",
            types: ["object"]
        },
        {
            id: "target_message",
            name: "Target Message",
            description:
                "Type: Object\n\nDescription: The target message. [Message Context Menu Only]",
            types: ["object"]
        },
        {
            id: "target_user",
            name: "Target User",
            description: "Type: Object\n\nDescription: The target user. [User Context Menu Only]",
            types: ["object"]
        },
        {
            id: "target_member",
            name: "Target Member",
            description:
                "Type: Object\n\nDescription: The target server member if possible. [User Context Menu Only]",
            types: ["object"]
        }
    ],

    async code(cache) {
        const DiscordCommands = await this.getDependency("DiscordCommands", cache.name)

        const commandServerId = this.GetInputValue("command_server", cache)
        const commandJSON = JSON.parse(this.GetOptionValue("command_json", cache))

        DiscordCommands.create(commandJSON, commandServerId)

        if (this.isOutputConnected("action2", cache)) {
            const commandName = commandJSON.name
            const subcommands =
                commandJSON.type === undefined || commandJSON.type === 1
                    ? getSubcommands(commandJSON)
                    : undefined

            this.events.on("interactionCreate", (interaction) => {
                switch (commandJSON.type) {
                    case undefined:
                    case 1:
                        if (!interaction.isChatInputCommand()) return
                        break
                    case 2:
                        if (!interaction.isUserContextMenuCommand()) return
                        break
                    case 3:
                        if (!interaction.isMessageContextMenuCommand()) return
                        break
                    default:
                        return
                }

                if (interaction.commandGuildId && interaction.commandGuildId !== commandServerId) {
                    return
                }

                if (interaction.commandName === commandName) {
                    const subcommandGroup = interaction.options.getSubcommandGroup(false)
                    const subcommand = interaction.options.getSubcommand(false)
                    if (subcommands.size > 0) {
                        if (subcommandGroup) {
                            const subcommands2 = subcommands.get(subcommandGroup)
                            if (!subcommands2 || !subcommands2.has(subcommand)) {
                                return
                            }
                        } else if (!subcommand || subcommands.get(subcommand) !== null) {
                            return
                        }
                    } else if (subcommandGroup || subcommand) {
                        return
                    }

                    this.StoreOutputValue(interaction, "interaction", cache)

                    switch (interaction.commandType) {
                        case 2: // User
                            this.StoreOutputValue(interaction.targetUser, "target_user", cache)
                            this.StoreOutputValue(interaction.targetMember, "target_member", cache)
                            break
                        case 3: // Message
                            this.StoreOutputValue(
                                interaction.targetMessage,
                                "target_message",
                                cache
                            )
                            break
                    }

                    this.RunNextBlock("action2", cache)
                }
            })
        }
    }
}
