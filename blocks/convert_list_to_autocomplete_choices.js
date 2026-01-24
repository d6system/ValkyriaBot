module.exports = {
    name: "Convert List to Autocomplete Choices",

    description: "Converts a List of Options to Autocomplete Choices. (by @XCraftTM)",

    category: "Interaction Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "list",
            name: "List",
            description: "Type: List\n\nDescription: The List of Options to convert to Autocomplete Choices.",
            types: ["list", "unspecified"],
            required: true
        }
    ],

    options: [
        {
            id: "advanced_mode",
            name: "Advanced Mode",
            description: "Description: Whether to use Advanced Mode or not. (Can work with Objects)",
            type: "CHECKBOX",
        },
        {
            id: "name",
            name: "Name (Property)",
            description: "Description: The Path to the Name Property in the Object you want to use. (Advanced Mode)",
            type: "TEXT"
        },
        {
            id: "value",
            name: "Value (Property)",
            description: "Description: The Path to the Value Property in the Object you want to use. (Advanced Mode)",
            type: "TEXT"
        }
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "choices",
            name: "Choices",
            description: "Type: List\n\nDescription: The List of choices with the new option added.",
            types: ["list", "unspecified"]
        }
    ],

    async code(cache) {
        const list = this.GetInputValue("list", cache);
        const advanced_mode = this.GetOptionValue("advanced_mode", cache);
        const name = this.GetOptionValue("name", cache);
        const value = this.GetOptionValue("value", cache);

        if(!list || !Array.isArray(list)) {
            console.error("Convert List to Autocomplete Choices: Invalid List provided.");
            return;
        }

        let choices = [];

        if(advanced_mode) {
            for(const item of list) {
                choices.push({
                    name: eval(`item.${name}`),
                    value: eval(`item.${value}`)
                });
            }
        } else {
            for(const item of list) {
                choices.push({
                    name: item,
                    value: item
                });
            }
        }

        this.StoreOutputValue(choices, "choices", cache);
        this.RunNextBlock("action", cache);                
    }
}

