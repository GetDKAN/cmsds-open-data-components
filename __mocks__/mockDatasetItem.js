export const mockDatasetItem = {
  "@type": "dcat:Dataset",
  "title": "AB Registration Completion List",
  "identifier": "wb6u-x2ny",
  "description": "Access Data Dictionary Here - \u003Ca href=\u0022https:\/\/www.cms.gov\/CCIIO\/Programs-and-Initiatives\/Health-Insurance-Marketplaces\/Downloads\/62416-AB-Registration-Completion-List-Data-Dictionary-Web_v1.pdf\u0022\u003EData Dictionary (PDF)\u003C\/a\u003E Access Lines of Authority Here - \u003Ca href=\u0022\/AB-NIPR-Health-Line-Of-Authority\u0022\u003ENIPR Health Line of Authority\u003C\/a\u003E",
  "accessLevel": "public",
  "accrualPeriodicity": "R\/P10Y",
  "issued": "2016-03-30T14:54:00+00:00",
  "modified": "2026-02-10T13:47:00+00:00",
  "license": "https:\/\/www.usa.gov\/publicdomain\/label\/1.0\/",
  "publisher": {
    "identifier": "22605d3f-165a-5f35-b505-e49afed1b35e",
    "data": {
      "@type": "org:Organization",
      "name": "data.healthcare.gov"
    }
  },
  "contactPoint": {
    "fn": "FFMProducer-AssisterHelpDesk",
    "hasEmail": "mailto:FFMProducer-AssisterHelpDesk@cms.hhs.gov"
  },
  "keyword": [{
    "identifier": "20adf107-bea9-5565-b3aa-8dacee8066b0",
    "data": "healthcare"
  }],
  "distribution": [{
      "identifier": "479a03e6-ccf1-5636-9fd3-cad48c11177d",
      "data": {
        "@type": "dcat:Distribution",
        "title": "Registration Completion List for 2016- Present",
        "description": " ",
        "format": "csv",
        "mediaType": "text\/csv",
        "downloadURL": "https:\/\/data.healthcare.gov\/sites\/default\/files\/uploaded_resources\/TBL_RCL_312.csv",
        "describedBy": "https:\/\/data.healthcare.gov\/api\/1\/metastore\/schemas\/data-dictionary\/items\/22ad17f4-1b4d-4382-b940-79bddc8bb610",
        "describedByType": "application\/vnd.tableschema+json",
        "%Ref:downloadURL": [{
          "identifier": "d4dd979006600e7d231e65e435e042ea__1770731333__source",
          "data": {
            "filePath": "https:\/\/h-o.st\/sites\/default\/files\/uploaded_resources\/TBL_RCL_312.csv",
            "identifier": "d4dd979006600e7d231e65e435e042ea",
            "mimeType": "text\/csv",
            "perspective": "source",
            "version": "1770731333",
            "checksum": null
          }
        }]
      }
    },
    {
      "identifier": "8219e5c2-8fa6-5024-b5cd-bcd4e3858e7b",
      "data": {
        "@type": "dcat:Distribution",
        "title": "Registration Completion List for 2014 \u0026 2015",
        "description": "The Registration Completion List has been divided into two separate datasets: one for plan years 2014 \u0026 2015 and another for plan years 2016 to the present. The link above provides access to the 2014-2015 dataset.",
        "format": "csv",
        "downloadURL": "https:\/\/data.healthcare.gov\/sites\/default\/files\/uploaded_resources\/RCL_2014_2015_2.csv",
        "%Ref:downloadURL": [{
          "identifier": "e46bd7e34e7cf84d1d7422bd13d2ff59__1770731333__source",
          "data": {
            "filePath": "https:\/\/h-o.st\/sites\/default\/files\/uploaded_resources\/RCL_2014_2015_2.csv",
            "identifier": "e46bd7e34e7cf84d1d7422bd13d2ff59",
            "mimeType": "text\/csv",
            "perspective": "source",
            "version": "1770731333",
            "checksum": null
          }
        }]
      }
    }
  ],
  "bureauCode": [
    "009:38"
  ],
  "programCode": [
    "009:000"
  ],
  "%modified": "2026-02-10T08:48:52-0500"
};

export const mockDatasetItemDistribution1 = {
  "count": 100,
  "query": {
    "results": false,
    "schema": false,
    "resources": [{
      "id": "479a03e6-ccf1-5636-9fd3-cad48c11177d",
      "alias": "t"
    }],
    "limit": 500,
    "offset": 0,
    "count": true,
    "keys": true,
    "format": "json",
    "rowIds": false,
    "properties": [
      "npn",
      "applicable_plan_year",
      "individual_registration_completion_date",
      "individual_marketplace_end_date",
      "shop_registration_completion_date",
      "shop_end_date",
      "npn_valid_current_plan_year_only"
    ]
  }
};

export const mockDatasetItemDistribution2 = {
  "count": 169462,
  "query": {
    "results": false,
    "schema": false,
    "resources": [{
      "id": "8219e5c2-8fa6-5024-b5cd-bcd4e3858e7b",
      "alias": "t"
    }],
    "limit": 500,
    "offset": 0,
    "count": true,
    "keys": true,
    "format": "json",
    "rowIds": false,
    "properties": [
      "npn",
      "applicable_plan_year",
      "individual_registration_completion_date",
      "individual_marketplace_end_date",
      "shop_registration_completion_date",
      "shop_end_date",
      "npn_valid_current_plan_year_only"
    ]
  }
};

