import * as fs from 'fs';

function parsePrismaSchema(filePath) {
    const schema = fs.readFileSync(filePath, 'utf-8')
    const models = []
    let currentModel = null;
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
            // const first_letter = attribute_name.charAt(0).toUpperCase()
            // const remaining_letters = attribute_name.slice(1)
            // const new_attribute_name = first_letter + remaining_letters
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

export default parsePrismaSchema;