module.exports = {
    name: "Check If Website Has Element",

    description: "Checks if a specified element exists on a given website. By Domin0221",

    category: "Internet Stuff",
    
    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "website",
            "name": "Website URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The URL to the website.",
            "types": ["text", "unspecified"],
            "required": true
        },
        {
            "id": "path",
            "name": "Element Path",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The element path. Use inspect element, select desired element, right click on it in the DevTools and click \"Copy Selector\".",
            "types": ["text", "unspecified"],
            "required": true
        }
    ],

    options: [],

    outputs: [
        {
            "id": "trueAction",
            "name": "Action (If True)",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "falseAction",
            "name": "Action (If False)",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "errorAction",
            "name": "Action (Error)",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "error",
            "name": "Error Message",
            "description": "Type: Text\n\nDescription: The error message if an error occurs.",
            "types": ["text", "unspecified"]
        }
    ],
    async code(cache) {
        const puppeteer = await this.require('puppeteer');

        (async () => {
            const url = this.GetInputValue("website", cache);
            const selector = this.GetInputValue("path", cache);

            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            try {
                await page.goto(url, { waitUntil: 'networkidle2' });

                const elementExists = await page.$(selector) !== null;

                if (elementExists) {
                    this.RunNextBlock("trueAction", cache);
                } else {
                    this.RunNextBlock("falseAction", cache);
                }
            } catch (error) {
                console.log(error);
                this.StoreOutputValue(error.message, "error", cache);
                this.RunNextBlock("errorAction", cache);
            } finally {
                await browser.close();
            }
        })();
    }
};
