
import json
import os
from elasticsearch import Elasticsearch, helpers
import argparse

print("Init Elasticsearch client")
es = Elasticsearch(
    cloud_id=<CLOUD_ID>,
    basic_auth=("elastic", <ES_PASSWORD>),
    request_timeout=30
)

mappings = {

    "properties": {
        "address": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "city": {
            "type": "text",
            "fields": {
                "prefix": {
                    "type": "text"
                },
                "delimiter": {
                    "type": "text"
                },
                "joined": {
                    "type": "text"
                },
                "stem": {
                    "type": "text",
                    "analyzer": "english"
                }
            }
        },
        "country": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "email": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "first_name": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "gender": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "id": {
            "type": "long"
        },
        "last_name": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "ref": {
            "type": "keyword"
        },
        "specialty": {
            "type": "text",
            "fields": {
                "prefix": {
                    "type": "text"
                },
                "delimiter": {
                    "type": "text"
                },
                "joined": {
                    "type": "text"
                },
                "stem": {
                    "type": "text",
                    "analyzer": "english"
                }
            }
        }
    }

}

print("Creating index")
es.indices.create(index='search-doctors', mappings=mappings)
print("Index created")
print("Indexing doctors data")
orderFile = open("./doctors.json", "r")
orderJson = json.load(orderFile)
helpers.bulk(es, orderJson, index='search-doctors')
print("Indexed doctors data")