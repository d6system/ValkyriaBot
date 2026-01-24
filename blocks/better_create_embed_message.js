module.exports = {
    name: "Better Create Message Embed",

    description: "Creates an embed to insert into a message.",

    category: "Message Embed Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "color",
            "name": "Color",
            "description": "Acceptable Types: Text, Number, Unspecified\n\nDescription: The color for this message embed. (OPTIONAL)",
            "types": ["text", "number", "unspecified"]
        },
        {
            "id": "thumbnail",
            "name": "Thumbnail URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The thumbnail URL for this message embed. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "author_icon",
            "name": "Author Icon URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The author icon URL for this message embed. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "author_name",
            "name": "Author Name",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The author name for this message embed. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "author_url",
            "name": "Author URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The author URL for this message embed. This requires the embed author name to highlight it! (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "title",
            "name": "Title",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The title for this message embed. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "url",
            "name": "URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The URL for this message embed. This requires the embed title to highlight it! (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "description",
            "name": "Description",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The description for this message embed. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "image",
            "name": "Image URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The image URL for this message embed. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "footer_icon",
            "name": "Footer Icon URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The footer icon URL for this message embed. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "footer_text",
            "name": "Footer Text",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The footer text for this message embed. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "timestamp_input",
            "name": "Timestamp (Date)",
            "description": "Acceptable Types: Date, Number, Boolean, Unspecified\n\nDescription: The timestamp (Date) for this message embed. If a boolean as \"true\", this uses the current time. (OPTIONAL)",
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
            "id": "timestamp_option",
            "name": "Timestamp (Date)",
            "description": "Acceptable Types: Date, Number, Boolean, Unspecified\n\nDescription: The timestamp (Date) for this message embed. If a boolean as \"true\", this uses the current time. (OPTIONAL)",
            "type": "CHECKBOX",
            "defaultValue": false
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
            "description": "Type: Object\n\nDescription: This message embed created.",
            "types": ["object"]
        }
    ],

    code: function(cache) {
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

        const color = this.GetInputValue("color", cache) || this.GetOptionValue("color", cache, false, undefined);
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

        const timestamp = this.GetInputValue("timestamp_input", cache, undefined) || this.GetOptionValue("timestamp_option", cache);
        
        let author = {};
        if(author_name) author.name = author_name;
        if(author_icon) author.iconURL = author_icon;
        if(author_url) author.url = author_url;

        let footer = {}
        if(footer_icon) footer.iconURL = footer_icon;
        if(footer_text) footer.text = footer_text;

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

        const newEmbed = JSON.parse(transform_keys);

        const {EmbedBuilder} = require("discord.js");
        const message_embed = new EmbedBuilder()        
        message_embed.data = newEmbed;
        message_embed.setColor(color || "#2f3136")
        if(timestamp) message_embed.setTimestamp(timestamp === true ? undefined : timestamp);

        this.StoreOutputValue(message_embed, "message_embed", cache);        
        this.RunNextBlock("action", cache);
        
    }
}