module.exports = {
    name: "Parse Duration to Date",

    description: "Parses a duration string (e.g. 5m, 24h, 3d, 200ms, 2y) and returns the current time plus that duration as a Date. If invalid, goes to a separate action path.",

    category: "Date Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"]
        },
        {
            id: "duration",
            name: "Duration String",
            description: "The duration string (e.g. 200ms, 5s, 5m, 24h, 3d, 2w, 6mo, 2y).",
            types: ["text", "unspecified"],
            required: true
        }
    ],

    options: [],

    outputs: [
        {
            id: "action",
            name: "Action (Success)",
            description: "Executes the following blocks when parsing succeeds.",
            types: ["action"]
        },
        {
            id: "action_invalid",
            name: "Action (Invalid)",
            description: "Executes the following blocks if the input duration string is invalid.",
            types: ["action"]
        },
        {
            id: "date",
            name: "Date",
            description: "The calculated future Date object.",
            types: ["date", "unspecified"]
        }
    ],

    code(cache) {
        const input = this.GetInputValue("duration", cache)?.trim();
        const regex = /^(\d+)(ms|s|m|h|d|w|mo|y)$/i; // supports ms, seconds, minutes, hours, days, weeks, months, years

        if (!regex.test(input)) {
            this.RunNextBlock("action_invalid", cache);
            return;
        }

        const [, valueStr, unit] = input.match(regex);
        const value = parseInt(valueStr, 10);

        let ms = 0;
        switch (unit.toLowerCase()) {
            case "ms": ms = value; break;
            case "s": ms = value * 1000; break;
            case "m": ms = value * 60 * 1000; break;
            case "h": ms = value * 60 * 60 * 1000; break;
            case "d": ms = value * 24 * 60 * 60 * 1000; break;
            case "w": ms = value * 7 * 24 * 60 * 60 * 1000; break;
            case "mo": ms = value * 30 * 24 * 60 * 60 * 1000; break; // approx month
            case "y": ms = value * 365 * 24 * 60 * 60 * 1000; break; // approx year
        }

        const futureDate = new Date(Date.now() + ms);
        this.StoreOutputValue(futureDate, "date", cache);
        this.RunNextBlock("action", cache);
    }
}