module.exports = {
	name: "Dashboard Config",

	description: "Edit the default config for the dashboard",

	category: "Dashboard",

	auto_execute: false,

	inputs: [],

	options: [
        {
            id: "websiteName",
            name: "Website Name",
            description: "The name that is displayed on the web page's tab.",
            type: "text_line"
        },
        {
            id: "favicon",
            name: "Favicon URL",
            description: "The image that is displayed on the web page's tab.",
            type: "text",
            defaultValue: 'https://static-00.iconduck.com/assets.00/discord-icon-2048x2048-nnt62s2u.png'
        },
        {
            id: "colorScheme",
            name: "Color Scheme",
            description: "The color scheme to use. (Default: Blue)",
            type: "select",
            options:{ 
                blue: "Blue",
                dark: "Dark",
                green: "Green",
                pink: "Pink",
                red: "Red",
                yellow: "Yellow"
            },
            defaultValue: "blue"
        },
        {
            id: "owners",
            name: "Owner IDs",
            description: `The user ids of owners (allows access to the admin page).`,
            type: "MULTISELECT",
            allowUserOptions: true,
        },
        {
            id: "preload",
            name: "Loading Page Text",
            description: "The text to display on the loading page.",
            type: "text_line",
            defaultValue: "Loading..."
        },
        {
            id: "footer",
            name: "Footer Text",
            description: "The text to display at the bottom of the main dashboard page.",
            type: "text_line"
        }
    ],

	outputs: [
        {
            id: "config_out",
            name: "Dashboard Config",
            description: "The config object.",
            types: ["object", "unspecified"]
        }
    ],

	code(cache) {
        const config = {}
        config.websiteName = this.GetOptionValue("websiteName", cache) || ""
        config.colorScheme = this.GetOptionValue("colorScheme", cache)
        config.owners = this.GetOptionValue("owners", cache)
        config.footer = this.GetOptionValue("footer", cache) || ""
        config.preload = this.GetOptionValue("preload", cache)
        config.favicon = this.GetOptionValue("favicon", cache)

        this.StoreOutputValue(config, "config_out", cache)
	}
}