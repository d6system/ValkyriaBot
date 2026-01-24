module.exports = {
    name: "Remove Escape Characters",

    description: "Removes all JavaScript escape characters from a given text.",

    category: "Text Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Executes this block.",
            "types": ["action"]
        },
        {
            "id": "text",
            "name": "Text",
            "description": "The text from which to remove JavaScript escape characters.",
            "types": ["text", "unspecified"],
            "required": true
        }
    ],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "clean_text",
            "name": "Cleaned Text",
            "description": "The text with all JavaScript escape characters removed.",
            "types": ["text"]
        }
    ],

    code(cache) {
        const text = this.GetInputValue("text", cache) + "";

        // Remove common JS escape characters
        const cleaned = text
            .replace(/\\n/g, "")
            .replace(/\\r/g, "")
            .replace(/\\t/g, "")
            .replace(/\\v/g, "")
            .replace(/\\f/g, "")
            .replace(/\\b/g, "")
            .replace(/\\0/g, "")
            .replace(/\\'/g, "'")
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, "");

        this.StoreOutputValue(cleaned, "clean_text", cache);
        this.RunNextBlock("action", cache);
    }
}
