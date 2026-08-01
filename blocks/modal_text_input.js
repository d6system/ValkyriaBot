module.exports = {
    name: "Modal Text Input",

    description: "Creates a text input for modals.",

    category: "Command Stuff",

    auto_execute: true,

    options: [
        {
            id: "label",
            name: "Label",
            description: "Description: The label for this text input. [REQUIRED]",
            type: "TEXT"
        },
        {
            id: "placeholder",
            name: "Placeholder",
            description: "Description: The placeholder of this text input.",
            type: "TEXT"
        },
        {
            id: "value",
            name: "Value",
            description: "Description: The label for this text input.",
            type: "TEXT"
        },
        {
            id: "style",
            name: "Style",
            description: "Description: The style for this text input.",
            type: "SELECT",
            options: {
                1: "Single-Line Input",
                2: "Multi-Line Input"
            }
        },
        {
            id: "min_length",
            name: "Min Length",
            description: "Description: The minimum length of text for this text input.",
            type: "NUMBER"
        },
        {
            id: "max_length",
            name: "Max Length",
            description: "Description: The maximum length of text for this text input.",
            type: "NUMBER"
        },
        {
            id: "required",
            name: "Required?",
            description: "Description: Whether this text input is required.",
            type: "CHECKBOX"
        },
        {
            id: "custom_id",
            name: "Custom ID",
            description: "Description: The custom ID of this text input.",
            type: "TEXT"
        }
    ],

    outputs: [
        {
            id: "modal_input",
            name: "Modal Input",
            description: "Type: Object\n\nDescription: The modal input.",
            types: ["object"]
        }
    ],

    code(cache) {
        const { TextInputBuilder } = require("discord.js")
        const { randomUUID } = require("crypto")

        const label = this.GetOptionValue("label", cache)
        const placeholder = this.GetOptionValue("placeholder", cache)
        const value = this.GetOptionValue("value", cache)
        const style = this.GetOptionValue("style", cache) || 0
        const min_length = this.GetOptionValue("min_length", cache)
        const max_length = this.GetOptionValue("max_length", cache)
        const required = this.GetOptionValue("required", cache)
        const custom_id = this.GetOptionValue("custom_id", cache) || randomUUID()

        const modalInput = new TextInputBuilder()
            .setLabel(label)
            .setStyle(style)
            .setCustomId(custom_id)

        if (placeholder) modalInput.setPlaceholder(placeholder)
        if (value) modalInput.setValue(value)
        if (max_length) modalInput.setMaxLength(max_length)
        if (min_length) modalInput.setMinLength(min_length)
        if (required) modalInput.setRequired(required)
        if (placeholder) modalInput.setPlaceholder(placeholder)

        this.StoreOutputValue(modalInput, "modal_input", cache, "inputBlock")
    }
}
