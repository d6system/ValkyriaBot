module.exports = {
  name: "Get Dad Joke",

  description: "Fetches a random dad joke from the icanhazdadjoke API as plain text.",

  category: "Internet Stuff",

  inputs: [
    {
      id: "action",
      name: "Action",
      description: "Executes this block.",
      types: ["action"],
    },
  ],

  options: [],

  outputs: [
    {
      id: "action",
      name: "Action",
      description: "Executes the next block after the dad joke is fetched.",
      types: ["action"],
    },
    {
      id: "joke",
      name: "Dad Joke",
      description: "The dad joke fetched from the API as plain text.",
      types: ["text"],
    },
    {
      id: "status",
      name: "Status Code",
      description: "The HTTP status code of the response.",
      types: ["number"]
    }
  ],

  async code(cache) {
    const axios = require("axios");

    try {
      const response = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "text/plain" },
        responseType: "text",
        validateStatus: () => true,
      });

      this.StoreOutputValue(response.data, "joke", cache);
      this.StoreOutputValue(response.status, "status", cache);
      this.RunNextBlock("action", cache);
    } catch (err) {
      this.StoreOutputValue(500, "status", cache);
      this.StoreOutputValue("Failed to fetch dad joke.", "joke", cache);
      this.RunNextBlock("action", cache);
    }
  },
};