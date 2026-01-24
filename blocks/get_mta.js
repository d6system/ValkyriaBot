module.exports = {
    name: "Filter MTA Server by IP",

    description: "Fetches the MTA server list from https://mtasa.com/api and returns the server object that matches the given IP and port.",

    category: "Internet Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"]
        },
        {
            id: "ip",
            name: "Server IP",
            description: "The IP address to filter by.",
            types: ["text", "unspecified"],
            required: true
        },
        {
            id: "port",
            name: "Server Port",
            description: "The port number to filter by.",
            types: ["number", "text", "unspecified"],
            required: true
        }
    ],

    options: [
        {
            id: "timeout",
            name: "Timeout",
            description: "The request timeout in milliseconds. Default: 5000",
            type: "NUMBER",
            defaultValue: 5000
        }
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes the following blocks when this block finishes.",
            types: ["action"]
        },
        {
            id: "server",
            name: "Server Object",
            description: "The matching server object, or null if not found.",
            types: ["object", "unspecified"]
        }
    ],

    async code(cache, DBB) {
        const axios = require("axios");
        const ip = this.GetInputValue("ip", cache);
        const port = this.GetInputValue("port", cache);
        const timeout = this.GetOptionValue("timeout", cache) || 5000;

        try {
            const response = await axios.get("https://mtasa.com/api", {
                timeout,
                validateStatus: () => true
            });

            const data = Array.isArray(response.data) ? response.data : [response.data];
            const server = data.find(s => String(s.ip) === String(ip) && Number(s.port) === Number(port)) || null;

            this.StoreOutputValue(server, "server", cache);
        } catch (err) {
            DBB.Core.console("WARN", `Failed to fetch MTA API: ${err.message}`);
            this.StoreOutputValue(null, "server", cache);
        }

        this.RunNextBlock("action", cache);
    }
};
