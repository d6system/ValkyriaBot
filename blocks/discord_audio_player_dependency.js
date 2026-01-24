module.exports = {
    name: "Discord Audio Player [Dependency]",

    description: "Starts the Discord Audio Player dependency required for other blocks to work.",

    category: "Dependencies",

    options(data) {
        let options = [];

        const isYouTubeExtractorEnabled = data?.options?.["discord-player-youtubei"] ?? true;
        const isDeezerEnabled = data?.options?.["discord-player-deezer"] ?? false;
        const isYandexMusicEnabled = data?.options?.["discord-player-yandexmusic"] ?? false;
        const isTidalEnabled = data?.options?.["discord-player-tidal"] ?? false;
        const isSoundgasmEnabled = data?.options?.["discord-player-soundgasm"] ?? false;
        const isAppleMusicEnabled = data?.options?.["discord-player-applemusic"] ?? false;
        const isSoundCloudEnabled = data?.options?.["discord-player-soundcloud"] ?? false;
        const isSpotifyEnabled = data?.options?.["discord-player-spotify"] ?? false;
        const isTTSEnabled = data?.options?.["discord-player-tts"] ?? false;

        const youtubeiExtractor = [
            {
                id: "discord-player-youtubei",
                name: "YouTube Extractor",
                description: "Whether to enable the YouTube extractor. Disabling this will prevent playing from YouTube.",
                type: "CHECKBOX",
                defaultValue: true,
            },
        ];

        options.push(youtubeiExtractor);

        if (isYouTubeExtractorEnabled) {
            options.push({
                id: "discord-player-youtube-cookie",
                name: "YouTube Cookie (Required for most videos)",
                description:
                    "The YouTube cookie. \n\n1. Open a new incognito/private window in your browser (this prevents your cookies from being rotated)\n2. Log into YouTube in the incognito window\n3. Open DevTools (F12)\n4. Go to the Network tab\n5. Copy the value of the \"Cookie\" (its under Request Headers) header from any request to youtube.com\n6. Close the incognito window after copying the cookies",
                type: "TEXT",
            });
        }

        // ------------------------------------------

        const deezer = [
            {
                id: "discord-player-deezer",
                name: "Deezer Extractor (Requires ARL)",
                description: "Whether to enable the Deezer extractor. Disabling this will prevent playing from Deezer.",
                type: "CHECKBOX",
            },
        ];

        options.push(deezer);

        if (isDeezerEnabled) {
            options.push({
                id: "discord-player-deezer-arl",
                name: "Deezer Master ARL (Required)",
                description:
                    "The ARL for Deezer. To find it, Login to Your Deezer Account on a Web Browser, Open Developer Tools (F12), Go to Application > Cookies > https://www.deezer.com, Look for the 'arl' Cookie and Copy its Value.",
                type: "TEXT_LINE",
            });
        }

        // ------------------------------------------

        const yandexmusic = [
            {
                id: "discord-player-yandexmusic",
                name: "Yandex Music Extractor (Requires API Key)",
                description: "Whether to enable the Yandex Music extractor. Disabling this will prevent playing from Yandex Music.",
                type: "CHECKBOX",
            },
        ];

        options.push(yandexmusic);

        if (isYandexMusicEnabled)
            yandexmusic.push(
                {
                    id: "discord-player-yandexmusic-access-token",
                    name: "Yandex Music Access Token",
                    description:
                        "The access token for Yandex Music. Follow the Guide at https://github.com/MarshalX/yandex-music-api/discussions/513 to get your Access Token.",
                    type: "TEXT_LINE",
                    defaultValue: "",
                },
                {
                    id: "discord-player-yandexmusic-uid",
                    name: "Yandex Music User ID",
                    description: "The user ID for Yandex Music. To get uid go here https://mail.yandex.ru/. Your uid will be in url.",
                    type: "TEXT_LINE",
                    defaultValue: "",
                }
            );

        // ------------------------------------------

        const tidal = [
            {
                id: "discord-player-tidal",
                name: "Tidal Extractor",
                description: "Whether to enable the Tidal extractor. Disabling this will prevent playing from Tidal.",
                type: "CHECKBOX",
            },
        ];

        options.push(tidal);

        // ------------------------------------------

        const soundgasm = [
            {
                id: "discord-player-soundgasm",
                name: "Soundgasm Extractor",
                description: "Whether to enable the Soundgasm extractor. Disabling this will prevent playing from Soundgasm.",
                type: "CHECKBOX",
            },
        ];

        options.push(soundgasm);

        // ------------------------------------------

        const applemusic = [
            {
                id: "discord-player-applemusic",
                name: "Apple Music Extractor",
                description: "Whether to enable the Apple Music extractor. Disabling this will prevent playing from Apple Music.",
                type: "CHECKBOX",
            },
        ];

        options.push(applemusic);

        // ------------------------------------------

        const soundcloud = [
            {
                id: "discord-player-soundcloud",
                name: "SoundCloud Extractor",
                description: "Whether to enable the SoundCloud extractor. Disabling this will prevent playing from SoundCloud.",
                type: "CHECKBOX",
            },
        ];

        options.push(soundcloud);

        if (isSoundCloudEnabled)
            soundcloud.push(
                {
                    id: "discord-player-soundcloud-client-id",
                    name: "SoundCloud Client ID (Optional)",
                    description:
                        "The Client ID of your SoundCloud application. You can create one at https://developers.soundcloud.com/. If not provided, a default Client ID will be used, which may have limitations.",
                    type: "TEXT_LINE",
                    defaultValue: "",
                },
                {
                    id: "discord-player-soundcloud-oauth-token",
                    name: "SoundCloud OAuth Token (Optional)",
                    description:
                        "The OAuth Token of your SoundCloud application. You can create one at https://developers.soundcloud.com/. If not provided, a default OAuth Token will be used, which may have limitations.",
                    type: "TEXT_LINE",
                    defaultValue: "",
                }
            );

        // ------------------------------------------

        const spotify = [
            {
                id: "discord-player-spotify",
                name: "Spotify Extractor",
                description: "Whether to enable the Spotify extractor. Disabling this will prevent playing from Spotify.",
                type: "CHECKBOX",
                defaultValue: true,
            },
        ];

        options.push(spotify);

        if (isSpotifyEnabled)
            spotify.push(
                {
                    id: "discord-player-spotify-client-id",
                    name: "Spotify Client ID (Optional)",
                    description:
                        "The Client ID of your Spotify application. You can create one at https://developer.spotify.com/dashboard/applications.",
                    type: "TEXT_LINE",
                    defaultValue: "",
                },
                {
                    id: "discord-player-spotify-client-secret",
                    name: "Spotify Client Secret (Optional)",
                    description:
                        "The Client Secret of your Spotify application. You can create one at https://developer.spotify.com/dashboard/applications.",
                    type: "TEXT_LINE",
                    defaultValue: "",
                }
            );

        // ------------------------------------------

        const tts = [
            {
                id: "discord-player-tts",
                name: 'Text-to-Speech (TTS) Extractor ("tts:Your Text Here")',
                description: "Whether to enable the Text-to-Speech (TTS) extractor. Disabling this will prevent playing TTS audio.",
                type: "CHECKBOX",
            },
        ];

        options.push(tts);

        if (isTTSEnabled)
            tts.push({
                id: "discord-player-tts-language",
                name: "TTS Language",
                description: "The language code for the TTS extractor (e.g., 'en' for English, 'es' for Spanish).",
                type: "TEXT_LINE",
                defaultValue: "en",
            });

        // ------------------------------------------

        return options.flat();
    },

    async init(DBB) {
        const { readFileSync } = require("fs");
        const packageManager = require('./!auto_package_manager').getPackageManager();
        const values = JSON.parse(readFileSync(DBB.File.paths.workspaces))
            .map((workspace) => {
                if (workspace.workspaces) {
                    return workspace.workspaces.map((wpc) => wpc.blocks.filter((x) => x.name == "discord_audio_player_dependency")).flat();
                } else {
                    return workspace.blocks.filter((x) => x.name == "discord_audio_player_dependency");
                }
            })
            .filter((x) => x[0])
            .map((x) => x.map((x) => x.options).flat())
            .flat()[0];
        const isYouTubeExtractorEnabled = values?.["discord-player-youtubei"] ?? true;
        const isDeezerEnabled = values?.["discord-player-deezer"] ?? false;
        const isYandexMusicEnabled = values?.["discord-player-yandexmusic"] ?? false;
        const isTidalEnabled = values?.["discord-player-tidal"] ?? false;
        const isSoundgasmEnabled = values?.["discord-player-soundgasm"] ?? false;
        const isAppleMusicEnabled = values?.["discord-player-applemusic"] ?? false;
        const isSoundCloudEnabled = values?.["discord-player-soundcloud"] ?? false;
        const isSpotifyEnabled = values?.["discord-player-spotify"] ?? true;
        const isTTSEnabled = values?.["discord-player-tts"] ?? false;

        const youtubeCookie = values?.["discord-player-youtube-cookie"] ?? "";

        const deezerArl = values?.["discord-player-deezer-arl"] ?? "";

        const soundcloudClientId = values?.["discord-player-soundcloud-client-id"] ?? "";
        const soundcloudOAuthToken = values?.["discord-player-soundcloud-oauth-token"] ?? "";

        const yandexMusicAccessToken = values?.["discord-player-yandexmusic-access-token"] ?? "";
        const yandexMusicUid = values?.["discord-player-yandexmusic-uid"] ?? "";

        const spotifyClientId = values?.["discord-player-spotify-client-id"] ?? "";
        const spotifyClientSecret = values?.["discord-player-spotify-client-secret"] ?? "";

        const ttsLanguage = values?.["discord-player-tts-language"] ?? "en";

        try {
            const success = await packageManager?.requires(
                { name: "discord.js", version: "latest" },
                { name: "discord-player", version: "latest" },
                { name: "ffmpeg-static", version: "latest" },
                { name: "axios", version: "latest" },
                isYouTubeExtractorEnabled ? { name: "discord-player-youtube", version: "latest" } : null,
                isDeezerEnabled ?           { name: "discord-player-deezer", version: "latest" }        : null,
                isYandexMusicEnabled ?      { name: "discord-player-yandexmusic", version: "latest" }   : null,
                isTidalEnabled ?            { name: "discord-player-tidal", version: "latest" }         : null,
                isSoundgasmEnabled ?        { name: "discord-player-soundgasm", version: "latest" }     : null,
                isAppleMusicEnabled ?       { name: "discord-player-applemusic", version: "latest" }    : null,
                isSoundCloudEnabled ?       { name: "discord-player-soundcloud", version: "latest" }    : null,
                isSpotifyEnabled ?          { name: "discord-player-spotify", version: "latest" }       : null,
                isTTSEnabled ?              { name: "discord-player-tts", version: "latest" }           : null
            );
            if (!success) return console.log("Failed to install dependencies! (Discord Audio Player Dependency)");
        } catch (e) {
            return console.log(e);
        }

        const module = require("discord-player");
        if (!DBB.Dependencies.DiscordPlayer) DBB.Dependencies.DiscordPlayer = {};
        DBB.Dependencies.DiscordPlayer.module = require("discord-player");

        process.env.FFMPEG_PATH = require("ffmpeg-static");
        const player = new module.Player(DBB.DiscordJS.client);

        //const { YoutubeiExtractor } = require("discord-player-youtubei");

        if (isYouTubeExtractorEnabled) {
            const { YoutubeExtractor } = require("discord-player-youtube");
            await player.extractors.register(YoutubeExtractor, {
                cookie: youtubeCookie || undefined,
                disableYTJSLog: true,
            });
            require("youtubei.js").Log.setLevel(require("youtubei.js").Log.Level.NONE)
        }

        if (isDeezerEnabled && deezerArl) {
            const { DeezerExtractor } = require("discord-player-deezer");
            await player.extractors.register(DeezerExtractor, { 
                    arl: deezerArl,
                    decryptionKey: "4f9512ef59ad5f2446e2fbbf6dd7b71f"
                });
        } else if (isDeezerEnabled) DBB.Core.console("WARN", "Deezer extractor is enabled but ARL is missing. Skipping registration.");

        if (isYandexMusicEnabled && yandexMusicAccessToken && yandexMusicUid) {
            const { YandexMusicExtractor } = require("discord-player-yandexmusic");
            await player.extractors.register(YandexMusicExtractor, { accessToken: yandexMusicAccessToken, uid: yandexMusicUid });
        } else if (isYandexMusicEnabled) DBB.Core.console("WARN", "Yandex Music extractor is enabled but Access Token or UID is missing. Skipping registration.");

        if (isTidalEnabled) {
            const TidalExtractor = require("discord-player-tidal")?.default;
            await player.extractors.register(TidalExtractor);
        }
        
        if (isSoundgasmEnabled) {
            const { SoundgasmExtractor } = require("discord-player-soundgasm");
            await player.extractors.register(SoundgasmExtractor);
        }
        
        if (isAppleMusicEnabled) {
            const { AppleMusicExtractor } = require("discord-player-applemusic");
            await player.extractors.register(AppleMusicExtractor);
        }
        
        if (isSoundCloudEnabled) {
            const { SoundcloudExtractor } = require("discord-player-soundcloud");
            if (soundcloudClientId && soundcloudOAuthToken) {
                await player.extractors.register(SoundcloudExtractor, { clientId: soundcloudClientId, oauthToken: soundcloudOAuthToken });
            } else {
                await player.extractors.register(SoundcloudExtractor);
            }
        }
        
        if (isSpotifyEnabled) {
            const { SpotifyExtractor } = require("discord-player-spotify");
            if (spotifyClientId && spotifyClientSecret) {
                await player.extractors.register(SpotifyExtractor, { clientId: spotifyClientId, clientSecret: spotifyClientSecret });
            } else {
                await player.extractors.register(SpotifyExtractor);
            }
        }

        if (isTTSEnabled) {
            const { TTSExtractor } = require("discord-player-tts");
            await player.extractors.register(TTSExtractor, { language: ttsLanguage });
        }

        DBB.Dependencies.DiscordPlayer.player = player;
    },
};
