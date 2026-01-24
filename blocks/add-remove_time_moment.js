module.exports = {
    name: "Add/Remove Time [Moment.JS]",

    description: "Modifies the Moment.JS Timestamp.",

    category: "Moment Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "moment",
            "name": "Moment",
            "description": "Type: Date<Moment>\n\nDescription: The Moment Date created!",
            "types": ["date"],
            "required": true
        },
        {
            "id": "time",
            "name": "Time",
            "description": "Type: Select\n\nDescription: The time to add or remove.\n\nOptions: years, months, weeks, days, hours, minutes, seconds, milliseconds",
            "types": ["text", "unspecified"],
            "required": true
        },
        {
            "id": "amount",
            "name": "Amount",
            "description": "Type: Number\n\nDescription: The amount to add or remove.",
            "types": ["number", "unspecified"],
            "required": true
        }
    ],

    options: [
        // Action (Add/Remove)
        {
            "id": "action",
            "name": "Action",
            "description": "Description: The action to perform.",
            "type": "SELECT",
            "options": {
                "add": "Add Time",
                "remove": "Remove Time"
            }
        },
        // What to remove (Day, Month, Year, etc.)
        {
            "id": "time",
            "name": "Time",
            "description": "Description: The time to add or remove.",
            "type": "SELECT",
            "options": {
                "years": "Years",
                "months": "Months",
                "weeks": "Weeks",
                "days": "Days",
                "hours": "Hours",
                "minutes": "Minutes",
                "seconds": "Seconds",
                "milliseconds": "Milliseconds"
            }
        },
        {
            "id": "amount",
            "name": "Amount",
            "description": "Description: The amount to add or remove.",
            "type": "NUMBER",
            "defaultValue": 0
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "moment",
            "name": "Moment",
            "description": "Type: Date<Moment>\n\nDescription: The Moment Date created!",
            "types": ["date"]
        }
    ],

    async code(cache) {
        const action = this.GetOptionValue("action", cache);
        const time = this.GetInputValue("time", cache) ?? this.GetOptionValue("time", cache);
        const amount = parseInt(this.GetInputValue("amount", cache)) ?? parseInt(this.GetOptionValue("amount", cache));

        const moment_date = this.GetInputValue("moment", cache);

        if(action === "add") {
            moment_date.add(amount, time);
        } else if(action === "remove") {
            moment_date.subtract(amount, time);
        }

        this.StoreOutputValue(moment_date, "moment", cache);
        this.RunNextBlock("action", cache);
    }
}