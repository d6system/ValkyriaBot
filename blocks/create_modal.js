module.exports = {
    name: "Create and Show Modal",

    description: "Creates and Shows a Modal on an Interaction(by @XCraftTM)",

    category: "Interaction Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "interaction",
            "name": "Interaction",
            "description": "Type: Object\n\nDescription: The Title of Your Application",
            "types": ["object"],
            "required": true
        },
        {
            "id": "customid",
            "name": "CustomID",
            "description": "Type: Text\n\nDescription: The ID of the Application.",
            "types": ["text", "unspecified"],
        },
        {
            "id": "title",
            "name": "Title",
            "description": "Type: Text\n\nDescription:The Title of Your Application",
            "types": ["text", "unspecified"]
        },
        {
            "id": "label_textDisplay_1",
            "name": "Label/Text 1",
            "description": "Use Either a Label Component or a Text Display Component (REQUIRED)",
            "types": ["object", "unspecified"],
            "required": true
        },
        {
            "id": "label_textDisplay_2",
            "name": "Label/Text 2",
            "description": "Use Either a Label Component or a Text Display Component (OPTIONAL)",
            "types": ["object", "unspecified"]
        },
        {
            "id": "label_textDisplay_3",
            "name": "Label/Text 3",
            "description": "Use Either a Label Component or a Text Display Component (OPTIONAL)",
            "types": ["object", "unspecified"]
        },
        {
            "id": "label_textDisplay_4",
            "name": "Label/Text 4",
            "description": "Use Either a Label Component or a Text Display Component (OPTIONAL)",
            "types": ["object", "unspecified"]
        },
        {
            "id": "label_textDisplay_5",
            "name": "Label/Text 5",
            "description": "Use Either a Label Component or a Text Display Component (OPTIONAL)",
            "types": ["object", "unspecified"]
        }
    ],

    options: [
        {
            "id": "customid",
            "name": "CustomID",
            "description": "Description: The ID of the Application.",
            "type": "TEXT"
        },
        {
            "id": "title",
            "name": "Title",
            "description": "Description: The Title of Your Application",
            "type": "TEXT"
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        }
    ],

    code(cache) {
        const { ModalBuilder } = require("discord.js");
        var custom_id = this.GetInputValue("customid", cache) || this.GetOptionValue("customid", cache);
        var title = this.GetInputValue("title", cache) || this.GetOptionValue("title", cache);
        const interaction = this.GetInputValue("interaction", cache);
        const textfield1 = this.GetInputValue("label_textDisplay_1", cache, { fetch: true });
        const textfield2 = this.GetInputValue("label_textDisplay_2", cache, { fetch: true });
        const textfield3 = this.GetInputValue("label_textDisplay_3", cache, { fetch: true });
        const textfield4 = this.GetInputValue("label_textDisplay_4", cache, { fetch: true });
        const textfield5 = this.GetInputValue("label_textDisplay_5", cache, { fetch: true });
        const options = [textfield1, textfield2, textfield3, textfield4, textfield5].filter(a => a != undefined);

        const modal = new ModalBuilder()
            .setCustomId(custom_id)
            .setTitle(title)

        options.forEach(option => {
            if (option) {
                if(option?.type == 18 || option?.data?.type == 18) modal.addLabelComponents(option)
                    else if(option?.type == 10 || option?.data?.type == 10) modal.addTextDisplayComponents(option)
            }
        });

        if(modal.components.length === 0) return this.end(new Error("You must provide at least one Label or Text Display Component!"), true, false);

        interaction.showModal(modal);

        this.RunNextBlock("action", cache)

    }
}