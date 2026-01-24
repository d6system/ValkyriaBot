module.exports = {
    name: "Ping Server/Service (Available)",

    description: "Checks if the server is online and responsive.",

    category: "Internet Stuff",

    inputs(data) {
        const inputs = [
            {
                id: "action",
                name: "Action",
                description: "Executes this block.",
                types: ["action"],
            },
            {
                id: "timeout",
                name: "Timeout",
                description: "The timeout duration in seconds (default is 5 seconds).",
                types: ["number", "unspecified"],
            },
            {
                id: "ip",
                name: "IP Address",
                description: "Enter the IP address of the server.",
                types: ["text", "unspecified"],
            },
        ];

        const portPing = data?.options?.port_ping ?? false;

        if (portPing) {
            inputs.push({
                id: "port",
                name: "Port",
                description: "Enter the port number of the server.",
                types: ["number", "text", "unspecified"],
            });
        }

        return inputs;
    },

    options(data) {
        const options = [
            {
                id: "port_ping",
                name: "Port Ping",
                description: "Whether to ping the server's port.",
                type: "CHECKBOX",
            },
            {
                id: "timeout",
                name: "Timeout (Seconds)",
                description: "The timeout duration in seconds (default is 5 seconds).",
                type: "NUMBER",
                defaultValue: 5,
            },
            {
                id: "ip",
                name: "IP Address",
                description: "Enter the IP address of the server.",
                type: "TEXT",
            },
        ];

        const portPing = data?.options?.port_ping ?? false;

        if (portPing) {
            options.push({
                id: "port",
                name: "Port",
                description: "Enter the port number of the server.",
                type: "NUMBER",
                defaultValue: 80,
            });
        }
        return options;
    },

    outputs: [
        {
            id: "action",
            name: "Action (Any)",
            description: "Executes the following blocks when this block finishes its task.",
            types: ["action"],
        },
        {
            id: "action_true",
            name: "Action (Online)",
            description: "Executes the following blocks when this block finishes its task.",
            types: ["action"],
        },
        {
            id: "action_false",
            name: "Action (Offline)",
            description: "Executes the following blocks when this block finishes its task.",
            types: ["action"],
        },
        {
            id: "status",
            name: "Status",
            description: "The status of the server (true if online, false if offline).",
            types: ["boolean", "unspecified"],
        },
        {
            id: "time",
            name: "Response Time",
            description: "The response time of the server in milliseconds.",
            types: ["number", "unspecified"],
        }
    ],

    async code(cache) {
        const net = require("net");
        const ping = await this.require('ping');

        const get = (id) => this.GetInputValue(id, cache) || this.GetOptionValue(id, cache);

        const port_ping = this.GetOptionValue("port_ping", cache);
        const ip = get("ip");
        const port = port_ping ? get("port") : null;
        const timeout = get("timeout") || 5;

        async function checkPort(host, port, timeout = 5000) {
            return new Promise((resolve) => {
                const socket = new net.Socket();
                const start = Date.now();

                const onError = () => {
                    socket.destroy();
                    resolve({
                        success: false,
                        time: Date.now() - start
                    });
                };

                socket.setTimeout(timeout);
                socket.once("error", onError);
                socket.once("timeout", onError);

                socket.connect(port, host, () => {
                    socket.end();
                    resolve({
                        success: true,
                        time: Date.now() - start
                    });
                });
            });
        }

        async function pingServer(host) {
            const res = await ping.promise.probe(host, {
                timeout: 5
            });
            return {
                alive: res.alive,
                time: res.time
            };
        }

        if(port_ping) {
            checkPort(ip, port, timeout * 1000).then((responseTime) => {
                this.StoreOutputValue(responseTime.time, "time", cache);
                this.StoreOutputValue(responseTime.success, "status", cache);
                this.RunNextBlock("action", cache);
                if (responseTime.success) {
                    this.RunNextBlock("action_true", cache);
                } else {
                    this.RunNextBlock("action_false", cache);
                }
            }).catch(() => {
                this.StoreOutputValue(false, "status", cache);
                this.RunNextBlock("action", cache);
                this.RunNextBlock("action_false", cache);
            });
        } else {
            pingServer(ip).then((result) => {
                this.StoreOutputValue(result.alive, "status", cache);
                this.StoreOutputValue(result.time, "time", cache);
                this.RunNextBlock("action", cache);
                if (result.alive) {
                    this.RunNextBlock("action_true", cache);
                } else {
                    this.RunNextBlock("action_false", cache);
                }
            }).catch(() => {
                this.StoreOutputValue(false, "status", cache);
                this.RunNextBlock("action", cache);
                this.RunNextBlock("action_false", cache);
            });
        }
    },
};
