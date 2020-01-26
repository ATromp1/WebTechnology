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
id &nbsp; - &nbsp; The id of the product

### Response Format
On success, the HTTP status code in the response header is 200 OK and the response body contains a product object in JSON format. On error, the header status code is an error code and the response body contains an error object.

---

## GET http://localhost:3000/products


    http://localhost:3000/products
Retrieves all resources

### Response Format
On success, the HTTP status code in the response header is 200 OK and the response body contains an array of product objects in JSON format. On error, the header status code is an error code and the response body contains an error object.

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
### Response Format
On success, the HTTP status code in the response header is 200 OK. On error, the header status code is an error code and the response body contains an error object.

---

## PUT http://localhost:3000/products

    http://localhost:3000/products
Changes and/or replaces resources or collections

#### params
#
id &nbsp; - &nbsp; The id of the product

#### Headers
#
*Content-type* &nbsp;&nbsp;&nbsp;&nbsp; application/json

#### Body
#
```json
{
    "id" : 1,
    "brand": "Samsung",
    "model": "Galaxy Fold",
    "os": "Android",
    "image": "https://www.samsung.com/global/galaxy/galaxy-fold/specs/images/galaxy-fold_specs_design_cosmos_black.jpg",
    "screensize": 7.3
}
```

### Response Format
On success, the HTTP status code in the response header is 200 OK. On error, the header status code is an error code and the response body contains an error object.

---

## DEL http://localhost:3000/products/?id

    http://localhost:3000/products/?id
Deletes resources

#### params
#
id &nbsp; - &nbsp; The id of the product

### Response Format
On success, the HTTP status code in the response header is 200 OK. On error, the header status code is an error code and the response body contains an error object.

----

## DEL http://localhost:3000/products

    http://localhost:3000/products
Deletes all resources

### Response Format
On success, the HTTP status code in the response header is 200 OK. On error, the header status code is an error code and the response body contains an error object.

----