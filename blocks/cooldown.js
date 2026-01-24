module.exports = {
    name: "Cooldown",
    description: "Handles the cooldown for a command.",
    category: "Extras",
    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "message_interaction",
            name: "Message/Interaction",
            description: "Acceptable Types: Object, Unspecified\n\nDescription: The message or interaction to check the cooldown for.",
            types: ["object", "unspecified"],
            required: true
        },
        {
            id: "command_id",
            name: "Command ID",
            description: "Acceptable Types: Text, Unspecified\n\nDescription: The unique ID for this command.",
            types: ["text", "unspecified"],
            required: true
        },
        {
            id: "command_slowmode",
            name: "Command Slowmode",
            description: "Acceptable Types: Number, Date, Unspecified\n\nDescription: The interval in milliseconds to block the user from using this command again. Supports Date.",
            types: ["number", "date", "unspecified"]
        }
    ],
    options: [
        {
            id: "command_slowmode_restriction",
            name: "Command Slowmode Restriction",
            description: "Description: The restriction that will affect the user slowmode at each location. Only use this option if you put a value in the \"Command Slowmode\" input.",
            type: "SELECT",
            options: {
                none: "None",
                channel: "Per Channel",
                "server/dm": "Per Server/DM",
                everywhere: "Everywhere"
            }
        },
        {
            id: "command_slowmode_option",
            name: "Command Slowmode",
            description: "Acceptable Type: Number\n\nDescription: The interval of milliseconds to block the user for using this command again.",
            type: "NUMBER"
        }
    ],
    outputs: [
        {
            id: "action_slowmode_active",
            name: "Action Too Fast",
            description: "Type: Action\n\nDescription: Executes the following blocks if the user is in slowmode.",
            types: ["action"]
        },
        {
            id: "action_no_slowmode",
            name: "Action Out of Slowmode",
            description: "Type: Action\n\nDescription: Executes the following blocks if the user is not in slowmode.",
            types: ["action"]
        },
        {
            id: "cooldown_end_date",
            name: "Cooldown End Date",
            description: "Type: Date\n\nDescription: The date when the cooldown will end.",
            types: ["date", "unspecified"]
        },
        {
            id: "cooldown_left_seconds",
            name: "Cooldown Left Seconds",
            description: "Type: Number\n\nDescription: The amount of seconds left for the cooldown to end.",
            types: ["number", "unspecified"]
        }
    ],
    init(DBB, fileName) {
        const Data = DBB.Blocks.Data;
        const slowmodeData = Data.getData("slowmode", fileName, "block");

        if (slowmodeData && typeof slowmodeData === "object") {
            for (const commandName in slowmodeData) {
                const userIDs = slowmodeData[commandName];

                for (const userID in userIDs) {
                    const discordIDs = userIDs[userID];

                    for (const discordID in discordIDs) {
                        const time = discordIDs[discordID];

                        if (Date.now() >= (parseInt(time) || 0)) delete discordIDs[discordID];
                    }

                    if (!Object.values(discordIDs).length) delete userIDs[userID];
                }

                if (!Object.values(userIDs).length) delete slowmodeData[commandName];
            }

            if (Object.values(slowmodeData).length) Data.setData("slowmode", slowmodeData, fileName, "block");
            else Data.deleteData("slowmode", fileName, "block");
        } else Data.deleteData("slowmode", fileName, "block");
    },
    code(cache, DBB) {
        const commandSlowmodeInput = this.GetInputValue("command_slowmode", cache);
        const commandSlowmodeOption = parseInt(this.GetOptionValue("command_slowmode_option", cache)) || 30000; // 30 seconds cooldown
        const command_slowmode = commandSlowmodeInput ? parseInt(commandSlowmodeInput) : commandSlowmodeOption;
        const command_slowmode_restriction = this.GetOptionValue("command_slowmode_restriction", cache) || "none";
        const command_id = this.GetInputValue("command_id", cache);

        function ExtraCheckSlowmode(userData, targetID, slowmodeData) {
            const currentTime = Date.now();
            const endTime = userData[targetID];
            const remainingTime = Math.ceil((endTime - currentTime) / 1000);

            DBB.Blocks.Core.StoreOutputValue(new Date(endTime), "cooldown_end_date", cache);
            DBB.Blocks.Core.StoreOutputValue(remainingTime <= 0 ? 0 : remainingTime, "cooldown_left_seconds", cache);

            if (endTime && endTime >= currentTime) {
                return false;
            }

            return true;
        }

        function SetSlowmode(userData, targetID, slowmodeData) {
            const currentTime = Date.now();
            userData[targetID] = currentTime + command_slowmode;
            DBB.Blocks.Data.setData("slowmode", slowmodeData, command_id, "block");
        }

        function CheckSlowmode(msg) {
            let slowmodeData = DBB.Blocks.Data.getData("slowmode", command_id, "block");

            if (!(slowmodeData && typeof slowmodeData === "object")) {
                slowmodeData = {};
            }

            if (!(slowmodeData[command_id] && typeof slowmodeData[command_id] === "object")) {
                slowmodeData[command_id] = {};
            }

            const userIDs = slowmodeData[command_id];
            const authorId = msg.user ? msg.user.id : msg.author.id;

            if (!(userIDs[authorId] && typeof userIDs[authorId] === "object")) {
                userIDs[authorId] = {};
            }

            const userData = userIDs[authorId];

            switch (command_slowmode_restriction) {
                case "channel":
                    return ExtraCheckSlowmode(userData, msg.channel.id, slowmodeData);
                case "server/dm":
                    return ExtraCheckSlowmode(userData, msg.guild ? msg.guild.id : msg.channel.id, slowmodeData);
                case "everywhere":
                    return ExtraCheckSlowmode(userData, "global", slowmodeData);
                default:
                    return ExtraCheckSlowmode(userData, "default", slowmodeData);
            }
        }

        const i = this.GetInputValue("message_interaction", cache);

        if (CheckSlowmode(i)) {
            // Execute action_no_slowmode first
            this.RunNextBlock("action_no_slowmode", cache);

            // Set slowmode after the action is executed
            let slowmodeData = DBB.Blocks.Data.getData("slowmode", command_id, "block");

            if (!(slowmodeData && typeof slowmodeData === "object")) {
                slowmodeData = {};
            }

            if (!(slowmodeData[command_id] && typeof slowmodeData[command_id] === "object")) {
                slowmodeData[command_id] = {};
            }

            const userIDs = slowmodeData[command_id];
            const authorId = i.user ? i.user.id : i.author.id;

            if (!(userIDs[authorId] && typeof userIDs[authorId] === "object")) {
                userIDs[authorId] = {};
            }

            const userData = userIDs[authorId];

            switch (command_slowmode_restriction) {
                case "channel":
                    SetSlowmode(userData, i.channel.id, slowmodeData);
                    break;
                case "server/dm":
                    SetSlowmode(userData, i.guild ? i.guild.id : i.channel.id, slowmodeData);
                    break;
                case "everywhere":
                    SetSlowmode(userData, "global", slowmodeData);
                    break;
                default:
                    SetSlowmode(userData, "default", slowmodeData);
                    break;
            }
        } else {
            // Execute action_slowmode_active if user is in slowmode
            this.RunNextBlock("action_slowmode_active", cache);
        }
    }
};
