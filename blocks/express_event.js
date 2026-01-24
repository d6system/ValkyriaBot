module.exports = {
    name: "Express Event [Event]",

    description: "Starts a Express Server and accepts Requests... (What you call API) Default Port: 3000",

    category: "Express",

    auto_execute: true,

    inputs: [],

    options: [
        {
            "id": "path",
            "name": "Path",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The Path that is going to be accessible to the API and will run this Block.\n\nDefault: '/'\n\nYou can use /status to build a Status reply.",
            "type": "text"
        },
        {
            "id": "method",
            "name": "The Connection Method",
            "description": "Description: The Type for the User to do the request: get, post, delete, put",
            "type": "SELECT",
            "options": {
                "get": "GET",
                "post": "POST",
                "put": "PUT",
                "delete": "DELETE"
            }
        },
        {
            "id": "port",
            "name": "Port",
            "description": "Acceptable Types: Number, Unspecified\n\nDescription: The Port that the Express Server will be running on.\n\nDefault: 3000",
            "type": "number",
            "defaultValue": 3000
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
            "id": "req",
            "name": "Request",
            "description": "Type: Object\n\nDescription: The Request Object that you can work with!",
            "types": ["object", "unspecified"]
        },
        {
            "id": "res",
            "name": "Response",
            "description": "Type: Object\n\nDescription: The Response that includes important Data!",
            "types": ["object", "unspecified"]
        },
        {
            "id": "headers",
            "name": "Headers",
            "description": "Type: Object\n\nDescription: The Headers, incase there are any...",
            "types": ["object", "unspecified"]
        },
        {
            "id": "body",
            "name": "Body",
            "description": "Type: Object\n\nDescription: The Body, incase there is one.",
            "types": ["object", "unspecified"]
        }
    ],

    async init(DBB, blockName) {
        if (!DBB.Core.Dependencies) DBB.Core.Dependencies = {};
        if (!DBB.Core.Dependencies.Express) DBB.Core.Dependencies.Express = {};
        
        const packageManager = require('./!auto_package_manager').getPackageManager();

        try {
            // Wait for package installation to complete before proceeding
            await packageManager?.requires({ name: "express", version: "latest" });
        } catch (e) {
            console.log("Failed to install dependencies! (Express Event)");
            console.log(e);
            return; // Don't proceed if installation failed
        }
        
        const module = require("express");
        const express = require('express');
        const app = express();
        app.use(express.json({
            type: "application/json"
        }));
        let started = false;
        let port = 3000;
        DBB.Core.Dependencies.Express = {
            module,
            app,
            started,
            port
        };
    },

    code(cache, DBB) {
        let i = setInterval(() => {
            if (DBB.Core.Dependencies.Express.app) {
                clearInterval(i);
                run(cache, DBB);
            }
        })

        const run = (cache, DBB) => {
            let e = DBB.Core.Dependencies.Express;
            const port = this.GetOptionValue("port", cache);
            const app = e.app;
            if (!e.started) {
                app.listen(port !== e.port ? port : e.port)
                e.started = true;
                this.console("INFO", "Express Server Started! Port: " + (port !== e.port ? port : e.port));
            }
            const pathsInput = this.GetOptionValue("path", cache) || "/";
            const paths = pathsInput.split(',').map(p => p.trim());
            const method = this.GetOptionValue("method", cache);
            paths.forEach(path => {
                switch (method) {
                    case "get":
                        app.get(path, (req, res) => {
                            this.StoreOutputValue(req.headers, "headers", cache);
                            this.StoreOutputValue(req, "req", cache);
                            this.StoreOutputValue(res, "res", cache);
                            this.RunNextBlock("action", cache);
                        });
                        break;
                    case "post":
                        app.post(path, (req, res) => {
                            this.StoreOutputValue(req.headers, "headers", cache);
                            this.StoreOutputValue(req.body, "body", cache);
                            this.StoreOutputValue(req, "req", cache);
                            this.StoreOutputValue(res, "res", cache);
                            this.RunNextBlock("action", cache);
                        });
                        break;
                    case "put":
                        app.put(path, (req, res) => {
                            this.StoreOutputValue(req.headers, "headers", cache);
                            this.StoreOutputValue(req.body, "body", cache);
                            this.StoreOutputValue(req, "req", cache);
                            this.StoreOutputValue(res, "res", cache);
                            this.RunNextBlock("action", cache);
                        });
                        break;
                    case "delete":
                        app.delete(path, (req, res) => {
                            this.StoreOutputValue(req.headers, "headers", cache);
                            this.StoreOutputValue(req.body, "body", cache);
                            this.StoreOutputValue(req, "req", cache);
                            this.StoreOutputValue(res, "res", cache);
                            this.RunNextBlock("action", cache);
                        });
                        break;
                }
            })
        }
    }
}