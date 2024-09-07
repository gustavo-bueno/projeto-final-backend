const swaggerAutoGen = require('swagger-autogen');

output = "./swagger_doc.json"
endpoints = ["./index.js"]

swaggerAutoGen(output, endpoints)