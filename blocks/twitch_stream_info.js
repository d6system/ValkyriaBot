module.exports = {
  name: "Get Twitch Stream Info",

  description: "Fetches the current stream info for a given channel.",

  category: "Internet Stuff",

  inputs: [
    {
      id: "action",
      name: "Action",
      description: "Executes this block.",
      types: ["action"]
    },
    {
      id: "username",
      name: "Twitch Username",
      description: "The Twitch username to add or remove.",
      types: ["text", "unspecified"]
    }
  ],
  
  options: [
    {
      id: "username",
      name: "Twitch Username",
      description: "The Twitch username to add or remove.",
      type: "TEXT"
    },
    {
      id: "aditional_properties",
      name: "Aditional Properties",
      type: "MULTISELECT",
      allowUserOptions: false,
      duplicates: false,
      description: "Select aditional properties to output",
      options: {
        "tags": "Stream Tags [List]",
        "viewers": "Viewer Count [Number]",
        "language": "Language [Text]",
        "startDate": "Stream Started At [Date]",
        "isMature": "Is Mature? [Boolean]",
      }
    },
  ],

outputs(data) {
    return [
      {
        id: "online",
        name: "Online",
        description: "Executes the following blocks if the streamer is live.",
        types: ["action"],
      },
      {
        id: "offline",
        name: "Offline",
        description: "Ecxecutes the following blocks if the streamer is offline.",
        types: ["action"],
      },
      {
        id: "title",
        name: "Stream Title",
        description: "The Title of the data.",
        types: ["text", "unspecified"],
      },
      {
        id: "author",
        name: "Channel Name",
        description: "The Name of the channel.",
        types: ["text", "unspecified"],
      },
      {
        id: "profilePic",
        name: "Profile Picture",
        description: "The Profile Picture of the channel.",
        types: ["text", "unspecified"],
      },
      {
        id: "link",
        name: "Link",
        description: "The URL of the data.",
        types: ["text", "unspecified"],
      },
      {
        id: "game",
        name: "Game",
        description: "The Game that is being played.",
        types: ["text", "unspecified"],
      },
      {
        id: "thumbnailUrl",
        name: "Thumbnail URL",
        description: "The URL of the Thumbnail image.",
        types: ["text", "unspecified"],
      },
      data?.options?.aditional_properties?.includes("tags") ? {
        id: "tags",
        name: "Stream Tags",
        description: "The list of Stream Tags.",
        types: ["list", "unspecified"],
      } : undefined,
      data?.options?.aditional_properties?.includes("viewers") ? {
        id: "viewers",
        name: "Viewer Count",
        description: "The amount of Viewers.",
        types: ["number", "unspecified"],
      } : undefined,
      data?.options?.aditional_properties?.includes("language") ? {
        id: "language",
        name: "Language",
        description: "The Language of the data.",
        types: ["text", "unspecified"],
      } : undefined,
      data?.options?.aditional_properties?.includes("startDate") ? {
        id: "startDate",
        name: "Stream Started At",
        description: "The time that the Stream Started.",
        types: ["date", "unspecified"],
      } : undefined,
      data?.options?.aditional_properties?.includes("isMature") ? {
        id: "isMature",
        name: "Is Mature?",
        description: "Boolean if the stream is 18+.",
        types: ["boolean", "unspecified"],
      } : undefined,
    ]
  },

  code(cache, DBB) {
    const username = this.GetInputValue("username", cache) || this.GetOptionValue("username", cache)
    DBB.twitch_manager.emit("twitch_channel_get_stream_info", (username))
    const thiss = this;
    DBB.twitch_manager.on("twitch_channel_stream_info", async ({ state, data }) => {
      thiss.StoreOutputValue(username, "author", cache);
      thiss.StoreOutputValue(data.title, "title", cache);
      thiss.StoreOutputValue(`https://www.twitch.tv/${username}`, "link", cache);
      thiss.StoreOutputValue(data.game_name, "game", cache);
      thiss.StoreOutputValue(data.thumbnail_url, "thumbnailUrl", cache);
      thiss.StoreOutputValue(data.tags, "tags", cache);
      thiss.StoreOutputValue(data.viewer_count, "viewers", cache);
      thiss.StoreOutputValue(data.language, "language", cache);
      thiss.StoreOutputValue(data.started_at, "startDate", cache);
      thiss.StoreOutputValue(data.profilePicUrl, "profilePic", cache);
      thiss.StoreOutputValue(data.is_mature, "isMature", cache);

      state == "online" ? thiss.RunNextBlock("online", cache) : thiss.RunNextBlock("offline", cache);
    })
  }
};
