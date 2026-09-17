module.exports = {
    name: "Get Interaction Info",

    description: "Gets the interaction information.",

    category: "Command Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "interaction",
            name: "Interaction",
            description:
                "Acceptable Types: Object, Unspecified\n\nDescription: The interaction to get the information.",
            types: ["object", "unspecified"],
            required: true
        }
    ],

    options: [
        {
            id: "interaction_info",
            name: "Interaction Info",
            description: "Description: The interaction information to get.",
            type: "SELECT",
            options: [
                [1, "Interaction Channel [Channel]"],
                [2, "Interaction Created At [Date]"],
                [3, "Interaction Server [Server]"],
                [4, "Interaction Server Locale [Text]"],
                [5, "Interaction ID [Text]"],
                [6, "Interaction Locale [Text]"],
                [7, "Interaction Member [Member]"],
                [8, "Interaction Member Permissions [Permissions]"],
                [9, "Interaction Token [Number]"],
                [10, "Interaction Type [Text]"],
                [11, "Interaction User [User]"],
                { type: "SEPARATOR" },
                [12, "Is Interaction Ephemeral (Private)? [Boolean]"],
                {
                    type: "GROUP",
                    name: "Component Interaction",
                    options: [
                        [13, "Interaction Component Type [Text]"],
                        [14, "Interaction Custom ID [Text]"]
                    ]
                },
                [15, "Interaction Message [Message]"],
                [16, "Interaction Webhook [Webhook]"],
                {
                    type: "GROUP",
                    name: "Command Interaction",
                    options: [
                        [17, "Interaction Command [Command]"],
                        [18, "Interaction Command Type [Server]"],
                        [19, "Interaction Command Name [Text]"],
                        [20, "Interaction Command Description [Text]"],
                        [21, "Interaction Command ID [Text]"],
                        [22, "Is Interaction Command Server-Only? [Boolean]"],
                        [23, "Is Interaction Command Available in DMs? [Boolean]"],
                        [24, "Is Interaction Command NSFW (Age-Restricted)? [Boolean]"]
                    ]
                }
            ]
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
            id: "result",
            name: "Result",
            description:
                "Type: Unspecified\n\nDescription: The information obtained from the interaction.",
            types: ["unspecified"]
        }
    ],

    code(cache) {
        const {
            InteractionType,
            ComponentType,
            ApplicationCommandType,
            InteractionContextType
        } = require("discord.js")

        const interaction = this.GetInputValue("interaction", cache)
        const interaction_info = Number(this.GetOptionValue("interaction_info", cache))

        let result
        switch (interaction_info) {
            case 1:
                result = interaction.channel
                break
            case 2:
                result = interaction.createdAt
                break
            case 3:
                result = interaction.guild
                break
            case 4:
                result = interaction.guildLocale
                break
            case 5:
                result = interaction.id
                break
            case 6:
                result = interaction.locale
                break
            case 7:
                result = interaction.member
                break
            case 8:
                result = interaction.memberPermissions
                break
            case 9:
                result = interaction.token
                break
            case 10:
                result = InteractionType[interaction.type]
                break
            case 11:
                result = interaction.user
                break
            case 12:
                result = interaction.ephemeral
                break
            case 13:
                result = ComponentType[interaction.componentType]
                break
            case 14:
                result = interaction.customId
                break
            case 15:
                result = interaction.message
                break
            case 16:
                result = interaction.webhook
                break
            case 17:
                result = interaction.command
                break
            case 18:
                result = ApplicationCommandType[interaction.commandType]
                break
            case 19:
                result = interaction.commandName
                break
            case 20:
                result = interaction.command?.description
                break
            case 21:
                result = interaction.commandId
                break
            case 22:
                result = Boolean(interaction.commandGuildId)
                break
            case 23:
                result = interaction.command?.contexts.some(
                    (context) =>
                        context === InteractionContextType.PrivateChannel ||
                        context === InteractionContextType.BotDM
                )
                break
            case 24:
                result = Boolean(interaction.nsfw)
                break
        }

        this.StoreOutputValue(result, "result", cache)
        this.RunNextBlock("action", cache)
    }
}
