module.exports = {
    name: "Convert Date / Unix Timestamp",

    description: "Converts a JavaScript Date object into a Unix timestamp and vice versa.",

    category: "Date Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"]
        },
        {
            id: "input",
            name: "Input",
            description: "Acceptable Types: Number, Date, Text\n\nDescription: The input to convert. A number will be treated as a Unix timestamp. A Date or ISO 8601 text will be parsed as a Date.",
            types: ["number", "date", "text", "unspecified"]
        }
    ],

    options: [
        {
            id: "direction",
            name: "Conversion Direction",
            description: "Select the direction of conversion.",
            type: "SELECT",
            options: {
                to_unix: "Date to Unix Timestamp",
                to_date: "Unix Timestamp to Date"
            }
        }
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "output",
            name: "Converted Output",
            description: "Type: Number or Date\n\nThe converted value depending on the selected direction.",
            types: ["number", "date"]
        }
    ],

    code(cache) {
        const input = this.GetInputValue("input", cache);
        const direction = this.GetOptionValue("direction", cache);

        let output;

        if (direction === "to_unix") {
            const dateObj = new Date(input);
            if (isNaN(dateObj.getTime())) {
                throw new Error("Invalid Date input.");
            }
            output = Math.floor(dateObj.getTime() / 1000);
        } else if (direction === "to_date") {
            const timestamp = Number(input);
            if (isNaN(timestamp)) {
                throw new Error("Invalid Unix timestamp.");
            }
            output = new Date(timestamp * 1000);
        }

        this.StoreOutputValue(output, "output", cache);
        this.RunNextBlock("action", cache);
    }
};