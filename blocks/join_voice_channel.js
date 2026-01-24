module.exports = {
    name: "Join Voice Channel",

    description: "Joins the voice channel and creates a new Player Queue that is empty.",

    category: "Music V2",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "voice_channel",
            "name": "Voice Channel",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The voice channel to join.",
            "types": ["object", "unspecified"],
            "required": true
        }
    ],

    options: [
        {
            "id": "deaf",
            "name": "Deaf Bot?",
            "description": "Description: Deaf Bot? (More Privacy)",
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

    async code(cache, DBB) {
        try {
            const success = await require('./!auto_package_manager').getPackageManager().requires({ name: "discord-player", version: "latest" })
            if(!success) console.log("Failed to install dependencies! (Join Voice Channel)")
        } catch (e) {
            console.log(e)
        }
        const { useMainPlayer } = require('discord-player');
        const channel = this.GetInputValue("voice_channel", cache);
        const deaf = this.GetOptionValue("deaf", cache);

        useMainPlayer().nodes.create(channel.guild.id, {
            leaveOnEmpty: false,
            leaveOnEnd: false,
            leaveOnStop: false,
            selfDeaf: deaf,
            connectionTimeout: 999999999,
            volume: 10
        }).connect(channel.id);

        this.RunNextBlock("action", cache);
    }
}