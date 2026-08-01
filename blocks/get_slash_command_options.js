module.exports = {
    name: "Get Slash Command Option(s)",

    description: "Gets the value(s) of the slash command option(s).",

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
                "Acceptable Types: Object, Unspecified\n\nDescription: The interaction obtained from the slash command to get its option(s).",
            types: ["object", "unspecified"],
            required: true
        },
        {
            id: "option_names",
            name: "Option Name",
            description:
                "Acceptable Types: Text, Unspecified\n\nDescription: The name of the slash command option(s). Leave blank to get all options.",
            types: ["text", "unspecified"],
            multiInput: true
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
            id: "option_values",
            name: "Option Value",
            description:
                "Type: Object, Text, Number, Boolean\n\nDescription: The value of the slash command option(s).",
            types: ["object", "text", "number", "boolean"],
            multiOutput: true
        }
    ],

    code(cache) {
        const { ApplicationCommandOptionType } = require("discord.js")

        const interaction = this.GetInputValue("interaction", cache)
        const option_names = this.GetInputValue("option_names", cache).filter((a) => a)

        let optionValues
        if (option_names.length > 0) {
            optionValues = option_names.map((optionName) =>
                interaction.options.get(optionName, false)
            )
        } else {
            // Ignore subcommand options
            optionValues = interaction.options.data
            while (optionValues[0]?.options) {
                optionValues = optionValues[0]?.options
            }
        }

        this.StoreOutputValue(
            optionValues.map((data) => {
                switch (data.type) {
                    case ApplicationCommandOptionType.Attachment:
                        return data.attachment
                    case ApplicationCommandOptionType.Channel:
                        return data.channel
                    case ApplicationCommandOptionType.User:
                    case ApplicationCommandOptionType.Mentionable:
                        return data.member ?? data.user
                    case ApplicationCommandOptionType.Role:
                        return data.role
                    default:
                        return data.value
                }
            }),
            "option_values",
            cache
        )
        this.RunNextBlock("action", cache)
    }
}
