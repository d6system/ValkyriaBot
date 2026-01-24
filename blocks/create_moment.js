module.exports = {
    name: "Create Moment [Moment.JS]",

    description: "Creates a date to use it in your blocks. This block uses Moment.JS to create the date. You can add or remove time from the date selected in \"Start Date\".",

    category: "Moment Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "custom_date",
            "name": "Custom Date",
            "description": "Acceptable Types: Date, Unspecified\n\nDescription: The custom date if you selected the option \"Custom Date\" in \"Start Date\".\nSupports Date Object, Timestamp, and Date String.",
            "types": ["date", "unspecified"]
        }
    ],

    options: [
        {
            "id": "start_time",
            "name": "Moment State",
            "description": "Description: The start date. If you want, you can use the inputs above (Year, Month, Day, Minutes, Seconds, Milliseconds) to add or remove time.",
            "type": "SELECT",
            "options": {
                "current": "Current",
                "custom": "Custom Date"
            }
        },
        {
            "id": "time",
            "name": "Start/End of...",
            "description": "Description: The time to get the start or end of.\n\nIf \"Week\" is selected it will return the first day of the week at 00:00:00 with Timezone",
            "type": "SELECT",
            "options": {
                "none": "None",
                "year": "Year",
                "month": "Month",
                "week": "Week",
                "day": "Day",
                "hour": "Hour",
                "minute": "Minute",
                "second": "Second",
                "millisecond": "Millisecond"
            }
        },
        {
            "id": "locale",
            "name": "Locale",
            "description": "Description: The locale to use. Default is English. You may use the ISO 639-1 language code (e.g. en, fr, de, es, en-gb).\nThis will adjust the timezone and format of the timestamp.",
            "type": "TEXT",
            "defaultValue": "en"
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
        const moment = await this.require("moment");
        const start_time = this.GetOptionValue("start_time", cache);
        const time = this.GetOptionValue("time", cache);
        const locale = this.GetOptionValue("locale", cache);
        const custom_date = this.GetInputValue("custom_date", cache);

        let date;
        if (start_time === "current") date = moment().locale(locale);
        else if (start_time === "custom") date = moment(custom_date);

        if (time !== "null") date.startOf(time);

        this.StoreOutputValue(date, "moment", cache);
        this.RunNextBlock("action", cache);
    }
}