import { createSvelteForm } from "./utils/Svelte/createSvelteForm";
import { createVueForm } from "./utils/Vue/createVueForm";
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

createSvelteForm(models)