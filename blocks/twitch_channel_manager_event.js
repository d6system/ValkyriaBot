module.exports = {
  name: "Twitch Channel Manager [Event]",

  description: "Runs when a channel has been added/removed.",

  category: "Internet Stuff",

  auto_execute: true,

  inputs: [],
  
  options: [],

  outputs: [
    {
      id: "add",
      name: "Channel Added",
      description: "Executes the next block.",
      types: ["action"]
    },
    {
      id: "remove",
      name: "Channel Removed",
      description: "Executes the next block.",
      types: ["action"]
    },
    {
      id: "username",
      name: "Username",
      description: "The Twitch username to add or remove.",
      types: ["text", "unspecified"]
    },
    {
      id: "profilePicUrl",
      name: "Profile Picture",
      description: "The Twitch profile pic URL to add or remove.",
      types: ["text", "unspecified"]
    },
    {
      id: "url",
      name: "URL",
      description: "The Twitch URL to add or remove.",
      types: ["text", "unspecified"]
    }
  ],

  code(cache, DBB) {
    DBB.twitch_manager.on("twitch_channel_managed", async ({ username, url, profilePicUrl, mode }) => {
      this.StoreOutputValue(username, "username", cache);
      this.StoreOutputValue(url, "url", cache);
      this.StoreOutputValue(profilePicUrl, "profilePicUrl", cache);
      mode == "add" ? this.RunNextBlock("add", cache) : this.RunNextBlock("remove", cache);
    })
  }
};
