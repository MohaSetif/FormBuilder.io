"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prismaParser_1 = require("./utils/prismaParser");
var schemaFilePath = './prisma/User.prisma';
var models = (0, prismaParser_1.parsePrismaSchema)(schemaFilePath);
models.forEach(function (model) {
    console.log("Model: ".concat(model.name));
    model.attributes.forEach(function (attribute) {
        console.log("- Attribute: ".concat(attribute.name, ", Type: ").concat(attribute.type));
    });
    console.log('\n');
});
