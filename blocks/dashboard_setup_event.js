module.exports = {
    name: "Discord Dashboard Setup [Event]",

    description: "Sets up the discord-dashboard, installs required modules, and starts the dashboard. Runs action on options changes",

    category: "Dashboard",

    auto_execute: true,

    inputs: [
        {
            id: "config",
            name: "Dashboard Config",
            description: "Acceptable Types: Object, Unspecified\n\nDescription: The Dashboard category object.",
            types: ["object", "unspecified"],
            required: true
        },  
        {
            id: "locales",
            name: "Locales",
            description: "Acceptable Types: Object, Unspecified\n\nDescription: The locales of the Dashboard.",
            types: ["object", "unspecified"],
            required: true,
            multiInput: true
        },  
        {
            id: "categories",
            name: "Dashboard Category",
            description: "Acceptable Types: Object, Unspecified\n\nDescription: The Dashboard category object.",
            types: ["object", "unspecified"],
            multiInput: true,
            required: true,
        },  
    ],

    options(data) {
        const simple_mode = data?.options?.simple_mode == undefined ? true : data.options.simple_mode;

        return [
            {
                id: "simple_mode",
                name: "Simple Mode?",
                description: "If enabled, the block will automatically use this current bot's token and secret. If disabled, you will need to provide the bot token and secret manually.",
                type: "CHECKBOX",
                defaultValue: true
            },
            simple_mode ? undefined : {
                id: "bot_token",
                name: "Bot Token",
                description: "The Discord Bot Token for the dashboard.",
                type: "TEXT"
            },
            simple_mode ? undefined : {
                id: "client_id",
                name: "Client ID",
                description: "The Discord Application Client ID for the dashboard.",
                type: "TEXT"
            },
            {
                id: "client_secret",
                name: "Client Secret",
                description: "The Discord Application Client Secret for the dashboard.",
                type: "TEXT"
            },
            {
                id: "license",
                name: "License Key",
                description: "The license key for the discord-dashboard package.",
                type: "TEXT"
            },
            {
                id: "port",
                name: "Port",
                description: "The port on which the dashboard will be hosted.",
                type: "NUMBER",
                defaultValue: 3000
            },
            {
                id: "redirect_uri",
                name: "Redirect URI",
                description: "The redirect URI for OAuth2 authentication.",
                type: "TEXT",
                defaultValue: "/discord/callback"
            },
            {
                id: "domain",
                name: "Domain",
                description: "The domain name where the dashboard will be accessible.",
                type: "TEXT",
                defaultValue: "http://localhost"
            },
            {
                id: "sqlDirectory",
                name: "SQL Directory",
                description: "The file path where data will be stored.",
                type: "TEXT",
                defaultValue: "./data/sqldata"
            }
        ]
    },

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes after an option is changed.",
            types: ["action"]
        },
        {
            id: "option_id",
            name: "Option ID",
            description: "The id of the option that was changed.",
            types: ["text", "Unspecified"]
        },
        {
            id: "new_value",
            name: "New Value",
            description: "The new value of the option.",
            types: ["text", "number", "boolean", "object", "unspecified"]
        },
        {
            id: "server",
            name: "Server",
            description: "The server (guild) where the option was changed.",
            types: ["object", "Unspecified"]
        },
        {
            id: "user",
            name: "User",
            description: "The user who changed the option.",
            types: ["object", "Unspecified"]
        }
    ],

    async code(cache, DBB) {

        const simpleMode = this.GetOptionValue("simple_mode", cache);
        const clientId = simpleMode ? this.client.user.id :  this.GetOptionValue("client_id", cache);
        const clientSecret = this.GetOptionValue("client_secret", cache);
        const botToken = simpleMode ? DBB.Data.token : this.GetOptionValue("bot_token", cache);
        const licenseKey = this.GetOptionValue("license", cache);
        const port = this.GetOptionValue("port", cache);
        const redirectUri = this.GetOptionValue("redirect_uri", cache);
        const domain = this.GetOptionValue("domain", cache);
        const sqlDirectory = this.GetOptionValue("sqlDirectory", cache);

        const { execSync } = require('child_process');
        function isModuleInstalled(name) {
            try {
                require.resolve(name);
                return true;
            } catch (e) {
                return false;
            }
        }
        function installModule(name) {
            execSync(`npm install ${name}`, { stdio: 'inherit' });
        }
        if (!isModuleInstalled('discord-dashboard')) installModule('discord-dashboard');
        if (!isModuleInstalled('dbd-soft-ui')) installModule('dbd-soft-ui');
        if (!isModuleInstalled('keyv')) installModule('keyv');
        if (!isModuleInstalled('express-session')) installModule('express-session');
        if (!isModuleInstalled('session-file-store')) installModule('session-file-store');

        const { Client, GatewayIntentBits } = require('discord.js');
        const SoftUI = require('dbd-soft-ui');
        const DBD = require('discord-dashboard');
        const Keyv = require('keyv');
        var session = require('express-session');
        var FileStore = require('session-file-store')(session);
        const fs = require('fs')

        var fileStoreOptions = {path: `${sqlDirectory}/sessions`};

        const keyvInstances = {}

        let client;

        if (simpleMode) {
            client = DBB.DiscordJS.client;
        } else {
            client = new Client({ intents: [GatewayIntentBits.Guilds] });
            client.login(botToken);
        }

        const Handler = new DBD.Handler({});

        await DBD.useLicense(licenseKey);
        DBD.Dashboard = DBD.UpdatedClass();

        const raw_categories = this.GetInputValue("categories", cache)
        const list_types = ["rolesMultiSelect", "channelsMultiSelect", "multiSelect"]

        const config = this.GetInputValue("config", cache)

        const raw_locales = this.GetInputValue("locales", cache)
        let locales = {}

        if (!fs.existsSync(sqlDirectory)) {
            fs.mkdir(sqlDirectory, { recursive: true }, (err) => {
                if (err) {
                    console.error(`Error creating directory: ${err}`);
                } else {}
            })
        }

        if (!raw_categories[0]) {
            this.console("WARN", "No categories were provided to the dashboard. The dashboard will not function without categories.");
            return;
        }

        for (const category of raw_categories) {
            const new_options_list = []
            for (const option of category.categoryOptionsList) { 
                if (category.categoryOptionsList[0]) {
                    if (option.optionId) {
                        if (option.optionType?.type == "multiRow") {
                            for (const option2 of option.optionType.options) {
                                option2.optionId = option2.optionId.replace(" ", "-")
                                const filePath = `${sqlDirectory}/${option2.optionId}.sqlite`;
        
                                // Check if the database does not exist, create if needed
                                if (!fs.existsSync(filePath)) {
                                    fs.writeFileSync(filePath, '', 'utf8');
                                }
                    
                                const keyvInstance = new Keyv(`sqlite://${filePath}`); // Creating keyv instance for the data
                                keyvInstances[option2.optionId] = keyvInstance; // Add the instance to an object to be recalled later
                    
                                option2.getActualSet = async ({guild}) => {
                                    let DEFAULT_STATE
                                    if (list_types.includes(option2.optionType.type)) {
                                        DEFAULT_STATE = []
                                    } else if (option2.optionType.type == "slider") {
                                        DEFAULT_STATE = option2.defaultValue
                                    } else {
                                        DEFAULT_STATE = false
                                    }
                                    return await keyvInstance.get(guild.id) || DEFAULT_STATE;
                                }
        
                                option2.setNew = async ({ guild, user, newData }) => {
                                    await keyvInstance.set(guild.id, newData);
        
                                    this.StoreOutputValue(keyvInstance.opts.uri.split("/")[keyvInstance.opts.uri.split("/").length - 1].replace(".sqlite", ""), "option_id", cache); // Gets the option ID and stores as an output
                                    this.StoreOutputValue(newData, "new_value", cache);
                                    this.StoreOutputValue(guild.object, "server", cache);
                                    this.StoreOutputValue(user.object.user, "user", cache);
                                    this.RunNextBlock("action", cache);
                                    return;
                                }                                  
                            }

                        } else {
                            option.optionId = option.optionId.replace(" ", "-")
                            const filePath = `${sqlDirectory}/${option.optionId}.sqlite`;
    
                            // Check if the database does not exist, create if needed
                            if (!fs.existsSync(filePath)) {
                                fs.writeFileSync(filePath, '', 'utf8');
                            }
                
                            const keyvInstance = new Keyv(`sqlite://${filePath}`); // Creating keyv instance for the data
                            keyvInstances[option.optionId] = keyvInstance; // Add the instance to an object to be recalled later
                
                            option.getActualSet = async ({guild}) => {
                                let DEFAULT_STATE
                                if (list_types.includes(option.optionType.type)) {
                                    DEFAULT_STATE = []
                                } else if (option.optionType.type == "slider") {
                                    DEFAULT_STATE = option.defaultValue
                                } else if (option.optionType.type == "embedBuilder") {
                                    DEFAULT_STATE = {}
                                }else {
                                    DEFAULT_STATE = false
                                }
                                return await keyvInstance.get(guild.id) || DEFAULT_STATE;
                            }
    
                            option.setNew = async ({ guild, user, newData }) => {
                                await keyvInstance.set(guild.id, newData);
    
                                this.StoreOutputValue(keyvInstance.opts.uri.split("/")[keyvInstance.opts.uri.split("/").length - 1].replace(".sqlite", ""), "option_id", cache); // Gets the option ID and stores as an output
                                this.StoreOutputValue(newData, "new_value", cache);
                                this.StoreOutputValue(guild.object, "server", cache);
                                this.StoreOutputValue(user.object.user, "user", cache);
                                this.RunNextBlock("action", cache);
                                return;
                            }  
                        }
  
                    }                    
                    new_options_list.push(option) // Add the updated option with functions to the array
                }
            }
            
            if (category.toggleable) {
                const filePath = `${sqlDirectory}/${category.categoryId}.sqlite`

                if (!fs.existsSync(filePath)) {
                    fs.writeFileSync(filePath, '', 'utf8');
                }

                const keyvInstance = new Keyv(`sqlite://${filePath}`); // Creating keyv instance for the data
                keyvInstances[category.categoryId] = keyvInstance

                category.getActualSet = async ({guild}) => {
                    return Boolean(await keyvInstance.get(guild.id)) || false;
                }

                category.setNew = async ({ guild, user, newData }) => {
                    await keyvInstance.set(guild.id, newData);

                    this.StoreOutputValue(keyvInstance.opts.uri.split("/")[keyvInstance.opts.uri.split("/").length - 1].replace(".sqlite", ""), "option_id", cache); // Gets the option ID and stores as an output
                    this.StoreOutputValue(newData, "new_value", cache);
                    this.StoreOutputValue(client.guilds.cache.get(guild.id), "server", cache);
                    this.RunNextBlock("action", cache);
                    return;
                }   
            }
            category.categoryOptionsList = new_options_list // Replace the old options list with the updated version

            for (const localeData of raw_locales) {
                if (!localeData) return
                const locale = JSON.parse(localeData.text)
                locale.name = localeData.string
                locales[localeData.locale] = locale;
            }
        }

        const Dashboard = new DBD.Dashboard({
            sessionStore: new FileStore(fileStoreOptions),
            minimizedLogs: true,
            port: port,
            invite: {
                clientId: clientId,
                scopes: ["bot", "applications.commands"],
                permissions: "8",
                redirectUri: `${domain}:${port}${redirectUri}`,
              },
            acceptPrivacyPolicy: true,
            client: { id: clientId, secret: clientSecret },
            redirectUri: `${domain}:${port}${redirectUri}`,
            domain: domain,
            ownerIDs: config.owners,
            useThemeMaintenance: true,
            useTheme404: true,
            bot: client,
            theme: SoftUI({
                error: {
                    error404: {
                      title: "Error 404",
                      subtitle: "Page Not Found",
                      description:
                        "Page doesn't exists, click the button bellow to return to the main page.",
                    },
                  },
                footer: {
                    replaceDefault: true,
                    text: config.footer
                },
                storage: Handler,
                locales: locales,
                customThemeOptions: {
                    index: async ({ req, res, config }) => {
                        return {
                            values: [],
                            graph: {},
                            cards: [],
                        };
                    },
                },
                websiteName: config.websiteName,
                colorScheme: config.colorScheme,
                icons: {
                    favicon: config.favicon,
                    noGuildIcon: "https://static-00.iconduck.com/assets.00/discord-icon-2048x2048-nnt62s2u.png",
                    sidebar: {
                        darkUrl: config.favicon,
                        lightUrl: config.favicon,
                        hideName: true,
                        borderRadius: false,
                        alignCenter: true,
                    },
                },
                index: {
                    graph: {
                        enabled: false,
                        lineGraph: true,
                        title: 'Memory Usage',
                        tag: 'Memory (MB)',
                        max: 100
                    },
                },
                sweetalert: {
                    errors: {},
                    success: {
                        login: "You logged in!",
                    }
                },
                preloader: {
                    image: "/img/soft-ui.webp", 
                    spinner: true,
                    text: config.preload,
                },
                admin: {
                    pterodactyl: {
                        enabled: false,
                        apiKey: "apiKey",
                        panelLink: "https://panel.website.com",
                        serverUUIDs: []
                    }
                }
            }),
            settings: raw_categories
        });

        Dashboard.init();
    }
};