module.exports = {
    name: "Button (Component)",

    description: "Creates a button component for messages.",

    category: "Message Stuff",

    auto_execute: true,

    inputs(data) {
        const showInputs = data?.options?.show_inputs;
        const style = data?.options?.style || "1";

        if (!showInputs) return;

        const inputs = [
            {
                id: "action",
                name: "Action",
                description: "Executes this block.",
                types: ["action"]
            },
            {
                id: "label",
                name: "Label",
                description: "The label of the button.",
                types: ["text", "unspecified"]
            },
            {
                id: "emoji",
                name: "Emoji",
                description: "The emoji name or ID.",
                types: ["text", "unspecified"]
            },
            {
                id: "disabled",
                name: "Disabled",
                description: "Whether the button is disabled.",
                types: ["boolean", "unspecified"]
            },
            {
                id: "style",
                name: "Style",
                description: "The style number (1-5).",
                types: ["number", "text", "unspecified"]
            }
        ];

        if (style === "5") {
            inputs.push({
                id: "url",
                name: "URL",
                description: "The URL to open when clicked.",
                types: ["text", "unspecified"]
            });
        } else {
            inputs.push({
                id: "custom_id",
                name: "Custom ID",
                description: "The custom ID of the button.",
                types: ["text", "unspecified"]
            });
        }

        return inputs;
    },

    options(data) {
        const style = data?.options?.style || "1";
        return [
            {
                id: "show_inputs",
                name: "Enable Inputs?",
                description: "Show input fields instead of only using option panel.",
                type: "CHECKBOX"
            },
            {
                id: "label",
                name: "Label",
                description: "The label for this button. [REQUIRED]",
                type: "TEXT"
            },
            {
                id: "emoji",
                name: "Emoji (Optional)",
                description: "The emoji or the emote ID to display on this button.",
                type: "TEXT"
            },
            {
                id: "disabled",
                name: "Disabled",
                description: "Whether to disable this button",
                type: "CHECKBOX"
            },
            {
                id: "style",
                name: "Style",
                description: "The style for this button.",
                type: "SELECT",
                options: {
                    1: "Primary (Blurple)",
                    2: "Secondary (Grey)",
                    3: "Success (Green)",
                    4: "Danger (Red)",
                    5: "Link (Grey)"
                }
            },
            ...(style === "5"
                ? [{
                    id: "url",
                    name: "URL",
                    description: "The URL to redirect to when this button is clicked.",
                    type: "TEXT"
                }]
                : [{
                    id: "custom_id",
                    name: "Custom ID",
                    description: "The custom ID of this button.",
                    type: "TEXT"
                }]
            )
        ];
    },

    outputs(data) {
        const showInputs = data?.options?.show_inputs;

        const outputs = [
            {
                id: "button_component",
                name: "Button (Component)",
                description: "The button component.",
                types: ["object"]
            }
        ];

        if (showInputs) {
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
        const { ButtonBuilder } = require("discord.js");
        const { randomUUID } = require("crypto");

        const executedFrom = cache.executedFrom?.[0];
        const showinputs = this.GetOptionValue("show_inputs", cache);
        if (executedFrom != "action" && showinputs) return;

        // Prefer input values first, then fallback to option values
        const getVal = (id) => this.GetInputValue(id, cache) ?? this.GetOptionValue(id, cache);

        const label = getVal("label");
        const emoji = getVal("emoji");
        const disabled = getVal("disabled");
        const style = Number(getVal("style")) || 1;
        const url = getVal("url");
        const custom_id = getVal("custom_id") || randomUUID();

        const buttonComponent = new ButtonBuilder()
            .setLabel(label)
            .setStyle(style);

        if (disabled) buttonComponent.setDisabled(Boolean(disabled));
        if (style === 5 && url) {
            buttonComponent.setURL(url);
        } else {
            buttonComponent.setCustomId(custom_id);
        }

        if (emoji) {
            buttonComponent.setEmoji(isNaN(emoji) ? { name: emoji } : { id: emoji, animated: true });
        }

        this.StoreOutputValue(buttonComponent, "button_component", cache, "inputBlock");

        if (executedFrom === "action") {
            this.RunNextBlock("action", cache);
        }
    }
};
