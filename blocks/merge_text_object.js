module.exports = {
    name: "Merge Texts from Object",

    description: "Merges multiple texts into a single text using object Keys/Values.",

    category: "Extras",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "text",
            "name": "Source Text",
            "description": "Acceptable Types: Text, Undefined, Null, Object, Boolean, Date, Number, List, Unspecified\n\nDescription: The text to merge with the source text. Supports everything (converts to text automatically). (OPTIONAL)",
            "types": ["text", "undefined", "null", "object", "boolean", "date", "number", "list", "unspecified"]
        },
        {
            "id": "object",
            "name": "Object",
            "description": "Acceptable Types: Object, List, Unspecified\n\nDescription: The object where to get your values from.\n\nYou can merge several objects. But take in mind if you have repeated keys; they will overwrite.",
            "types": ["object", "list", "unspecified"],
            "multiInput": true
        }        
    ],

    options: [
        {
            "id": "text",
            "name": "Source Text",
            "description": "Description: The source text to add the Text. Use the folowing codes to implement the Text: \"${keyname}\", \"${keyname.nestedkey}\", \"${keyname.nestedkey.anothernestedkey}\".",
            "type": "TEXT"
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
            "id": "text",
            "name": "Text",
            "description": "Type: Text\n\nDescription: The text merged.",
            "types": ["text", "unspecified"]
        }
    ],

    code(cache) {
        const original = this.GetInputValue("text", cache) || this.GetOptionValue("text", cache);
        const objects = this.GetInputValue("object", cache);        
        let object;           
        
        if(objects.length == 1){
            if(Array.isArray(objects[0])){
                object = Object.assign({}, ...objects[0]);
            }else{object = objects[0];}
        }else{
            object = Object.assign({}, ...objects);
        }
        
        const newText = original.replace(/\${([^\s{}]+)}/g, function(match, key) {
            const keys = key.split('.');            
            let value = object;
            for (const k of keys) {
              if (value.hasOwnProperty(k)) {
                value = value[k];
              } else {
                return "";
              }
            }            
            return value;
          });                

        this.StoreOutputValue(newText, "text", cache);
        this.RunNextBlock("action", cache);
    }
}