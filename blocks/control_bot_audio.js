module.exports = {
    name: "Control Bot Audio",

    description: "Controls the current bot audio (i.e. Un/Mute, Un/Deaf, Speaking, Suppress etc.)",

    category: "Music V2",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "server",
            "name": "Server",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The server to control the bot audio.",
            "types": ["object", "unspecified"],
            "required": true
        },
        // Voice Channel
        {
            "id": "voice_channel",
            "name": "Voice Channel",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The voice channel to join. \nIf Action Type is \"Join Voice Channel\", this input is required.",
            "types": ["object", "text", "number", "unspecified"]
        }
    ],

    options: [
        {
            "id": "audio_action_type",
            "name": "Audio Action Type",
            "description": "Description: The type of action to be performed on the current audio.",
            "type": "SELECT",
            "options": {
                "mute": "Un/Mute Microphone",
                "deaf": "Un/Deafen Bot",
                "request_to_speak": "Request to Speak (In Stage)",
                "suppress": "Suppress (In Stage)",
                "speaking": "Set Speaking",
                "join": "Join Voice Channel"
            }
        },
        {
            "id": "action_true_false",
            "name": "Action True/False",
            "description": "Description: Set the action to true or false.\n\nOn \"Request to Speak\" -> True = Request to Speak, False = Stop Requesting to Speak\nOn \"Suppress\" -> True = Speaker, False = Stop Speaker\nOn \"Set Speaking\" -> True = Start Speaking, False = Stop Speaking",
            "type": "CHECKBOX"
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        }
    ],

    async code(cache) {
        const { getVoiceConnection } = await this.require('@discordjs/voice');
        const server = this.GetInputValue("server", cache);
        const audio_action_type = this.GetOptionValue("audio_action_type", cache) + "";
        const action_true_false = Boolean(this.GetOptionValue("action_true_false", cache));

        const connection = getVoiceConnection(server.id);

        if(connection)
            switch (audio_action_type) {
                case "mute":
                    await connection.rejoin({ selfMute: action_true_false })
                    break;
                case "deaf":
                    await connection.rejoin({ selfDeaf: action_true_false })
                    break;
                case "speaking":
                    connection.setSpeaking(action_true_false);
                    break;
                case "request_to_speak":
                    await server.members.fetch(this.client.user.id).then(async (bot) => await bot.voice.setRequestToSpeak(action_true_false))
                    break;
                case "suppress":
                    await server.members.fetch(this.client.user.id).then(async (bot) => await bot.voice.setSuppressed(action_true_false))
                    break;
                case "join":
                    const channel = this.GetInputValue("voice_channel", cache);
                    await connection.rejoin({ channelId: channel, guildId: server.id });
                    break;
            }

        this.RunNextBlock("action", cache);
    }
}