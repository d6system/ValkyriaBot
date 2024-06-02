module.exports = {
    name: "Cooldown",

    description: "Handels the cooldown for a command.",

    category: "Extras",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        // Message
        {
            "id": "message_interaction",
            "name": "Message/Interaction",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The message to check the cooldown for.",
            "types": ["object", "unspecified"],
            "required": true
        },
        {
            "id": "command_slowmode",
            "name": "Command Slowmode",
            "description": "Acceptable Types: Number, Date, Unspecified\n\nDescription: The interval of milliseconds to block the user for using this command again. Supports Date.",
            "types": ["number", "date", "unspecified"]
        }
    ],

    options: [
        {
            "id": "command_slowmode_restriction",
            "name": "Command Slowmode Restriction",
            "description": "Description: The restriction that will affect the user slowmode at each location. Only use this option if you put a value in the \"Command Slowmode\" input.",
            "type": "SELECT",
            "options": {
                "none": "None",
                "channel": "Per Channel",
                "server/dm": "Per Server/DM",
                "everywhere": "Everywhere",
            }
        },
        {
            "id": "command_slowmode",
            "name": "Command Slowmode",
            "description": "Acceptable Type: Number\n\nDescription: The interval of milliseconds to block the user for using this command again.",
            "type": "NUMBER"
        }
    ],

    outputs: [
        {
            "id": "action_slowmode_active",
            "name": "Action Too Fast",
            "description": "Type: Action\n\nDescription: Executes the following blocks if the user is in slowmode.",
            "types": ["action"]
        },
        {
            "id": "action_no_slowmode",
            "name": "Action Out of Slowmode",
            "description": "Type: Action\n\nDescription: Executes the following blocks if the user is not in slowmode.",
            "types": ["action"]
        },
        {
            "id": "cooldown_end_date",
            "name": "Cooldown End Date",
            "description": "Type: Date\n\nDescription: The date when the cooldown will end.",
            "types": ["date", "unspecified"]
        },
        {
            "id": "cooldown_left_seconds",
            "name": "Cooldown Left Seconds",
            "description": "Type: Number\n\nDescription: The amount of seconds left for the cooldown to end.",
            "types": ["number", "unspecified"]
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
        let command_slowmode = this.GetInputValue("command_slowmode", cache) || parseInt(this.GetOptionValue("command_slowmode", cache)) !== 0 ? this.GetOptionValue("command_slowmode", cache) : 1000;
        const command_slowmode_restriction = this.GetOptionValue("command_slowmode_restriction", cache) + "";
        command_slowmode = Math.max(0, command_slowmode instanceof Date ? command_slowmode.getTime() : Date.now() + parseInt(command_slowmode));
        const command_name = "cooldown_block";

        function ExtraCheckSlowmode(userData, targetID, slowmodeData) {
            DBB.Blocks.Core.StoreOutputValue(new Date(userData[targetID]), "cooldown_end_date", cache);
            DBB.Blocks.Core.StoreOutputValue(Math.ceil((userData[targetID] - Date.now()) / 1000) <= -0 ? 0 : Math.ceil((userData[targetID] - Date.now()) / 1000), "cooldown_left_seconds", cache);

            if (userData[targetID] >= Date.now())
                return false;

            userData[targetID] = command_slowmode;

            DBB.Blocks.Data.setData("slowmode", slowmodeData, command_name, "block");

            return true;
        }

        function CheckSlowmode(msg) {
            let slowmodeData = DBB.Blocks.Data.getData("slowmode", command_name, "block");

            if (!(slowmodeData && typeof slowmodeData === "object")) {
                slowmodeData = {}
            }

            if (!(slowmodeData[command_name] && typeof slowmodeData[command_name] === "object")) {
                slowmodeData[command_name] = {}
            }

            const userIDs = slowmodeData[command_name];

            const authorId = msg.author.id

            if (!(userIDs[authorId] && typeof userIDs[authorId] == "object")) {
                userIDs[authorId] = {}
            }

            const userData = userIDs[authorId];

            switch (command_slowmode_restriction) {
                case "channel":
                    return ExtraCheckSlowmode(userData, msg.channel.id, slowmodeData);
                case "server/dm":
                    return ExtraCheckSlowmode(userData, msg.guild ? msg.guild.id : msg.channel.id, slowmodeData);
                case "everywhere":
                    return ExtraCheckSlowmode(userData, "global");
                default:
                    return true;
            }
        }

        const i = this.GetInputValue("message_interaction", cache);
        if(CheckSlowmode(i)) {
            this.RunNextBlock("action_no_slowmode", cache);
        } else {
            this.RunNextBlock("action_slowmode_active", cache);
        }
    }
}