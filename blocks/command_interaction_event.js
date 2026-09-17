module.exports = {
    name: "Command Interaction [Event]",

    description: "When a command is executed, this event will trigger.",

    category: "Events",

    auto_execute: true,

    options: [
        {
            id: "command_type",
            name: "Command Type",
            description: "Description: The type of the command.",
            type: "SELECT",
            options: {
                1: "Slash Command",
                2: "User Context Menu",
                3: "Message Context Menu"
            }
        },
        {
            id: "command_name",
            name: "Command Name",
            description: "Description: The name of the command.",
            type: "TEXT"
        },
        {
            id: "command_server_id",
            name: "Command Server ID",
            description: "Description: The server ID of the command if any.",
            type: "TEXT"
        }
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description:
                "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
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

    code(cache) {
        const command_type = Number(this.GetOptionValue("command_type", cache))
        const command_name = this.GetOptionValue("command_name", cache)
        const command_server_id = this.GetOptionValue("command_server_id", cache)

        const [commandName, subcommandName, subcommandName2] =
            command_type === 1 ? command_name.trim().toLowerCase().split(/\s+/, 3) : [command_name]

        this.events.on("interactionCreate", (interaction) => {
            switch (command_type) {
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

            if (interaction.commandGuildId && interaction.commandGuildId !== command_server_id) {
                return
            }

            if (interaction.commandName === commandName) {
                const subcommandGroup = interaction.options.getSubcommandGroup(false)
                const subcommand = interaction.options.getSubcommand(false)
                if (!subcommandName2 && subcommandGroup) return
                if (!subcommandName && subcommand) return

                if (subcommandName2) {
                    if (
                        subcommandGroup !== subcommandName ||
                        subcommand !== subcommandName2
                    ) {
                        return
                    }
                } else if (subcommandName) {
                    if (subcommand !== subcommandName) {
                        return
                    }
                }

                this.StoreOutputValue(interaction, "interaction", cache)

                switch (interaction.commandType) {
                    case 2: // User
                        this.StoreOutputValue(interaction.targetUser, "target_user", cache)
                        this.StoreOutputValue(interaction.targetMember, "target_member", cache)
                        break
                    case 3: // Message
                        this.StoreOutputValue(interaction.targetMessage, "target_message", cache)
                        break
                }

                this.RunNextBlock("action", cache)
            }
        })
    }
}
