module.exports = {
    name: "Format Moment",

    description: "Formats the date to any avaiable templates, for better readability.",

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
        }
    ],

    options: [
        {
            "id": "templates",
            "name": "Format Templates",
            "description": "Description: Some Format Templates to format the Moment to.",
            "type": "SELECT",
            "options": {
                "custom": "Custom Format",
                "LT": "LT - 09:35 AM",
                "LTS": "LTS - 09:35:17 AM",
                "L": "L - 06/30/2024",
                "l": "l - 6/30/2024",
                "LL": "LL - June 30, 2024",
                "ll": "ll - Jun 30, 2024",
                "LLL": "LLL - June 30, 2024 09:35 AM",
                "lll": "lll - Jun 30, 2024 09:35 AM",
                "LLLL": "LLLL - Sunday, June 30, 2024 09:35 AM",
                "llll": "llll - Sun, Jun 30, 2024 09:35 AM",
            }
        },
        {
            "id": "custom",
            "name": "Custom Format",
            "description": "Description: Your custom format template.\n\nUse the following tokens to format the date:\n\n- `YYYY` - Year\n- `YY` - Year (2 digits)\n- `Q` - Quarter\n- `M` - Month\n- `MM` - Month (2 digits)\n- `MMM` - Month (short)\n- `MMMM` - Month (long)\n- `D` - Day\n- `DD` - Day (2 digits)\n- `DDD` - Day of the year\n- `DDDD` - Day of the year (3 digits)\n- `d` - Day of the week\n- `dd` - Day of the week (short)\n- `ddd` - Day of the week (medium)\n- `dddd` - Day of the week (long)\n- `H` - Hour\n- `HH` - Hour (2 digits)\n- `h` - Hour (12-hour)\n- `hh` - Hour (12-hour, 2 digits)\n- `m` - Minute\n- `mm` - Minute (2 digits)\n- `s` - Second\n- `ss` - Second (2 digits)\n- `S` - Millisecond\n- `SS` - Millisecond (2 digits)\n- `SSS` - Millisecond (3 digits)\n- `Z` - Timezone offset\n- `ZZ` - Timezone offset (2 digits)",
            "type": "TEXT"
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
            "id": "formatted_date",
            "name": "Formatted Moment/Date",
            "description": "Type: Text\n\nDescription: The formatted date.",
            "types": ["text"]
        }
    ],

    code(cache) {
        const moment = require("moment");
        const date = this.GetInputValue("moment", cache);
        const template = this.GetOptionValue("templates", cache);
        const custom = this.GetOptionValue("custom", cache);

        let formatted_date;
        if (template === "custom") formatted_date = date.format(custom);
        else formatted_date = date.format(template);

        this.StoreOutputValue(formatted_date, "formatted_date", cache);
        this.RunNextBlock("action", cache);
    }
}