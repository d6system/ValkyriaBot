module.exports = {
    name: "Player/Queue Event [Multi-Type-Event]",

    description: "Triggers when a Queue Event is triggered",

    category: "Music V2",

    auto_execute: true,

    inputs: [],

    options: [
        {
            "id": "event",
            "name": "Event Type",
            "description": "Type: Select\n\nDescription: The Queue Event to trigger",
            "type": "SELECT",
            "options": [
                {
                    type: "GROUP",
                    name: "Queue Events",
                    options: [
                        ["audioTrackAdd", "Track Added <queue, track>"],
                        ["audioTrackRemove", "Track Removed <queue, track>"],
                        ["audioTracksAdd", "Tracks Added <queue, tracks>"],
                        ["audioTracksRemove", "Tracks Removed <queue, tracks>"],
                        ["disconnect", "Bot Leaves VC <queue>"],
                        ["emptyChannel", "Empty Channel <queue>"],
                        ["emptyQueue", "Queue Empty/Ended <queue>"],
                        ["channelPopulate", "Channel Populated <queue>"],
                        ["connection", "Connection Created <queue>"],
                        ["connectionDestroyed", "Connection Destroyed <queue>"],
                        ["queueCreate", "Queue Created <queue>"],
                        ["queueDelete", "Queue Deleted <queue>"],
                        ["volumeChange", "Volume Change <queue, oldVolume, newVolume>"],
                        ["willAutoPlay", "Will Auto Play <queue, tracks, track>"],
                        ["willPlayTrack", "Will Play Track <queue, track>"],
                    ]
                },
                {
                    type: "GROUP",
                    name: "Audio Events",
                    options: [
                        ["playerFinish", "Player Finish <queue, track>"],
                        ["playerPause", "Player Pause <queue>"],
                        ["playerResume", "Player Resume <queue>"],
                        ["playerStart", "Player Start <queue, track>"],
                        ["playerSkip", "Player Skip <queue, track>"],
                        ["voiceStateUpdate", "Voice State Update <queue, oldState, newState>"],
                    ]
                },
                {
                    type: "GROUP",
                    name: "Player Events",
                    options: [
                        ["playerTrigger", "Player Trigger <queue, track>"],
                        ["debug-player", "Player Debug <message>"],
                        ["debug-queue", "Player Queue Debug <queue, message>"],
                        ["error", "Player Error <queue, error>"],
                        ["playerError", "Player Queue Error <queue, error, track>"]
                    ]
                },
                {
                    type: "GROUP",
                    name: "Advanced Events",
                    options: [
                        ["audioFiltersUpdate", "Audio Filters Updated <queue, oldFilters, newFilters>"],
                        ["biquadFiltersUpdate", "Biquad Filters Updated <queue, oldFilters, newFilters>"],
                        ["dspUpdate", "DSP Updated <queue, oldFilters, newFilters>"],
                        ["equalizerUpdate", "Equalizer Updated <queue, oldFilters, newFilters>"],
                    ]
                }
            ]
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "value",
            "name": "Value",
            "description": "Type: Unspecified\n\nDescription: The Value depending on the number of arguments",
            "types": ["unspecified"],
            "multiOutput": true
        }
    ],

    async code(cache) {
        try {
            require("discord-player");
        } catch (e) {
            return;
        }
        const player = require("discord-player").useMainPlayer();
        const event = this.GetOptionValue("event", cache);
        if (event == "debug-player") {
            player.on("debug", (message) => {
                this.StoreOutputValue(message, "message", cache);
                this.RunNextBlock("action", cache);
            })
        } else {
            player.events.on(event.split("-")[0], (a,b,c,d,e,f) => {
                this.StoreOutputValue([a,b,c,d,e,f], "value", cache);
                this.RunNextBlock("action", cache);
            })
        }
    }
}