export const mockDatasetItemDataDictionary = {
  "identifier": "22ad17f4-1b4d-4382-b940-79bddc8bb610",
  "data": {
    "title": "AB Registration Completion List Dictionary",
    "fields": [{
        "name": "npn",
        "title": "NPN",
        "description": "The National Producer Number (NPN) of the agent or broker as entered by the agent or broker on the Marketplace Learning Management System (MLMS) as part of FFM registration. This column includes personal NPNs entered by agents and brokers, in addition to NPNs of business entities and web-brokers, when agents and brokers self-identify as the authorized representative of a business entity and\/or webbroker.  Be aware that an agent\u0027s or broker\u0027s registration effective date for a particular plan year may fall before, during, or after a plan year\u0027s individual market open enrollment period. Agents and brokers may only assist consumers with Marketplace transactions while they have a valid FFM registration for the applicable plan year.Agent\/broker identifying information is self-reported and is subject to user error.",
        "type": "string",
        "format": "default"
      },
      {
        "name": "applicable_plan_year",
        "title": "Applicable Plan Year",
        "description": "The consecutive 12-month period during which a health plan provides coverage for health benefits, described at 45 CFR 155.20. Terminated Agents and Brokers are prohibited from selling health plans that fall within the plan year. A plan year may be a calendar year or otherwise.",
        "type": "string",
        "format": "default"
      },
      {
        "name": "individual_registration_completion_date",
        "title": "Individual Market Registration Completion Date",
        "description": "The date on which the agent or broker completed Individual FFM registration for the individual market for the applicable plan year.",
        "type": "date",
        "format": "%m\/%d\/%Y"
      },
      {
        "name": "individual_marketplace_end_date",
        "title": "Individual Market Registration End Date",
        "description": "The date on which the agent\u0027s or broker\u0027s FFM registration for the individual market expires for the applicable plan year. The agent or broker may not continue to assist with or facilitate enrollment of qualified individuals in coverage in a manner that constitutes enrollment through an FFM or SBM-FP, or assists individuals in applying for advance payments of the premium tax credit and cost-sharing reductions for QHPs sold through a FFM or SBM-FP after this date, unless and until the FFM registration and CMS agreements for the following plan year has been completed.",
        "type": "date",
        "format": "%m\/%d\/%Y"
      },
      {
        "name": "shop_registration_date",
        "title": "SHOP Registration Completion Date",
        "description": "The date on which the agent or broker completed SHOP registration requirements (i.e., signing the Marketplace Agreement and identity proofing) to participate in the SHOP Marketplace for the applicable plan year.",
        "type": "date",
        "format": "%m\/%d\/%Y"
      },
      {
        "name": "shop_end_date",
        "title": "SHOP Registration End Date",
        "description": "The date on which the agent\u0027s or broker\u0027s FF-SHOP SHOP registration FFM expires for the applicable plan year. The agent or broker may not continue to assist with or facilitate enrollment of qualified employers or qualified employees in coverage in a manner that constitutes enrollment through an FF-SHOP or an SBMFP that uses the Federal platform to support select SHOP eligibility and enrollment functions after this date, unless and until FF-SHOP registration for the following plan year has been completed.",
        "type": "date",
        "format": "%m\/%d\/%Y"
      },
      {
        "name": "npn_valid_current_plan_year_only",
        "title": "NPN Valid [Current Plan Year]",
        "description": "Indicator for the current plan year.  A \u0022Y\u0022 means that the NPN is valid in National Insurance Producer Registry (NIPR) and has an active status in a healthcare line of authority.  \u0022N\u0022 means that the NPN is invalid in NIPR or the NPN is not active in a healthcare related line of authority. Previous plan years will have a dash \u0022- \u0022 in the column.",
        "type": "string",
        "format": "default"
      },
      {
        "name": "status",
        "title": "Status Code",
        "description": "The Reason Code describing why an individual\u0027s National Producer Number (NPN) was added to the Registration Completion List.\r\n\r\nAlpha Character (Status indicator)\r\nR - Reinstated\r\nT - Terminated: Barred\r\n\r\nNumeric Character (Reason indicator)\r\n1 - Resident State Expired licensure\/Missing LOA or Appointment\r\n2 - Non-Resident State Expired licensure\/Missing LOA or Appointment\r\n3 - Fraud or Abusive Conduct\r\n4 - Non-Compliance\r\n\r\nStatus Combination Details\r\n\r\nReinstated\r\nR1 - Reinstated after a finding of resident state licensure issue\r\nR2 - Reinstated after a finding of Non-Resident state licensure issue\r\nR3 - Reinstated after a finding of Fraud or Abusive Conduct\r\nR4 - Reinstated after a finding of Non-Compliance\r\n\r\nTerminated: Barred\r\nT1 - Terminated for Resident state licensure\r\nT2 - Terminated for Non-Resident state licensure\r\nT3 - Terminated for Fraud or Abusive Conduct\r\nT4 - Terminated for Non-Compliance",
        "type": "string",
        "format": "default"
      }
    ]
  }
};

