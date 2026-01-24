module.exports = {
    name: "Better Edit Message Embed",

    description: "Edits the embed to insert into a message.",

    category: "Message Embed Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "message_embed",
            "name": "Message Embed",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The message embed to edit.",
            "types": ["object", "unspecified"],
            "required": true
        },
        {
            "id": "color",
            "name": "Color",
            "description": "Acceptable Types: Text, Number, Unspecified\n\nDescription: The new color for this message embed. (OPTIONAL)",
            "types": ["text", "number", "unspecified"]
        },
        {
            "id": "thumbnail",
            "name": "Thumbnail URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The new thumbnail URL for this message embed. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "author_icon",
            "name": "Author Icon URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The new author icon URL for this message embed. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "author_name",
            "name": "Author Name",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The new author name for this message embed. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "author_url",
            "name": "Author URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The new author URL for this message embed. This requires the embed author name to highlight it! (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "title",
            "name": "Title",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The new title for this message embed. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "url",
            "name": "URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The new URL for this message embed. This requires the embed title to highlight it! (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "description",
            "name": "Description",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The new description for this message embed. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "image",
            "name": "Image URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The new image URL for this message embed. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "footer_icon",
            "name": "Footer Icon URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The new footer icon URL for this message embed. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "footer_text",
            "name": "Footer Text",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The new footer text for this message embed. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "timestamp",
            "name": "Timestamp (Date)",
            "description": "Acceptable Types: Date, Number, Unspecified\n\nDescription: The new timestamp (Date) for this message embed. If a boolean as \"true\", this uses the current time. (OPTIONAL)",
            "types": ["date", "number", "boolean", "unspecified"]
        },
        {
            "id": "object",
            "name": "Object",
            "description": "Acceptable Types: Object, List.\n\nDescription: The object(s) where to get your values from.\n\nYou can merge several objects. But take in mind if you have repeated keys; they will overwrite.",
            "types": ["object", "list", "unspecified"],
            "multiInput": true
        },
        {
            "id": "text",
            "name": "Text",
            "description": "Acceptable Types: Text, Undefined, Null, Object, Boolean, Date, Number, List, Unspecified\n\nDescription: The text to merge with the source text. Supports everything (converts to text automatically). (OPTIONAL)",
            "types": ["text", "undefined", "null", "object", "boolean", "date", "number", "list", "unspecified"],
            "multiInput": true
        }
    ],

    options: [           
        {
            "id": "color",
            "name": "Color",
            "description": "Description: Thumbnail.",
            "type": "COLOR"
        },
        {
            "id": "thumbnail",
            "name": "Thumbnail URL",
            "description": "Description: Thumbnail.",
            "type": "TEXT"
        },
		{
            "id": "author_icon",
            "name": "Author Icon URL",
            "description": "Description: Author Icon URL",
            "type": "TEXT"
        },		
		{
            "id": "author_name",
            "name": "Author Name",
            "description": "Description: Author Name.",
            "type": "TEXT"
        },		
		{
           "id": "author_url",
            "name": "Author URL",
            "description": "Description: Author URL.",
            "type": "TEXT"
        },
		{
            "id": "title",
            "name": "Title",
            "description": "Description: Title.",
            "type": "TEXT"
        },		
		{
            "id": "url",
            "name": "URL",
            "description": "Description: URL.",
            "type": "TEXT"
        },		
		{
            "id": "description",
            "name": "Description",
            "description": "Description: Description.",
            "type": "TEXT"
        },
		{
            "id": "image",
            "name": "Image URL",
            "description": "Description: Image URL.",
            "type": "TEXT"
        },		
		{
            "id": "footer_icon",
            "name": "Footer Icon URL",
            "description": "Description: Footer Icon.",
            "type": "TEXT"
        },			
		{
            "id": "footer_text",
            "name": "Footer Text",
            "description": "Description: Footer Text.",
            "type": "TEXT"
        },			
		{
            "id": "timestamp",
            "name": "Timestamp (Date)",
            "description": "Description: The timestamp (Date) for this message embed.\nTrue: Adds/Keeps timestamp // False: Removes timestamp.",
            "type": "SELECT",
            "options": {   
                "inherit": "No Change",
                "true": "True",             
                "false": "False",
            }
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
            "id": "message_embed",
            "name": "Message Embed",
            "description": "Type: Object\n\nDescription: This message embed edited.",
            "types": ["object"]
        }
    ],

    code: function(cache) {
        const { EmbedBuilder, time } = require('discord.js');
        var message_embed = this.GetInputValue("message_embed", cache);

        const variables = this.GetInputValue("text", cache);
        const objects = this.GetInputValue("object", cache);   
        let object;          
        if(objects.length == 1){
            if(Array.isArray(objects[0])){
                object = Object.assign({}, ...objects[0]);
            }else{object = objects[0];}
        }else{
            object = Object.assign({}, ...objects);
        } 

        const color_input = this.GetInputValue("color", cache, false, "#2f3136");     
        const color_option = this.GetOptionValue("color", cache) !== "#000000" ? this.GetOptionValue("color", cache) : null;
        const color = color_input !== "#2f3136" ? color_input : color_option;       

        const thumbnail_url = this.GetInputValue("thumbnail", cache) || this.GetOptionValue("thumbnail", cache, false, undefined);
        const author_icon = this.GetInputValue("author_icon", cache) || this.GetOptionValue("author_icon", cache, false, undefined);
        const author_name = this.GetInputValue("author_name", cache) || this.GetOptionValue("author_name", cache, false, undefined);
        const author_url = this.GetInputValue("author_url", cache) || this.GetOptionValue("author_url", cache, false, undefined);
        const title = this.GetInputValue("title", cache) || this.GetOptionValue("title", cache, false, undefined);
        const title_url = this.GetInputValue("url", cache) || this.GetOptionValue("url", cache, false, undefined);
        const description = this.GetInputValue("description", cache) || this.GetOptionValue("description", cache, false, undefined);
        const image_url = this.GetInputValue("image", cache) || this.GetOptionValue("image", cache, false, undefined);
        const footer_icon = this.GetInputValue("footer_icon", cache) || this.GetOptionValue("footer_icon", cache, false, undefined);
        const footer_text = this.GetInputValue("footer_text", cache) || this.GetOptionValue("footer_text", cache, false, undefined);

        var timestamp = this.GetInputValue("timestamp", cache) || this.GetOptionValue("timestamp", cache);              

        let footer = {};
        if (footer_text) {footer.text = footer_text}
        if (footer_icon) {footer.iconURL = footer_icon}

        let author = {};
        if (author_name) {author.name = author_name}
        if (author_icon) {author.iconURL = author_icon}
        if (author_url) {author.url = author_url}

        let image = {}
        if(image_url) image.url = image_url;

        let thumbnail = {}
        if(thumbnail_url) thumbnail.url = thumbnail_url;

        let embedConstructor = {};
        if(author_icon || author_name || author_url) embedConstructor.author = author;
        if(title) embedConstructor.title = (title || "\u200b");
        if(title_url) embedConstructor.url = (title_url || "\u200b");
        if(description) embedConstructor.description = (description || "\u200b");        
        if(image_url) embedConstructor.image = (image || "\u200b");
        if(thumbnail_url) embedConstructor.thumbnail = (thumbnail || "\u200b");
        if(footer_icon || footer_text) embedConstructor.footer = (footer);

        const string = JSON.stringify(embedConstructor);

        const transform_texts =
            string.replace(/\${text(\d+)}/g, function(match, number) {
                return String(variables[number - 1] || match);
            }).replace(/\n/g, '\\n')

            const transform_keys = transform_texts.replace(/\${([^\s{}]+)}/g, function(match, key) {
                const keys = key.split('.');            
                let value = object;
                for (const k of keys) {
                  if (value.hasOwnProperty(k)) {
                    value = value[k]
                    if (typeof value === 'string') {
                            value = (value.replace(/\n/g, '\\n')).replace(/"/g, '\\"');
                    }                
                  } else {
                    return "";
                  }
                }            
                return value;
            });

        
        const EmbedEdited = JSON.parse(transform_keys); 
        
        if(!message_embed.data){
            message_embed = EmbedBuilder.from(message_embed);
            message_embed.data = {
                ...message_embed.data,
                ...EmbedEdited
            }
        }else{
            message_embed.data ={
                ...message_embed.data,
                ...EmbedEdited
            }
        }
        
        if (color) message_embed.setColor(color);
        if (timestamp == true || timestamp == "true"){
            timestamp = undefined;
            message_embed.setTimestamp(timestamp);
        }
        else if(timestamp == false || timestamp == "false"){  
            message_embed.setTimestamp(null);
        }else{}
        
        this.StoreOutputValue(message_embed, "message_embed", cache);        
        this.RunNextBlock("action", cache);
    }
}