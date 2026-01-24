module.exports = {
    name: "Media Gallery (Component)",

    description: "Creates a Media Gallery for Containers.",

    category: "Component Stuff",

    auto_execute: true,

    inputs(data) {
        const inputs = [
            {
                id: "items",
                name: "Media Gallery Item",
                description: "The media gallery item to display.",
                types: ["object", "unspecified"],
                multiInput: true,
                required: true,
                max: 10
            }
        ];

        if (data?.options?.show_action) {
            inputs.unshift({
                id: "action",
                name: "Action",
                description: "Executes this block.",
                types: ["action"]
            });
        }

        return inputs;
    },

    options: [
        {
            id: "show_action",
            name: "Enable Action Input/Output?",
            description: "If enabled, adds an Action input/output for logic chaining.",
            type: "CHECKBOX"
        }
    ],

    outputs(data) {
        const outputs = [
            {
                id: "mediagallery",
                name: "Media Gallery (Component)",
                description: "Type: Object\n\nDescription: The Media Gallery component.",
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
        const { MediaGalleryBuilder } = require("discord.js");

        const executedFrom = cache.executedFrom?.[0];
        const showinputs = this.GetOptionValue("show_action", cache);
        if (executedFrom != "action" && showinputs) return;

        const items = this.GetInputValue("items", cache, { fetch: true }).filter((a) => a);

        const mediagallery = new MediaGalleryBuilder();

        mediagallery.addItems(items);

        this.StoreOutputValue(mediagallery, "mediagallery", cache, "inputBlock");

        if (executedFrom === "action") {
            this.RunNextBlock("action", cache);
        }
    }
};
