module.exports = {
  name: "Twitch Channel Manager",

  description: "Add or remove a Twitch channel from the monitored list via text input.",

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
    },
    {
      id: "mode",
      name: "Mode",
      description: "Choose whether to add or remove the user.",
      types: ["text", "unspecified"]
    }
  ],
  
  options: [
    {
      id: "username",
      name: "Channel Username",
      description: "The Twitch username to add or remove (used if input is not provided).",
      type: "TEXT_LINE"
    },
    {
      id: "mode",
      name: "Mode",
      description: "Choose whether to add or remove the user (used if input is not provided).",
      type: "SELECT",
      options: {
        add: "Add",
        remove: "Remove"
      }
    }
  ],

  outputs: [
    {
      id: "action",
      name: "Action",
      description: "Executes the next block.",
      types: ["action"]
    }
  ],

  code(cache, DBB) {
    const username = this.GetInputValue("username", cache) || this.GetOptionValue("username", cache);
    const mode = (this.GetInputValue("mode", cache) || this.GetOptionValue("mode", cache)).toLowerCase();
    DBB.twitch_manager.emit("twitch_channel_manager", {mode, username});
    this.RunNextBlock("action", cache);
  }
};
