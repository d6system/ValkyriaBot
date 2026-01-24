module.exports = {
    name: "Control Data",

    description: "Set or Get data.",

    category: "Data Stuff",

    inputs(data) {
        return [
            {
                id: "action",
                name: "Action",
                description: "Executes this block.",
                types: ["action"]
            },
            {
                id: "name",
                name: "Name",
                description:
                    "The name for this data.",
                types: ["text", "unspecified"],
                required: false
            },
            ["get"].includes(data?.options?.action_type || "get") ? 
                undefined :
            {
                id: "value",
                name: "Value",
                description:
                    "The value for this data to be replaced with or to be added.",
                types: [
                    "unspecified",
                    "undefined",
                    "null",
                    "object",
                    "boolean",
                    "date",
                    "number",
                    "text",
                    "list"
                ],
                required: false
            },
            ["none"].includes(data?.options?.data_type || "none") ?
                undefined :
            {
                id: "target",
                name: JSON.stringify(data?.options?.data_type).replaceAll(`"`, ``).replace(/^./, match => match.toUpperCase()),
                description:
                    `The ${JSON.stringify(data?.options?.data_type).replaceAll(`"`, ``).replace(/^./, match => match.toUpperCase())} object for the data. Will apply the data to this filter`,
                types: ["object", "text", "unspecified"]
            }
        ]
    },

    options(data) { 
        const options = [
            {
                id: "action_type",
                name: "Action Type",
                description:
                    'The type of action for this data. If "Add", inserted a number in the "Value" input add to the current number in the data or use a negative number to subtract.',
                type: "SELECT",
                options: [
                    {
                        type: "GROUP",
                        name: "Read",
                        description: "Get pre-existing data",
                        options: [
                            {id: "get", name: "Get", description: "Retreive data if it exists"}
                        ]
                    },
                    {
                        type: "GROUP",
                        name: "Write",
                        description: "Set new or update pre-existing data",
                        options: [
                            {id: "set", name: "Set", description: "Store new data or Overwrite any stored data"},
                            {id: "add", name: "Add", description: "Adds the new data to the old. ('1 + 1 = 2', 'test' + 'ing' = 'testing')"}
                        ]
                    }
                ]
            },
            {
                id: "data_type",
                name: "Data Type",
                description:
                    'The type of this data. If not "None", you need to put a value in the "Server/Member/User" input depending on which option you selected here.',
                type: "SELECT",
                options: {
                    none: "None",
                    server: "Server",
                    member: "Member",
                    user: "User"
                }
            },
            {
                id: "name",
                name: "Name",
                description:
                    'The name for this data value.',
                type: "TEXT_LINE",
            },
            ["get"].includes(data?.options?.action_type || "get") ?
                undefined :
            {
                id: "value",
                name: "Value",
                description:
                    'The value for this data to be set to / add.',
                type: "TEXT",
            }
        ]
        return options
    },

    outputs(data) {
        const outputs = [
            {
                id: "action",
                name: "Action",
                description:
                    "Executes the following blocks when this block finishes its task.",
                types: ["action"]
            },               
            {
                id: "output",
                name: "Output",
                description:
                    "The returned value. When 'adding' values, returns the new data",
                types: ["text", "number", "unspecified"]
            } 
        ]

        return outputs        
    },



    async code(cache) {
        const name = this.GetInputValue("name", cache) || this.GetOptionValue("name", cache)
        let value = await isNumber(this.GetInputValue("value", cache) || this.GetOptionValue("value", cache))
        const target = this.GetInputValue("target", cache)
        const action_type = this.GetOptionValue("action_type", cache)
        const data_type = this.GetOptionValue("data_type", cache)

        let id = target
        switch (data_type) {
            case "server":
                id = typeof target == "object" ? target.id : target
                break
            case "user":
                id = typeof target == "object" ? target.id : target
                break
            case "member":
                id = typeof target == "object" ? target.id + target.guild.id : target
                break
        }

        let existing = await isNumber(await this.getData(name, id, data_type))
        
        async function isNumber(value) {
            try {
                const number = Number(value)
                if (!isNaN(number)) {
                    return number
                } else {
                    return value
                }
            } catch (error) {
                return value
            }       
        }

        switch (action_type) {
            case "get":
                value = existing
                break;
            case "add":
                value = existing + value
                await this.setData(name, value, id, data_type)
                break;
            case "set":
                await this.setData(name, value, id, data_type)
                break;
        }

        this.StoreOutputValue(value,'output', cache)
        this.RunNextBlock("action", cache)
    }
}
