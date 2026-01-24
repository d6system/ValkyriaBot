module.exports = {
    name: "Number to Words",

    description: "Converts Numbers (including decimal points) into words. It also converts the numbers into words for currency. By Domin0221",

    category: "Extras",
    
    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "number",
            "name": "Number",
            "description": "Acceptable Types: Number, Unspecified\n\nDescription: The number to convert.",
            "types": ["number", "unspecified"],
            "required": true
        }
    ],

    options: [
        {
            "id": "language",
            "name": "Language",
            "description": "Description: The language for converted number.",
            "type": "SELECT",
            "options": {
                "en-US": "English - USA",
                "en-GB": "English - UK",
                "euro": "English - European Union",
                "en-AE": "English - UAE",
                "en-BD": "English - Bangladesh",
                "en-GH": "English - Ghana",
                "en-IE": "English - Ireland",
                "en-IN": "English - India",
                "en-MM": "English - Myanmar",
                "en-MU": "English - Mauritius",
                "en-NG": "English - Nigeria",
                "en-NP": "English - Nepal",
                "en-PH": "English - Philippines",
                "ee-EE": "Estonian - Estonia",
                "fa-IR": "Persian - Iran",
                "fr-BE": "French - Belgium",
                "fr-FR": "French - France",
                "gu-IN": "Gujarati - India",
                "hi-IN": "Hindi - India",
                "mr-IN": "Marathi - India",
                "nl-SR": "Dutch - Suriname",
                "pt-BR": "Portuguese - Brazil",
                "tr-TR": "Turkish - Turkey",
                "ko-KR": "Korean - South Korea"
            }
        },
        {
            "id": "currency",
            "name": "Add Currency Name",
            "description": "Description: Whether the number to be converted into words written as currency. Note: When currency is enabled, number will be rounded off to two decimals before converting to words.",
            "type": "checkbox"
        },
        {
            "id": "decimal",
            "name": "Ignore Decimal",
            "description": "Description: Whether to ignore fractional unit of number while converting into words.",
            "type": "checkbox"
        },
        {
            "id": "zeroCurrency",
            "name": "Ignore Zero Currency",
            "description": "Description: Whether to ignore zero currency value while converting into words.",
            "type": "checkbox"
        },
        {
            "id": "addOnly",
            "name": "Do Not Add \"Only\"",
            "description": "Description: Do not add \"Only\" at the end of the words. This works only when currency is enabled.",
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
            "id": "words",
            "name": "Words",
            "description": "Type: Text\n\nDescription: The number converted to words.",
            "types": ["text", "unspecified"]
        }
    ],
    async code(cache) {
        const { ToWords } = await this.require("to-words");
        const number = parseFloat(this.GetInputValue("number", cache));
        let language = this.GetOptionValue("language", cache);
        const currency = this.GetOptionValue("currency", cache);
        const decimal = this.GetOptionValue("decimal", cache);
        const zeroCurrency = this.GetOptionValue("zeroCurrency", cache);
        const addOnly = this.GetOptionValue("addOnly", cache);

        let euro;
        if (language === 'euro') {
            euro = {
              name: 'Euro',
              plural: 'Euros',
              symbol: '€',
              fractionalUnit: {
                name: 'Cent',
                plural: 'Cents',
                symbol: '',
              },
            };
            language = 'en-US';
          } else {
            euro = undefined;
          };

        const toWords = new ToWords({
            localeCode: language,
            converterOptions: {
              currency: currency,
              ignoreDecimal: decimal,
              ignoreZeroCurrency: zeroCurrency,
              doNotAddOnly: addOnly,
              currencyOptions: euro,
            },
          });

        const convertedWords = toWords.convert(number);
        this.StoreOutputValue(convertedWords, "words", cache);
        this.RunNextBlock("action", cache);
    }
};
