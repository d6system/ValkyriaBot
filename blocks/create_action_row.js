module.exports = {
    name: "Create Action Row (Component)",

    description: "Creates an Action Row to contain inline message components.",

    category: "Message Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "components",
            name: "Component",
            description:
                "Acceptable Types: Object, Unspecified\n\nDescription: The components to be contained in it.",
            types: ["object", "unspecified"],
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
            id: "action_row",
            name: "Action Row (Component)",
            description: "Type: Object\n\nDescription: The Action Row as component.",
            types: ["object"]
        }
    ],

    code(cache) {
        const { ActionRowBuilder } = require("discord.js")

        const components = this.GetInputValue("components", cache).filter((a) => a)

        const actionRow = new ActionRowBuilder().addComponents(...components)

        this.StoreOutputValue(actionRow, "action_row", cache)
        this.RunNextBlock("action", cache)
    }
}
