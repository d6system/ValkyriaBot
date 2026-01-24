module.exports = {
    name: "Text Display (Component)",

    description: "Creates a Text Display for Containers and Sections.",

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
                id: "text",
                name: "Text",
                description: "The text to display.",
                types: ["text", "unspecified"]
            }
        ];
    },

    options: [
        {
            id: "show_inputs",
            name: "Enable Inputs?",
            description: "If enabled, allows chaining and overrides text via input.",
            type: "CHECKBOX"
        },
        {
            id: "text",
            name: "Text",
            description: "The text to display.",
            type: "TEXT"
        }
    ],

    outputs(data) {
        const outputs = [
            {
                id: "textdisplay",
                name: "Text Display (Component)",
                description: "The Text Display component.",
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
        const { TextDisplayBuilder } = require("discord.js");

        const executedFrom = cache.executedFrom?.[0];
        const showinputs = this.GetOptionValue("show_inputs", cache);
        if (executedFrom != "action" && showinputs) return;

        const get = (id) => this.GetInputValue(id, cache) ?? this.GetOptionValue(id, cache);
        const text = get("text");

        if (!text || text.length <= 0) return;

        const textdisplay = new TextDisplayBuilder();
        textdisplay.setContent(text);

        this.StoreOutputValue(textdisplay, "textdisplay", cache, "inputBlock");

        if (executedFrom === "action") {
            this.RunNextBlock("action", cache);
        }
    }
};
