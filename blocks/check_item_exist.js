module.exports = {
    name: "Check if item exist",
    description: "Check if an item exists in a list.",
    category: "List Stuff",
    inputs: [
        {
            id: "action",
            name: "Action",
            description: "You must be stupid if you don't know this already",
            types: ["action"]
        },
        {
            id: "inputvalue",
            name: "Input Value",
            description: "The value to check for in the list.",
            types: ["text", "object", "unspecified"]
        },
        {
            id: "list",
            name: "List",
            description: "The list to search for the input value.",
            types: ["list", "unspecified"]
        }
    ],
    options: [
        {
            id: "inputvalue2",
            name: "Input Value",
            description: "The value to check for in the list.",
            type: "text"
        }
    ],
    outputs: [
        {
            id: "action",
            name: "Action if true",
            description: "You must be stupid if you don't know this already",
            types: ["action"]
        },
        {
            id: "action2",
            name: "Action if false",
            description: "You must be stupid if you don't know this already",
            types: ["action"]
        },
        {
            id: "item",
            name: "Item/value",
            description: "The item or value you checked for. ONLY WORKS IF ITEM EXIST!",
            type: ["unspecified"]
        },
        {
            id: "pos",
            name: "Position Number",
            description: "The position of the item in the list.",
            types: ["number"]
        }
    ],
    code(cache) {
        let inputValue = this.GetInputValue("inputvalue", cache);
        let list = this.GetInputValue("list", cache);
        let optionValue = this.GetOptionValue("inputvalue2", cache);

        // Check if input values are not empty, prioritizing inputs first
        if (!inputValue) {
            inputValue = optionValue;
        }

        // Check if list is not empty
        if (!list || !Array.isArray(list)) {
            throw new Error("Invalid or empty list provided.");
        }

        // Function to check if an item exists in a list
        function itemExists(inputValue, list) {
            return list.includes(inputValue);
        }

        // Check if the item exists in the list and get its position
        const exists = itemExists(inputValue, list);
        const pos = list.indexOf(inputValue);

        // Store the position in the "pos" output
        this.StoreOutputValue(pos, "pos", cache);

        // Determine which action to trigger based on existence
        if (exists) {
            const item = list[pos];
            this.StoreOutputValue(item, "item", cache)
            this.RunNextBlock("action", cache);
        } else {
            this.RunNextBlock("action2", cache);
        }
    }
};