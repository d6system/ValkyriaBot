module.exports = {
    name: "Gemini AI Reply",

    description: "Use the Google Gemini AI API to ask questions and return useful answers",

    category: "GeminiAI",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"],
        },
        {
            id: "text",
            name: "Text",
            description: "The text to put in the message.",
            types: ["text", "unspecified"],
        },
        {
            id: "instructions",
            name: "System Instructions",
            description: "Instruct what the model should act like (i.e. a persona, output format, style/tone, goals/rules, and additional context)",
            types: ["text", "unspecified"],
        },
        {
            id: "image",
            name: "Image",
            description: "The Image you want the AI to see. Supports URL and Path.",
            types: ["text", "unspecified"],
        },
    ],

    options: [
        {
            id: "key",
            name: "API Key",
            description:
                "The Cookie Secret of the Gemini AI. \nYou can find more Info on how to get the Cookie Secret at: \nhttps://aistudio.google.com/app/apikey",
            type: "TEXT",
        },
        {
            id: "model",
            name: "Model",
            description:
                "The Model to use for the AI. \nYou can find more Info on how to get the Model at: \nhttps://ai.google.dev/gemini-api/docs/models",
            type: "SELECT",
            options: {
                "gemini-2.5-pro": "Gemini 2.5 Pro",
                "gemini-2.5-flash": "Gemini 2.5 Flash",
                "gemini-2.5-flash-lite": "Gemini 2.5 Flash-Lite",
                "gemini-2.0-flash": "Gemini 2.0 Flash",
                "gemini-2.0-flash-lite": "Gemini 2.0 Flash-Lite"
            },
        },
        {
            id: "instructions",
            name: "System Instructions",
            description: "Instruct what the model should act like (i.e. a persona, output format, style/tone, goals/rules, and additional context)",
            type: "text",
            defaultValue:
                "You must stay under 2000 Characters in the response, but can get near the 2000 characters if required! You are in a Discord Chat, replying to a Member and are able to use Discord Formatting to reply to messages!",
        },
        {
            id: "text",
            name: "Text",
            description: "The text to put in the message.",
            type: "text",
        },
    ],

    outputs: [
        {
            id: "action",
            name: "Action (Complete)",
            description: "Executes the following blocks when this block finishes its task.",
            types: ["action"],
        },
        {
            id: "response",
            name: "Response (Complete)",
            description: "The message obtained.",
            types: ["text", "unspecified"],
        },
        {
            id: "action_stream",
            name: "Action (Stream)",
            description: "This Action will run every Time the AI sends a new part of the Message.",
            types: ["action"],
        },
        {
            id: "response_stream",
            name: "Response (Stream)",
            description: "This Streams a part of the generated Text. You can use this to edit a existing Message with the AI.",
            types: ["text", "unspecified"],
        },
    ],

    async code(cache, DBB) {
        try {
            const success = await require('./!auto_package_manager').getPackageManager().requires({ name: "gemini-ai", version: "latest", dnr: true });
            if (!success) console.log("Failed to install dependencies! (Gemini AI)");
        } catch (e) {
            console.log(e);
        }
        import("gemini-ai")
            .then(async ({ default: Gemini }) => {
                const axios = require("axios");
                const key = this.GetOptionValue("key", cache);
                const text = this.GetInputValue("text", cache) ?? this.GetOptionValue("text", cache);
                const instructions =
                    this.GetInputValue("instructions", cache) ??
                    this.GetOptionValue("instructions", cache) ??
                    "You must stay under 2000 Characters in the response, but can get near the 2000 characters if required! You are in a Discord Chat, replying to a Member and are able to use Discord Formatting to reply to messages!";
                const image = this.GetInputValue("image", cache);
                const model = this.GetOptionValue("model", cache) ?? "gemini-2.5-pro";

                let url = image;
                if (image && image.startsWith("http")) {
                    const { data } = await axios.get(image, {
                        responseType: "arraybuffer",
                    });
                    if (data) url = data;
                }


                try {
                    const gemini = new Gemini(key);
                    let parts = "";
                    const response = await gemini.ask([text, url ?? null], {
                        systemInstruction: instructions,
                        model: model,
                        stream: (part) => {
                            parts += part;
                            this.StoreOutputValue(parts, "response_stream", cache);
                            this.RunNextBlock("action_stream", cache);
                        },
                    });

                    this.StoreOutputValue(response, "response", cache);
                    this.RunNextBlock("action", cache);
                } catch (error) {
                    console.error(error);
                    this.StoreOutputValue("An Error Occured, please Verify your API Key! (Check Console for More Info)", "response", cache);
                    this.RunNextBlock("action", cache);
                }
            })
            .catch((err) => {
                console.log(err);
                this.StoreOutputValue(
                    "Error Gemini AI Package is missing, you can install it by using `npm i gemini-ai` in a terminal in the Bot Folder. Sorry for this Workaround.",
                    "response",
                    cache
                );
                this.RunNextBlock("action", cache);
            });
    },
};
