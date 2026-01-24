module.exports = {
  name: "ChatGPT Request (Model Picker)",

  description: "Sends a prompt to OpenAI and returns the message using selected model (gpt-4o, 4.1, or o1-mini).",

  category: "Internet Stuff",

  inputs: [
    {
      id: "action",
      name: "Action",
      description: "Executes this block.",
      types: ["action"]
    },
    {
      id: "api_key",
      name: "API Key",
      description: "Your OpenAI API Key.",
      types: ["text", "unspecified"],
      required: true
    },
    {
      id: "prompt",
      name: "Prompt",
      description: "The prompt/question to ask ChatGPT.",
      types: ["text", "unspecified"],
      required: true
    }
  ],

  options: [
    {
      id: "model",
      name: "Model",
      description: "Choose which OpenAI model to use.",
      type: "SELECT",
      options: {
        "gpt-4o": "GPT-4o",
        "gpt-4-1106-preview": "GPT-4.1",
        "gpt-4-turbo": "GPT-4 Turbo (o1-mini)"
      },
      defaultValue: "gpt-4o"
    }
  ],

  outputs: [
    {
      id: "action",
      name: "Action",
      description: "Executes the next block.",
      types: ["action"]
    },
    {
      id: "response",
      name: "Message Text",
      description: "The message returned from the model.",
      types: ["text"]
    }
  ],

  async code(cache) {
    const axios = require("axios");

    const apiKey = this.GetInputValue("api_key", cache);
    const prompt = this.GetInputValue("prompt", cache);
    const model = this.GetOptionValue("model", cache);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );

      const message = response.data.choices?.[0]?.message?.content;
      this.StoreOutputValue(message, "response", cache);
    } catch (err) {
      this.StoreOutputValue("Error: " + err.message, "response", cache);
    }

    this.RunNextBlock("action", cache);
  }
};