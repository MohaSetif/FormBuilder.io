import * as path from "path";
import * as fs from 'fs';

const createReactForm_ts = (models, form) => {
    let html = `import React, { useState } from 'react';

const RegistrationForm = () => {
    `;
    
    const processedAttributes = new Set();

    models.forEach(model => {
        model.attributes.forEach(attribute => {
            const typeMap = {
                String: "text",
                Int: "number",
                Float: "number",
                DateTime: "datetime-local",
                Boolean: "checkbox",
            };

            const typeMap_ts = {
                String: "string",
                Int: "number",
                Float: "number",
                DateTime: "string",
                Boolean: "boolean",
            };

            const shouldIgnoreCreation = /^(created)?at$/i.test(attribute.name);
            const shouldIgnoreUpdate = /^(updated)?at$/i.test(attribute.name);

            if (!shouldIgnoreCreation && !shouldIgnoreUpdate && !processedAttributes.has(attribute.name)) {
                const first_letter = attribute.name.charAt(0).toUpperCase()
                const remaining_letters = attribute.name.slice(1)
                const new_attribute_name = first_letter + remaining_letters
                html += '\t\t'
                html += `const [${attribute.name}, set${new_attribute_name}] = useState<${typeMap_ts[attribute.type]}>(${typeMap[attribute.type] === 'number' ? 0 : "''"});\n`;

                processedAttributes.add(attribute.name);
            }
        });
    });

    html += `
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const response = await fetch('https://example.com/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({`;

    models.forEach((model, index) => {
        html += '\n'
        model.attributes.forEach((attribute, idx) => {
            html += '\t\t\t\t\t\t\t'
            html += `${attribute.name}: ${attribute.name}`;

            if (index !== models.length - 1 || idx !== model.attributes.length - 1) {
                html += ',';
                html += '\n'
            }
        });
    });

    html += `
            }),
        });
    
        if (response.ok) {
          alert('Registration successful!');
        } else {
          alert('Registration failed. Please try again.');
        }
      };

    return (
      <div>
        <h1>Registration Form</h1>
        <form onSubmit={handleSubmit}>
    `;

    models.forEach(model => {
        model.attributes.forEach(attribute => {
            const typeMap = {
                String: "text",
                Int: "number",
                Float: "number",
                DateTime: "datetime-local",
                Boolean: "checkbox",
            };

            const shouldIgnoreCreation = /^(created)?at$/i.test(attribute.name);
            const shouldIgnoreUpdate = /^(updated)?at$/i.test(attribute.name);

            if (!shouldIgnoreCreation && !shouldIgnoreUpdate) {
                const first_letter = attribute.name.charAt(0).toUpperCase()
                const remaining_letters = attribute.name.slice(1)
                const new_attribute_name = first_letter + remaining_letters

                html += `
                <label>${new_attribute_name}: 
                <input type="${typeMap[attribute.type]}" 
                      value={${attribute.name}} 
                      onChange={(e) => set${new_attribute_name}(e.target.value)} 
                      required />
                </label>\n`;
            }
        });
    });

    html += `
          <button type="submit">Register</button>
        </form>
      </div>
    );
};

export default RegistrationForm;
`;

    const outputFilePath = path.join('.', `${form}.tsx`); //Let the user choose his form file
    fs.writeFileSync(outputFilePath, html);
    console.log(`Generated React form saved to: ${outputFilePath}`);
}

export default createReactForm_ts;