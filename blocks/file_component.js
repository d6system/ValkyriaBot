module.exports = {
    name: "File (Component)",

    description: "Creates a File for Containers",

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
                id: "name",
                name: "File Name",
                description: "Name of the file that was attached.",
                types: ["text", "unspecified"]
            },
            {
                id: "spoiler",
                name: "Spoiler",
                description: "Whether to mark this file as a spoiler.",
                types: ["boolean", "unspecified"]
            }
        ];
    },

    options: [
        {
            id: "show_inputs",
            name: "Enable Inputs?",
            description: "If enabled, use inputs for file name and spoiler and enable logic chaining.",
            type: "CHECKBOX"
        },
        {
            id: "name",
            name: "File Name (Read Description)",
            description: "Connect a attachment to the Message you want to send and provide a name for it. Then go back here and enter the Name of the file you attached to this field.",
            type: "TEXT",
        },
        {
            id: "spoiler",
            name: "Spoiler",
            description: "Whether to mark this file as a spoiler.",
            type: "CHECKBOX",
        }
    ],

    outputs(data) {
        const outputs = [
            {
                id: "file",
                name: "File (Component)",
                description: "Type: Object\n\nDescription: The File component.",
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
        const { FileBuilder } = require("discord.js");

        const executedFrom = cache.executedFrom?.[0];
        const showinputs = this.GetOptionValue("show_inputs", cache);
        if (executedFrom != "action" && showinputs) return;

        const get = (id) => this.GetInputValue(id, cache) ?? this.GetOptionValue(id, cache);

        const name = get("name");
        const spoiler = get("spoiler");

        const file = new FileBuilder();

        file.setURL(`attachment://${name}`);
        if (spoiler) {
            file.setSpoiler(true);
        }

        this.StoreOutputValue(file, "file", cache, "inputBlock");

        if (executedFrom === "action") {
            this.RunNextBlock("action", cache);
        }
    }
};
