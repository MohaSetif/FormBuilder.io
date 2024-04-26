import * as fs from 'fs';

interface Attribute {
    name: string;
    type: string;
}

interface Model {
    name: string;
    attributes: Attribute[];
}

function parsePrismaSchema(filePath: string): Model[] {
    const schema = fs.readFileSync(filePath, 'utf-8')
    const models: Model[] = []
    let currentModel: Model | null = null;
    const lines = schema.split('\n')
    let isInside : Boolean = false;

    for(let line of lines){
        const trimmed_line = line.trim();
        if(trimmed_line.startsWith('model ')){
            if (currentModel !== null) {
                models.push(currentModel);
            }
            const modelName = trimmed_line.split(' ')[1];
            currentModel = {
                name: modelName,
                attributes: []
            }
            isInside = true;
        }
        else if(trimmed_line == '}' && isInside){
            isInside = false
        }
        else if(!trimmed_line.startsWith('//') && currentModel && isInside && trimmed_line){
            const attribute_line = trimmed_line.replace(/[{?}]/g, '')
            const [attribute_name, attribute_type] = attribute_line.split(/\s+/);
            currentModel.attributes.push({
                name: attribute_name,
                type: attribute_type
            })
        }
    }

    if(currentModel != null){
        models.push(currentModel)
    }

    return models
}

const schemaFilePath = './prisma/User.prisma';
const models = parsePrismaSchema(schemaFilePath);

models.forEach(model => {
    console.log(`Model: ${model.name}`);
    model.attributes.forEach(attribute => {
        console.log(`- Attribute: ${attribute.name}, Type: ${attribute.type}`);
    });
    console.log('\n');
});
