module.exports = {
	name: "Create Dashboard Multi Row",

	description: "Creates a multirow object that contains multiple options within a category for the dashboard",

	category: "Dashboard",

	auto_execute: false,

	inputs: [
        {
            id: "options",
            name: "Option Object",
            description: "Acceptable Types: text, unspecified\n\nDescription: The category to add the option to.",
            types: ["object", "unspecified"],
            required: true,
            multiInput: true
        }
    ],

	options: [
        {
            id: "id",
            name: "Option ID",
            description: "Description: The id of the option.",
            type: "text"
        },
        {
            id: "title",
            name: "Title",
            description: "Description: The title of the space.",
            type: "text"
        },
        {
            id: "description",
            name: "Option Description",
            description: "Description: The description of the space.",
            type: "text"
        },
    ],

	outputs: [
        {
            id: "option_out",
            name: "Option",
            description: "Types: Object, Unspecified\n\nDescription: The category object. Used to add options to.",
            types: ["object", "unspecified"]
        }
    ],

	code(cache) {
        const SoftUI = require('dbd-soft-ui');

        const option = {}
        option.optionId = this.GetOptionValue("id", cache)
        option.optionName = this.GetOptionValue("title", cache)
        option.optionDescription = this.GetOptionValue("description", cache)

        option.optionType = SoftUI.formTypes.multiRow(this.GetInputValue("options", cache))

        this.StoreOutputValue(option, "option_out", cache)
	}
}