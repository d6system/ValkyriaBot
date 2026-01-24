module.exports = {
    name: "Autocomplete Song Search",

    description: "Applies the autocomplete song search to a slash command.",

    category: "Music V2",

    auto_execute: true,

    inputs: [],

    options: [
        {
            id: "id",
            name: "Name / Id",
            description: "Description: The Id of the Command to filter for.",
            type: "text"
        },
        {
            id: "option",
            name: "Query Option ID",
            description: "Description: The ID of the Query Option",
            type: "text"
        },
        {
            id: "search_engine",
            name: "Search Engine",
            description: "Description: The Search Engine to use.",
            type: "SELECT",
            options: {
                none: "None/Auto",
                youtube: "YouTube",
                soundcloud: "SoundCloud",
                spotify: "Spotify",
                apple: "Apple Music",
            }
        }
    ],

    outputs: [],

    async init(DBB, blockName) {
        const { readFileSync } = require("fs");
        const values = JSON.parse(readFileSync(DBB.File.paths.workspaces)).map((workspace) => {
                if (workspace.workspaces) {
                    return workspace.workspaces.map((wpc) => wpc.blocks.filter((x) => x.name == blockName)).flat();
                } else {
                    return workspace.blocks.filter((x) => x.name == blockName);
                }
            }).filter((x) => x[0])
            .map((x) => x.map((x) => x.options).flat())
            .flat()[0];
        const id = values?.id;
        const option = values?.option;
        try {
            require("discord-player")
        } catch(e) {
            return;
        }
        const { useMainPlayer, QueryType } = require("discord-player");
        const raw_engine = values?.search_engine;

        switch (raw_engine) {
            case "none":
                engine = undefined;
                break;
            case "youtube":
                engine = QueryType.YOUTUBE_SEARCH;
                break;
            case "soundcloud":
                engine = QueryType.SOUNDCLOUD_SEARCH;
                break;
            case "spotify":
                engine = QueryType.SPOTIFY_SEARCH;
                break;
            case "apple":
                engine = QueryType.APPLE_MUSIC_SEARCH;
                break;
        }

        DBB.DiscordJS.client.on("interactionCreate", async (interaction) => {
            if (interaction.commandName == id) {
                if (interaction.isAutocomplete()) {
                    try {
                        const player = useMainPlayer();
                        const query = interaction.options.getString(option) || " ";
                        const results = await player.search(query, {
                            searchEngine: engine
                        });

                        await interaction.respond(
                            results.tracks.slice(0, 10).map((t) => ({
                                name: (t.author.split(",")[0] + " - " + t.title).substring(0, 99),
                                value: t.url
                            }))
                        );
                    } catch (e) {
                        // Ignore
                    }

                }
            }
        });
    }
}