"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createSvelteForm_1 = require("./utils/Svelte/createSvelteForm");
var prismaParser_1 = require("./utils/prismaParser");
var schemaFilePath = './prisma/User.prisma';
var models = (0, prismaParser_1.parsePrismaSchema)(schemaFilePath);
// models.forEach(model => {
//     console.log(`Model: ${model.name}`);
//     model.attributes.forEach(attribute => {
//         console.log(`- Attribute: ${attribute.name}, Type: ${attribute.type}`);
//     });
//     console.log('\n');
// });
(0, createSvelteForm_1.createSvelteForm)(models);
