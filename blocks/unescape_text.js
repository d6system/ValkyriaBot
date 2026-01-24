module.exports = {
    name: "Unescape Text",

    description: "Converts a text that includes a escape character into utilizing that character.",

    category: "Utilities",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "text",
            "name": "Text",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The text to utilize.",
            "types": ["text", "unspecified"]
        }
    ],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "utilized",
            "name": "Utilized",
            "description": "Type: Object\n\nDescription: The text that has been utilized.",
            "types": ["text", "unspecified"]
        }
    ],

    async code(cache) {
        const text = this.GetInputValue("text", cache) + "";
        const utilized = text.replaceAll(/\\u([\dA-Fa-f]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)));;
        this.StoreOutputValue(utilized, "utilized", cache);
        this.RunNextBlock("action", cache);
    }
}