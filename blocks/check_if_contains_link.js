
module.exports = {
  name: "Check If Contains Link",

  description: "Detects any link(s) in a text using an external library. Supports links without protocol (e.g., example.com). Outputs found links and routes accordingly.",

  category: "Internet Stuff",

  inputs: [
    {
      id: "action",
      name: "Action",
      description: "Executes this block.",
      types: ["action"]
    },
    {
      id: "text",
      name: "Text",
      description: "The text to scan for URLs (with or without protocol).",
      types: ["text", "unspecified"],
      required: true
    }
  ],

  options: [],

  outputs: [
    {
      id: "yes",
      name: "Yes",
      description: "Executes if one or more URLs are found.",
      types: ["action"]
    },
    {
      id: "no",
      name: "No",
      description: "Executes if no URL is found.",
      types: ["action"]
    },
    {
      id: "url",
      name: "URL(s)",
      description: "Outputs a list of detected URLs.",
      types: ["list"]
    }
  ],

  async code(cache, DBB) {
    await require('./!auto_package_manager').getPackageManager().requires({ name: "linkify-it", version: "latest" });

    const linkify = require("linkify-it")();
    linkify.tlds(["onion"], true); // Add support for non-standard domains too
    linkify.add("www.", {
      validate: (text, pos, self) => {
        const tail = text.slice(pos);
        if (/^\S+\.\S+/.test(tail)) return tail.match(/^\S+/)[0].length;
        return 0;
      }
    });

    const text = this.GetInputValue("text", cache);
    const matches = linkify.match(text);

    if (matches && matches.length > 0) {
      const urls = matches.map(m => m.url);
      this.StoreOutputValue(urls, "url", cache);
      this.RunNextBlock("yes", cache);
    } else {
      this.RunNextBlock("no", cache);
    }
  }
};
