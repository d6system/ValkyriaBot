module.exports = {
    name: "Discord Audio Player [Dependency]",

    description: "Starts the Discord Audio Player dependency required for other blocks to work.",

    category: "Dependencies",

    outputs: [],

    init(DBB, blockName) {
        DBB.Core.setDependency("DiscordPlayer", blockName, async () => {
            process.env.FFMPEG_PATH = await DBB.Core.require("ffmpeg-static")
            await DBB.Core.require("mediaplex")

            const module = await DBB.Core.require("discord-player")
            await DBB.Core.require("@discord-player/extractor")
            const { YoutubeiExtractor } = await DBB.Core.require("discord-player-youtubei")

            const player = new module.Player(DBB.DiscordJS.client)

            await player.extractors.loadDefault((ext) => ext !== "YouTubeExtractor")
            await player.extractors.register(YoutubeiExtractor)

            return { module, player }
        })
    }
}
