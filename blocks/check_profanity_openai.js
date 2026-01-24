module.exports = {
    name: "Check Text for Profanity (OpenAI)",

    description: "Checks if the given text contains profanity, hate speech, or similar using OpenAI GPT-4.1 API.",

    category: "AI Tools",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"]
        },
        {
            id: "text",
            name: "Text to Check",
            description: "The input text to check for inappropriate content.",
            types: ["text"],
            required: true
        },
        {
            id: "api_key",
            name: "OpenAI API Key",
            description: "Your OpenAI API Key.",
            types: ["text"],
            required: true
        }
    ],

    options: [],

    outputs: [
        {
            id: "safe_path",
            name: "Action (Safe)",
            description: "Runs if no harmful content is detected.",
            types: ["action"]
        },
        {
            id: "unsafe_path",
            name: "Action (Unsafe)",
            description: "Runs if harmful content is detected.",
            types: ["action"]
        },
        {
            id: "raw_result",
            name: "Raw Result",
            description: "The full JSON response from OpenAI.",
            types: ["object"]
        }
    ],

    async code(cache) {
        const axios = require("axios");

        const inputText = this.GetInputValue("text", cache);
        const apiKey = this.GetInputValue("api_key", cache);

        const prompt = `You are a content moderation tool. Analyze the following text for any signs of profanity, hate speech, racism, threats, sexual content, or any form of harmful language. 
Reply ONLY with "safe" or "unsafe".

Text: "${inputText}"`;

        try {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4-1106-preview",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.1
                },
                {
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const result = response.data;
            const content = result.choices?.[0]?.message?.content?.toLowerCase().trim();

            this.StoreOutputValue(result, "raw_result", cache);

            if (content === "safe") {
                this.RunNextBlock("safe_path", cache);
            } else {
                this.RunNextBlock("unsafe_path", cache);
            }
        } catch (err) {
            console.error("OpenAI API error:", err.message);
            this.RunNextBlock("unsafe_path", cache); // Fail-safe path
        }
    }
};