# Webtech api documentation

## Introduction
The API endpoints return JSON metadata about phone brands, model, os, screensize and a picture.

## Overview
Web API base address is http://localhost:3000/products. 
The database contains JSON Data that can be fetched, posted, modified and deleted.

## Rate limit
There is currently no limit to the number of requests an user can send.

## Error Codes
Error codes that can be expected:
200 OK
201 Created
400 Bad Request 
500 Internal Server Error

---

## GET http://localhost:3000/products/?id


    http://localhost:3000/products/?id
Retrieves resources
#### params
#
id

---

## POST http://localhost:3000/products

    http://localhost:3000/products
Creates resources

#### Headers
#
*Content-type* &nbsp;&nbsp;&nbsp;&nbsp; application/json

#### Body
#
```json
{
    "brand": "Fairphone",
    "model": "FP3",
    "os": "Android",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg",
    "screensize": 5.65
}
```

---

## PUT http://localhost:3000/products/?id

    http://localhost:3000/products/?id
Changes and/or replaces resources or collections

#### params
#
id

---

## DEL http://localhost:3000/products/?id

    http://localhost:3000/
Deletes resources

#### params
#
id

----