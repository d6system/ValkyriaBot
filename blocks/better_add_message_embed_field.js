module.exports = {
    name: "Better Add Message Embed Field",

    description: "Adds a field to the message embed.",

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
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The message embed to add this field.",
            "types": ["object", "unspecified"],
            "required": true
        },
        {
            "id": "field_name",
            "name": "Field Name",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The field name to add to the message embed. Default: Blank. (OPTIONAL)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "field_value",
            "name": "Field Value",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The field value to add to the message embed. Default: Blank. (OPTIONAL)",
            "types": ["text", "number", "unspecified"]
        },
        {
            "id": "field_inline",
            "name": "Field Inline",
            "description": "Acceptable Types: Boolean, Unspecified\n\nDescription: The field inline to display to the message embed. Default: \"false\". (OPTIONAL)",
            "types": ["boolean", "unspecified"]
        },
        {
            "id": "custom_position",
            "name": "Custom Position",
            "description": "Acceptable Types: Number, Unspecified\n\nDescription: The custom position to add this field to the message embed. Starts at \"1\". (Only use this input if you selected the option \"Custom Position\")",
            "types": ["number", "text", "unspecified"]
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
            "id": "position_type",
            "name": "Position Type",
            "description": "Description: The position to add this field to the message embed.",
            "type": "SELECT",
            "options": {
                "last": "Last Position",
                "first": "First Position",
                "random": "Random Position",
                "custom": "Custom Position"
            }
        },
        {
            "id": "field_name",
            "name": "Field Name",
            "description": "Description: The field name to add to the message embed. Default: Blank. (OPTIONAL)",
            "type": "TEXT"
        },
		{
            "id": "field_value",
            "name": "Field Value",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The field value to add to the message embed. Default: Blank. (OPTIONAL)",
            "type": "TEXT"
        },		
		{
            "id": "field_inline",
            "name": "Field Inline",
            "description": "Description: The field inline to display to the message embed. Default: \"false\". (OPTIONAL)",
            "type": "CHECKBOX",
            "defaultValue": false
        },
		{
            "id": "custom_position",
            "name": "Custom Position",
            "description": "Description: The custom position to add this field to the message embed. Starts at \"1\". (Only use this input if you selected the option \"Custom Position\")",
            "type": "NUMBER"
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
            "description": "Type: Object\n\nDescription: The message embed with this field added.",
            "types": ["object"]
        }
    ],

    code(cache) {
        const message_embed = this.GetInputValue("message_embed", cache);
        const position_type = this.GetOptionValue("position_type", cache) + "";

        const field_name_input = this.GetInputValue("field_name", cache, false, "\u200b") + "";
        const field_value_input = this.GetInputValue("field_value", cache, false, "\u200b") + "";

        const field_name_option = this.GetOptionValue("field_name", cache, false) !== '' ? this.GetOptionValue("field_name", cache) : "\u200b";
        const field_value_option = this.GetOptionValue("field_value", cache, false) !== '' ? this.GetOptionValue("field_value", cache) : "\u200b";   

        const field_inline = this.GetInputValue("field_inline", cache) || this.GetOptionValue("field_inline", cache);  

        const custom_position = parseInt(this.GetInputValue("custom_position", cache)) || parseInt(this.GetOptionValue("custom_position", cache));

        const field_name_transform = field_name_input !== "\u200b" ? field_name_input : field_name_option;
        const field_value_transform = field_value_input !== "\u200b" ? field_value_input : field_value_option;

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

            const transform_texts_name =
            field_name_transform.replace(/\${text(\d+)}/g, function(match, number) {
                return String(variables[number - 1] || match);
            }).replace(/\\n/g, '\n') 

            const transform_texts_value =
            field_value_transform.replace(/\${text(\d+)}/g, function(match, number) {
                return String(variables[number - 1] || match);
            }).replace(/\\n/g, '\n') 

            const transform_keys_name = transform_texts_name.replace(/\${([^\s{}]+)}/g, function(match, key) {
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

            const transform_keys_value = transform_texts_value.replace(/\${([^\s{}]+)}/g, function(match, key) {
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

            function truncateString(str, maxLength) {
                if (str.length > maxLength) {
                    return str.slice(0, maxLength); // Extract characters from index 0 to maxLength-1
                }
                return str;
            }

            var field_name_split = transform_keys_name;
            var field_value_split = transform_keys_value;

            let field_name = truncateString(field_name_split, 256);
            let field_value = truncateString(field_value_split, 1024);

        switch(position_type) {
            case "first":
                message_embed.spliceFields(0, 0, {
                    name: field_name,
                    value: field_value,
                    inline: field_inline
                });
                break;
            default:
            case "last":
                message_embed.addFields({
                    name: field_name,
                    value: field_value,
                    inline: field_inline
                });
                break;
            case "random":
                message_embed.spliceFields(
                    message_embed.data.fields ? Math.round(Math.random() * message_embed.data.fields.length) : 0,
                    0,
                    {
                        name: field_name,
                        value: field_value,
                        inline: field_inline
                    }
                );
                break;
                case "custom": { 
                    if (isNaN(custom_position)){
                        message_embed.spliceFields(Math.max(0, 1 - 1), 0, {
                            name: field_name,
                            value: field_value,
                            inline: field_inline
                        });
                    }else{
                    message_embed.spliceFields(Math.max(0, custom_position - 1), 0, {
                        name: field_name,
                        value: field_value,
                        inline: field_inline
                    });
                }
                    break;                
            }
        }

        this.StoreOutputValue(message_embed, "message_embed", cache);
        this.RunNextBlock("action", cache);


    }
}