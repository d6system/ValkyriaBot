module.exports = {
    name: "Character Count",
    description: "Counts the number of characters in a given text.",
    category: "D6 blocks",
    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Trigger the block.",
            types: ["action"]
        },
        {
            id: "text",
            name: "Text",
            description: "The text to count characters from.",
            types: ["text"]
        }
    ],
    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Trigger the block.",
            types: ["action"]
        },
        {
            id: "char_count",
            name: "Char Count",
            description: "The number of characters in the input text.",
            types: ["number"]
        }
    ],
    code(cache) {
        const text = this.GetInputValue("text", cache);

        const charCount = text.trim().length;

        this.StoreOutputValue(charCount, "char_count", cache);
        this.RunNextBlock("action", cache);
    }
};