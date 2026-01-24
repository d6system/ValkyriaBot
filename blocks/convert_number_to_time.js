module.exports= {
    name: "Convert Number to Time (Inviduals)",

    description: "Converts a number to time in weeks, days, hours, minutes and seconds.",

    category: "Date",

    inputs: [
    {
        id: "action",
        name: "Action",
        description: "Acceptable Types: Action\n\nDescription: Executes this block.",
        types: ["action"]
    },
    {
        id: "raw",
        name: "Raw Number",
        description: "Acceptable Types: Number, Text, Unspecified\n\nDescription: The raw Number to convert.",
        types: ["Number", "Text", "unspecified"],
        required: true
    },
    ],

    options: [
        {
            id: "type",
            name: "The Type of Input Time",
            description: "The type of time to convert the number from.",
            type: "SELECT",
            options: {
                "milliseconds": "Milliseconds",
                "seconds": "Seconds",
                "minutes": "Minutes",
                "hours": "Hours",
                "days": "Days"
            }
        }
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "formattedstring",
            name: "Full Time String",
            description: "Type: Text, Unspecified\n\nDescription: The formatted time string. For Example: '2 weeks 5 days 13 hours 23 minutes 12 seconds' (Depending on what exists)",
            types: ["text", "unspeficied"]
        },
        {
            id: "weeks",
            name: "Weeks",
            description: "Type: Number\n\nDescription: The number of weeks in the time.",
            types: ["number"]
        },
        {
            id: "days",
            name: "Days",
            description: "Type: Number\n\nDescription: The number of days in the time.",
            types: ["number"]
        },
        {
            id: "hours",
            name: "Hours",
            description: "Type: Number\n\nDescription: The number of hours in the time.",
            types: ["number"]
        },
        {
            id: "minutes",
            name: "Minutes",
            description: "Type: Number\n\nDescription: The number of minutes in the time.",
            types: ["number"]
        },
        {
            id: "seconds",
            name: "Seconds",
            description: "Type: Number\n\nDescription: The number of seconds in the time.",
            types: ["number"]
        }
    ],

    async code(cache) {
        const raw = this.GetInputValue("raw", cache);
        const type = this.GetOptionValue("type", cache);

        let time = 0;
        switch(type) {
            case "milliseconds":
                time = raw;
                break;
            case "seconds":
                time = raw * 1000;
                break;
            case "minutes":
                time = raw * 1000 * 60;
                break;
            case "hours":
                time = raw * 1000 * 60 * 60;
                break;
            case "days":
                time = raw * 1000 * 60 * 60 * 24;
                break;
        }

        let weeks = Math.floor(time / (1000 * 60 * 60 * 24 * 7));
        time -= weeks * (1000 * 60 * 60 * 24 * 7);
        let days = Math.floor(time / (1000 * 60 * 60 * 24));
        time -= days * (1000 * 60 * 60 * 24);
        let hours = Math.floor(time / (1000 * 60 * 60));
        time -= hours * (1000 * 60 * 60);
        let minutes = Math.floor(time / (1000 * 60));
        time -= minutes * (1000 * 60);
        let seconds = Math.floor(time / 1000);

        let formattedstring = "";
        if(weeks > 0) formattedstring += weeks + " weeks ";
        if(days > 0) formattedstring += days + " days ";
        if(hours > 0) formattedstring += hours + " hours ";
        if(minutes > 0) formattedstring += minutes + " minutes ";
        if(seconds > 0) formattedstring += seconds + " seconds ";

        this.StoreOutputValue(formattedstring, "formattedstring", cache);
        this.StoreOutputValue(weeks, "weeks", cache);
        this.StoreOutputValue(days, "days", cache);
        this.StoreOutputValue(hours, "hours", cache);
        this.StoreOutputValue(minutes, "minutes", cache);
        this.StoreOutputValue(seconds, "seconds", cache);
        this.RunNextBlock("action", cache);
    }
}