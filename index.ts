import { createForm } from "./utils/createForm";
import { parsePrismaSchema } from "./utils/prismaParser";


const schemaFilePath = './prisma/User.prisma';
const models = parsePrismaSchema(schemaFilePath);

models.forEach(model => {
    console.log(`Model: ${model.name}`);
    model.attributes.forEach(attribute => {
        console.log(`- Attribute: ${attribute.name}, Type: ${attribute.type}`);
    });
    console.log('\n');
});

const prismaForm = createForm(models)