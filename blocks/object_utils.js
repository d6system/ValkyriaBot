module.exports = {
    name: "Object Utils (Create Edit Delete)",

    description: "Various utilities for creating, editing, and deleting object properties.",

    category: "Object Stuff",

    auto_execute: true,

    inputs(data) {
        const type = data.options?.action || "create";
        if (type === "create") {
            return [
                {
                    id: "key",
                    name: "Object Key",
                    description: "The key of the object to create.",
                    types: ["text", "unspecified"],
                    multiInput: true // cauese GetInputValue to return an array
                },
                {
                    id: "value",
                    name: "Object Value",
                    description: "The value of the object to create.",
                    types: ["unspecified", "text", "number", "boolean"],
                    multiInput: true // cauese GetInputValue to return an array
                }
            ];
        } else if (type === "edit") {
            return [
                {
                    id: "object",
                    name: "Object",
                    description: "The object to edit.",
                    types: ["object", "unspecified"]
                },
                {
                    id: "key",
                    name: "Object Key",
                    description: "The key of the object to edit.",
                    types: ["text", "unspecified"],
                    multiInput: true // cauese GetInputValue to return an array
                },
                {
                    id: "value",
                    name: "New Object Value",
                    description: "The new value of the object.",
                    types: ["unspecified", "text", "number", "boolean"],
                    multiInput: true // cauese GetInputValue to return an array
                }
            ];
        } else if (type === "delete") {
            return [
                {
                    id: "object",
                    name: "Object",
                    description: "The object to delete the property from.",
                    types: ["object", "unspecified"]
                },
                {
                    id: "key",
                    name: "Object Key",
                    description: "The key of the object to delete.",
                    types: ["text", "unspecified"],
                    multiInput: true // cauese GetInputValue to return an array
                }
            ];
        }
    },

    options(data) {
        return [
            {
                id: "action",
                name: "Action Type",
                description: "Choose the type of action to perform on the object.",
                type: "SELECT",
                options: [
                    { id: "create", name: "Create Object", description: "Create a new object with specified properties." },
                    { id: "edit", name: "Edit Property", description: "Edit an existing property of an object. Will keep original values if not set." },
                    { id: "delete", name: "Delete Property", description: "Delete a property from an object." }
                ]
            }
        ]
    },

    outputs: [
        {
            id: "object",
            name: "Object",
            description: "The resulting object after the operation.",
            types: ["object"]
        }
    ],

    code(cache) {
        const action = this.GetOptionValue("action", cache) || "create";

        if (action === "create") {
            const object = {};
            const newkeys = this.GetInputValue("key", cache);
            const values = this.GetInputValue("value", cache);
            function addPropertyToNestedKeys(obj, keys, propName, propValue) {
                let currentObj = obj;
                for (const key of keys) {
                    if (!currentObj[key]) {
                        currentObj[key] = {};
                    }
                    currentObj = currentObj[key];
                }
                currentObj[propName] = propValue;
            }

            if (Array.isArray(newkeys) && Array.isArray(values) && newkeys.length === values.length) {
                for (let i = 0; i < newkeys.length; i++) {
                    const keyPath = String(newkeys[i]).split('.').map(k => k.trim()).filter(k => k);
                    if (keyPath.length > 0) {
                        addPropertyToNestedKeys(object, keyPath.slice(0, -1), keyPath[keyPath.length - 1], values[i]);
                    }
                }
            }

            this.StoreOutputValue(object, "object", cache);
        } else if (action === "edit") {
            const object = this.GetInputValue("object", cache);
            const newkeys = this.GetInputValue("key", cache);
            const values = this.GetInputValue("value", cache);
            function addPropertyToNestedKeys(obj, keys, propName, propValue) {
                let currentObj = obj;
                for (const key of keys) {
                    if (!currentObj[key]) {
                        currentObj[key] = {};
                    }
                    currentObj = currentObj[key];
                }
                currentObj[propName] = propValue;
            }

            if (Array.isArray(newkeys) && Array.isArray(values) && newkeys.length === values.length) {
                for (let i = 0; i < newkeys.length; i++) {
                    const keyPath = String(newkeys[i]).split('.').map(k => k.trim()).filter(k => k);
                    if (keyPath.length > 0) {
                        addPropertyToNestedKeys(object, keyPath.slice(0, -1), keyPath[keyPath.length - 1], values[i]);
                    }
                }
            }

            this.StoreOutputValue(object, "object", cache);
        } else if (action === "delete") {
            const object = this.GetInputValue("object", cache);
            const delkeys = this.GetInputValue("key", cache);
            function deletePropertyFromNestedKeys(obj, keys) {
                let currentObj = obj;
                for (let i = 0; i < keys.length - 1; i++) {
                    const key = keys[i];
                    if (!currentObj[key]) {
                        return; // Key path does not exist
                    }
                    currentObj = currentObj[key];
                }
                delete currentObj[keys[keys.length - 1]];
            }
            if (Array.isArray(delkeys)) {
                for (const delkey of delkeys) {
                    const keyPath = String(delkey).split('.').map(k => k.trim()).filter(k => k);
                    if (keyPath.length > 0) {
                        deletePropertyFromNestedKeys(object, keyPath);
                    }
                }
            }
            this.StoreOutputValue(object, "object", cache);
        }
    }
}