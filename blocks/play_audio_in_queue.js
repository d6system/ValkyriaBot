module.exports = {
    name: "Play Music",

    description: "Plays Music of Any Type (e.g. YouTube, Spotify, SoundCloud, Files, Radio Stations, ...)",

    category: "Music V2",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"],
        },
        {
            id: "voicechannel",
            name: "Voice Channel",
            description: "Acceptable Types: Object, Unspecified\n\nDescription: The Voice Channel to join...",
            types: ["object", "unspecified"],
            required: true,
        },
        {
            id: "song",
            name: "Song Name/URL",
            description: "Acceptable Types: Text, Unspecified\n\nDescription: The Song URL/Name you want to Play.",
            types: ["text", "unspecified"],
            required: true,
        },
    ],

    options(data) {
        /* --- Leave On Empty Cooldown Handler --- */
        let leaveonempty = [
            {
                id: "leaveonempty",
                name: "Leave on Empty VC?",
                description: "Leave on Empty Queue?",
                type: "CHECKBOX",
                defaultValue: false,
            },
        ];

        if (data?.options?.leaveonempty) {
            leaveonempty.push({
                id: "emptycooldown",
                name: "Empty VC Cooldown",
                description: "If you set the bot to leave on Empty VC, then you can set a cooldown when he should leave",
                type: "NUMBER",
                defaultValue: 0,
            });
        }

        /* --- Leave On End Cooldown Handler --- */

        let leaveonend = [
            {
                id: "leaveonened",
                name: "Leave on End?",
                description: "Leave on End?",
                type: "CHECKBOX",
                defaultValue: false,
            },
        ];

        if (data?.options?.leaveonened) {
            leaveonend.push({
                id: "endcooldown",
                name: "Queue End Cooldown",
                description: "If you set the bot to leave on End, then you can set a cooldown when he should leave.",
                type: "NUMBER",
                defaultValue: 0,
            });
        }

        let autoselfdeaf = [
            {
                id: "autoselfdeaf",
                name: "Deaf Bot?",
                description: "Deaf Bot? (More Privacy)",
                type: "CHECKBOX",
                defaultValue: true,
            },
        ];

        let initialvolume = [
            {
                id: "initialvolume",
                name: "Initial Volume",
                description: "The Volume the bot should have! Default: 10",
                type: "NUMBER",
                defaultValue: 10,
            },
        ];

        let source = [
            {
                id: "source",
                name: "Audio Source",
                description: "The Songs Origin (Global / Radio Station / File).",
                type: "SELECT",
                options: {
                    global: "Global",
                    radio: "Radio",
                    file: "File",
                },
            },
        ];

        let action = [
            {
                id: "action",
                name: "Play (Now / Queue)",
                description: "If the Song should play instantly or be added to the queue!",
                type: "CHECKBOX",
                defaultValue: false,
            },
        ];

        return [...leaveonempty, ...leaveonend, ...autoselfdeaf, ...initialvolume, ...source, ...action];
    },

    outputs(data) {
        const source = data?.options?.source || "global";

        let start = [
            {
                id: "action",
                name: "Action",
                description: "Executes the following blocks when this block finishes its task.",
                types: ["action"],
            },
        ];

        if (source == "global") {
            start.push(
                {
                    id: "title",
                    name: "Title",
                    description: "The Title of the Song.",
                    types: ["text", "unspecified"],
                },
                {
                    id: "author",
                    name: "Author",
                    description: "The Author of the Song.",
                    types: ["text", "unspecified"],
                },
                {
                    id: "url",
                    name: "URL",
                    description: "The URL of the Song.",
                    types: ["text", "unspecified"],
                },
                {
                    id: "duration",
                    name: "Duration",
                    description: "The Duration of the Song.",
                    types: ["text", "unspecified"],
                },
                {
                    id: "thumbnail",
                    name: "Thumbnail",
                    description: "The Thumbnail of the Song.",
                    types: ["text", "unspecified"],
                },
                {
                    id: "releasedate",
                    name: "Release Date",
                    description: "The Release Date of the Song.",
                    types: ["text", "unspecified"],
                },
                {
                    id: "lyrics",
                    name: "Lyrics",
                    description: "The Lyrics of the Song.",
                    types: ["text", "unspecified"],
                }
            );
        } else if (source == "radio") {
            start.push(
                {
                    id: "title",
                    name: "Title",
                    description: "The Title of the Radio Station.",
                    types: ["text", "unspecified"],
                },
                {
                    id: "url",
                    name: "URL",
                    description: "The URL of the Radio Station.",
                    types: ["text", "unspecified"],
                },
                {
                    id: "thumbnail",
                    name: "Thumbnail",
                    description: "The Thumbnail of the Radio Station.",
                    types: ["text", "unspecified"],
                }
            );
        } else if (source == "file") {
            start.push(
                {
                    id: "title",
                    name: "Title",
                    description: "The Title of the File.",
                    types: ["text", "unspecified"],
                },
                {
                    id: "author",
                    name: "Author",
                    description: "The Author of the File.",
                    types: ["text", "unspecified"],
                },
                {
                    id: "duration",
                    name: "Duration",
                    description: "The Duration of the File.",
                    types: ["text", "unspecified"],
                },
                {
                    id: "thumbnail",
                    name: "Thumbnail",
                    description: "The Thumbnail of the File.",
                    types: ["text", "unspecified"],
                }
            );
        }
        let end = [
            {
                id: "track",
                name: "Track",
                description: "The Track Object/List",
                types: ["object", "list", "unspecified"],
            },
            {
                id: "actionerr",
                name: "Action (Error)",
                description: "Executes the following blocks if this Block has an error.",
                types: ["action"],
            },
            {
                id: "err",
                name: "Error Message",
                description: "The Error Message, if an error was thrown!",
                types: ["text", "unspecified"],
            },
        ];

        return [...start, ...end];
    },

    async code(cache, DBB) {
        /**
         * Validates whether a given string is a fully qualified URL.
         * @param {string} string The string to validate.
         * @returns {boolean} True if the string is a valid URL, false otherwise.
         */
        const isURL = function (string) {
            try {
                return ["http:", "https:"].includes(new URL(string).protocol);
            } catch {
                return false;
            }
        };
        /**
         * Unshortens a URL using a HEAD request
         *
         * @param {string} url - The URL to unshorten
         * @returns {Promise<string>} The unshortened URL or the original URL if an error occurs
         */
        async function unshortenURL(url) {
            try {
                const response = await fetch(url, {
                    method: "GET",
                    redirect: "follow",
                    signal: AbortSignal.timeout(7000),
                });

                const { origin, pathname } = new URL(response.url);
                return origin + pathname;
            } catch (error) {
                console.error("Failed to unshorten:", error.message);
                return url;
            }
        }
        const { get } = require("axios");
        let song = this.GetInputValue("song", cache);
        const vc = this.GetInputValue("voicechannel", cache);
        const source = this.GetOptionValue("source", cache);

        const emptycooldown = this.GetOptionValue("emptycooldown", cache) || 0;
        const endcooldown = this.GetOptionValue("endcooldown", cache) || 0;

        const leaveonempty = this.GetOptionValue("leaveonempty", cache);
        const autoselfdeaf = this.GetOptionValue("autoselfdeaf", cache);
        const leaveonend = this.GetOptionValue("leaveonened", cache);
        const initialvolume = parseInt(this.GetOptionValue("initialvolume", cache)) || 10;

        const { useMainPlayer, QueryType, useQueue } = require("discord-player");
        const action = this.GetOptionValue("action", cache);
        let radioname;
        let radiothumbnail;

        let querytype;
        if (source == "radio") {
            querytype = undefined;
            try {
                try {
                    const success = await require('./!auto_package_manager').getPackageManager().requires(
                        { name: "radio-browser", version: "latest", dnr: true },
                        { name: "sharp", version: "latest", dnr: true }
                    );
                    if (!success) console.trace("Failed to install dependencies! (Play Music (Source: Radio))");
                } catch (e) {
                    console.log(e);
                }
                const { getStations } = require("radio-browser");
                const sharp = require("sharp");
                const results = await getStations({
                    by: "name",
                    searchterm: song,
                    limit: 1,
                    offset: 0,
                });
                if (results.length > 0) {
                    song = results[0].url;
                    radioname = results[0].name;
                    const img = await get(results[0].favicon, { responseType: "document", validateStatus: () => true });
                    if (img && img.status == 200) radiothumbnail = await sharp(Buffer.from(img.data)).png().toBuffer();
                } else {
                    // You can uncomment this for debugging incase of issues
                    //console.error(err);
                    this.StoreOutputValue(err.message, "err", cache);
                    this.RunNextBlock("actionerr", cache);
                    return;
                }
            } catch (err) {
                // You can uncomment this for debugging incase of issues
                //console.error(err);
                this.StoreOutputValue(err.message, "err", cache);
                this.RunNextBlock("actionerr", cache);
                return;
            }
        } else if (source == "file") {
            querytype = QueryType.FILE;
        } else {
            querytype = undefined;
        }

        const player = useMainPlayer();
        try {
            let queue = useQueue(vc.guild.id);
            if (queue) if (source == "radio" && queue.isPlaying() && action !== "play") queue.node.skip();
            if (isURL(song) && song.includes("deezer")) song = await unshortenURL(song);
            const res = await player.play(vc, song, {
                searchEngine: querytype,
                nodeOptions: {
                    metadata: vc,
                    selfDeaf: autoselfdeaf,
                    volume: initialvolume,
                    leaveOnEmpty: leaveonempty,
                    leaveOnEmptyCooldown: emptycooldown,
                    leaveOnEnd: leaveonend,
                    leaveOnEndCooldown: endcooldown,
                    connectionTimeout: 999999999,
                },
            });
            if (action === "play") {
                if (res.queue.isPlaying()) {
                    res.queue.node.skipTo(res.track);
                }
            }
            if (!res.queue.isPlaying()) await res.queue.node.play();
            if (source == "radio") {
                this.StoreOutputValue(res.track.url, "url", cache);
                this.StoreOutputValue(radioname, "title", cache);
                this.StoreOutputValue(radiothumbnail, "thumbnail", cache);
            } else if (source == "file") {
                this.StoreOutputValue(res.track.author, "author", cache);
                this.StoreOutputValue(res.track.duration, "duration", cache);
            } else {
                this.StoreOutputValue(res.track.title, "title", cache);
                this.StoreOutputValue(res.track.thumbnail, "thumbnail", cache);
                this.StoreOutputValue(res.track.author, "author", cache);
                this.StoreOutputValue(res.track.duration, "duration", cache);
                this.StoreOutputValue(res.track.url, "url", cache);
                this.StoreOutputValue(res.track.raw.startTime, "releasedate", cache);
                const lyrics = await player.lyrics.search({
                    q: res.track.cleanTitle,
                    artistName: res.track.author,
                });

                if (lyrics.length > 0) this.StoreOutputValue(lyrics[0].plainLyrics, "lyrics", cache);
            }
            this.StoreOutputValue(res.track, "track", cache);
            this.RunNextBlock("action", cache);
        } catch (err) {
            // You can uncomment this for debugging incase of issues
            //console.error(err);
            this.StoreOutputValue(err.message, "err", cache);
            this.RunNextBlock("actionerr", cache);
            return;
        }
    },
};