export const mockDatasetItemDocs = {
  "openapi": "3.0.2",
  "info": {
    "title": "API Documentation",
    "version": "v1"
  },
  "paths": {
    "\/api\/1\/metastore\/schemas\/dataset\/items\/wb6u-x2ny": {
      "get": {
        "operationId": "dataset-get-item",
        "summary": "Get a single dataset.",
        "tags": [
          "Metastore: dataset"
        ],
        "parameters": [{
          "$ref": "#\/components\/parameters\/showReferenceIds"
        }],
        "responses": {
          "200": {
            "description": "Full dataset item.",
            "content": {
              "application\/json": {
                "schema": {
                  "$ref": "#\/components\/schemas\/dataset"
                }
              }
            }
          },
          "404": {
            "$ref": "#\/components\/responses\/404IdNotFound"
          }
        }
      }
    },
    "\/api\/1\/datastore\/query\/wb6u-x2ny\/{index}": {
      "post": {
        "operationId": "datastore-datasetindex-query-post",
        "summary": "Query a single datastore resource",
        "tags": [
          "Datastore: query"
        ],
        "parameters": [{
          "$ref": "#\/components\/parameters\/datastoreDistributionIndex"
        }],
        "requestBody": {
          "required": true,
          "content": {
            "application\/json": {
              "schema": {
                "$ref": "#\/components\/schemas\/datastoreResourceQuery"
              },
              "example": {
                "conditions": [{
                  "resource": "t",
                  "property": "record_number",
                  "value": 1,
                  "operator": "\u003E"
                }],
                "limit": 3
              }
            }
          }
        },
        "responses": {
          "200": {
            "$ref": "#\/components\/responses\/200JsonOrCsvQueryOk"
          },
          "400": {
            "$ref": "#\/components\/responses\/400BadJson"
          },
          "404": {
            "$ref": "#\/components\/responses\/404IdNotFound"
          }
        }
      },
      "get": {
        "operationId": "datastore-datasetindex-query-get",
        "summary": "Query a single datastore resource with get",
        "description": "Simple GET equivalent of a POST query -- see the POST endpoint documentation for full query schema. A few basic parameters are provided here as examples. For more reliable queries, write your query in JSON and then convert to a query string. See [this web tool](https:\/\/www.convertonline.io\/convert\/json-to-query-string) for an example.",
        "tags": [
          "Datastore: query"
        ],
        "parameters": [{
            "$ref": "#\/components\/parameters\/datastoreDistributionIndex"
          },
          {
            "$ref": "#\/components\/parameters\/datastoreQueryLimit"
          },
          {
            "$ref": "#\/components\/parameters\/datastoreQueryOffset"
          },
          {
            "$ref": "#\/components\/parameters\/datastoreQueryCount"
          },
          {
            "$ref": "#\/components\/parameters\/datastoreQueryResults"
          },
          {
            "$ref": "#\/components\/parameters\/datastoreQuerySchema"
          },
          {
            "$ref": "#\/components\/parameters\/datastoreQueryKeys"
          },
          {
            "$ref": "#\/components\/parameters\/datastoreQueryFormat"
          },
          {
            "$ref": "#\/components\/parameters\/datastoreQueryRowIds"
          }
        ],
        "responses": {
          "200": {
            "$ref": "#\/components\/responses\/200JsonOrCsvQueryOk"
          },
          "400": {
            "$ref": "#\/components\/responses\/400BadJson"
          },
          "404": {
            "$ref": "#\/components\/responses\/404IdNotFound"
          }
        }
      }
    },
    "\/api\/1\/datastore\/query\/{distributionId}": {
      "post": {
        "operationId": "datastore-resource-query-post",
        "summary": "Query a single datastore resource",
        "tags": [
          "Datastore: query"
        ],
        "parameters": [{
          "$ref": "#\/components\/parameters\/datastoreDistributionUuid"
        }],
        "requestBody": {
          "required": true,
          "content": {
            "application\/json": {
              "schema": {
                "$ref": "#\/components\/schemas\/datastoreResourceQuery"
              },
              "example": {
                "conditions": [{
                  "resource": "t",
                  "property": "record_number",
                  "value": 1,
                  "operator": "\u003E"
                }],
                "limit": 3
              }
            }
          }
        },
        "responses": {
          "200": {
            "$ref": "#\/components\/responses\/200JsonOrCsvQueryOk"
          },
          "400": {
            "$ref": "#\/components\/responses\/400BadJson"
          },
          "404": {
            "$ref": "#\/components\/responses\/404IdNotFound"
          }
        }
      },
      "get": {
        "operationId": "datastore-resource-query-get",
        "summary": "Query a single datastore resource with get",
        "description": "Simple GET equivalent of a POST query. Note that parameters containing arrays or objects are not yet supported by SwaggerUI. For conditions, sorts, and other complex parameters, write your query in JSON and then convert to a nested query string. See [this web tool](https:\/\/www.convertonline.io\/convert\/json-to-query-string) for an example.",
        "tags": [
          "Datastore: query"
        ],
        "parameters": [{
            "$ref": "#\/components\/parameters\/datastoreDistributionUuid"
          },
          {
            "$ref": "#\/components\/parameters\/datastoreQueryLimit"
          },
          {
            "$ref": "#\/components\/parameters\/datastoreQueryOffset"
          },
          {
            "$ref": "#\/components\/parameters\/datastoreQueryCount"
          },
          {
            "$ref": "#\/components\/parameters\/datastoreQueryResults"
          },
          {
            "$ref": "#\/components\/parameters\/datastoreQuerySchema"
          },
          {
            "$ref": "#\/components\/parameters\/datastoreQueryKeys"
          },
          {
            "$ref": "#\/components\/parameters\/datastoreQueryFormat"
          },
          {
            "$ref": "#\/components\/parameters\/datastoreQueryRowIds"
          }
        ],
        "responses": {
          "200": {
            "$ref": "#\/components\/responses\/200JsonOrCsvQueryOk"
          },
          "400": {
            "$ref": "#\/components\/responses\/400BadJson"
          },
          "404": {
            "$ref": "#\/components\/responses\/404IdNotFound"
          }
        }
      }
    },
    "\/api\/1\/datastore\/sql": {
      "get": {
        "operationId": "datastore-sql",
        "summary": "Query resources in datastore",
        "description": "Interact with resources in the datastore using an SQL-like syntax.\n",
        "tags": [
          "Datastore: SQL Query"
        ],
        "parameters": [{
            "name": "query",
            "in": "query",
            "description": "A SQL-like query.\n\nA `SELECT` using the `show_db_columns` parameter will make it easier to build queries against the data as\nit returns columns without spaces and in some cases, truncated names where the human readable column header\nis very long.\n\n`\/api\/1\/datastore\/sql?query=[SELECT * FROM DATASTORE_UUID][LIMIT 1 OFFSET 0];\u0026show_db_columns`\n\nYou can then build the `SELECT` part of the query. Do not use spaces between its arguments.\n\n`\/api\/1\/datastore\/sql?query=[SELECT a,b,c, FROM DATASTORE_UUID]`\n\n`WHERE` can use any column in the data.\n\n`\/api\/1\/datastore\/sql?query=[SELECT a,b FROM DATASTORE_UUID][WHERE c = \u0022CCC\u0022];\u0026show_db_columns`\n\n`LIMIT` and `OFFSET` allow you to get more than the 500 record limit, by using successive queries:\n\n`\/api\/1\/datastore\/sql?query=[SELECT a,b,c FROM DATASTORE_UUID][WHERE d = \u0022CCC\u0022][LIMIT 500 OFFSET 0];\u0026show_db_columns`\n\n`\/api\/1\/datastore\/sql?query=[SELECT a,b,c FROM DATASTORE_UUID][WHERE d = \u0022DDD\u0022][LIMIT 500 OFFSET 500];\u0026show_db_columns`\n\nNote: `SELECT`, `WHERE` and `LIMIT...OFFSET` clauses must each be included within brackets `[ ]`.\n",
            "required": true,
            "schema": {
              "type": "string"
            },
            "style": "form",
            "examples": {
              "Registration Completion List for 2014 \u0026 2015": {
                "summary": "Query distribution 8219e5c2-8fa6-5024-b5cd-bcd4e3858e7b",
                "value": "[SELECT * FROM 8219e5c2-8fa6-5024-b5cd-bcd4e3858e7b][LIMIT 2]"
              }
            }
          },
          {
            "name": "show_db_columns",
            "in": "query",
            "description": "Add `\u0026show_db_columns` to return columns without spaces and in some cases, truncated names where the human\nreadable column header is very long.\n",
            "schema": {
              "type": "boolean"
            },
            "style": "form",
            "allowEmptyValue": true
          }
        ],
        "responses": {
          "200": {
            "description": "Ok. Query successful.",
            "content": {
              "application\/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "description": "Simple result row, key\/value pairs."
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "parameters": {
      "datastoreDistributionUuid": {
        "name": "distributionId",
        "in": "path",
        "description": "A distribution ID",
        "required": true,
        "schema": {
          "type": "string"
        },
        "examples": {
          "479a03e6-ccf1-5636-9fd3-cad48c11177d": {
            "value": "479a03e6-ccf1-5636-9fd3-cad48c11177d",
            "summary": "Registration Completion List for 2016- Present"
          },
          "8219e5c2-8fa6-5024-b5cd-bcd4e3858e7b": {
            "value": "8219e5c2-8fa6-5024-b5cd-bcd4e3858e7b",
            "summary": "Registration Completion List for 2014 \u0026 2015"
          }
        }
      },
      "datastoreDatasetUuid": {
        "name": "datasetId",
        "in": "path",
        "description": "A dataset ID",
        "required": true,
        "schema": {
          "type": "string"
        },
        "example": "wb6u-x2ny"
      },
      "datastoreDistributionIndex": {
        "name": "index",
        "in": "path",
        "description": "The index of a distribution in a dataset\u0027s distribution array. For instance, the first distribution in a dataset would have an index of \u00220,\u0022 the second would have \u00221\u0022, etc.",
        "required": true,
        "schema": {
          "type": "string"
        },
        "examples": {
          "index0": {
            "value": "0",
            "summary": "Registration Completion List for 2016- Present"
          },
          "index1": {
            "value": "1",
            "summary": "Registration Completion List for 2014 \u0026 2015"
          }
        }
      },
      "datastoreQueryLimit": {
        "name": "limit",
        "in": "query",
        "style": "deepObject",
        "explode": true,
        "schema": {
          "$ref": "#\/components\/schemas\/datastoreQuery\/properties\/limit"
        }
      },
      "datastoreQueryOffset": {
        "name": "offset",
        "in": "query",
        "style": "deepObject",
        "explode": true,
        "schema": {
          "$ref": "#\/components\/schemas\/datastoreQuery\/properties\/offset"
        }
      },
      "datastoreQueryCount": {
        "name": "count",
        "in": "query",
        "style": "deepObject",
        "explode": true,
        "schema": {
          "$ref": "#\/components\/schemas\/datastoreQuery\/properties\/count"
        }
      },
      "datastoreQueryResults": {
        "name": "results",
        "in": "query",
        "style": "deepObject",
        "explode": true,
        "schema": {
          "$ref": "#\/components\/schemas\/datastoreQuery\/properties\/results"
        }
      },
      "datastoreQuerySchema": {
        "name": "schema",
        "in": "query",
        "style": "deepObject",
        "explode": true,
        "schema": {
          "$ref": "#\/components\/schemas\/datastoreQuery\/properties\/schema"
        }
      },
      "datastoreQueryKeys": {
        "name": "keys",
        "in": "query",
        "style": "deepObject",
        "explode": true,
        "schema": {
          "$ref": "#\/components\/schemas\/datastoreQuery\/properties\/keys"
        }
      },
      "datastoreQueryFormat": {
        "name": "format",
        "in": "query",
        "style": "deepObject",
        "explode": true,
        "schema": {
          "$ref": "#\/components\/schemas\/datastoreQuery\/properties\/format"
        }
      },
      "datastoreQueryRowIds": {
        "name": "rowIds",
        "in": "query",
        "style": "deepObject",
        "explode": true,
        "schema": {
          "$ref": "#\/components\/schemas\/datastoreQuery\/properties\/rowIds"
        }
      },
      "showReferenceIds": {
        "name": "show-reference-ids",
        "in": "query",
        "description": "Metastore objects often include references to other objects stored in other schemas. These references are usually hidden in responses. Some identifiers are necessary to work with other API endpoints (e.g. datastore endpoints may require the distribution identifier). Add `?show-reference-ids` to show the identifiers generated by DKAN.",
        "schema": {
          "type": "boolean",
          "default": false
        },
        "style": "form",
        "allowEmptyValue": true
      },
      "datasetUuid": {
        "name": "identifier",
        "in": "path",
        "description": "A dataset identifier",
        "required": true,
        "schema": {
          "type": "string"
        },
        "example": "wb6u-x2ny"
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
      "datastoreQuery": {
        "title": "Datastore Query",
        "description": "Schema for DKAN datastore queries",
        "type": "object",
        "properties": {
          "resources": {
            "type": "array",
            "title": "Resources",
            "description": "Resources to query against and aliases. Usually you will add only one resource to this array, but if performing a join, list the primary resource first and then add resources to be used in the joins array.",
            "items": {
              "type": "object",
              "properties": {
                "alias": {
                  "type": "string",
                  "description": "Alias to use to refer to this resource elsewhere in the query."
                }
              }
            }
          },
          "properties": {
            "type": "array",
            "items": {
              "anyOf": [{
                  "$ref": "#\/components\/schemas\/datastoreQueryResource"
                },
                {
                  "type": "object",
                  "title": "Aliased property from specific resource",
                  "properties": {
                    "resource": {
                      "$ref": "#\/components\/schemas\/datastoreQueryResource"
                    },
                    "property": {
                      "$ref": "#\/components\/schemas\/datastoreQueryProperty"
                    },
                    "alias": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "resource",
                    "property"
                  ]
                },
                {
                  "type": "object",
                  "title": "Aliased expression",
                  "properties": {
                    "expression": {
                      "$ref": "#\/components\/schemas\/datastoreQueryExpression"
                    },
                    "alias": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "expression",
                    "alias"
                  ]
                }
              ]
            }
          },
          "conditions": {
            "type": "array",
            "description": "Conditions or groups of conditions for the query, bound by \u0027and\u0027 operator.",
            "items": {
              "anyOf": [{
                  "$ref": "#\/components\/schemas\/datastoreQueryCondition"
                },
                {
                  "$ref": "#\/components\/schemas\/datastoreQueryConditionGroup"
                }
              ]
            }
          },
          "joins": {
            "type": "array",
            "description": "Joins",
            "items": {
              "type": "object",
              "properties": {
                "resource": {
                  "$ref": "#\/components\/schemas\/datastoreQueryResource"
                },
                "condition": {
                  "$ref": "#\/components\/schemas\/datastoreQueryCondition"
                }
              },
              "required": [
                "resource",
                "condition"
              ]
            }
          },
          "groupings": {
            "type": "array",
            "description": "Properties or aliases to group results by.",
            "items": {
              "anyOf": [{
                  "$ref": "#\/components\/schemas\/datastoreQueryResource"
                },
                {
                  "$ref": "#\/components\/schemas\/datastoreQueryResourceProperty"
                }
              ]
            }
          },
          "limit": {
            "type": "integer",
            "description": "Limit for maximum number of records returned. Must be a minumum of 1.",
            "minimum": 1
          },
          "offset": {
            "type": "integer",
            "description": "Number of records to offset by or skip before returning first record.",
            "default": 0
          },
          "sorts": {
            "type": "array",
            "description": "Result sorting directives.",
            "items": {
              "$ref": "#\/components\/schemas\/datastoreQuerySort"
            }
          },
          "count": {
            "description": "Return a count of the total rows returned by the query, ignoring the limit\/offset.",
            "type": "boolean",
            "default": true
          },
          "results": {
            "description": "Return the result set. Set to false and set count to true to receive only a count of matches.",
            "type": "boolean",
            "default": true
          },
          "schema": {
            "description": "Return the schema for the datastore collection.",
            "type": "boolean",
            "default": true
          },
          "keys": {
            "description": "Return results as an array of keyed objects, with the column machine names as keys. If false, results will be an array of simple arrays of values.",
            "type": "boolean",
            "default": true
          },
          "format": {
            "type": "string",
            "description": "Format to return data in. Default is JSON, can be set to CSV.",
            "enum": [
              "csv",
              "json"
            ],
            "default": "json"
          },
          "rowIds": {
            "description": "Flag to include the result_number column in output. Default is FALSE",
            "type": "boolean",
            "default": false
          }
        }
      },
      "datastoreResourceQuery": {
        "title": "Datastore Resource Query",
        "description": "Schema for DKAN datastore queries. When querying against a specific resource, the \u0022resource\u0022 property is always optional. If you want to set it explicitly, note that it will be aliased to simply \u0022t\u0022.",
        "type": "object",
        "properties": {
          "properties": {
            "type": "array",
            "items": {
              "anyOf": [{
                  "$ref": "#\/components\/schemas\/datastoreQueryResource"
                },
                {
                  "type": "object",
                  "title": "Aliased property from specific resource",
                  "properties": {
                    "resource": {
                      "$ref": "#\/components\/schemas\/datastoreQueryResource"
                    },
                    "property": {
                      "$ref": "#\/components\/schemas\/datastoreQueryProperty"
                    },
                    "alias": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "resource",
                    "property"
                  ]
                },
                {
                  "type": "object",
                  "title": "Aliased expression",
                  "properties": {
                    "expression": {
                      "$ref": "#\/components\/schemas\/datastoreQueryExpression"
                    },
                    "alias": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "expression",
                    "alias"
                  ]
                }
              ]
            }
          },
          "conditions": {
            "type": "array",
            "description": "Conditions or groups of conditions for the query, bound by \u0027and\u0027 operator.",
            "items": {
              "anyOf": [{
                  "$ref": "#\/components\/schemas\/datastoreQueryCondition"
                },
                {
                  "$ref": "#\/components\/schemas\/datastoreQueryConditionGroup"
                }
              ]
            }
          },
          "groupings": {
            "type": "array",
            "description": "Properties or aliases to group results by.",
            "items": {
              "anyOf": [{
                  "$ref": "#\/components\/schemas\/datastoreQueryResource"
                },
                {
                  "$ref": "#\/components\/schemas\/datastoreQueryResourceProperty"
                }
              ]
            }
          },
          "limit": {
            "type": "integer",
            "description": "Limit for maximum number of records returned. Must be a minumum of 1.",
            "minimum": 1
          },
          "offset": {
            "type": "integer",
            "description": "Number of records to offset by or skip before returning first record.",
            "default": 0
          },
          "sorts": {
            "type": "array",
            "description": "Result sorting directives.",
            "items": {
              "$ref": "#\/components\/schemas\/datastoreQuerySort"
            }
          },
          "count": {
            "description": "Return a count of the total rows returned by the query, ignoring the limit\/offset.",
            "type": "boolean",
            "default": true
          },
          "results": {
            "description": "Return the result set. Set to false and set count to true to receive only a count of matches.",
            "type": "boolean",
            "default": true
          },
          "schema": {
            "description": "Return the schema for the datastore collection.",
            "type": "boolean",
            "default": true
          },
          "keys": {
            "description": "Return results as an array of keyed objects, with the column machine names as keys. If false, results will be an array of simple arrays of values.",
            "type": "boolean",
            "default": true
          },
          "format": {
            "type": "string",
            "description": "Format to return data in. Default is JSON, can be set to CSV.",
            "enum": [
              "csv",
              "json"
            ],
            "default": "json"
          },
          "rowIds": {
            "description": "Flag to include the result_number column in output. Default is FALSE",
            "type": "boolean",
            "default": false
          }
        }
      },
      "datastoreQueryResource": {
        "type": "string",
        "description": "Alias to resource set in resources array. Not needed when only querying against one resource.",
        "title": "Datastore Query: resource"
      },
      "datastoreQueryProperty": {
        "type": "string",
        "description": "The property\/column or alias to filter by. Should not include collection\/table alias.",
        "pattern": "^[^.]+$",
        "title": "Datastore Query: property"
      },
      "datastoreQueryResourceProperty": {
        "type": "object",
        "description": "Property name with optional collection\/table alias.",
        "properties": {
          "resource": {
            "$ref": "#\/components\/schemas\/datastoreQueryResource"
          },
          "property": {
            "$ref": "#\/components\/schemas\/datastoreQueryProperty"
          }
        },
        "required": [
          "property"
        ],
        "title": "Datastore Query: resourceProperty"
      },
      "datastoreQueryConditionGroup": {
        "type": "object",
        "title": "Datastore Query: Conditional group",
        "description": "Group of conditions bound by \u0027and\u0027\/\u0027or\u0027 operators.",
        "properties": {
          "groupOperator": {
            "type": "string",
            "enum": [
              "and",
              "or"
            ]
          },
          "conditions": {
            "type": "array",
            "items": {
              "anyOf": [{
                  "$ref": "#\/components\/schemas\/datastoreQueryCondition"
                },
                {
                  "$ref": "#\/components\/schemas\/datastoreQueryConditionGroup"
                }
              ]
            }
          }
        },
        "required": [
          "conditions"
        ]
      },
      "datastoreQueryCondition": {
        "type": "object",
        "title": "Datastore Query: Condition",
        "description": "Condition object including property, value and operator. If querying only one resource, the \u0022resource\u0022 does not need to be specified.",
        "properties": {
          "resource": {
            "$ref": "#\/components\/schemas\/datastoreQueryResource"
          },
          "property": {
            "$ref": "#\/components\/schemas\/datastoreQueryProperty"
          },
          "value": {
            "anyOf": [{
                "type": "string"
              },
              {
                "type": "number"
              },
              {
                "type": "array",
                "items": {
                  "anyOf": [{
                      "type": "string"
                    },
                    {
                      "type": "number"
                    }
                  ]
                }
              },
              {
                "$ref": "#\/components\/schemas\/datastoreQueryResourceProperty"
              }
            ],
            "description": "The value to filter against."
          },
          "operator": {
            "oneOf": [{
                "type": "string",
                "description": "Comparison operators",
                "enum": [
                  "=",
                  "\u003C\u003E",
                  "\u003C",
                  "\u003C=",
                  "\u003E",
                  "\u003E="
                ]
              },
              {
                "type": "string",
                "pattern": "^([lL][iI][kK][eE]|[bB][eE][tT][wW][eE][eE][nN]|[iI][nN]|[nN][oO][tT] [iI][nN]|[cC][oO][nN][tT][aA][iI][nN][sS]|[sS][tT][aA][rR][tT][sS] [wW][iI][tT][hH]|[mM][aA][tT][cC][hH])$",
                "description": "Alphanumeric comparison operators, case-insensitive. One of: like, between, in, not in, contains, starts with, match"
              }
            ],
            "default": "="
          }
        },
        "required": [
          "property",
          "value"
        ]
      },
      "datastoreQueryExpression": {
        "type": "object",
        "title": "Datastore Query: Expression",
        "description": "Arithmetic or aggregate expression performed on one or more properties. Note that performing expressions on text or other non-numeric data types my yield unexpected results.",
        "properties": {
          "operator": {
            "oneOf": [{
                "type": "string",
                "pattern": "^([sS][uU][mM]|[cC][oO][uU][nN][tT]|[aA][vV][gG]|[mM][aA][xX]|[mM][iI][nN])$",
                "description": "Aggregate operators, case-insensitive. One of: sum, count, avg, max, min"
              },
              {
                "type": "string",
                "enum": [
                  "+",
                  "-",
                  "*",
                  "\/",
                  "%"
                ],
                "description": "Arithmetic operators"
              }
            ]
          },
          "operands": {
            "type": "array",
            "description": "Arithmetic operators will require two operands, aggregate operators should take only one. Do not combine arithmetic and aggregate operators in a single query.",
            "items": {
              "anyOf": [{
                  "type": "number",
                  "title": "Number"
                },
                {
                  "$ref": "#\/components\/schemas\/datastoreQueryProperty"
                },
                {
                  "$ref": "#\/components\/schemas\/datastoreQueryResourceProperty"
                },
                {
                  "type": "object",
                  "title": "Expression",
                  "properties": {
                    "expression": {
                      "$ref": "#\/components\/schemas\/datastoreQueryExpression"
                    }
                  }
                }
              ]
            }
          }
        }
      },
      "datastoreQuerySort": {
        "type": "object",
        "description": "Properties to sort by in a particular order.",
        "properties": {
          "resource": {
            "$ref": "#\/components\/schemas\/datastoreQueryResource"
          },
          "property": {
            "$ref": "#\/components\/schemas\/datastoreQueryProperty"
          },
          "order": {
            "type": "string",
            "description": "Order to sort in, lowercase.",
            "enum": [
              "asc",
              "desc"
            ]
          }
        },
        "title": "Datastore Query: sort"
      },
      "dataset": {
        "title": "Project Open Data Dataset",
        "description": "The metadata format for all federal open data. Validates a single JSON object entry (as opposed to entire Data.json catalog).",
        "type": "object",
        "required": [
          "title",
          "description",
          "identifier",
          "accessLevel",
          "modified",
          "keyword"
        ],
        "properties": {
          "@type": {
            "title": "Metadata Context",
            "type": "string",
            "description": "IRI for the JSON-LD data type. This should be dcat:Dataset for each Dataset.",
            "default": "dcat:Dataset"
          },
          "title": {
            "title": "Title",
            "description": "Human-readable name of the asset. Should be in plain English and include sufficient detail to facilitate search and discovery.",
            "type": "string",
            "minLength": 1
          },
          "identifier": {
            "title": "Unique Identifier",
            "description": "A unique identifier for the dataset or API as maintained within an Agency catalog or database.",
            "type": "string",
            "minLength": 1
          },
          "description": {
            "title": "Description",
            "description": "Human-readable description (e.g., an abstract) with sufficient detail to enable a user to quickly understand whether the asset is of interest.",
            "type": "string",
            "minLength": 1
          },
          "accessLevel": {
            "description": "The degree to which this dataset could be made publicly-available, regardless of whether it has been made available. Choices: public (Data asset is or could be made publicly available to all without restrictions), restricted public (Data asset is available under certain use restrictions), or non-public (Data asset is not available to members of the public).",
            "title": "Public Access Level",
            "type": "string",
            "enum": [
              "public",
              "restricted public",
              "non-public"
            ],
            "default": "public"
          },
          "accrualPeriodicity": {
            "title": "Frequency",
            "description": "Frequency with which dataset is published.",
            "type": "string",
            "enum": [
              "R\/P10Y",
              "R\/P4Y",
              "R\/P1Y",
              "R\/P2M",
              "R\/P3.5D",
              "R\/P1D",
              "R\/P2W",
              "R\/P6M",
              "R\/P2Y",
              "R\/P3Y",
              "R\/P0.33W",
              "R\/P0.33M",
              "R\/PT1S",
              "R\/P1M",
              "R\/P3M",
              "R\/P0.5M",
              "R\/P4M",
              "R\/P1W",
              "R\/PT1H",
              "irregular"
            ]
          },
          "describedBy": {
            "title": "Data Dictionary",
            "description": "URL to the data dictionary for the dataset or API. Note that documentation other than a data dictionary can be referenced using Related Documents as shown in the expanded fields.",
            "type": "string",
            "format": "uri"
          },
          "describedByType": {
            "title": "Data Dictionary Type",
            "description": "The machine-readable file format (IANA Media Type or MIME Type) of the distribution\u2019s describedBy URL.",
            "type": "string"
          },
          "issued": {
            "title": "Release Date",
            "description": "Date of formal issuance.",
            "type": "string"
          },
          "modified": {
            "title": "Last Update",
            "description": "Most recent date on which the dataset was changed, updated or modified.",
            "type": "string"
          },
          "license": {
            "title": "License",
            "description": "The license dataset or API is published with. See \u003Ca href=\u0022https:\/\/resources.data.gov\/open-licenses\/\u0022\u003EOpen Licenses\u003C\/a\u003E for more information.",
            "type": "string",
            "format": "uri",
            "default": "https:\/\/www.usa.gov\/publicdomain\/label\/1.0\/"
          },
          "spatial": {
            "title": "Spatial",
            "description": "The \u003Ca href=\u0022https:\/\/project-open-data.cio.gov\/v1.1\/schema\/#spatial\u0022\u003Espatial coverage\u003C\/a\u003E of the dataset. Could include a spatial region like a bounding box or a named place.",
            "type": "string",
            "minLength": 1
          },
          "temporal": {
            "title": "Temporal",
            "description": "The \u003Ca href=\u0022https:\/\/project-open-data.cio.gov\/v1.1\/schema\/#temporal\u0022\u003Estart and end dates\u003C\/a\u003E for which the dataset is applicable, separated by a \u0022\/\u0022 (i.e., 2000-01-15T00:45:00Z\/2010-01-15T00:06:00Z).",
            "type": "string"
          },
          "isPartOf": {
            "title": "Collection",
            "description": "The collection of which the dataset is a subset.",
            "type": "string",
            "minLength": 1
          },
          "publisher": {
            "title": "Organization",
            "description": "A Dataset Publisher Organization.",
            "type": "object",
            "required": [
              "name"
            ],
            "properties": {
              "@type": {
                "title": "Metadata Context",
                "description": "IRI for the JSON-LD data type. This should be org:Organization for each publisher",
                "type": "string",
                "default": "org:Organization"
              },
              "name": {
                "title": "Publisher Name",
                "description": "",
                "type": "string",
                "minLength": 1
              },
              "subOrganizationOf": {
                "title": "Parent Organization",
                "type": "string"
              }
            }
          },
          "contactPoint": {
            "title": "Project Open Data ContactPoint vCard",
            "description": "A Dataset ContactPoint as a vCard object.",
            "type": "object",
            "required": [
              "fn",
              "hasEmail"
            ],
            "properties": {
              "@type": {
                "title": "Metadata Context",
                "description": "IRI for the JSON-LD data type. This should be vcard:Contact for contactPoint.",
                "enum": [
                  "vcard:Contact"
                ],
                "type": "string"
              },
              "fn": {
                "title": "Contact Name",
                "description": "A full formatted name, e.g. Firstname Lastname.",
                "type": "string",
                "minLength": 1
              },
              "hasEmail": {
                "title": "Email",
                "description": "Email address for the contact name.",
                "pattern": "^mailto:[\\w\\_\\~\\!\\$\\\u0026\\\u0027\\(\\)\\*\\+\\,\\;\\=\\:.-]+@[\\w.-]+\\.[\\w.-]+?$|[\\w\\_\\~\\!\\$\\\u0026\\\u0027\\(\\)\\*\\+\\,\\;\\=\\:.-]+@[\\w.-]+\\.[\\w.-]+?$",
                "type": "string"
              }
            }
          },
          "theme": {
            "title": "Category",
            "description": "Main thematic category of the dataset.",
            "type": "array",
            "items": {
              "type": "string",
              "title": "Category",
              "minLength": 1
            },
            "uniqueItems": true
          },
          "keyword": {
            "title": "Tags",
            "description": "Tags (or keywords) help users discover your dataset; please include terms that would be used by technical and non-technical users.",
            "type": "array",
            "items": {
              "type": "string",
              "title": "Tag",
              "minLength": 1
            },
            "minItems": 1
          },
          "distribution": {
            "title": "Distribution",
            "description": "A distribution is a container for the metadata specific to the data resource being shared. Each distribution should contain one \u003Cstrong\u003EAccess URL\u003C\/strong\u003E or \u003Cstrong\u003EDownload URL\u003C\/strong\u003E. When providing a Download URL, also include the format of the file. A distribution containing a Download URL to a csv or tsv file will generate queues that will import the data into a database table, this is referred to as a datastore. The datastore provides an API endpoint for users to run queries against the data.",
            "type": "array",
            "items": {
              "title": "Data File",
              "type": "object",
              "properties": {
                "@type": {
                  "title": "Metadata Context",
                  "description": "IRI for the JSON-LD data type. This should be dcat:Distribution for each Distribution.",
                  "default": "dcat:Distribution",
                  "type": "string",
                  "readOnly": true
                },
                "title": {
                  "title": "Title",
                  "description": "Human-readable name of the file.",
                  "type": "string",
                  "minLength": 1
                },
                "description": {
                  "title": "Description",
                  "description": "Human-readable description of the file.",
                  "type": "string",
                  "minLength": 1
                },
                "format": {
                  "title": "Format",
                  "description": "A human-readable description of the file format of a distribution (i.e. csv, pdf, kml, etc.).",
                  "type": "string"
                },
                "mediaType": {
                  "title": "Media Type",
                  "description": "The machine-readable file format (\u003Ca href=\u0022https:\/\/www.iana.org\/assignments\/media-types\/media-types.xhtml\u0022\u003EIANA Media Type or MIME Type\u003C\/a\u003E) of the distribution\u2019s downloadURL.",
                  "type": "string"
                },
                "downloadURL": {
                  "title": "Download URL",
                  "description": "URL providing direct access to a downloadable file of a dataset.",
                  "type": "string",
                  "format": "uri"
                },
                "accessURL": {
                  "title": "Access URL",
                  "description": "URL providing indirect access to a dataset.",
                  "type": "string",
                  "format": "uri"
                },
                "conformsTo": {
                  "title": "Data Standard",
                  "description": "URI used to identify a standardized specification the distribution conforms to.",
                  "type": "string",
                  "format": "uri"
                },
                "describedBy": {
                  "title": "Data Dictionary",
                  "description": "URL to the data dictionary for the distribution found at the downloadURL.",
                  "type": "string"
                },
                "describedByType": {
                  "title": "Data Dictionary Type",
                  "description": "The machine-readable file format (IANA Media Type or MIME Type) of the distribution\u2019s describedBy URL.",
                  "pattern": "^[a-z\\\/\\.\\+]+?$",
                  "type": "string"
                }
              },
              "uniqueItems": true
            },
            "minItems": 1
          },
          "references": {
            "title": "Related Documents",
            "description": "Related documents such as technical information about a dataset, developer documentation, etc.",
            "type": "array",
            "items": {
              "type": "string",
              "format": "uri"
            }
          },
          "bureauCode": {
            "title": "Bureau Code",
            "description": "Federal agencies, combined agency and bureau code from \u003Ca href=\u0022https:\/\/resources.data.gov\/schemas\/dcat-us\/v1.1\/omb_bureau_codes.csv\u0022\u003EOMB Circular A-11, Appendix C\u003C\/a\u003E in the format of \u003Ccode\u003E015:010\u003C\/code\u003E.",
            "type": "array",
            "items": {
              "type": "string"
            },
            "minItems": 1,
            "uniqueItems": true
          },
          "programCode": {
            "title": "Program Code",
            "description": "Federal agencies, list the primary program related to this data asset, from the \u003Ca href=\u0022https:\/\/resources.data.gov\/schemas\/dcat-us\/v1.1\/FederalProgramInventory_FY13_MachineReadable_091613.csv\u0022\u003EFederal Program Inventory\u003C\/a\u003E. Use the format of \u003Ccode\u003E015:001\u003C\/code\u003E",
            "type": "array",
            "items": {
              "type": "string"
            },
            "minItems": 1,
            "uniqueItems": true
          }
        }
      }
    },
    "responses": {
      "400BadJson": {
        "description": "Bad request, usually JSON schema validation failure.",
        "content": {
          "application\/json": {
            "schema": {
              "$ref": "#\/components\/schemas\/errorResponse"
            },
            "example": {
              "message": "JSON Schema validation failed.",
              "status": 400,
              "timestamp": "2021-06-14T13:46:06+00:00",
              "data": {
                "keyword": "type",
                "pointer": "path\/to\/invalid\/json\/property",
                "message": "The attribute expected to be of type \u0027\u0027object\u0027\u0027 but \u0027array\u0027 given."
              }
            }
          }
        }
      },
      "404IdNotFound": {
        "description": "Not found, usually due to incorrect identifier.",
        "content": {
          "application\/json": {
            "schema": {
              "$ref": "#\/components\/schemas\/errorResponse"
            },
            "example": {
              "message": "Error retrieving metadata: 00000000-0000-0000-0000-000000000000 not found.",
              "status": 404,
              "timestamp": "2021-06-14T13:46:06+00:00"
            }
          }
        }
      },
      "200JsonOrCsvQueryOk": {
        "description": "Ok. JSON or CSV datastore response, depending on query.",
        "content": {
          "application\/json": {
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
          "text\/csv": {
            "schema": {
              "type": "string"
            }
          }
        }
      }
    }
  }
};

export const mockDatasetItemResults = {
  "results": [{
      "npn": "2140722",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/22\/2015",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "09\/24\/2015",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "9107354",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/21\/2015",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/21\/2015",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17686833",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/23\/2015",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/23\/2015",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18139527",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/07\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "16519054",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/09\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "09\/09\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "1657131",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/16\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18021228",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/18\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17870437",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/18\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/18\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17187070",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/13\/2015",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "8172269",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "11\/02\/2015",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "16178238",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/18\/2015",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "3211956",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/11\/2015",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/13\/2015",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "119074",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/16\/2015",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "09\/16\/2015",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "6565293",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/07\/2015",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "16766899",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "11\/28\/2015",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "2155968",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/30\/2015",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18010276",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/03\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18087542",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/16\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17397269",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/06\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18138541",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/13\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/13\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "7839277",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/18\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "15456186",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "08\/16\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17942354",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/19\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/19\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17516488",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/10\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17959840",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/10\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/08\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17922561",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "08\/24\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "08\/24\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17790088",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/03\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "09\/03\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18121642",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/30\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17229488",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/28\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "8734795",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "08\/15\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "16528788",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/27\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "2029892",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/22\/2015",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "13361849",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/24\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17900033",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/20\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17815555",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/28\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/28\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "5334895",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/15\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/14\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17367559",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "08\/15\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "487721",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/22\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "16094378",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/12\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/14\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17881231",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/20\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18145248",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/13\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17542750",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/05\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17908304",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/26\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/28\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "8967407",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/14\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "7068427",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/09\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "09\/09\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "12128866",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "08\/31\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17994429",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/10\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18097796",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/31\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18080420",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/06\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "09\/08\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17869939",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/29\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "7250951",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/18\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "11090152",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/17\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17696217",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/31\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18072464",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "08\/24\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "08\/29\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "3196763",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/20\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17399017",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/05\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "2017",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/18\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "4590341",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "08\/08\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "9692682",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/23\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18125860",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/28\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "16894723",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/13\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "631319",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/16\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "5689664",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/30\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17909736",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/13\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17890004",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "08\/01\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "08\/01\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18128498",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/19\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17971690",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/20\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "7211375",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/20\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "8510398",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "08\/19\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18101887",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/31\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "8698476",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/04\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/04\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "7231522",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/14\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17021579",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/21\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/22\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18144821",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/12\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17995316",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/04\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18043915",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "08\/18\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17755483",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/05\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "8070590",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/28\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17635633",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/07\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "8168054",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/28\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17630589",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "08\/25\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "08\/25\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17415122",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/11\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/13\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17784608",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "08\/24\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18114004",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/19\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17716936",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/15\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/14\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "5629589",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/20\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/19\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "16961536",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/22\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "16976344",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/28\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17739413",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "08\/04\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17201165",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "08\/29\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "16891649",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/20\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17647224",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/30\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "09\/30\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "11136394",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/06\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "09\/06\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18022670",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/21\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "10\/21\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17686946",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "08\/25\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "17738102",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/29\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "09\/29\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "7222903",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "08\/02\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "08\/03\/2016",
      "shop_end_date": "10\/31\/2016",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18063651",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/16\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "6059974",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "10\/29\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    },
    {
      "npn": "18095232",
      "applicable_plan_year": "2016",
      "individual_registration_completion_date": "09\/06\/2016",
      "individual_marketplace_end_date": "10\/31\/2016",
      "shop_registration_completion_date": "",
      "shop_end_date": "",
      "npn_valid_current_plan_year_only": "-"
    }
  ],
  "count": 100,
  "schema": {
    "479a03e6-ccf1-5636-9fd3-cad48c11177d": {
      "fields": {
        "npn": {
          "type": "text",
          "mysql_type": "text",
          "description": "NPN"
        },
        "applicable_plan_year": {
          "type": "text",
          "mysql_type": "text",
          "description": "Applicable Plan Year"
        },
        "individual_registration_completion_date": {
          "type": "text",
          "mysql_type": "text",
          "description": "Individual Registration Completion Date"
        },
        "individual_marketplace_end_date": {
          "type": "text",
          "mysql_type": "text",
          "description": "Individual Marketplace End Date"
        },
        "shop_registration_completion_date": {
          "type": "text",
          "mysql_type": "text",
          "description": "Shop Registration Completion Date"
        },
        "shop_end_date": {
          "type": "text",
          "mysql_type": "text",
          "description": "Shop End Date"
        },
        "npn_valid_current_plan_year_only": {
          "type": "text",
          "mysql_type": "text",
          "description": "NPN Valid (Current Plan Year Only)"
        }
      }
    }
  },
  "query": {
    "keys": true,
    "limit": 100,
    "offset": 0,
    "resources": [{
      "id": "479a03e6-ccf1-5636-9fd3-cad48c11177d",
      "alias": "t"
    }],
    "count": true,
    "results": true,
    "schema": true,
    "format": "json",
    "rowIds": false,
    "properties": [
      "npn",
      "applicable_plan_year",
      "individual_registration_completion_date",
      "individual_marketplace_end_date",
      "shop_registration_completion_date",
      "shop_end_date",
      "npn_valid_current_plan_year_only"
    ]
  }
};

export const mockDatasetItemSchema = {
  "count": 100,
  "schema": {
    "479a03e6-ccf1-5636-9fd3-cad48c11177d": {
      "fields": {
        "npn": {
          "type": "text",
          "mysql_type": "text",
          "description": "NPN"
        },
        "applicable_plan_year": {
          "type": "text",
          "mysql_type": "text",
          "description": "Applicable Plan Year"
        },
        "individual_registration_completion_date": {
          "type": "text",
          "mysql_type": "text",
          "description": "Individual Registration Completion Date"
        },
        "individual_marketplace_end_date": {
          "type": "text",
          "mysql_type": "text",
          "description": "Individual Marketplace End Date"
        },
        "shop_registration_completion_date": {
          "type": "text",
          "mysql_type": "text",
          "description": "Shop Registration Completion Date"
        },
        "shop_end_date": {
          "type": "text",
          "mysql_type": "text",
          "description": "Shop End Date"
        },
        "npn_valid_current_plan_year_only": {
          "type": "text",
          "mysql_type": "text",
          "description": "NPN Valid (Current Plan Year Only)"
        }
      }
    }
  },
  "query": {
    "results": false,
    "count": true,
    "schema": true,
    "resources": [{
      "id": "479a03e6-ccf1-5636-9fd3-cad48c11177d",
      "alias": "t"
    }],
    "limit": 500,
    "offset": 0,
    "keys": true,
    "format": "json",
    "rowIds": false,
    "properties": [
      "npn",
      "applicable_plan_year",
      "individual_registration_completion_date",
      "individual_marketplace_end_date",
      "shop_registration_completion_date",
      "shop_end_date",
      "npn_valid_current_plan_year_only"
    ]
  }
};
