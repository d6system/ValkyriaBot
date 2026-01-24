module.exports = {
    name: "Generate Random Emoji",

    description: "Generates a random emoji. By Domin0221",

    category: "Extras",
    
    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        }
    ],

    options: [
        {
            "id": "emojiNumber",
            "name": "Number of Emojis",
            "description": "Description: The number of random emojis to generate.",
            "type": "NUMBER"
        },
        {
            "id": "emojiCategory",
            "name": "Emoji Category",
            "description": "Description: The category from which to generate random emojis.",
            "type": "SELECT",
            "options": {
                "": "All Categories",
                "smileys-and-emotion": "Smileys & Emotion",
                "people-and-body": "People & Body",
                "component": "Component",
                "animals-and-nature": "Animals & Nature",
                "food-and-drink": "Food & Drink",
                "travel-and-places": "Travel & Places",
                "activities": "Activities",
                "objects": "Objects",
                "symbols": "Symbols",
                "flags": "Flags"
            }
        },
        {
            "id": "allowDuplicates",
            "name": "Allow Duplicates",
            "description": "Description: Allow or disallow duplicated emojis.",
            "type": "checkbox"
        },
        {
            "id": "allowSkintones",
            "name": "Allow Skintones",
            "description": "Description: Allow or disallow all skintones of people where present.",
            "type": "checkbox"
        },
        {
            "id": "allowGenders",
            "name": "Allow Genders",
            "description": "Description: Allow or disallow all genders of people where present.",
            "type": "checkbox"
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "emoji",
            "name": "List of Emojis",
            "description": "Type: List\n\nDescription: The generated list of emojis.",
            "types": ["list", "unspecified"]
        },
        {
            "id": "firstEmoji",
            "name": "First Emoji",
            "description": "Type: Text\n\nDescription: The first emoji from the list of generated emojis.",
            "types": ["text", "unspecified"]
        }
    ],
    async code(cache) {
        const emoji = await this.require("emoji-random-list");
        const numOfEmojis = parseInt(this.GetOptionValue("emojiNumber", cache));
        const emojiGroup = this.GetOptionValue("emojiCategory", cache);
        const duplicates = this.GetOptionValue("allowDuplicates", cache);
        const skintones = this.GetOptionValue("allowSkintones", cache);
        const genders = this.GetOptionValue("allowGenders", cache);

        const randomEmoji = emoji.random({
            n: numOfEmojis,
            group: emojiGroup,
            noduplicates: duplicates,
            skintones: skintones,
            genders: genders
        });
        const firstRandomEmoji = randomEmoji[0];

        this.StoreOutputValue(randomEmoji, "emoji", cache);
        this.StoreOutputValue(firstRandomEmoji, "firstEmoji", cache);
        this.RunNextBlock("action", cache);
    }
};
