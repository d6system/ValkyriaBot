module.exports = {
    name: "Flip Number",

    description: "Flips a number or numeric text to its negative or positive form. Example: 100 → -100, -255 → 255",

    category: "Math",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"]
        },
        {
            id: "input",
            name: "Number/Text",
            description: "The number or text representing a number to flip. Accepts numbers or numeric text.",
            types: ["number", "text"]
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
            id: "result",
            name: "Flipped Value",
            description: "The result of flipping the sign of the input.",
            types: ["number", "text"]
        }
    ],

    code(cache) {
        const input = this.GetInputValue("input", cache);

        let flipped;

        if (typeof input === "number") {
            flipped = -input;
        } else if (!isNaN(input)) {
            const parsed = parseFloat(input);
            flipped = isNaN(parsed) ? input : -parsed;
        } else {
            flipped = input;
        }

        this.StoreOutputValue(flipped, "result", cache);
        this.RunNextBlock("action", cache);
    }
};