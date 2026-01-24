"use strict";
function isNumber(value) {
    if (typeof value !== "string" && typeof value !== "number") {
        return false;
    }
    return !!value.toString().trim().match(/^[0-9]+$/);
}
const block = {
    name: "Is Number",
    description: "Validates that the input is a number (only characters 0-9 allowed) and executes an action based on that",
    category: "Blocks",
    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"],
        },
        {
            id: "input",
            name: "Input",
            description: "Type: Text, Number\n\nDescription: value to check for being a number",
            types: ["unspecified", "text", "number"],
        },
    ],
    outputs: [
        {
            id: "true_action",
            name: "True Action",
            description: "Type: Action\n\nDescription: Block to execute if input is a number",
            types: ["action"],
        },
        {
            id: "false_action",
            name: "False Action",
            description: "Type: Action\n\nDescription: Block to execute if input is NOT a number",
            types: ["action"],
        },
    ],
    options: [],
    code(cache) {
        const input = this.GetInputValue("input", cache);
        if (isNumber(input)) {
            this.RunNextBlock("true_action", cache);
        }
        else {
            this.RunNextBlock("false_action", cache);
        }
    },
};
module.exports = block;
