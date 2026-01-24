module.exports = {
    name: "Separator (Component)",

    description: "Creates a Separator for Containers",

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
                id: "divider",
                name: "Divider",
                description: "Whether to display a divider.",
                types: ["boolean", "unspecified"]
            },
            {
                id: "spacing",
                name: "Spacing",
                description: "Spacing value (0, 1, 2).",
                types: ["number", "text", "unspecified"]
            }
        ];
    },

    options: [
        {
            id: "show_inputs",
            name: "Enable Inputs?",
            description: "If enabled, uses inputs instead of static options, and allows chaining via action.",
            type: "CHECKBOX"
        },
        {
            id: "divider",
            name: "Divider",
            description: "Whether to display a divider.",
            type: "CHECKBOX",
            defaultValue: true,
        },
        {
            id: "spacing",
            name: "Spacing",
            description: "The spacing of the separator.",
            type: "SELECT",
            options: {
                0: "None",
                1: "Small",
                2: "Large"
            }
        }
    ],

    outputs(data) {
        const outputs = [
            {
                id: "separator",
                name: "Separator (Component)",
                description: "Type: Object\n\nDescription: The Separator component.",
                types: ["object"],
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
        const { SeparatorBuilder } = require("discord.js");

        const executedFrom = cache.executedFrom?.[0];
        const showinputs = this.GetOptionValue("show_inputs", cache);
        if (executedFrom != "action" && showinputs) return;

        const get = (id) => this.GetInputValue(id, cache) ?? this.GetOptionValue(id, cache);

        const divider = get("divider");
        const spacing = parseInt(get("spacing"));

        const separator = new SeparatorBuilder();

        separator.setDivider(!!divider);
        if (!isNaN(spacing) && spacing > 0) {
            separator.setSpacing(spacing);
        } else {
            separator.clearSpacing();
        }

        this.StoreOutputValue(separator, "separator", cache, "inputBlock");

        if (executedFrom === "action") {
            this.RunNextBlock("action", cache);
        }
    }
};
