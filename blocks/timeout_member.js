module.exports = {
    name: "Timeout Member",

    description: "Timeouts a member for a certain amount of time with a reason for the Audit Log.",

    category: "Server Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"],
        },
        {
            id: "member",
            name: "Member",
            description: "Member to timeout",
            types: ["object", "unspecified"],
            required: true,
        },
        {
            id: "time",
            name: "Time",
            description: "The duration of the timeout (e.g., '10s' for 10 seconds, '5m' for 5 minutes, '2h' for 2 hours, '1d' for 1 day).",
            types: ["text", "unspecified"],
            required: true,
        },
        {
            id: "reason",
            name: "Reason",
            description: "The reason for the timeout (leave blank for nothing!)",
            types: ["text", "unspecified"],
            required: false,
        },
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes the following blocks when this block finishes its task.",
            types: ["action"],
        },
        {
            id: "member",
            name: "Member",
            description: "The Member which was timeouted!",
            types: ["object", "unspecified"],
        },
        {
            id: "actionerror",
            name: "Action Error",
            description: "Executes the following blocks when this block fails.",
            types: ["action"],
        },
        {
            id: "error",
            name: "Error",
            description: "The error message if an error occurs.",
            types: ["text", "unspecified"],
        },
    ],

    async code(cache) {
        function parseDuration(str) {
            const regex = /([0-9]+)(ms|s|m|h|d)/gi;
            const matches = str.matchAll(regex);

            let totalMs = 0;
            let hasMatch = false;

            for (const match of matches) {
                hasMatch = true;
                const num = parseInt(match[1]);
                const unit = match[2].toLowerCase();

                const ms =
                    unit === "ms"
                        ? num
                        : unit === "s"
                        ? num * 1000
                        : unit === "m"
                        ? num * 60 * 1000
                        : unit === "h"
                        ? num * 60 * 60 * 1000
                        : unit === "d"
                        ? num * 24 * 60 * 60 * 1000
                        : 0;

                totalMs += ms;
            }

            return hasMatch ? totalMs : null;
        }
        const member = this.GetInputValue("member", cache);
        const time = this.GetInputValue("time", cache);
        const reason = this.GetInputValue("reason", cache);

        const timeOut = parseDuration(time);
        if (timeOut === null) {
            this.RunNextBlock("actionerror", cache);
            this.StoreOutputValue("Invalid time format. Use formats like '10s', '5m', '2h', or '1d'.", "error", cache);
            return;
        }

        try {
            member
                .timeout(timeOut, reason)
                .then((nmember) => {
                    this.StoreOutputValue(nmember, "member", cache);
                    this.RunNextBlock("action", cache);
                })
                .catch((err) => {
                    this.RunNextBlock("actionerror", cache);
                    this.StoreOutputValue(err.message, "error", cache);
                });
        } catch (err) {
            this.RunNextBlock("actionerror", cache);
            this.StoreOutputValue(err.message, "error", cache);
        }
    },
};
