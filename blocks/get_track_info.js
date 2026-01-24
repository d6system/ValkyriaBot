module.exports = {
    name: "Get Track Info",

    description: "Get Infos about a specific Track",

    category: "Music V2",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "track",
            "name": "Track",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The Track Object",
            "types": ["object", "unspecified"],
            "required": true
        }
    ],

    options: [
        {
            "id": "info-type",
            "name": "Info Type",
            "description": "Description: The Type of Info you want to get",
            "type": "SELECT",
            "options": [
                {
                    type: "GROUP",
                    name: "Normal Infos",
                    options: [
                        ["title", "Title <Text>"],
                        ["description", "Description <Text>"],
                        ["author", "Author <Text>"],
                        ["url", "URL <Text(URL)>"],
                        ["thumbnail", "Thumbnail <Text(URL)>"],
                        ["duration", "Duration <Number>"],
                        ["views", "Views <Number>"]
                    ]
                },
                {
                    type: "GROUP",
                    name: "Advanced Infos",
                    options: [
                        ["cleantTitle", "Clean Title <Text>"],
                        ["isLive", "Is Live <Boolean>"],
                        ["playlist", "Playlist <Object<Playlist>>"],
                        ["queue", "Queue <Object<Queue>>"],
                        ["hasMetadata", "Has Metadata? <Boolean>"],
                        ["metadata", "Metadata <Object>"],
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
            "id": "info",
            "name": "Track Info",
            "description": "Acceptable Types: Text, List, Object, Unspecified\n\nDescription: The Requested Track Info",
            "types": ["text", "list", "object", "unspecified"]
        }
    ],

    async code(cache) {
        const track = this.GetInputValue("track", cache);

        if (track) {
            const infoType = this.GetOptionValue("info-type", cache);

            let info;

            switch (infoType) {
                case "title":
                    info = track.title;
                    break;
                case "description":
                    info = track.description;
                    break;
                case "author":
                    info = track.author;
                    break;
                case "url":
                    info = track.url;
                    break;
                case "thumbnail":
                    info = track.thumbnail;
                    break;
                case "duration":
                    info = track.duration;
                    break;
                case "cleantTitle":
                    info = track.cleanTitle;
                    break;
                case "isLive":
                    info = track.live;
                    break;
                case "playlist":
                    info = track.playlist;
                    break;
                case "queue":
                    info = track.queue;
                    break;
                case "hasMetadata":
                    info = track.hasMetadata;
                    break;
                case "metadata":
                    info = track.metadata;
                    break;
                case "views":
                    info = track.views;
                    break;
                default:
                    info = null;
                    break;
            }

            this.StoreOutputValue(info, "info", cache);
            this.RunNextBlock("action", cache);
        } else {
            console.log("Input is not a Track")
        }

    }
}