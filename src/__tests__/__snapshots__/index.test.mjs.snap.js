exports[`Codegen resolver : real samples : root.json : esm 1`] = {
  "/home/p0lip/Projects/json-ref-escodegen/src/__tests__/__fixtures__/void/3183748318.mjs": "import _createArray from \"json-ref-escodegen/runtime/create-array.mjs\";\nimport _3949625684 from \"./3949625684.mjs\";\nimport _1136828491 from \"./1136828491.mjs\";\nconst $ = {\n  \"allOf\": _createArray([{\n    \"$ref\": \"./todo-full.json#\"\n  }, {\n    \"$ref\": \"./user.json#\"\n  }], [[\"0\", function () {\n    return _3949625684;\n  }], [\"1\", function () {\n    return _1136828491;\n  }]])\n};\nexport {$ as default};\n",
  "/home/p0lip/Projects/json-ref-escodegen/src/__tests__/__fixtures__/void/3949625684.mjs": "import _1136828491 from \"./1136828491.mjs\";\nimport _createArray from \"json-ref-escodegen/runtime/create-array.mjs\";\nimport _320072186 from \"./320072186.mjs\";\nconst $ = {\n  \"title\": \"Todo Full\",\n  \"allOf\": _createArray([{\n    \"$ref\": \"./todo-partial.json#\"\n  }, {\n    \"type\": \"object\",\n    \"properties\": {\n      \"id\": {\n        \"type\": \"integer\",\n        \"minimum\": 0,\n        \"maximum\": 1000000\n      },\n      \"completed_at\": {\n        \"type\": [\"string\", \"null\"],\n        \"format\": \"date-time\"\n      },\n      \"created_at\": {\n        \"type\": \"string\",\n        \"format\": \"date-time\"\n      },\n      \"updated_at\": {\n        \"type\": \"string\",\n        \"format\": \"date-time\"\n      },\n      get \"user\"() {\n        return _1136828491;\n      }\n    },\n    \"required\": [\"id\", \"user\"]\n  }], [[\"0\", function () {\n    return _320072186;\n  }]]),\n  \"x-tags\": [\"Todos\"]\n};\nexport {$ as default};\n",
  "/home/p0lip/Projects/json-ref-escodegen/src/__tests__/__fixtures__/void/1136828491.mjs": "const $ = {\n  \"title\": \"User\",\n  \"type\": \"object\",\n  \"properties\": {\n    \"name\": {\n      \"type\": \"string\",\n      \"description\": \"The user's full name.\"\n    },\n    \"age\": {\n      \"type\": \"number\",\n      \"minimum\": 0,\n      \"maximum\": 150\n    }\n  },\n  \"required\": [\"name\", \"age\"],\n  \"x-tags\": [\"Todos\"]\n};\nexport {$ as default};\n",
  "/home/p0lip/Projects/json-ref-escodegen/src/__tests__/__fixtures__/void/320072186.mjs": "const $ = {\n  \"title\": \"Todo Partial\",\n  \"type\": \"object\",\n  \"properties\": {\n    \"name\": {\n      \"type\": \"string\"\n    },\n    \"completed\": {\n      \"type\": [\"boolean\", \"null\"]\n    }\n  },\n  \"required\": [\"name\", \"completed\"],\n  \"x-tags\": [\"Todos\"]\n};\nexport {$ as default};\n"
};
exports[`Codegen resolver : real samples : root.json : actual stringified text 1`] = {
  "allOf": [
    {
      "title": "Todo Full",
      "allOf": [
        {
          "title": "Todo Partial",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "completed": {
              "type": [
                "boolean",
                "null"
              ]
            }
          },
          "required": [
            "name",
            "completed"
          ],
          "x-tags": [
            "Todos"
          ]
        },
        {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1000000
            },
            "completed_at": {
              "type": [
                "string",
                "null"
              ],
              "format": "date-time"
            },
            "created_at": {
              "type": "string",
              "format": "date-time"
            },
            "updated_at": {
              "type": "string",
              "format": "date-time"
            },
            "user": {
              "title": "User",
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "description": "The user's full name."
                },
                "age": {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 150
                }
              },
              "required": [
                "name",
                "age"
              ],
              "x-tags": [
                "Todos"
              ]
            }
          },
          "required": [
            "id",
            "user"
          ]
        }
      ],
      "x-tags": [
        "Todos"
      ]
    },
    {
      "title": "User",
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "The user's full name."
        },
        "age": {
          "type": "number",
          "minimum": 0,
          "maximum": 150
        }
      },
      "required": [
        "name",
        "age"
      ],
      "x-tags": [
        "Todos"
      ]
    }
  ]
};
