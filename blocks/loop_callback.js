module.exports = {
    name: "Loop Callback",

    description: "Used for Continuing a Loop with a Callback. DO NOT USE THIS BLOCK ALONE! CONNECT TO 'Better Loop List (With Callback)' BLOCK!",

    category: "List Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "loopblockdata",
            "name": "Loop Block Data",
            "description": "Type: Object\n\nDescription: CONNECT TO CALLBACK BLOCK ONLY! DO NOT USE THIS OUTPUT FOR ANYTHING ELSE!",
            "types": ["object"]
        }
    ],

    options: [],

    outputs: [],

    async code(cache, DBB) {
        const block = this.GetInputValue("loopblockdata", cache);

        try {
            if (block.name in DBB.Blocks.cache) {
                await require("./" + block.name + ".js").callbackloop(block, DBB)
            } else {
                DBB.Core.end({
                    message:
                        'The block "' +
                        block.name +
                        '" does not exist in the "blocks" folder. Update the blocks by going to "Project" menu -> "Update Blocks Folder" in Discord Bot Builder.',
                })
            }
        } catch (err) {
            DBB.Core.end(
                {
                    message:
                        '\n______________________________________\n\n ERROR:\n\n Workspace:' +
                        (isNaN(block.workspace)
                            ? ''
                            : ' ' + DBB.Data.workspaces[block.workspace].info.title) +
                        (isNaN(block.workspace)
                            ? ''
                            : ' [#' + (parseInt(block.workspace) + 1) + ']') +
                        '\n Block:' +
                        ('name' in block ? ' ' + block.name : '') +
                        (isNaN(block.index)
                            ? ''
                            : ' [#' + (parseInt(block.index) + 1) + ']') +
                        '\n\n \u2193 The error will be displayed below \u2193\n\n______________________________________\n',
                    error: err,
                },
                true
            )
        }
    }
}