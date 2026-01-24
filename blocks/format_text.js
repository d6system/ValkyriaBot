module.exports = {
    name: "Format Text",

    description: "Removes line breaks and other formatting from a text.",

    category: "Text Manipulation",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\\n\\nDescription: Executes this block.",
            "types": ["action"],
            "required": true
        },
        {
            "id": "text",
            "name": "Text",
            "description": "Acceptable Types: Text, Unspecified\\n\\nDescription: The text to be cleaned.",
            "types": ["text", "unspecified"],
            "multiInput": true
        }
    ],

    options: [
        {
            "id": "filter_type",
            "name": "Filter Type",
            "description": "Choose which formatting should be removed.",
            "type": "SELECT",
            "options": {
                "linebreaks": "Remove only line breaks",
                "all": "Remove all formatting"
            }
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\\n\\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "formatted_text",
            "name": "Formatted Text",
            "description": "Type: Text\\n\\nDescription: The cleaned text.",
            "types": ["text"],
            "multiOutput": true
        }
    ],

    code(cache) {
        const texts = this.GetInputValue("text", cache) || [];
        const filter_type = this.GetOptionValue("filter_type", cache) + "";

        let formattedTexts = texts.map(text => {
            if (typeof text !== "string") return text;

            if (filter_type === "linebreaks") {
                return text.replace(/(\\r\\n|\\n|\\r)/g, " ");
            } else if (filter_type === "all") {
                return text.replace(/(\\r\\n|\\n|\\r)/g, " ")
                           .replace(/\\t+/g, " ")
                           .replace(/\\s{2,}/g, " ")
                           .trim();
            }
            return text;
        });

        this.StoreOutputValue(formattedTexts, "formatted_text", cache);
        this.RunNextBlock("action", cache);
    }
};
