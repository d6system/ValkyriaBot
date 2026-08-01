module.exports = {
    name: "Defer Interaction Reply",

    description:
        "Defers the reply to the interaction made by a slash command for example. A message will appear saying that the bot is thinking...",

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
                "Acceptable Types: Object, Unspecified\n\nDescription: The interaction to reply.",
            types: ["object", "unspecified"],
            required: true
        },
        {
            id: "ephemeral",
            name: "Private?",
            description:
                "Acceptable Types: Boolean, Unspecified\n\nDescription: Whether the reply should be ephemeral (private).",
            types: ["boolean", "unspecified"]
        }
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description:
                "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"]
        }
    ],

    code(cache) {
        const interaction = this.GetInputValue("interaction", cache)
        const ephemeral = Boolean(this.GetInputValue("ephemeral", cache, false, true))

        interaction.deferReply({ ephemeral }).then(() => {
            this.RunNextBlock("action", cache)
        })
    }
}
