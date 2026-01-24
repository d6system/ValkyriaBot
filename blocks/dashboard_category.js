module.exports = {
	name: "Create Dashboard Category",

	description: "Creates a category element for the dashboard",

	category: "Dashboard",

	auto_execute: false,

	inputs: [
        {
            id: "options",
            name: "Option",
            description: "Acceptable Types: Object, Unspecified\n\nDescription: The object outputs of the dashboard option blocks.",
            types: ["object", "unspecified"],
            // required: true,
            multiInput: true
        }
    ],

	options: [
        {
            id: "id",
            name: "Category ID",
            description: "Description: The id of the category.",
            type: "text"
        },
        {
            id: "name",
            name: "Category Name",
            description: "Description: The name of the category.",
            type: "text"
        },
        {
            id: "description",
            name: "Category Description",
            description: "Description: The description of the category.",
            type: "text"
        },
        {
            id: "toggleable",
            name: "Toggleable?",
            description: "Description: If this category can be toggled.",
            type: "checkbox"
        }
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
        const category = {}
        category.categoryId = this.GetOptionValue("id", cache)
        category.categoryName = this.GetOptionValue("name", cache)
        category.categoryDescription = this.GetOptionValue("description", cache)
        category.toggleable = this.GetOptionValue("toggleable", cache)
        category.categoryOptionsList = (this.GetInputValue("options", cache)).filter(option => option != undefined)

        this.StoreOutputValue(category, "option_out", cache)
	}
}