module.exports = {
    name: "Toggle Boolean",

    description: "Toggles a Boolean to the opposite value.",

    category: "Inputs",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Description: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "input",
            "name": "Boolean",
            "description": "Description: The boolean to toggle.",
            "types": ["boolean", "unspecified"]
        }
    ],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks.",
            "types": ["action"]
        },
        {
            "id": "output",
            "name": "Boolean",
            "description": "Type: Boolean\n\nDescription: The boolean.",
            "types": ["boolean"]
        }
    ],

    code(cache) {
        const input = this.GetInputValue("input", cache);

        this.StoreOutputValue(!input, "output", cache);
        this.RunNextBlock("action", cache);
    }
}