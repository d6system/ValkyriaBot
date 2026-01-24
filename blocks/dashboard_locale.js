module.exports = {
	name: "Create Dashboard Locale",

	description: "Creates a locale, also needed for the home page",

	category: "Dashboard",

	auto_execute: false,


	inputs: [],

	options: [
        {
            id: "locale_id",
            name: "Locale ID",
            description: "The locale ID to add. (Example: en-GB, es-ES, fr-FR, etc.)",
            type: "text_line",
            defaultValue: "en-GB"
        },
        {
            id: "locale_name",
            name: "Locale Name",
            description: "The locale Name to add. (Example: English (GB), Spanish (ES), French (FR), etc.)",
            type: "text_line",
            defaultValue: "English"
        },
        {
            id: "main_title",
            name: "Main Page Title",
            description: "The title of the main page.",
            type: "text_line",
            defaultValue: "Welcome to the dashboard!"
        },
        {
            id: "main_description",
            name: "Main Page Description",
            description: "The description of the main page.",
            type: "text",
            defaultValue: "Here you can edit the dashboard's settings.",
        },
        {
            id: "locale_text",
            name: "Locale Text",
            description: "The text to translate to (Only change the right side of the ':' characters)",
            type: "text",
            defaultValue: `{
                "index": {
                    "card": {
                        "image": "your path or url",
                        "category": ""
                    },
                    "feedsTitle": "Feeds",
                    "graphTitle": "Graphs",
                    "feeds": ["Current Users", "CPU", "System Platform", "Server Count"]
                },
                "manage": {
                    "settings": {
                        "memberCount": "Members",
                        "info": {
                            "info": "Info",
                            "server": "Server Information"
                        }
                    },
                    "title": "Your Servers",
                    "description": "Manage your guilds"
                },
                "admin": {
                    "feeds": {
                        "feedBuilder": "Feed Builder",
                        "feedIcon": "Feed Icon",
                        "feedDescription": "Feed Description",
                        "feedColour": "Feed Color",
                        "colors": {
                            "pink": "Pink",
                            "red": "Red",
                            "orange": "Orange",
                            "green": "Green",
                            "gray": "Gray",
                            "blue": "Blue",
                            "dark": "Dark"
                        },
                        "feedSubmit": "Submit",
                        "feedFeedPreview": "Feed Preview",
                        "feedPreview": "Preview",
                        "feedCurrent": "Current Feeds",
                        "feedShowIcons": "Show Icons"
                    },
                    "admin": {
                        "title": "Admin Controls",
                        "adminUpdates": "Check for Updates"
                    }
                },
                "guild": {
                    "home": "Home",
                    "settingsCategory": "Module Settings",
                    "updates": {
                        "title": "Changes have been made!",
                        "reset": "Reset",
                        "save": "Save"
                    }
                },
                "partials": {
                    "sidebar": {
                        "dash": "Dashboard",
                        "manage": "Your Servers!",
                        "commands": "Commands",
                        "admin": "Admin",
                        "account": "Account Pages",
                        "login": "Sign In",
                        "logout": "Sign Out",
                        "pp": "Privacy Policy"
                    },
                    "navbar": {
                        "home": "Home",
                        "pages": {
                            "manage": "Manage Guilds",
                            "settings": "Manage Guilds",
                            "commands": "Commands",
                            "pp": "Privacy Policy",
                            "admin": "Admin Panel",
                            "error": "Error",
                            "credits": "Credits",
                            "debug": "Debug",
                            "leaderboard": "Leaderboard",
                            "profile": "Profile",
                            "maintenance": "Under Maintenance",
                            "pages": "Pages",
                            "dashboard": "Settings"
                        }
                    },
                    "title": {
                        "pages": {
                            "manage": "Manage Guilds",
                            "settings": "Manage Guilds",
                            "commands": "Commands",
                            "pp": "Privacy Policy",
                            "admin": "Admin Panel",
                            "error": "Error",
                            "credits": "Credits",
                            "debug": "Debug",
                            "leaderboard": "Leaderboard",
                            "profile": "Profile",
                            "maintenance": "Under Maintenance"
                        }
                    },
                    "preloader": {
                        "text": "Some preload text"
                    },
                    "settings": {
                        "title": "Site Configuration",
                        "description": "Configurable Viewing Options",
                        "theme": {
                            "title": "Site Theme",
                            "description": "Make the site more appealing for your eyes!(But please don't use light mode)",
                            "dark": "Dark",
                            "light": "Light",
                            "auto": "Auto"
                        }
                    }
                }
            }`
        },
    ],

	outputs: [
        {
            id: "locale_out",
            name: "Locale",
            description: "The Locale object",
            types: ["object", "unspecified"]
        }
    ],

	code(cache, DBB) {
        const localeId = this.GetOptionValue('locale_id', cache)
        const localeName = this.GetOptionValue('locale_name', cache)
        const localeText = JSON.parse(this.GetOptionValue('locale_text', cache))

        localeText.index.card.title = this.GetOptionValue('main_title', cache)
        localeText.index.card.description = this.GetOptionValue('main_description', cache)

        const localeData = {locale: localeId, string: localeName, text: JSON.stringify(localeText)}

        this.StoreOutputValue(localeData, "locale_out", cache)
	}
}