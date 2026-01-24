module.exports = {

    name: "Create Button",

    description: "Create a button.",

    category: "Buttons",

    inputs(data) {
        return [
            {
                id: "action",
                name: "Action",
                description: "Executes this block.",
                types: ["action"]
            },
            {
                id: "styles",
                name: "Style",
                description: "The Style of the Button.\n\n[1 = blurple]\n[2 = grey]\n[3 = green]\n[4 = red]\n[5 = url]",
                types: ["number", "text", "unspecified"]
            },
            {
                id: "label",
                name: "Label",
                description: "The Label of the Button.",
                types: ["text", "unspecified"]
            },
            {
                id: "emoji",
                name: "Emoji",
                description: "The Emoji for the Button. (OPTIONAL)",
                types: ["text", "unspecified"]
            },
            {
                id: "id",
                name: data?.options?.styles == 5 ? "URL" : "Custom ID",
                description: `The ${data?.options?.styles == 5 ? "URL" : "Custom ID"} of the Button.`,
                types: ["text", "unspecified"]
            },
            {
                id: "enable",
                name: "Disabled?",
                description: "Whether this button is enabled or disabled",
                types: ["boolean", "unspecified"]
            }
        ]
    },

    options(data) {
        return [
            {
                id: "styles",
                name: "Style",
                description: "The Style of the Button.",
                type: "SELECT",
                options: {                
                    1: "Blurple / Primary",
                    2: "Grey / Secondary",
                    3: "Green / Success",
                    4: "Red / Danger",
                    5: "Link / Url"
                }
            },
            {
                id: "label",
                name: "Label",
                description: "The Label of the Button.",
                type: "TEXT"
            },
            {
                id: "emoji",
                name: "Emoji",
                description: "The Emoji for the Button. (OPTIONAL)",
                type: "TEXT"
            },
            {
                id: "id",
                name: data?.options?.styles == 5 ? "URL" : "Custom ID",
                description: `The ${data?.options?.styles == 5 ? "URL" : "Custom ID"} of the Button.`,
                type: "TEXT",
                multiOption: true
            },
            {
                id: "enable",
                name: "Disabled?",
                description: "Whether this button is enabled or disabled",
                type: "CHECKBOX",
                defaultValue: false
            }
        ]
    },

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "button",
            name: "Button",
            description: "The Button output.",
            types: ["object", "unspecified"]
        },
    ],
    
    async code(cache) {

        const { ButtonBuilder } = require('discord.js');
        const label = this.GetInputValue("label", cache) || this.GetOptionValue("label", cache) || undefined;      
        const emoji = this.GetInputValue("emoji", cache) || this.GetOptionValue("emoji", cache) || undefined;
        const id = this.GetInputValue("id", cache) || this.GetOptionValue("id", cache) || null;
        const style = Number(this.GetInputValue("styles", cache) || this.GetOptionValue("styles", cache));
        const disabled = this.GetInputValue("enable", cache) || this.GetOptionValue("enable", cache);      

        const idURL = (style == 5) ? "URL" : "ID"

        const fail = (message) => {
            this.console("WARN", message);
            this.RunNextBlock("action", cache)
        }        

        if ((!label && !emoji) && !id) {
            fail(`The 'Create Button' block (#${cache.index + 1}) doesn't have a label/emoji or an ${idURL}`);
            return
        }
        if ((!label && !emoji)) {
            fail(`The 'Create Button' block (#${cache.index + 1}) doesn't have a label/emoji!`);
            return
        }
        if (!id) {
            fail(`The 'Create Button' block (#${cache.index + 1}) doesn't have an ${idURL}`);
            return
        }

        var button =
            new ButtonBuilder()
                .setStyle(style)
                .setDisabled(disabled)     
                       
            if (label) button.setLabel(label)
            if (emoji) button.setEmoji(emoji)
            style !== 5 ? button.setCustomId(id) : button.setURL(id)

        this.StoreOutputValue([button], "button", cache)
        this.RunNextBlock("action", cache)
    }
}