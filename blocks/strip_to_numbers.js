module.exports = {
    name: "Strip and Normalize Number",

    description: "Strips non-numeric characters, converts negative numbers to positive, and rounds decimals to the nearest integer.",

    category: "Math",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"]
        },
        {
            id: "text",
            name: "Text",
            description: "The text to clean and normalize. Accepts numeric input with potential non-numeric characters.",
            types: ["text", "unspecified"],
            required: true
        }
    ],

    options: [],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "normalized_number",
            name: "Normalized Number",
            description: "The rounded, positive-only integer parsed from the input.",
            types: ["number"]
        },
        {
            id: "as_text",
            name: "As Text",
            description: "The normalized number as text.",
            types: ["text"]
        }
    ],

    code(cache) {
        const input = this.GetInputValue("text", cache);

        // Extract any valid number from input string
        const match = input.match(/-?\\d+(\\.\\d+)?/);
        let number = match ? parseFloat(match[0]) : 0;

        // Make it positive and round
        number = Math.abs(Math.round(number));

        this.StoreOutputValue(number, "normalized_number", cache);
        this.StoreOutputValue(number.toString(), "as_text", cache);
        this.RunNextBlock("action", cache);
    }
};