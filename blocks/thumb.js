module.exports = {
    name: "T.H.U.M.B.",

    description: "~~~ THE HOLY ULTIMATE MODERATION BLOCK ~~~\n\nA complete moderation block supporting kick, ban, timeout, and mute actions with optional reasons and time length. Brought to you by yours truly, sam51211.",

    category: "Server Stuff",

    inputs(data) {
        const action = data?.options?.moderation_action;
        const inputs = [
            {
                id: "action",
                name: "Action",
                description: "Executes this block.",
                types: ["action"]
            },
            {
                id: "member",
                name: "Member",
                description: "The member to moderate.",
                types: ["object"],
                required: true
            }
        ];

        if (["ban", "timeout", "mute"].includes(action)) {
            inputs.push({
                id: "length",
                name: "Length",
                description: "Duration of ban/timeout/mute (e.g., 10m, 1h, 7d). Leave blank to make it permanent.",
                types: ["text", "unspecified"]
            });
        }

        if (action) {
            inputs.push({
                id: "reason",
                name: "Reason",
                description: "Optional reason for the action.",
                types: ["text", "unspecified"]
            });
        }

        return inputs;
    },

    options(data) {
        const options = [
            {
                id: "moderation_action",
                name: "Moderation Action",
                description: "Choose what action to perform.",
                type: "SELECT",
                options: {
                    kick: "Kick",
                    ban: "Ban",
                    timeout: "Timeout",
                    mute: "Mute"
                }
            }
        ];

        const action = data?.options?.moderation_action;
        if (["ban", "timeout", "mute"].includes(action)) {
            options.push({
                id: "length",
                name: "Length",
                description: "Duration of ban/timeout/mute (e.g., 10m, 1h, 7d). Leave blank to make it permanent.",
                type: "TEXT"
            });
        }

        if (action) {
            options.push({
                id: "reason",
                name: "Reason",
                description: "Optional reason for the action.",
                type: "TEXT"
            });
        }

        return options;
    },

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Runs after the moderation is applied.",
            types: ["action"]
        },
        {
            id: "action_error",
            name: "Action (Error)",
            description: "Runs if an error occurred.",
            types: ["action"]
        },
        {
            id: "error",
            name: "Error Message",
            description: "The error message if something went wrong.",
            types: ["text"]
        }
    ],

    async code(cache) {
        const member = this.GetInputValue("member", cache);
        const reason = this.GetInputValue("reason", cache) || this.GetOptionValue("reason", cache) || "No reason provided.";
        const length = this.GetInputValue("length", cache) || this.GetOptionValue("length", cache);
        const action = this.GetOptionValue("moderation_action", cache);

        try {
            if (!member) throw new Error("Invalid member object.");

            if (action === "kick") {
                await member.kick(reason);
            } else if (action === "ban") {
                const durationMs = length ? parseDuration(length) : undefined;
                await member.ban({ reason, deleteMessageSeconds: 0 });
                if (durationMs) setTimeout(() => member.guild.members.unban(member.id, "Temporary ban expired."), durationMs);
            } else if (action === "timeout") {
                const durationMs = parseDuration(length);
                if (!durationMs) throw new Error("Timeout requires a valid length.");
                await member.timeout(durationMs, reason);
            } else if (action === "mute") {
                const durationMs = parseDuration(length);
                if (!durationMs) throw new Error("Mute requires a valid length.");
                await member.disableCommunicationUntil(Date.now() + durationMs, reason);
            }

            this.RunNextBlock("action", cache);
        } catch (err) {
            this.StoreOutputValue(err.message, "error", cache);
            this.RunNextBlock("action_error", cache);
        }

        function parseDuration(str) {
            const match = /^([0-9]+)(s|m|h|d)$/i.exec(str);
            if (!match) return null;
            const num = parseInt(match[1]);
            const unit = match[2].toLowerCase();
            return unit === 's' ? num * 1000 :
                   unit === 'm' ? num * 60 * 1000 :
                   unit === 'h' ? num * 60 * 60 * 1000 :
                   unit === 'd' ? num * 24 * 60 * 60 * 1000 :
                   null;
        }
    }
};