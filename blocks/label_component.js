module.exports = {
    name: "Label (Component)",

    description: "Creates a Label for ONLY MODALS",

    category: "Component Stuff",

    auto_execute: true,

    inputs(data) {
        if (!data?.options?.show_inputs) return [{
                id: "modal_component",
                name: "Modal Component",
                description: "The Modal Component to add. This can be any Type of Select Menu, Text Input or File Upload component.",
                types: ["object", "unspecified"],
                required: true
            }];

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
                description: "The Label for the component.",
                types: ["text", "unspecified"]
            },
            {
                id: "description",
                name: "Description",
                description: "The Description for the component.",
                types: ["text", "unspecified"]
            },
            {
                id: "modal_component",
                name: "Modal Component",
                description: "The Modal Component to add. This can be any Type of Select Menu, Text Input or File Upload component.",
                types: ["object", "unspecified"],
                required: true
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
            id: "label",
            name: "Label (Max 45 Chars)",
            description: "The Label for the component. This is required!",
            type: "TEXT",
            max: 45
        },
        {
            id: "description",
            name: "Description (Max 100 Chars)",
            description: "The Description for the component. Optional.",
            type: "TEXT",
            max: 100
        }
    ],

    outputs(data) {
        const outputs = [
            {
                id: "label",
                name: "Label (Component)",
                description: "The Label component.",
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
        const { LabelBuilder } = require("discord.js");

        const executedFrom = cache.executedFrom?.[0];
        const showinputs = this.GetOptionValue("show_inputs", cache);
        if (executedFrom != "action" && showinputs) return;

        const get = (id) => showinputs ? (this.GetInputValue(id, cache) ?? this.GetOptionValue(id, cache)) : this.GetOptionValue(id, cache);
        const label = get("label");
        const description = get("description");
        const modalComponent = this.GetInputValue("modal_component", cache, { fetch: true });
        const finalModalComponent = modalComponent?.data?.type == 1 ? modalComponent?.components?.[0] : modalComponent;

        if (!modalComponent || !finalModalComponent) {
            this.end(new Error("The provided component is not a Modal Component!"), true, false);
            return;
        }

        if (!label || label.length <= 0) return this.end(new Error("Label is required!"), true, false);

        const labelcomponent = new LabelBuilder();
        labelcomponent.setLabel(label);
        if(description?.length) labelcomponent.setDescription(description);

        switch (finalModalComponent?.type || finalModalComponent?.data?.type) {
            case 3:
                labelcomponent.setStringSelectMenuComponent(finalModalComponent);
                break;
            case 4:
                labelcomponent.setTextInputComponent(finalModalComponent);
                break;
            case 5:
                labelcomponent.setUserSelectMenuComponent(finalModalComponent);
                break;
            case 6:
                labelcomponent.setRoleSelectMenuComponent(finalModalComponent);
                break;
            case 7:
                labelcomponent.setMentionableSelectMenuComponent(finalModalComponent);
                break;
            case 8:
                labelcomponent.setChannelSelectMenuComponent(finalModalComponent);
                break;
            case 19:
                labelcomponent.setFileUploadComponent(finalModalComponent);
                break;
            default:
                this.end(new Error("The provided component is not a Select Menu or Text Input!"), true, false);
                return;
        }

        this.StoreOutputValue(labelcomponent, "label", cache, "inputBlock");

        if (executedFrom === "action") {
            this.RunNextBlock("action", cache);
        }
    }
};
