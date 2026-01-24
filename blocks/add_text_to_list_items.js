module.exports = {
    name: "Add Text to List Items",

    description: "Adds custom text to every item in a list.",

    category: "List Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "list",
            "name": "List",
            "description": "Acceptable Types: List, Unspecified\n\nDescription: The list to get your items.",
            "types": ["list", "unspecified"],
            "required": true
        },
        {
            "id": "before",
            "name": "Before Text",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: Text before every item.",
            "types": ["text", "number", "unspecified"]
        },
        {
            "id": "after",
            "name": "After Text",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: Text after every item.",
            "types": ["text", "number", "unspecified"]
        },
        {
            "id": "order",
            "name": "Reverse",
            "description": "Description: Choose the order [1-2-3] or [3-2-1] for example.",
            "types": ["boolean", "unspecified"]
        }
    ],

    options: [        
        {
            "id": "auto",
            "name": "Auto Append",
            "description": "Description: Add automatic values at the beggining of your list items.",
            "type": "SELECT",
            "options": {
                "none": "None",
                "numeric": "Numeric [1-9]",
                "roman": "Numeric Roman [I-X]",
                "emoji": "Numeric Emoji [1️⃣-9️⃣]",
                "alpha": "Alphabetical [a-z]",
                "alpha2": "Alphabetical [A-Z]"
            }
        },
        {
            "id": "order",
            "name": "Reverse?",
            "description": "Description: Choose the order [1-2-3] or [3-2-1] for example.",
            "type": "CHECKBOX",
            "defaultValue": false
        },
        {
            "id": "before",
            "name": "Before Text",
            "description": "Description: Text before every item.",
            "type": "text"
        },
        {
            "id": "after",
            "name": "After Text",
            "description": "Description: Text after every item.",
            "type": "text"
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
            "id": "list",
            "name": "List",
            "description": "Type: List\n\nDescription: The list with the new items.",
            "types": ["list", "unspecified"]
        }
    ],

    code(cache) {
        const append = this.GetInputValue("list", cache);
        var before = this.GetInputValue("before", cache) || this.GetOptionValue("before", cache);
        const after = this.GetInputValue("after", cache) || this.GetOptionValue("after", cache);
        const auto = this.GetOptionValue("auto", cache);
        const order = this.GetInputValue("order", cache) || this.GetOptionValue("order", cache);      

        let change;
        switch(auto) {
            case "none":  
                break;
            case "numeric":
                change = "numeric";
                break;            
            case "roman":
                change = "roman";
                break;
            case "emoji":
                change = "emoji";
                break;
            case "alpha":
                change = "az";
                break;
            case "alpha2":
                change = "AZ";
                break;
        }

        function toRoman(num) {
            const romanNumerals = {
                M: 1000,
                CM: 900,
                D: 500,
                CD: 400,
                C: 100,
                XC: 90,
                L: 50,
                XL: 40,
                X: 10,
                IX: 9,
                V: 5,
                IV: 4,
                I: 1
            };
            let roman = '';
            for (let i in romanNumerals) {
                while (num >= romanNumerals[i]) {
                    roman += i;
                    num -= romanNumerals[i];
                }
            }
            return roman;
        }

        function toEmojiNumeral(num) {
            const emojiNumerals = {
                0: '0️⃣',
                1: '1️⃣',
                2: '2️⃣',
                3: '3️⃣',
                4: '4️⃣',
                5: '5️⃣',
                6: '6️⃣',
                7: '7️⃣',
                8: '8️⃣',
                9: '9️⃣'
            };
            let emojiNumeral = '';
            const numStr = num.toString();
            for (let i = 0; i < numStr.length; i++) {
                emojiNumeral += emojiNumerals[numStr[i]];
            }
            return emojiNumeral;
        }
        
        var list = [];
        let position;
        let item;
        let startat;
        for (const [index, value] of Object.entries(append)) {
            if(order == false){
                startat = (parseInt(index) + 1);
            }else{
                startat = ((append.length)-parseInt(index));
            }

            before = before ? before : ". ";

            if (change == "numeric") {
                position = startat + before;
                item = position + value + after;                
            }else if (change == "roman"){
                position = toRoman(startat) + before;
                item = position + value + after;
            }else if (change == "emoji"){
                position = toEmojiNumeral(startat) + before;
                item = position + value + after;
            }else if (change == "az"){
                position = String.fromCharCode(97 + (startat-1)) + before;
                item = position + value + after; 
            }else if (change == "AZ"){
                position = String.fromCharCode(65 + (startat-1)) + before;
                item = position + value + after; 
            }else{
                item = before + value + after;
            }
            list.push(item);            
        }     

        this.StoreOutputValue(list, "list", cache);
        this.RunNextBlock("action", cache);        
    }
}