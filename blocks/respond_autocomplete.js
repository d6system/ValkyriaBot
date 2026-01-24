module.exports = {
    name: "Respond to Autocomplete Interaction",

    description: "Responds to a Autocomplete Interaction using custom specified choices. (by @XCraftTM)",

    category: "Interaction Stuff",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "interaction",
            name: "Interaction",
            description: "Type: Object\n\nDescription: The Title of Your Application",
            types: ["object", "unspecified"],
            required: true
        },
        {
            id: "choices",
            name: "Choices",
            description: "Type: List\n\nDescription: The List of Choices to show in the Autocomplete.",
            types: ["list", "unspecified"]
        }
    ],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "interaction",
            "name": "Interaction",
            "description": "Type: Object, Unspecified\n\nDescription: The Interaction Object",
            "types": ["object", "unspecified"]
        }
    ],

    async code(cache) {
        const interaction = this.GetInputValue("interaction", cache);
        const choices = this.GetInputValue("choices", cache);

        if(!interaction || !choices || !Array.isArray(choices)) {
            console.error("Respond to Autocomplete Interaction: Invalid Choices or Interaction provided.");
            return;
        }

        if(interaction.isAutocomplete()) {
            try {
                await interaction.respond(choices);
            } catch(e) {
                //console.error("Respond to Autocomplete Interaction: Failed to respond to the Interaction.");
                //console.error(e);
            }
        } else {
            console.error("Respond to Autocomplete Interaction: The provided Interaction is not a Autocomplete Interaction.");
        }

        this.StoreOutputValue(interaction, "interaction", cache);
        this.RunNextBlock("action", cache);
    }
}