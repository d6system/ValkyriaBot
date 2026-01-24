module.exports = {
    name: "Post to Mastodon",

    description: "Posts a message to a Mastodon instance using a user-provided access token.",

    category: "Internet Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"]
        },
        {
            id: "message",
            name: "Message Text",
            description: "The text content to post to Mastodon.",
            types: ["text", "unspecified"],
            required: true
        },
        {
            id: "access_token",
            name: "Access Token",
            description: "The Mastodon user access token used for authentication.",
            types: ["text", "unspecified"],
            required: true
        }
    ],

    options: [
        {
            id: "instance_url",
            name: "Mastodon Instance URL",
            description: "The base URL of the Mastodon instance. Example: https://rt.sprdzy.com",
            type: "TEXT",
            defaultValue: "https://rt.sprdzy.com"
        }
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "status_code",
            name: "Status Code",
            description: "The HTTP status code returned by the Mastodon API.",
            types: ["number"]
        },
        {
            id: "response",
            name: "API Response",
            description: "The JSON response object returned by the Mastodon API.",
            types: ["object", "unspecified"]
        }
    ],

    async code(cache, DBB) {
        const { default: axios } = require("axios");

        const message = this.GetInputValue("message", cache);
        const accessToken = this.GetInputValue("access_token", cache);
        const instanceUrl = this.GetOptionValue("instance_url", cache);

        try {
            const response = await axios.post(
                `${instanceUrl}/api/v1/statuses`,
                { status: message },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    validateStatus: () => true
                }
            );

            this.StoreOutputValue(response.status, "status_code", cache);
            this.StoreOutputValue(response.data, "response", cache);
        } catch (err) {
            this.StoreOutputValue(500, "status_code", cache);
            this.StoreOutputValue({ error: err.message }, "response", cache);
        }

        this.RunNextBlock("action", cache);
    }
};
