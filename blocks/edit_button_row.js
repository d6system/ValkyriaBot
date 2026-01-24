module.exports = {
    name: "Edit Button Row",
    description: "Edit a button of a Button Row.",
    category: "Buttons",
    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "row",
            name: "Button Row",
            description: "Description: The Button Row List Or Object",
            types: ["list", "object", "unspecified"]
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
        },
        {
            id: "custom",
            name: "Button Number",
            description: "Description: Add something here if you want to use a custom Button Number!",
            types: ["number", "unspecified"],
        }
    ],
    options: [
        {
            id: "button",
            name: "Button",
            description: "Type: Text\n\nDescription: Which Button do you want to edit?",
            type: "SELECT",
            options: {
                1: "First Button",
                2: "Second Button",
                3: "Third Button",
                4: "Fourth Button",
                5: "Fifth Button"
            }
        },
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
            type: "CHECKBOX"
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
            id: "buttonrow",
            name: "Button Row",
            description: "Description: The Button Row Output.",
            types: ["list", "unspecified"]
        }
    ],
    async code(cache) {

        const { ButtonBuilder, ButtonStyle } = require('discord.js');

        const number = Number(this.GetInputValue("custom", cache)) - 1 || this.GetOptionValue("button", cache) - 1;
        const row = this.GetInputValue("row", cache);

        var button = row[number]
        
        if (!button) {
            this.console("WARN", `The 'Edit Button Row' block (#${cache.index}) can not find The selected button to edit!`)
            this.StoreOutputValue(row, "buttonrow", cache);
            this.RunNextBlock("action", cache);
            return
        }
      
        var style = this.GetInputValue("styles", cache) || this.GetOptionValue("styles", cache);
        const disabled = this.GetInputValue("enable", cache) || this.GetOptionValue("enable", cache);
        var emoji = this.GetInputValue("emoji", cache) || this.GetOptionValue("emoji", cache) || button['data'].emoji;
        var label = this.GetInputValue("label", cache) || this.GetOptionValue("label", cache) || button['data'].label;
        const id = this.GetInputValue("id", cache) || this.GetOptionValue("id", cache) || button['data'].custom_id;

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

        button =
            new ButtonBuilder()
                .setStyle(style)
                .setDisabled(disabled)     
                       
            if (label) button.setLabel(label)
            if (emoji) button.setEmoji(emoji)
            style !== ButtonStyle.Link ? button.setCustomId(id) : button.setURL(id)

            
        row[number] = button

        this.StoreOutputValue(row, "buttonrow", cache);
        this.RunNextBlock("action", cache);
        
    }
}

