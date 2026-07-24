module.exports = {
    name: "Better Send Message",

    description: "Sends a message with Components + Merge Text.",

    category: "Component Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "channel",
            name: "Channel / Message",
            description: "Acceptable Types: Object, Unspecified\n\nDescription: The text channel or DM channel to send this message.",
            types: ["object", "list", "unspecified"],
            required: true
        },
        {
            id: "poll",
            name: "Poll",
            description: "Acceptable Types: Object, Unspecified\n\nDescription: The text channel or DM channel to send this message.",
            types: ["object", "unspecified"]
        },
        {
            id: "file",
            name: "Attachment",
            description: "Acceptable Types: Object, Text, List, Unspecified\n\nDescription: The attachment to put in the message. Supports Image, file path and URL. (OPTIONAL)",
            types: ["object", "text", "list", "unspecified"],
            multiInput: true
        },
        {
            id: "embed",
            name: "Embed",
            description: "Acceptable Types: Object, List, Unspecified\n\nDescription: The embed(s) to add to the message.",
            types: ["object", "list", "unspecified"],
            multiInput: true
        },
        {
            id: "row",
            name: "Components",
            description: "Acceptable Types: Object, List, Unspecified\n\nDescription: The 1st Action Row to send",
            types: ["object", "list", "unspecified"],
            multiInput: true
        },
        {
            id: "text",
            name: "Text",
            description: "Acceptable Types: Text, Undefined, Null, Object, Boolean, Date, Number, List, Unspecified\n\nDescription: The text 1 to merge with the source text. Supports everything (converts to text automatically). (OPTIONAL)",
            types: ["text", "undefined", "null", "object", "boolean", "date", "number", "list", "unspecified"],
            multiInput: true
        }      
    ],

    options: [
        {
            id: "type",
            name: "Send / Reply",
            description: "Description: The type of message to send.",
            type: "SELECT",
            options: {
                "send": "Send in Channel",
                "reply": "Reply to Message"
            }
        },
        {
            id: "silent",
            name: "Silent Message",
            description: "Description: Prevents users from getting a notification.",
            type: "SELECT",
            options: {
                undefined: "False",
                "true": "True"
            }
        },
        {
            id: "text",
            name: "Source Text",
            description: "Description: The text to add to your message. Use the folowing codes to implement the Text Variables: \"${text1}\", \"${text2}\", \"${text3}\".",
            type: "TEXT"
        }
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "message",
            name: "Message",
            description: "Description: The message that was sent.",
            types: ["object", "list", "unspecified"]
        },
        {
            id: "error",
            name: "Error",
            description: "Type: Object, List\n\nDescription: Error.",
            types: ["text"]
        }
    ],

    async code(cache) {
        
        const { ActionRowBuilder, MessageFlags } = require('discord.js');

        const channel = this.GetInputValue("channel", cache);
        const poll = this.GetInputValue("poll", cache);

        const text = this.GetOptionValue("text", cache);
        const variables = this.GetInputValue("text", cache);

        const msg =
            text.replace(/\${text(\d+)}/g, function(match, number) {
                return String(variables[number - 1] || match);
            }).replace(/\\n/g, '\n')        
        
        const embeds = this.GetInputValue("embed", cache);
        let embed;
        if(embeds[0] == undefined){
            embed = undefined
        }else{
            embed = embeds;
        }
        if(Array.isArray(embeds[0])){
            embed = embeds[0];
        }                          

        const files = this.GetInputValue("file", cache);
        let file;
        if(files[0] == undefined){
            file = undefined
        }else{
            file = files;
        }
        if(Array.isArray(files[0])){
            file = files[0];
        }   

        const type = this.GetOptionValue("type", cache);
        const silent = this.GetOptionValue("silent", cache);

        const comp = this.GetInputValue("row", cache);
        
        let comps = []
        let Components = [];     
        let components        
        let flags;
        if (silent === "true") {
            flags = MessageFlags.SuppressNotifications;
        }        
        
        for (const [index, value] of comp.entries()) {
            if(value && Array.isArray(value)) {
                components = new ActionRowBuilder()
                await value.forEach(element => {
                    components.addComponents(element)
                });
            } else if(value) {
                components = new ActionRowBuilder().addComponents(value)
            }
            Components.push(components)
        }

        Components.forEach(element => {
            if(element) {
                comps.push(element)
            }
        });
        
        comps = comps.filter(comp => comp)
        if(comps.length > 5) {
            comps.pop()
        }

        if(type == "send") {
            channel.send({ flags: flags, poll: poll, content: msg ? msg : undefined, embeds: embed ? Array.isArray(embed) ? embed : [embed] : undefined, files: file ? Array.isArray(file) ? file : [file] : undefined, components: comps ? comps : undefined}).then( msg => {
                this.StoreOutputValue(msg, "message", cache);
                this.RunNextBlock("action", cache);
                return
            }).catch(error => {
            this.StoreOutputValue(error.message, "error", cache);
            this.RunNextBlock("action", cache);
        });

        } else {
            channel.reply({ flags: flags, poll: poll, content: msg ? msg : undefined, embeds: embed ? Array.isArray(embed) ? embed : [embed] : undefined, files: file ? Array.isArray(file) ? file : [file] : undefined, components: comps ? comps : undefined}).then( msg => {
                this.StoreOutputValue(msg, "message", cache);
                this.RunNextBlock("action", cache);
                return
            }).catch(error => {
            this.StoreOutputValue(error.message, "error", cache);
            this.RunNextBlock("action", cache);
        });

        }
    }
}