module.exports = {
    name: "Modal File Upload (Component)",

    description: "Creates a File Upload component for ONLY MODALS",

    category: "Component Stuff",

    auto_execute: true,

    inputs(data) {
        if (!data?.options?.show_inputs) return [];

        return [
            {
                id: "action",
                name: "Action",
                description: "Executes this block.",
                types: ["action"]
            },
            {
                id: "customid",
                name: "Custom ID",
                description: "The Custom ID for the component.",
                types: ["text", "unspecified"]
            },
            {
                id: "min_values",
                name: "Minimum Values",
                description: "The Minimum Values for the File Upload component.",
                types: ["number", "unspecified"]
            },
            {
                id: "max_values",
                name: "Maximum Values",
                description: "The Maximum Values for the File Upload component.",
                types: ["number", "unspecified"]
            },
            {
                id: "required",
                name: "Required?",
                description: "Whether the component is required or not.",
                types: ["boolean", "unspecified"]
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
            id: "customid",
            name: "Custom ID (Max 45 Chars)",
            description: "The Custom ID for the component. This is required!",
            type: "TEXT",
            max: 100
        },
        {
            id: "min_values",
            name: "Minimum Values",
            description: "The Minimum Values for the File Upload component.",
            type: "NUMBER",
            min: 0,
            defaultValue: 1,
            max: 10
        },
        {
            id: "max_values",
            name: "Maximum Values",
            description: "The Maximum Values for the File Upload component.",
            type: "NUMBER",
            min: 1,
            defaultValue: 1,
            max: 10
        },
        {
            id: "required",
            name: "Required?",
            description: "Whether the component is required or not.",
            type: "CHECKBOX",
            defaultValue: true
        }
    ],

    outputs(data) {
        const outputs = [
            {
                id: "fileUploadComponent",
                name: "File Upload (Component)",
                description: "The File Upload component.",
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
        const { FileUploadBuilder } = require("discord.js");

        const executedFrom = cache.executedFrom?.[0];
        const showinputs = this.GetOptionValue("show_inputs", cache);
        if (executedFrom != "action" && showinputs) return;

        const get = (id) => showinputs ? (this.GetInputValue(id, cache) ?? this.GetOptionValue(id, cache)) : this.GetOptionValue(id, cache);
        const customId = get("customid");
        const minValues = get("min_values");
        const maxValues = get("max_values");
        const required = get("required");

        if (!customId || customId.length <= 0) return this.end(new Error("Custom ID is required!"), true, false);

        const fileUploadComponent = new FileUploadBuilder();
        fileUploadComponent.setCustomId(customId);
        fileUploadComponent.setMinValues(minValues);
        fileUploadComponent.setMaxValues(maxValues);
        fileUploadComponent.setRequired(required);

        this.StoreOutputValue(fileUploadComponent, "fileUploadComponent", cache, "inputBlock");

        if (executedFrom === "action") {
            this.RunNextBlock("action", cache);
        }
    }
};
