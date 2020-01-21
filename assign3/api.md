# Webtech api documentation

## Introduction
The API endpoints return JSON metadata about phone brands, model, os, screensize and a picture.

## Overview
Things that the developers should know about

## Rate limit
Is there a limit to the number of requests an user can send?

---

## GET http://localhost:3000/products/?id


    http://localhost:3000/users/?id
Retrieves resources
#### params
#
id

---

## POST http://localhost:3000/products

    http://localhost:3000/users
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
