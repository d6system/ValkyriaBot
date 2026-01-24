module.exports = {
    name: "Create Autocomplete Option Choice",

    description: "Creates an Autocomplete Option Choice. (by @XCraftTM)",

    category: "Interaction Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "choices",
            name: "Choices",
            description: "Type: List\n\nDescription: A List of already made choices which to add the Option to.",
            types: ["list", "unspecified"]
        },
        {
            id: "name",
            name: "Name",
            description: "Type: Text\n\nDescription: The name of the option. Only visible to the User.",
            types: ["text", "unspecified"]
        },
        {
            id: "value",
            name: "Value",
            description: "Type: Text\n\nDescription: The value of the option. This value will be the option return value when selected and runned.",
            types: ["text", "unspecified"]
        }
    ],

    options: [
        {
            id: "name",
            name: "Name",
            description: "Description: The name of the option. Only visible to the User.",
            type: "TEXT"
        },
        {
            id: "value",
            name: "Value",
            description: "Description: The value of the option. This value will be the option return value when selected and runned.",
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
        },
        {
            id: "choice",
            name: "Choice",
            description: "Type: Object\n\nDescription: The Choice object output.",
            types: ["object", "unspecified"]
        }
    ],

    async code(cache) {
        const choices = (Array.isArray(this.GetInputValue("choices", cache)) ? this.GetInputValue("choices", cache) : []) || [];
        const name = this.GetInputValue("name", cache) || this.GetOptionValue("name", cache);
        const value = this.GetInputValue("value", cache) || this.GetOptionValue("value", cache);

        const choice = {
            name: name,
            value: value
        }

        choices.push(choice);

        this.StoreOutputValue(choices, "choices", cache);
        this.StoreOutputValue(choice, "choice", cache);
        this.RunNextBlock("action", cache);                
    }
}

