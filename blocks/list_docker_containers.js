module.exports = {
    name: "List Docker Containers",
    
    description: "Lists all Docker containers with their status using docker.sock. Where Bot in a Container Create a volume with 'Bind' to /var/run/docker.sock:/var/run/docker.sock in RO (Ready-Only)",
    
    category: "Docker",
    
    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"],
            "required": true
        }
    ],
    
    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "containers",
            "name": "Containers List",
            "description": "Type: List\n\nDescription: A list of Docker containers with their status.",
            "types": ["list"]
        },
        {
            "id": "error",
            "name": "Error Message",
            "description": "Type: Text, Undefined\n\nDescription: An error message if something goes wrong.",
            "types": ["text", "undefined"]
        }
    ],
    
    async code(cache) {
        const fs = require("fs");
        const path = "/var/run/docker.sock";

        try {
            if (!fs.existsSync(path)) {
                throw new Error("Docker socket not found. Ensure Docker is installed and running.");
            }

            const http = require("http");
            const options = {
                socketPath: path,
                path: "/containers/json?all=true",
                method: "GET"
            };

            const request = http.request(options, (res) => {
                let data = "";
                res.on("data", (chunk) => {
                    data += chunk;
                });

                res.on("end", () => {
                    try {
                        const containers = JSON.parse(data).map(container => ({
                            id: container.Id,
                            name: container.Names[0],
                            image: container.Image,
                            status: container.Status,
                            state: container.State
                        }));

                        this.StoreOutputValue(containers, "containers", cache);
                        this.RunNextBlock("action", cache);
                    } catch (parseError) {
                        this.StoreOutputValue("Failed to parse Docker response.", "error", cache);
                        this.RunNextBlock("action", cache);
                    }
                });
            });

            request.on("error", (err) => {
                this.StoreOutputValue(`Error communicating with Docker: ${err.message}`, "error", cache);
                this.RunNextBlock("action", cache);
            });

            request.end();
        } catch (error) {
            this.StoreOutputValue(error.message, "error", cache);
            this.RunNextBlock("action", cache);
        }
    }
};
