module.exports = {
    name: "Check If Value Exists (with fallback)",

    description: "Returns the fallback value if the input is null, undefined or empty.",

    category: "Extras",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"]
        },
        {
            id: "value",
            name: "Primary Value",
            description: "The value to check. If it is null, undefined or an empty string, the fallback will be used.",
            types: ["unspecified", "text", "number", "object", "boolean", "list", "null", "date"]
        },
        {
            id: "fallback",
            name: "Fallback Response",
            description: "The fallback value to use if the primary value is invalid.",
            types: ["unspecified", "text", "number", "object", "boolean", "list", "date"],
            required: true
        }
    ],

    options: [],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes the next block after this block finishes.",
            types: ["action"]
        },
        {
            id: "result",
            name: "Result",
            description: "The resulting value, either the original or the fallback.",
            types: ["unspecified", "text", "number", "object", "boolean", "list", "null", "date"]
        }
    ],

    code(cache) {
        const value = this.GetInputValue("value", cache);
        const fallback = this.GetInputValue("fallback", cache);

        const result = (!value || value === null || value === undefined || value === "") ? fallback : value;

        this.StoreOutputValue(result, "result", cache);
        this.RunNextBlock("action", cache);
    }
};
