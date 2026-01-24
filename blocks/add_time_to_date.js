module.exports = {
    name: "Add Time to Date",

    description: "Takes a date and adds specified amounts of seconds, minutes, hours, days, months, and years.",

    category: "Date Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"]
        },
        {
            id: "date",
            name: "Date",
            description: "The original date to which time will be added.",
            types: ["date", "text", "unspecified"],
            required: true
        },
        {
            id: "seconds",
            name: "Seconds",
            description: "Number of seconds to add.",
            types: ["number", "unspecified"]
        },
        {
            id: "minutes",
            name: "Minutes",
            description: "Number of minutes to add.",
            types: ["number", "unspecified"]
        },
        {
            id: "hours",
            name: "Hours",
            description: "Number of hours to add.",
            types: ["number", "unspecified"]
        },
        {
            id: "days",
            name: "Days",
            description: "Number of days to add.",
            types: ["number", "unspecified"]
        },
        {
            id: "months",
            name: "Months",
            description: "Number of months to add.",
            types: ["number", "unspecified"]
        },
        {
            id: "years",
            name: "Years",
            description: "Number of years to add.",
            types: ["number", "unspecified"]
        }
    ],

    options: [],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes the next block after processing.",
            types: ["action"]
        },
        {
            id: "new_date",
            name: "New Date",
            description: "The resulting date after time is added.",
            types: ["date"]
        }
    ],

    code(cache) {
        let date = new Date(this.GetInputValue("date", cache));

        const seconds = parseInt(this.GetInputValue("seconds", cache)) || 0;
        const minutes = parseInt(this.GetInputValue("minutes", cache)) || 0;
        const hours = parseInt(this.GetInputValue("hours", cache)) || 0;
        const days = parseInt(this.GetInputValue("days", cache)) || 0;
        const months = parseInt(this.GetInputValue("months", cache)) || 0;
        const years = parseInt(this.GetInputValue("years", cache)) || 0;

        date.setSeconds(date.getSeconds() + seconds);
        date.setMinutes(date.getMinutes() + minutes);
        date.setHours(date.getHours() + hours);
        date.setDate(date.getDate() + days);
        date.setMonth(date.getMonth() + months);
        date.setFullYear(date.getFullYear() + years);

        this.StoreOutputValue(date, "new_date", cache);
        this.RunNextBlock("action", cache);
    }
};