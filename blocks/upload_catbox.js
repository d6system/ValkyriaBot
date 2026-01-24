module.exports = {
    name: "Upload Image to Catbox",

    description: "Uploads an image to Catbox using a local file path, then returns the image URL.",

    category: "Utilities",

    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"],
            required: true,
        },
        {
            id: "url/path",
            name: "URL/PATH",
            description: "Acceptable Types: Text, Unspecified\n\nDescription: The URL or path of the image to upload.",
            types: ["text", "unspecified"],
            required: true,
        },
        {
            id: "title",
            name: "Title",
            description: "Acceptable Types: Text, Unspecified\n\nDescription: The title of the image.",
            types: ["text", "unspecified"],
        },
        {
            id: "description",
            name: "Description",
            description: "Acceptable Types: Text, Unspecified\n\nDescription: The description of the image.",
            types: ["text", "unspecified"],
        },
        {
            id: "userhash",
            name: "Catbox Userhash",
            description: "Acceptable Types: Text, Unspecified\n\nDescription: OPTIONAL - The userhash of the Catbox account.",
            types: ["text", "unspecified"],
        },
    ],

    options: [
        {
            id: "inputtype",
            name: "Input Type",
            description: "The type of input you want to use.",
            type: "SELECT",
            options: {
                url: "URL",
                file: "File Path",
            },
        },
        {
            id: "userhash",
            name: "Catbox Userhash",
            description: "The userhash of the Catbox account.",
            type: "text",
        }
    ],

    outputs: [
        {
            id: "upload_completed",
            name: "Upload Completed",
            types: ["action"],
        },
        {
            id: "image_url",
            name: "Image URL",
            types: ["text"],
        },
        {
            id: "action_error",
            name: "Action Error",
            types: ["action"],
        },
        {
            id: "error",
            name: "Error",
            types: ["text"],
        },
    ],

    async code(cache) {
        try {
            const { Catbox } = await this.require("node-catbox");
            const type = this.GetOptionValue("inputtype", cache) == "file" ? "stream" : "url";

            const image = this.GetInputValue("url/path", cache)
            const userhash = this.GetInputValue("userhash", cache) || this.GetOptionValue("userhash", cache);

            const title = this.GetInputValue("title", cache);
            const description = this.GetInputValue("description", cache);

            const catbox = new Catbox(userhash);


            catbox[type == "url" ? "uploadURL" : "uploadFile"]({
                    url: image,
                    path: image,
                    title,
                    description,
                })
                .then((res) => {
                    this.StoreOutputValue(res, "image_url", cache);
                    this.RunNextBlock("upload_completed", cache);
                })
                .catch((err) => {
                    this.StoreOutputValue(err.message, "error", cache);
                    this.RunNextBlock("action_error", cache);
                });
        } catch (e) {
            this.StoreOutputValue(e.message, "error", cache);
            this.RunNextBlock("action_error", cache);
        }
    },
};
