module.exports = {
    name: "Calculate Time Duration",

    description: "Calculates the time duration between two dates and outputs hours, minutes, and seconds.",

    category: "Date Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"],
            required: true
        },
        {
            id: "start_date",
            name: "Start Date",
            description: "Acceptable Types: Date\n\nDescription: The starting date.",
            types: ["date", "unspecified"],
            required: true
        },
        {
            id: "end_date",
            name: "End Date",
            description: "Acceptable Types: Date\n\nDescription: The ending date.",
            types: ["date"],
            required: true
        }
    ],

    options: [],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "hours",
            name: "Hours",
            description: "Type: Number\n\nDescription: The total hours between the dates.",
            types: ["number"]
        },
        {
            id: "minutes",
            name: "Minutes",
            description: "Type: Number\n\nDescription: The total minutes (excluding full hours).",
            types: ["number"]
        },
        {
            id: "seconds",
            name: "Seconds",
            description: "Type: Number\n\nDescription: The total seconds (excluding full minutes).",
            types: ["number"]
        }
    ],

    code(cache) {
        const startDate = new Date(this.GetInputValue("start_date", cache));
        const endDate = new Date(this.GetInputValue("end_date", cache));
        const diffMs = endDate - startDate;

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        this.StoreOutputValue(hours, "hours", cache);
        this.StoreOutputValue(minutes, "minutes", cache);
        this.StoreOutputValue(seconds, "seconds", cache);
        this.RunNextBlock("action", cache);
    }
}
	