module.exports = {
    name: "Upload Discord Soundboard Sound",

    description: "Uploads a soundboard sound to Discord.",

    category: "Server Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"],
        },
        {
            id: "guild",
            name: "Server/ID",
            description: "Acceptable Types: Object, Text, Unspecified\n\nDescription: The Server to upload the soundboard sound to.",
            types: ["object", "text", "unspecified"],
            required: true,
        },
        {
            id: "url",
            name: "File PATH/URL",
            description: "Acceptable Types: Text, Unspecified\n\nDescription: The URL of the file to upload.",
            types: ["text", "unspecified"],
            required: true,
        },
        {
            id: "name",
            name: "Name",
            description: "Acceptable Types: Text, Unspecified\n\nDescription: The name of the soundboard sound.",
            types: ["text", "unspecified"],
            required: true,
        },
        {
            id: "emoji",
            name: "Emoji (Char/ID)",
            description: "Acceptable Types: Text, Unspecified\n\nDescription: The emoji of the soundboard sound.",
            types: ["text", "unspecified"],
        },
        {
            id: "volume",
            name: "Volume",
            description: "Acceptable Types: Number, Unspecified\n\nDescription: The volume of the soundboard sound.",
            types: ["number", "unspecified"],
        },
    ],

    options: [
        {
            id: "input_type",
            name: "Input Type",
            description: "Description: The type of input for the file.",
            type: "SELECT",
            options: {
                url: "URL",
                path: "File Path",
            },
        },
        {
            id: "file_type",
            name: "File Type",
            description: "Description: The type of file to upload.",
            type: "SELECT",
            options: {
                "audio/mp3": "MP3",
                "audio/ogg": "OGG",
            },
        },
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"],
        },
        {
            id: "sound",
            name: "Sound",
            description: "Type: Object, Text\n\nDescription: The soundboard sound object. This may be Text if an error occurred.",
            types: ["object", "text", "unspecified"],
        }
    ],

    async code(cache) {
        try {
            /**
             * @type {import('discord.js').Guild}
             */
            let guild = this.GetInputValue("guild", cache);
            if (!guild?.id) guild = await this.client.guilds.fetch(guild).catch(() => null);
            if (!guild) return console.trace("Invalid Server/ID provided. Create soundboard sound failed.");
            const url = this.GetInputValue("url", cache);
            const name = this.GetInputValue("name", cache);
            const emoji = this.GetInputValue("emoji", cache);
            const volume = this.GetInputValue("volume", cache);
            const input_type = this.GetOptionValue("input_type", cache);
            const file_type = this.GetOptionValue("file_type", cache);

            const axios = require("axios");
            const fs = require("fs");

            let file;
            if (input_type === "url") {
                const t = await axios(url, { responseType: "arraybuffer", validateStatus: () => true, method: "GET" });
                if(t.status !== 200) return console.trace(`Invalid URL provided. Create soundboard sound failed. ${t.status} ${t.statusText}`);
                file = t.data;
            } else {
                file = fs.readFileSync(url, {
                    encoding: "binary",
                });
            }

            /**
             * @type {import('discord.js').GuildSoundboardSoundCreateOptions}
             */
            let form = {
                name: name,
                file: file,
                contentType: file_type,
            };

            if (emoji && emoji.length >= 5) form.emojiId = emoji;
            if (emoji && emoji.length < 5 && emoji.length >= 1) form.emojiName = emoji;
            if (volume) form.volume = volume/100;

            const response = await guild.soundboardSounds.create(form)

            this.StoreOutputValue(response, "sound", cache);
            this.RunNextBlock("action", cache);
        } catch (e) {
            this.StoreOutputValue(e.message, "sound", cache);
            this.RunNextBlock("action", cache);
        }
    },
};
