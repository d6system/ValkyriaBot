module.exports = {
    name: "Edit Button",
    description: "Edit a button.",
    category: "Buttons",
    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "button",
            name: "Button",
            description: "Description: The Button output.",
            types: ["object", "unspecified"]
        },
        {
            id: "styles",
            name: "Style",
            description: "Type: Text\n\nDescription: The Style of the Button. [blurple], [grey], [green], [red], [url]",
            types: ["text", "unspecified"],
        },
        {
            id: "label",
            name: "Label",
            description: "Type: Text\n\nDescription: The Label of the Button.",
            types: ["text", "unspecified"]
        },
        {
            id: "emoji",
            name: "Emoji",
            description: "Type: Text\n\nDescription: The Emoji for the Button. (OPTIONAL)",
            types: ["text", "unspecified"]
        },
        {
            id: "id",
            name: "ID / URL",
            description: "Type: Text\n\nDescription: The ID or URL of the Button.",
            types: ["text", "unspecified"]
        },
        {
            id: "enable",
            name: "Disabled?",
            description: "Description: Whether this button is enabled or disabled",
            types: ["boolean", "unspecified"],
        }
    ],
    options: [
        {
            id: "styles",
            name: "Style",
            description: "Type: Text\n\nDescription: The Style of the Button. [blurple], [grey], [green], [red], [url]",
            type: "SELECT",
            options: {
                "primary": "Blurple / Primary",
                "secondary": "Grey / Secondary",
                "success": "Green / Success",
                "danger": "Red / Danger",
                "link": "Link / Url"
            }
        },
        {
            id: "label",
            name: "Label",
            description: "Type: Text\n\nDescription: The Label of the Button.",
            type: "TEXT"
        },
        {
            id: "emoji",
            name: "Emoji",
            description: "Type: Text\n\nDescription: The Emoji for the Button. (OPTIONAL)",
            type: "TEXT"
        },
        {
            id: "id",
            name: "ID / URL",
            description: "Type: Text\n\nDescription: The ID or URL of the Button.",
            type: "TEXT"
        },
        {
            id: "enable",
            name: "Disabled?",
            description: "Description: Whether this button is enabled or disabled",
            type: "CHECKBOX",
            defaultValue: false
        }
    ],
    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "button",
            name: "Button",
            description: "Description: The Button output.",
            types: ["object"]
        }
    ],
    async code(cache) {

        const { ButtonBuilder, ButtonStyle } = require('discord.js');

        const obutton = this.GetInputValue("button", cache);
        var style = this.GetInputValue("styles", cache) || this.GetOptionValue("styles", cache);
        const disabled = this.GetInputValue("enable", cache) || this.GetOptionValue("enable", cache);
        var emoji = this.GetInputValue("emoji", cache) || this.GetOptionValue("emoji", cache) || obutton[0]['data'].emoji;
        var label = this.GetInputValue("label", cache) || this.GetOptionValue("label", cache) || obutton[0]['data'].label;
        const id = this.GetInputValue("id", cache) || this.GetOptionValue("id", cache) || obutton[0]['data'].custom_id;

        if (style == "primary") {
            style = ButtonStyle.Primary
        } else if (style == "secondary") {
            style = ButtonStyle.Secondary
        } else if (style == "success") {
            style = ButtonStyle.Success
        } else if (style == "danger") {
            style = ButtonStyle.Danger
        } else if (style == "link") {
            style = ButtonStyle.Link
        }

        var button =
            new ButtonBuilder()
                .setStyle(style)
                .setDisabled(disabled)     
                       
            if (label) button.setLabel(label)
            if (emoji) button.setEmoji(emoji)
            style !== ButtonStyle.Link ? button.setCustomId(id) : button.setURL(id)
                
        this.StoreOutputValue([button], "button", cache)
        this.RunNextBlock("action", cache)
    }
}

