module.exports = {
    name: "Section (Component)",

    description: "Creates a Section component for Container.",

    category: "Component Stuff",

    auto_execute: true,

    inputs(data) {
        const baseInputs = [
            {
                id: "text_display",
                name: "Text Display (Comp.)",
                description: "The text display component for this section. MAX 3.",
                types: ["object", "unspecified"],
                multiInput: true,
                max: 3
            },
            {
                id: "thumbnail",
                name: "Thumbnail (Component)",
                description: "The thumbnail component for this section.",
                types: ["object", "unspecified"],
                multiInput: false,
            },
            {
                id: "button",
                name: "Button (Component)",
                description: "The button component for this section.",
                types: ["object", "unspecified"],
                multiInput: false,
            }
        ];

        if (data?.options?.show_action) {
            baseInputs.unshift({
                id: "action",
                name: "Action",
                description: "Executes this block.",
                types: ["action"]
            });
        }

        return baseInputs;
    },

    options() {
        return [
            {
                id: "show_action",
                name: "Enable Action Input/Output?",
                description: "If enabled, adds an Action input/output for chaining.",
                type: "CHECKBOX"
            }
        ];
    },

    outputs(data) {
        const outputs = [
            {
                id: "section",
                name: "Section (Component)",
                description: "Type: Object\n\nDescription: The section component.",
                types: ["object"],
            }
        ];

        if (data?.options?.show_action) {
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
        const { SectionBuilder } = require("discord.js");

        const executedFrom = cache.executedFrom?.[0];
        const showinputs = this.GetOptionValue("show_action", cache);
        if (executedFrom != "action" && showinputs) return;

        const button = this.GetInputValue("button", cache, { fetch: true });
        const text_display = this.GetInputValue("text_display", cache, { fetch: true })?.filter((a) => a) || [];
        const thumbnail = this.GetInputValue("thumbnail", cache, { fetch: true });

        const section = new SectionBuilder();

        if (button) section.setButtonAccessory(button);
        if (text_display?.length) section.addTextDisplayComponents(text_display);
        if (thumbnail) section.setThumbnailAccessory(thumbnail);

        this.StoreOutputValue(section, "section", cache, "inputBlock");

        if (executedFrom === "action") {
            this.RunNextBlock("action", cache);
        }
    }
};
