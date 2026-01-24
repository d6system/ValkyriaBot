module.exports = {
    name: "Request API (AXIOS)",

    description: "Allows you to request an API using Axios. Finally working without any issues, i hope.",

    category: "Internet Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "url",
            "name": "API URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The URL of API.",
            "types": ["text", "unspecified"],
            "required": true
        },
        {
            "id": "header",
            "name": "Header",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The headers to send to API. (OPTIONAL)\n\nNEW METHOD: With the new Multi Input you can input text here!\nExample:\n  Header#1: x-api-key: XXXX-XXX-XXXXXXX\n  Header#2: Content-Type: application/json\netc....\n\n\nYou can still connect a Single Object into here and it would merge them.",
            "types": ["object", "text", "unspecified"],
            "multiInput": true
        },
        {
            "id": "body",
            "name": "Body",
            "description": "Acceptable Types: Text, Object, Unspecified\n\nDescription: The body to send to API. (OPTIONAL)\n\nNEW METHOD: With the new Multi Input you can input text here!\nExample:\n  Body#1: \"key1\": \"value\"\n  Body#2: \"key2\": \"value\"\netc....\n\n\nYou can still connect a Single Object into here and it would merge them.",
            "types": ["object", "text", "unspecified"],
            "multiInput": true
        }
    ],

    options: [
        {
            "id": "method_type",
            "name": "Method Type",
            "description": "Description: The type of method for API request.",
            "type": "SELECT",
            "options": {
                "get": "GET",
                "post": "POST",
                "put": "PUT",
                "delete": "DELETE",
                "patch": "PATCH"
            }
        },
        {
            "id": "return_type",
            "name": "Return Type",
            "description": "Description: The type of data to obtain from API request.",
            "type": "SELECT",
            "options": {
                "json": "Object/Text",
				"buffer": "Buffer",
                "attachment": "Attachment"
            }
        },
        {
            id: "timeout",
            name: "Timeout",
            description: "Description: The time in milliseconds before the request times out.\nDefault: 0 (No timeout)",
            type: "NUMBER",
            defaultValue: 0
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
            "id": "status",
            "name": "Status Code",
            "description": "Type: Number\n\nDescription: The status code of the API request.",
            "types": ["number"]
        },
        {
            "id": "data",
            "name": "API Data",
            "description": "Type: Object\n\nDescription: The API data obtained if possible.",
            "types": ["object", "unspecified"]
        },
        {
            "id": "headers",
            "name": "Response Headers",
            "description": "Type: Object\n\nDescription: The headers of the API request.",
            "types": ["object"]
        }
    ],

    async code(cache) {
        const { AttachmentBuilder } = require("discord.js");
        const url = this.GetInputValue("url", cache);

        let headers = this.GetInputValue("header", cache);
        let rawheaders = {};
        try {
            if(headers[0]) {
                headers.forEach((h) => {
                    if(typeof h === "string") {
                        if((h.includes("{") && h.includes("}")) || (h.includes("[") && h.includes("]"))) {
                            for(const [key, value] of Object.entries(JSON.parse(h))) {
                                rawheaders = {...rawheaders, [key]: value};
                            }
                        } else {
                            const parts = h.split(h.includes(": ") ? ": " : ":");
                            if(parts[1].includes("{") && parts[1].includes("}")) {
                                rawheaders[parts[0]] = JSON.parse(parts[1]);
                            } else {
                                rawheaders[parts[0]] = parts[1];
                            }
                        }
                    } else {
                        rawheaders = {...rawheaders, ...h};
                    }
                })
            }
        } catch (e) {
            rawheaders = undefined;
        }

        let body = this.GetInputValue("body", cache);
        let rawbody = {};
        try {
            if(body[0]) {
                body.forEach((b) => {
                    if(typeof b === "string") {
                        if((b.includes("{") && b.includes("}")) || (b.includes("[") && b.includes("]"))) {
                            for(const [key, value] of Object.entries(JSON.parse(b))) {
                                rawbody = {...rawbody, [key]: value};
                            }
                        } else {
                            const parts = b.split(b.includes(": ") ? ": " : ":");
                            if(parts[1].includes("{") && parts[1].includes("}")) {
                                rawbody[parts[0]] = JSON.parse(parts[1]);
                            } else {
                                if(parts[1] === "true" || parts[1] === "false" || parts[1] === "null" || !isNaN(parts[1])) {
                                    rawbody[parts[0]] = JSON.parse(parts[1]);
                                } else {
                                    rawbody[parts[0]] = parts[1];
                                }
                            }
                        }
                    } else {
                        rawbody = {...rawbody, ...b};
                    }
                })
            }
        } catch (e) {
            rawbody = undefined;
        }
        const method = this.GetOptionValue("method_type", cache);
        const return_type = this.GetOptionValue("return_type", cache);


        const axios = require("axios");
        axios({
            method: method,
            url: url,
            headers: rawheaders ?? undefined,
            data: rawbody ?? undefined,
            responseType: return_type === "buffer" ? "arraybuffer" : return_type === "attachment" ? "arraybuffer" : undefined,
            validateStatus: () => true,
            timeout: this.GetOptionValue("timeout", cache)
        }).then(response => {
            this.StoreOutputValue(response.status, "status", cache);
            this.StoreOutputValue(response.headers, "headers", cache);
            if(return_type === "json") {
                this.StoreOutputValue(response.data, "data", cache);
            } else if(return_type === "buffer") {
                this.StoreOutputValue(Buffer.from(response.data), "data", cache);
            } else if(return_type === "attachment") {
                this.StoreOutputValue(new AttachmentBuilder(Buffer.from(response.data, "base64")), "data", cache);
            }
            this.RunNextBlock("action", cache);
        }).catch(err => {
            console.log(err)
        })
    }
}