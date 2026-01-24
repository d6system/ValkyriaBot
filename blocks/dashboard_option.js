module.exports = {
	name: "Create Dashboard Option",

	description: "Creates an option within a category for the dashboard. Select the type from the block",

	category: "Dashboard",

	auto_execute: false,

	options(data) {
        const options = [
            {
                id: "type",
                name: "Option Type",
                description: "Select the option type to add",
                type: "SELECT",
                defaultValue: "text",
                options: [
                    {
                        type: "GROUP",
                        name: "Inputs",
                        description: "Options that allow the user to input",
                        options: [
                            { id: "text", name: "Text", description: "A text input" },
                            { id: "number", name: "Number", description: "A number input" },
                            { id: "switch", name: "Switch", description: "A switch input" },
                            // { id: "checkbox", name: "Checkbox", description: "A checkbox input" },
                            { id: "slider", name: "Slider", description: "A slider input" },
                            { id: "colour", name: "Colour", description: "A colour picker" },
                            { id: "date", name: "Date", description: "A date picker" },
                            { id: "tag", name: "Tag", description: "Allows the user to input a list of tags" },
                        ]
                    },
                    { type: "SEPARATOR" },
                    {
                        type: "GROUP",
                        name: "Selectors",
                        description: "Options that allow the user to select from a list. - All allow for single or multiple selections",
                        options: [
                            { id: "channel", name: "Channel", description: "A channel selection" },
                            { id: "role", name: "Role", description: "A role selection" },
                            { id: "list", name: "List", description: "A list selection" },
                        ]
                    },
                    { type: "SEPARATOR" },
                    {
                        type: "GROUP",
                        name: "Utility",
                        description: "Options that could be considered as Utility",
                        options: [
                            { id: "embed", name: "Embed Creator", description: "An embed creator" },
                            { id: "spacer", name: "Spacer", description: "A space that can contain text. - Does not allow the user to change" },
                            // { id: "multiRow", name: "Multi-Row", description: "A space that can contain multiple options within a single container" },
                        ]
                    },
                ]
            },
            {
                id: "id",
                name: "Option ID",
                description: "The id of the option (Used internally).",
                type: "TEXT_LINE"
            },
            {
                id: "name",
                name: "Option Name",
                description: "The name of the option that gets displayed on the dashboard.",
                type: "TEXT_LINE"
            },
            {
                id: "description",
                name: "Option Description",
                description: "The description of the option that gets displayed on the dashboard.",
                type: "text"
            },
        ]

        const textOption = () => {
            options.push(
                {
                    id: "placeholder",
                    name: "Placeholder?",
                    description: "Placeholder text to display in the text box",
                    type: "text"
                },
                {
                    id: "min",
                    name: "Min?",
                    description: "The minimum number of characters. - Set to 0 for no minimum",
                    type: "number"
                },
                {
                    id: "max",
                    name: "Max?",
                    description: "The maximum number of characters. - Set to 0 for no maximum",
                    type: "number"
                },
                {
                    id: "small",
                    name: "Small Text?",
                    description: "If this option should use a smaller text box (not resizeable)",
                    type: "checkbox"
                },
                {
                    id: "required",
                    name: "Required?",
                    description: "If this option is required",
                    type: "checkbox"
                }
            )
        }

        switch (data?.options?.type) {
            case "text":
                textOption()
                break;

            case "number":
                options.push(
                    {
                        id: "min",
                        name: "Min?",
                        description: "The minimum number of characters. - Set to 0 for no minimum",
                        type: "number"
                    },
                    {
                        id: "max",
                        name: "Max?",
                        description: "The maximum number of characters. - Set to 0 for no maximum",
                        type: "number"
                    }
                )
                break;

            case "switch":
                break;

            case "checkbox":
                break;

            case "slider":
                options.push(
                    {
                        id: "min",
                        name: "Min Number?",
                        description: "The minimum number of characters. - Set to 0 for no minimum",
                        type: "number"
                    },
                    {
                        id: "max",
                        name: "Max Number?",
                        description: "The maximum number of characters. - Set to 0 for no maximum",
                        type: "number",
                        defaultValue: 100
                    },
                    {
                        id: "step",
                        name: "Step Amount?",
                        description: "The amount to step per incriment",
                        type: "number",
                        defaultValue: 1
                    },
                    {
                        id: "default",
                        name: "Default Value?",
                        description: "The default value that the slider will be set to",
                        type: "number",
                        defaultValue: 50
                    }
                )
                break;

            case "colour":
                options.push(
                    {
                        id: "default",
                        name: "Default Colour",
                        description: "The default colour that the colour picker will be set to",
                        type: "color"
                    }
                )
                break;

            case "date":
                break;
            
            case "tag":
                break;

            case "channel": 
                options.push(
                    {
                        id: "multiSelect",
                        name: "Multi Select?",
                        description: "Should the user be able to select multiple channels?",
                        type: "checkbox"
                    },
                    {
                        id: "types",
                        name: "Channel Types",
                        description: "The channel types to display",
                        type: "multiselect",
                        options: {
                            GuildText: "Text",
                            GuildVoice: "Voice",
                            GuildCategory: "Category",
                            GuildPrivateThread: "Private Thread",
                            GuildPublicThread: "Public Thread",
                            GuildAnnouncement: "Announcement",
                            GuildForum: "Forum",
                            GuildNewsThread: "News",
                            GuildStageVoice: "Stage Voice",
                            GuildMedia: "Media"
                        },
                        defaultValue: "GuildText"
                    },
                    {
                        id: "hideNoAccess",
                        name: "Hide No Access?",
                        description: "Hide channels that the user does not have access to?",
                        type: "checkbox",
                        defaultValue: true
                    },
                    {
                        id: "hideNSFW",
                        name: "hide NSFW?",
                        description: "Show or hide NSFW Channels?",
                        type: "checkbox"
                    },
                    {
                        id: "onlyNSFW",
                        name: "Only NSFW?",
                        description: "Show only NSFW Channels?",
                        type: "checkbox"
                    },
                )
                break;

            case "role": 
                options.push(
                    {
                        id: "multiSelect",
                        name: "Multi Select?",
                        description: "Should the user be able to select multiple roles?",
                        type: "checkbox"
                    },
                    {
                        id: "inludeBots",
                        name: "Inlude Bots?",
                        description: "Inlude bots in the list?",
                        type: "checkbox"
                    },
                )
                break;

            case "list":
                options.push(
                    {
                        id: "types",
                        name: "List Items",
                        description: 'The list of items to select from',
                        type: "MULTISELECT",
                        allowUserOptions: true
                    },
                    {
                        id: "multiSelect",
                        name: "Multi Select?",
                        description: "Should the user be able to select multiple roles?",
                        type: "checkbox"
                    },
                )
                break;

            case "embed":
                break;

            case "spacer":
                    delete options[1]
                break;
            
            default:
                textOption()
        }

        if (data?.options?.type !== "spacer") {
            options.push(
                {
                    id: "disabled",
                    name: "Disabled?",
                    description: "If this option is disabled",
                    type: "checkbox"
                },
            )            
        }

        return options
    },

	outputs(data) {
        let outputs = [
            {
                id: "option_out",
                name: "Option",
                description: "The option that was created",
                types: ["object", "unspecified"]
            }
        ]
        return outputs
    },

	code(cache, DBB) {
        const SoftUI = require('dbd-soft-ui');
        const DBD = require('discord-dashboard');
        const { ChannelType } = require("discord.js")

        const optionType = this.GetOptionValue("type", cache)

        const option = {}
        option.optionId = this.GetOptionValue("id", cache)
        option.optionName = this.GetOptionValue("name", cache)
        option.optionDescription = this.GetOptionValue("description", cache)
        
        const disabled = this.GetOptionValue("disabled", cache)
        const placeholder = this.GetOptionValue("placeholder", cache)
        const min = this.GetOptionValue("min", cache)
        const max = this.GetOptionValue("max", cache)
        const small = this.GetOptionValue("small", cache)
        const required = this.GetOptionValue("required", cache)
        const step = this.GetOptionValue("step", cache)
        const defaultValue = this.GetOptionValue("default", cache)
        const types = this.GetOptionValue("types", cache)
        const multiSelect = this.GetOptionValue("multiSelect", cache)
        const hideNSFW = this.GetOptionValue("hideNSFW", cache)
        const onlyNSFW = this.GetInputValue("onlyNSFW", cache) || this.GetOptionValue("onlyNSFW", cache)
        const hideNoAccess = this.GetOptionValue("hideNoAccess", cache)
        const inludeBots = this.GetOptionValue("inludeBots", cache)

        switch (optionType) {
            case "text":
                if (small) {
                    option.optionType = DBD.formTypes.input(placeholder, min, max, disabled, required)
                } else {
                    option.optionType = DBD.formTypes.textarea(placeholder, min, max, disabled, required)
                }
                break;

            case "number":        
                option.optionType = SoftUI.formTypes.numberPicker(min, max, disabled)
                break;

            case "switch":
                option.optionType = DBD.formTypes.switch(disabled)
                break;

            case "checkbox":
                option.optionType = DBD.formTypes.checkbox(disabled)
                break;

            case "slider":
                option.optionType = SoftUI.formTypes.slider(min, max, step, disabled)
                option.defaultValue = defaultValue
                break;

            case "colour":
                option.optionType = DBD.formTypes.colorSelect(defaultValue, disabled)
                break;

            case "date":
                option.optionType = SoftUI.formTypes.date(disabled)
                break;
            
            case "tag":
                option.optionType = SoftUI.formTypes.tagInput(disabled)
                break;

            case "channel": 
                const channelTypes = []
        
                for (const type of types) {
                    try {
                        channelTypes.push(ChannelType[type])
                    } catch (error) {}
                    
                }
                
                if (multiSelect) {
                    option.optionType = DBD.formTypes.channelsMultiSelect(disabled, required, channelTypes, hideNSFW, onlyNSFW, hideNoAccess)
                } else {
                    option.optionType = DBD.formTypes.channelsSelect(disabled, channelTypes, hideNSFW, onlyNSFW, hideNoAccess)
                }
                break;

            case "role": 
                if (multiSelect) {
                    option.optionType = DBD.formTypes.rolesMultiSelect(inludeBots, disabled, required)
                } else {
                    option.optionType = DBD.formTypes.rolesSelect(inludeBots, disabled)
                }
                break;

            case "list":
                const listObject = {}
        
                for (const item of types) {
                    listObject[item] = item
                }

                if (multiSelect) {
                    option.optionType = DBD.formTypes.multiSelect(listObject, disabled)
                } else {
                    option.optionType = DBD.formTypes.select(listObject, disabled)
                }
                break;

            case "embed":
                option.optionType = DBD.formTypes.embedBuilder({
                    username: DBB.DiscordJS.client.user.username,
                    avatarURL: DBB.DiscordJS.client.user.avatarURL(),
                })
                break;

            case "spacer":
                delete option.id
                option.optionType = SoftUI.formTypes.spacer()
                break;
            
            default:
                textOption()
        }

        this.StoreOutputValue(option, "option_out", cache)
	}
}