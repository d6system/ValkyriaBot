module.exports = {
    name: "Leave Voice Channel",

    description: "Leaves the voice channel.",

    category: "Music V2",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "guild",
            "name": "Server",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The Guild to get the Voice Connection from!",
            "types": ["object", "unspecified"],
            "required": true
        }
    ],

    options: [],

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
            if(!success) console.log("Failed to install dependencies! (Leave Voice Channel)")
        } catch (e) {
            console.log(e)
        }
        const { useQueue } = require('discord-player');
        const guild = this.GetInputValue("guild", cache);

        useQueue(guild.id)?.delete();

        this.RunNextBlock("action", cache);
    }
}