module.exports = {
    name: "Select Menu Option",

    description: "Creates an option for (text) select menus.",

    category: "Component Stuff",

    auto_execute: true,

    inputs(data) {
        if (!data?.options?.show_inputs) return;

        return [
            {
                id: "action",
                name: "Action",
                description: "Executes this block.",
                types: ["action"]
            },
            {
                id: "label",
                name: "Label",
                description: "The label for this select menu option.",
                types: ["text", "unspecified"]
            },
            {
                id: "value",
                name: "Value",
                description: "The value for this select menu option.",
                types: ["text", "unspecified"]
            },
            {
                id: "description",
                name: "Description",
                description: "The description of this select menu option.",
                types: ["text", "unspecified"]
            },
            {
                id: "emoji",
                name: "Emoji",
                description: "The emoji or emote ID to display on this select menu option.",
                types: ["text", "unspecified"]
            },
            {
                id: "default",
                name: "Default?",
                description: "Whether this option is selected by default.",
                types: ["boolean", "unspecified"]
            }
        ];
    },

    options: [
        {
            id: "show_inputs",
            name: "Enable Inputs?",
            description: "If enabled, this block will use inputs and allow action chaining.",
            type: "CHECKBOX"
        },
        {
            id: "label",
            name: "Label",
            description: "The label for this select menu option. [REQUIRED]",
            type: "TEXT"
        },
        {
            id: "value",
            name: "Value",
            description: "The value for this select menu option. [REQUIRED]",
            type: "TEXT"
        },
        {
            id: "description",
            name: "Description",
            description: "The description of this select menu option.",
            type: "TEXT"
        },
        {
            id: "emoji",
            name: "Emoji",
            description: "The emoji or emote ID to display on this select menu option.",
            type: "TEXT"
        },
        {
            id: "default",
            name: "Default?",
            description: "Whether this select menu option is selected by default.",
            type: "CHECKBOX"
        }
    ],

    outputs(data) {
        const outputs = [
            {
                id: "select_menu_option",
                name: "Select Menu Option",
                description: "Type: Object\n\nDescription: The select menu option.",
                types: ["object"]
            }
        ];

        if (data?.options?.show_inputs) {
            outputs.unshift({
                id: "action",
                name: "Action",
                description: "Executes this block.",
                types: ["action"]
            });
        }

        return outputs;
    },

    code(cache) {
        const { StringSelectMenuOptionBuilder } = require("discord.js");

        const executedFrom = cache.executedFrom?.[0];
        const showinputs = this.GetOptionValue("show_inputs", cache);
        if (executedFrom != "action" && showinputs) return;

        const get = (id) => this.GetInputValue(id, cache) ?? this.GetOptionValue(id, cache);

        const label = get("label");
        const value = get("value");
        const description = get("description"); // invisible char fallback
        const emoji = get("emoji");
        const isDefault = get("default");

        const option = new StringSelectMenuOptionBuilder()
            .setLabel(label)
            .setValue(value);

        if (description && description != "") option.setDescription(description);
        if (isDefault) option.setDefault(true);
        if (emoji) {
            option.setEmoji(isNaN(emoji) ? { name: emoji } : { id: emoji, animated: true });
        }

        this.StoreOutputValue(option, "select_menu_option", cache, "inputBlock");

        if (executedFrom === "action") {
            this.RunNextBlock("action", cache);
        }
    }
};
