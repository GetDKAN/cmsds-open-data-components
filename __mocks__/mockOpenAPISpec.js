// OpenAPI 3.0 specification fetched from https://data.healthcare.gov/api/1?authentication=false
// Used for Storybook stories and testing

const mockOpenAPISpec = {
  "openapi": "3.0.2",
  "info": {
    "title": "API Documentation",
    "version": "v1"
  },
  "components": {
    "responses": {
      "400BadJson": {
        "description": "Bad request, usually JSON schema validation failure.",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/errorResponse"
            },
            "example": {
              "message": "JSON Schema validation failed.",
              "status": 400,
              "timestamp": "2021-06-14T13:46:06+00:00",
              "data": {
                "keyword": "type",
                "pointer": "path/to/invalid/json/property",
                "message": "The attribute expected to be of type ''object'' but 'array' given."
              }
            }
          }
        }
      },
      "404IdNotFound": {
        "description": "Not found, usually due to incorrect identifier.",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/errorResponse"
            },
            "example": {
              "message": "Error retrieving metadata: 00000000-0000-0000-0000-000000000000 not found.",
              "status": 404,
              "timestamp": "2021-06-14T13:46:06+00:00"
            }
          }
        }
      },
      "200DatastoreCsvOk": {
        "description": "Ok, CSV successfully generated.",
        "content": {
          "text/csv": {
            "schema": {
              "type": "string"
            }
          }
        }
      },
      "200JsonOrCsvQueryOk": {
        "description": "Ok. JSON or CSV datastore response, depending on query.",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "results": {
                  "type": "array",
                  "items": {
                    "type": "object"
                  }
                },
                "count": {
                  "type": "integer"
                },
                "schema": {
                  "type": "object",
                  "description": "Schema of all resources queries, keyed by ID."
                },
                "query": {
                  "type": "object"
                }
              }
            }
          },
          "text/csv": {
            "schema": {
              "type": "string"
            }
          }
        }
      }
    },
    "schemas": {
      "errorResponse": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string",
            "description": "Error message."
          },
          "status": {
            "type": "integer"
          },
          "timestamp": {
            "type": "string",
            "format": "date-time"
          },
          "data": {
            "type": "object",
            "description": "Arbitrary object storing more detailed data on the error message."
          }
        }
      },
      "dataset": {
        "title": "Project Open Data Dataset",
        "description": "The metadata format for all federal open data.",
        "type": "object",
        "required": ["title", "description", "identifier", "accessLevel", "modified", "keyword"],
        "properties": {
          "title": {
            "title": "Title",
            "description": "Human-readable name of the asset.",
            "type": "string",
            "minLength": 1
          },
          "identifier": {
            "title": "Unique Identifier",
            "description": "A unique identifier for the dataset or API.",
            "type": "string",
            "minLength": 1
          },
          "description": {
            "title": "Description",
            "description": "Human-readable description with sufficient detail.",
            "type": "string",
            "minLength": 1
          }
        }
      }
    },
    "parameters": {
      "datasetUuid": {
        "name": "identifier",
        "in": "path",
        "description": "A dataset identifier",
        "required": true,
        "schema": {
          "type": "string"
        },
        "example": "e4rr-zk4i"
      }
    }
  },
  "paths": {
    "/api/1/datastore/query": {
      "post": {
        "operationId": "datastore-query-post",
        "summary": "Query one or more datastore resources",
        "tags": ["Datastore: query"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              },
              "example": {
                "conditions": [
                  {
                    "resource": "t",
                    "property": "record_number",
                    "value": 1,
                    "operator": ">"
                  }
                ],
                "limit": 3,
                "resources": [
                  {
                    "id": "f2f4cf6f-9534-5696-b3ba-ae35152bc11f",
                    "alias": "t"
                  }
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "$ref": "#/components/responses/200JsonOrCsvQueryOk"
          },
          "400": {
            "$ref": "#/components/responses/400BadJson"
          }
        }
      },
      "get": {
        "operationId": "datastore-query-get",
        "summary": "Query one or more datastore resources",
        "description": "Simple GET equivalent of a POST query.",
        "tags": ["Datastore: query"],
        "parameters": [
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "minimum": 1
            }
          },
          {
            "name": "offset",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 0
            }
          }
        ],
        "responses": {
          "200": {
            "$ref": "#/components/responses/200JsonOrCsvQueryOk"
          },
          "400": {
            "$ref": "#/components/responses/400BadJson"
          }
        }
      }
    },
    "/api/1/metastore/schemas": {
      "get": {
        "operationId": "metastore-get-schemas",
        "summary": "Get list of all schemas",
        "tags": ["Metastore"],
        "responses": {
          "200": {
            "description": "List of metastore schemas.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "description": "Full collection of available metastore schemas"
                }
              }
            }
          }
        }
      }
    },
    "/api/1/search": {
      "get": {
        "operationId": "search",
        "summary": "Search the DKAN catalog",
        "description": "Search description.",
        "tags": ["Search"],
        "parameters": [
          {
            "name": "fulltext",
            "in": "query",
            "description": "Full-text search to run against metadata fields.",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "The page of the result set.",
            "schema": {
              "type": "integer",
              "default": 1
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "total": {
                      "type": "integer",
                      "description": "Total search results for query."
                    },
                    "results": {
                      "type": "object",
                      "description": "Dataset objects from the DKAN metastore."
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "tags": [
    {
      "name": "Metastore",
      "description": "Work with metadata items."
    },
    {
      "name": "Datastore: query",
      "description": "Query datastore resources."
    },
    {
      "name": "Search",
      "description": "Search the DKAN catalog."
    }
  ]
};

export default mockOpenAPISpec;
