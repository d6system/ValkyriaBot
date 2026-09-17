module.exports = {
    name: "Better Loop List (With Callback)",

    description: "Loops the list. For each item in the list, this will return its position number and value. With the added possibility of a delay between each loop",

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
            "description": "Acceptable Types: List, Unspecified\n\nDescription: The list to loop.",
            "types": ["list", "unspecified"],
            "required": true
        }
    ],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action (Loop)",
            "description": "Type: Action\n\nDescription: Executes the following blocks for each item in the list.",
            "types": ["action"]
        },
        {
            "id": "action2",
            "name": "Action (Finish)",
            "description": "Type: Action\n\nDescription: Executes the following blocks for each item in the list.",
            "types": ["action"]
        },
        {
            "id": "index",
            "name": "Position Number",
            "description": "Type: Number\n\nDescription: The item's position number in the list. Starts at \"0\".",
            "types": ["number"]
        },
        {
            "id": "value",
            "name": "Item Value",
            "description": "Type: Unspecified\n\nDescription: The value of the list item.",
            "types": ["unspecified"]
        },
        {
            "id": "loopblockdata",
            "name": "Loop Block Data",
            "description": "Type: Object\n\nDescription: CONNECT TO CALLBACK BLOCK ONLY! DO NOT USE THIS OUTPUT FOR ANYTHING ELSE!",
            "types": ["object"]
        }
    ],

    callbackloop(cache, DBB) {
        if (cache._index >= cache._array.length) return DBB.Blocks.Core.RunNextBlock("action2", cache)
        DBB.Blocks.Core.StoreOutputValue(cache._index, "index", cache);
        DBB.Blocks.Core.StoreOutputValue((cache._array)[cache._index], "value", cache);
        DBB.Blocks.Core.StoreOutputValue(cache, "loopblockdata", cache);
        cache._index++;
        DBB.Blocks.Core.RunNextBlock("action", cache);
    },

    code(cache, DBB) {
        let list = this.GetInputValue("list", cache);
        let i = 0;

        if (i >= list.length) return DBB.Blocks.Core.RunNextBlock("action2", cache)
        DBB.Blocks.Core.StoreOutputValue(i, "index", cache);
        DBB.Blocks.Core.StoreOutputValue(list[i], "value", cache);
        i++;
        cache._array = list;
        cache._index = i;
        DBB.Blocks.Core.StoreOutputValue(cache, "loopblockdata", cache);
        DBB.Blocks.Core.RunNextBlock("action", cache);
    }
}