module.exports = {
    name: "Interaction [Event]",

    description: "When an interaction is created, this event will trigger.",

    category: "Events",

    auto_execute: true,

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
            description: "Type: Object\n\nDescription: The interaction created.",
            types: ["object"]
        }
    ],

    code(cache) {
        this.events.on("interactionCreate", (interaction) => {
            this.StoreOutputValue(interaction, "interaction", cache)
            this.RunNextBlock("action", cache)
        })
    }
}
