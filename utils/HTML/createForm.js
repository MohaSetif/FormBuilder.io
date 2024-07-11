import * as path from "path";
import * as fs from 'fs';

const createForm = (model, form) => {
    let html = `<!DOCTYPE html>
    <html lang="en">
        <form method='post' action=''>`;

            html += '\n'
            html += '\t';
            html += `<h2>Model: ${model.name}</h2>`;
            model.attributes.forEach(attribute => {
              const label = attribute.name;
              const typeMap = {
                String: "text",
                Int: "number",
                Float: "number",
                DateTime: "date",
                Boolean: "checkbox",
              };
              const htmlType = typeMap[attribute.type];
              const shouldIgnoreCreation = /^(created)?at$/i.test(attribute.name);
              const shouldIgnoreUpdate = /^(updated)?at$/i.test(attribute.name);
              if(!shouldIgnoreCreation && !shouldIgnoreUpdate)
                {
                  if(typeMap[attribute.type])
                    {
                      html += '\n'
                      html += '\t'
                      html += `<label for="${label}">${label}:</label>`;
                      html += '\n'
                      html += '\t'
                      html += `<input type="${htmlType}" name="${label}" />`;
                      html += '\n'
                      html += '\n'
                    }
                }
            });

    html += `</form>
    </html>`;

    const outputFilePath = path.join('.', `${form}.html`);
    fs.writeFileSync(outputFilePath, html);
    console.log(`Generated HTML form saved to: ${outputFilePath}`);
}

export default createForm