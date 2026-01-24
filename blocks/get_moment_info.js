module.exports = {
    name: "Get Moment Info",

    description: "Gets the Moment information.",

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
            "id": "moment_info",
            "name": "Moment Info",
            "description": "Description: The Moment information to get.",
            "type": "SELECT",
            "options": {
                "milliseconds": "Milliseconds",
                "seconds": "Seconds",
                "minutes": "Minutes",
                "hours": "Hours",
                "day": "Day of Week [1-7]",
                "date": "Date of Month [1-31]",
                "month": "Month",
                "week": "Week of Year [1-53]",
                "year": "Year",
                "days_in_month": "Days in Month",
                "unix": "Unix Timestamp",
                "toDate": "Date Object",
                "iso": "ISO String",
                "toObject": "Object with Properties",
                "toString": "Date Text",
            }
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
            "id": "result",
            "name": "Result",
            "description": "Type: Unspecified\n\nDescription: The information obtained from the date.",
            "types": ["unspecified"]
        }
    ],

    code(cache) {
        const moment = this.GetInputValue("moment", cache);
        const moment_info = parseInt(this.GetOptionValue("moment_info", cache));

        let result; 
        switch(moment_info) {
            case "milliseconds":
                result = moment.milliseconds();
                break;
            case "seconds":
                result = moment.seconds();
                break;
            case "minutes":
                result = moment.minutes();
                break;
            case "hours":
                result = moment.hours();
                break;
            case "day":
                result = moment.day()+1;
                break;
            case "date":
                result = moment.date();
                break;
            case "month":
                result = moment.month()+1;
                break;
            case "week":
                result = moment.week();
                break;
            case "year":
                result = moment.year();
                break;
            case "days_in_month":
                result = moment.daysInMonth();
                break;
            case "unix":
                result = moment.unix();
                break;
            case "toDate":
                result = moment.toDate();
                break;
            case "iso":
                result = moment.toISOString();
                break;
            case "toObject":
                result = moment.toObject();
                break;
            case "toString":
                result = moment.toString();
                break;
        }

        this.StoreOutputValue(result, "result", cache);
        this.RunNextBlock("action", cache);
    }
}