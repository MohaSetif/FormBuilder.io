import * as fs from 'fs';

export default function parsePrismaSchema(filePath) {
    //console.log('File Path:', typeof filePath);
    const schema = fs.readFileSync(filePath, 'utf-8');
    const models = []
    let currentModel = null;
    const typeMap = {
        String: "text",
        Int: "number",
        Float: "number",
        DateTime: "date",
        Boolean: "checkbox",
    };
    const lines = schema.split('\n')
    let isInside = false;

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
            if(typeMap[attribute_type])
            currentModel.attributes.push({
                name: attribute_name,
                type: attribute_type
            })
            else{
                continue
            }
        }
    }

    if(currentModel != null){
        models.push(currentModel)
    }

    return models
}

export async function selectModel(models) {
    const modelNames = models.map(model => model.name);
    const { selectedModel } = await inquirer.prompt({
        type: 'list',
        name: 'selectedModel',
        message: 'Choose the model:',
        choices: modelNames
    });
    
    return models.find(model => model.name === selectedModel);
}