import { createForm } from "./utils/createForm";
import { createReactForm } from "./utils/createReactForm";
import { createReactForm_ts } from "./utils/createReactForm_ts";
import { parsePrismaSchema } from "./utils/prismaParser";


const schemaFilePath = './prisma/User.prisma';
const models = parsePrismaSchema(schemaFilePath);

// models.forEach(model => {
//     console.log(`Model: ${model.name}`);
//     model.attributes.forEach(attribute => {
//         console.log(`- Attribute: ${attribute.name}, Type: ${attribute.type}`);
//     });
//     console.log('\n');
// });

createReactForm_ts(models)