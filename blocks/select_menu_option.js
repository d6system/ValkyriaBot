module.exports = {
    name: "Select Menu Option",

    description: "Creates an option for (text) select menus.",

    category: "Command Stuff",

    auto_execute: true,

    options: [
        {
            id: "label",
            name: "Label",
            description: "Description: The label for this select menu option. [REQUIRED]",
            type: "TEXT"
        },
        {
            id: "value",
            name: "Value",
            description: "Description: The value for this select menu option. [REQUIRED]",
            type: "TEXT"
        },
        {
            id: "description",
            name: "Description",
            description: "Description: The description of this select menu option.",
            type: "TEXT"
        },
        {
            id: "emoji",
            name: "Emoji",
            description:
                "Description: The emoji or the emote ID to display on this select menu option.",
            type: "TEXT"
        },
        {
            id: "default",
            name: "Default?",
            description: "Description: Whether this select menu option is selected by default.",
            type: "CHECKBOX"
        }
    ],

    outputs: [
        {
            id: "select_menu_option",
            name: "Select Menu Option",
            description: "Type: Object\n\nDescription: The select menu option.",
            types: ["object"]
        }
    ],

    code(cache) {
        const { StringSelectMenuOptionBuilder } = require("discord.js")

        const label = this.GetOptionValue("label", cache)
        const value = this.GetOptionValue("value", cache)
        const description = this.GetOptionValue("description", cache) || " ឵"
        const emoji = this.GetOptionValue("emoji", cache)
        const _default = this.GetOptionValue("default", cache)

        const selectMenuOption = new StringSelectMenuOptionBuilder().setLabel(label).setValue(value)

        if (description) selectMenuOption.setDescription(description)
        if (_default) selectMenuOption.setDefault(_default)
        if (emoji) {
            selectMenuOption.setEmoji(
                isNaN(emoji) ? { name: emoji } : { id: emoji, animated: true }
            )
        }

        this.StoreOutputValue(selectMenuOption, "select_menu_option", cache, "inputBlock")
    }
}
