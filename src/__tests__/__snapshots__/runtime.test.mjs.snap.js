exports[`Runtime : root.json fixture : generates valid code 1`] = {
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
