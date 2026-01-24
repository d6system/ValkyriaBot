module.exports = {
    name: "Extract Time From Argument",
    description: "Extracts time from strings or milliseconds.\nUpdates2025/08:\n- Reverse Mode\n- Format option\n- Total combined output\n- Milliseconds\n- Error output\n- Dynamic dual inputs",
    category: "Date",

    // Dynamic inputs based on Reverse Mode
    inputs(data) {
        const reverseMode = data?.options?.reverse;
        if (reverseMode) {
            return [{
                id: "rawtime_ms",
                name: "Milliseconds Input",
                description: "Enter total milliseconds (integer)",
                types: ["Text", "unspecified"],
                required: true
            }];
        } else {
            return [{
                id: "rawtime_normal",
                name: "Formatted Time Input",
                description: "Enter time like 1w2d3h4m5s250ms",
                types: ["Text", "unspecified"],
                required: true
            }];
        }
    },

    // Options for Reverse Mode and format
    options: [
        {
            id: "format",
            name: "Total Time Format",
            description: "Select the unit for total combined time output",
            type: "SELECT",
            options: {
                milliseconds: "Milliseconds",
                seconds: "Seconds",
                minutes: "Minutes",
                hours: "Hours",
                days: "Days"
            },
            defaultValue: "milliseconds"
        },
        {
            id: "reverse",
            name: "Reverse Mode",
            description: "Check to convert a total milliseconds number back into w/d/h/m/s",
            type: "CHECKBOX",
            defaultValue: false
        }
    ],

    // Outputs (static, action always included)
    outputs(data) {
        return [
            { id: "action", name: "Action", description: "Runs next action", types: ["action"] },
            { id: "extractedtime", name: "In Object Form", description: "Extracted time object {days, hours, minutes, seconds, milliseconds, totalMilliseconds}", types: ["object"] },
            { id: "days", name: "Days (+Weeks Combined)", description: "Total days including weeks", types: ["number"] },
            { id: "hours", name: "Hours", description: "Extracted hours", types: ["number"] },
            { id: "minutes", name: "Minutes", description: "Extracted minutes", types: ["number"] },
            { id: "seconds", name: "Seconds", description: "Extracted seconds", types: ["number"] },
            { id: "milliseconds", name: "Milliseconds", description: "Extracted milliseconds", types: ["number"] },
            { id: "totalcombined", name: "Total Combined", description: "The combined time in the selected format", types: ["number"] },
            { id: "error", name: "Error", description: "Returns an error message if any part of the block fails", types: ["text"] }
        ];
    },

    // Block code
    async code(cache) {

        function separateAndExtract(inputString) {
            const components = inputString.match(/[0-9]+(?:ms|[wdhms])/g);
            if (!components) return null;

            const extractedNumbers = {};
            components.forEach(component => {
                const number = parseInt(component.match(/[0-9]+/)[0]);
                const unit = component.match(/ms|[wdhms]/)[0];

                switch(unit) {
                    case "w": extractedNumbers.days = (extractedNumbers.days||0) + (number*7); break;
                    case "d": extractedNumbers.days = (extractedNumbers.days||0) + number; break;
                    case "h": extractedNumbers.hours = (extractedNumbers.hours||0) + number; break;
                    case "m": extractedNumbers.minutes = (extractedNumbers.minutes||0) + number; break;
                    case "s": extractedNumbers.seconds = (extractedNumbers.seconds||0) + number; break;
                    case "ms": extractedNumbers.milliseconds = (extractedNumbers.milliseconds||0) + number; break;
                }
            });

            extractedNumbers.totalMilliseconds =
                ((extractedNumbers.days||0)*86400000) +
                ((extractedNumbers.hours||0)*3600000) +
                ((extractedNumbers.minutes||0)*60000) +
                ((extractedNumbers.seconds||0)*1000) +
                (extractedNumbers.milliseconds||0);

            return extractedNumbers;
        }

        function reverseMilliseconds(ms) {
            const days = Math.floor(ms / 86400000); ms %= 86400000;
            const hours = Math.floor(ms / 3600000); ms %= 3600000;
            const minutes = Math.floor(ms / 60000); ms %= 60000;
            const seconds = Math.floor(ms / 1000); ms %= 1000;
            const milliseconds = ms;
            return { days, hours, minutes, seconds, milliseconds, totalMilliseconds: days*86400000 + hours*3600000 + minutes*60000 + seconds*1000 + milliseconds };
        }

        const reverseMode = this.GetOptionValue("reverse", cache);
        const format = this.GetOptionValue("format", cache);

        const rawInput = reverseMode
            ? this.GetInputValue("rawtime_ms", cache)?.trim()
            : this.GetInputValue("rawtime_normal", cache)?.trim();

        let extractedNumbers;

        if (reverseMode) {
            if (!/^\d+$/.test(rawInput)) {
                this.StoreOutputValue("Reverse mode input must be a whole number (milliseconds)!", "error", cache);
                return;
            }
            extractedNumbers = reverseMilliseconds(parseInt(rawInput, 10));
        } else {
            if (!/^(?:\d+(?:w|d|h|m|s|ms))+$/i.test(rawInput)) {
                this.StoreOutputValue("Invalid input format for normal mode! Expected format: 1w2d3h4m5s250ms", "error", cache);
                return;
            }
            extractedNumbers = separateAndExtract(rawInput);
        }

        // Calculate total combined in selected format
        let totalCombined = extractedNumbers.totalMilliseconds;
        switch(format) {
            case "seconds": totalCombined /= 1000; break;
            case "minutes": totalCombined /= 60000; break;
            case "hours": totalCombined /= 3600000; break;
            case "days": totalCombined /= 86400000; break;
        }

        // Store outputs
        this.StoreOutputValue(extractedNumbers, "extractedtime", cache);
        this.StoreOutputValue(extractedNumbers.days||0, "days", cache);
        this.StoreOutputValue(extractedNumbers.hours||0, "hours", cache);
        this.StoreOutputValue(extractedNumbers.minutes||0, "minutes", cache);
        this.StoreOutputValue(extractedNumbers.seconds||0, "seconds", cache);
        this.StoreOutputValue(extractedNumbers.milliseconds||0, "milliseconds", cache);
        this.StoreOutputValue(totalCombined, "totalcombined", cache);

        this.RunNextBlock("action", cache);
    }
};
