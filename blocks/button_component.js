module.exports = {
    name: "Button (Component)",

    description: "Creates a button component for messages.",

    category: "Message Stuff",

    auto_execute: true,

    options: [
        {
            id: "label",
            name: "Label",
            description: "Description: The label for this button. [REQUIRED]",
            type: "TEXT"
        },
        {
            id: "emoji",
            name: "Emoji",
            description: "Description: The emoji or the emote ID to display on this button.",
            type: "TEXT"
        },
        {
            id: "disabled",
            name: "Disabled",
            description: "Description: Whether to disable this button",
            type: "CHECKBOX"
        },
        {
            id: "style",
            name: "Style",
            description: "Description: The style for this button.",
            type: "SELECT",
            options: {
                1: "Primary (Blurple)",
                2: "Secondary (Grey)",
                3: "Success (Green)",
                4: "Danger (Red)",
                5: "Link (Grey)"
            }
        },
        {
            id: "url",
            name: "URL",
            description:
                'Description: The URL to open when this button ("Link" style only) is clicked.',
            type: "TEXT"
        },
        {
            id: "custom_id",
            name: "Custom ID",
            description: "Description: The custom ID of this button.",
            type: "TEXT"
        }
    ],

    outputs: [
        {
            id: "button_component",
            name: "Button (Component)",
            description: "Type: Object\n\nDescription: The button component.",
            types: ["object"]
        }
    ],

    code(cache) {
        const { ButtonBuilder } = require("discord.js")
        const { randomUUID } = require("crypto")

        const label = this.GetOptionValue("label", cache)
        const emoji = this.GetOptionValue("emoji", cache)
        const disabled = this.GetOptionValue("disabled", cache)
        const style = Number(this.GetOptionValue("style", cache))
        const url = this.GetOptionValue("url", cache)
        const custom_id = this.GetOptionValue("custom_id", cache) || randomUUID()

        const buttonComponent = new ButtonBuilder()
            .setLabel(label)
            .setStyle(style)

        if (disabled) buttonComponent.setDisabled(disabled)
        if (url) {
            buttonComponent.setURL(url)
        } else {
            buttonComponent.setCustomId(custom_id)
        }
        if (emoji) {
            buttonComponent.setEmoji(isNaN(emoji) ? { name: emoji } : { id: emoji, animated: true })
        }

        this.StoreOutputValue(buttonComponent, "button_component", cache, "inputBlock")
    }
}
