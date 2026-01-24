module.exports = {
    name: "Unix Timestamp to Date",

    description: "Converts a Unix timestamp (in seconds) to a JavaScript Date object. Improved version of XCraftTM's block by sam51211.",

    category: "Date Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"]
        },
        {
            id: "timestamp",
            name: "Unix Timestamp (Seconds)",
            description: "The Unix timestamp in seconds to convert.",
            types: ["number", "text", "unspecified"],
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
            id: "date",
            name: "Date",
            description: "The resulting JavaScript Date object.",
            types: ["date"]
        }
    ],

    code(cache) {
        const timestamp = this.GetInputValue("timestamp", cache);
        
        const seconds = Number(timestamp);
        const date = new Date(seconds * 1000); // Convert to milliseconds

        this.StoreOutputValue(date, "date", cache);
        this.RunNextBlock("action", cache);
    }
}