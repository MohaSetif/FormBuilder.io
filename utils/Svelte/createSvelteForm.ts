import * as path from "path";
import * as fs from 'fs';

export const createSvelteForm = (models) => {
    let html = `<script>
    `;

    models.forEach(model => {
        model.attributes.forEach(attribute => {
            html += `let ${attribute.name} = `;
            const typeMap = {
                String: "''",
                Int: "0",
                Float: "0.0",
                DateTime: "new Date()",
                Boolean: "false",
            };

            html += typeMap[attribute.type];
            html += `;\n`;
        });
    });

    html += `
    const handleSubmit = async () => {
      const response = await fetch('https://example.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({`;

    models.forEach((model, index) => {
        model.attributes.forEach((attribute, idx) => {
            html += `${attribute.name}`;

            if (index !== models.length - 1 || idx !== model.attributes.length - 1) {
                html += ', ';
            }
        });
    });

    html += `}),
      });
  
      if (response.ok) {
        alert('Registration successful!');
      } else {
        alert('Registration failed. Please try again.');
      }
    };
  </script>
  
  <main>
    <h1>Registration Form</h1>
    <form on:submit|preventDefault={handleSubmit}>`;

    models.forEach(model => {
        model.attributes.forEach(attribute => {
            html += `\n      <label>\n        ${attribute.name}:\n        <input bind:value={${attribute.name}} type="${attribute.type === 'Boolean' ? 'checkbox' : attribute.type.toLowerCase()}" `;
            if (attribute.type === 'Boolean') {
                html += `checked="{${attribute.name}}" `;
            }
            html += `required />\n      </label>`;
        });
    });

    html += `
      <button type="submit">Register</button>
    </form>
  </main>`;

    const outputFilePath = path.join('.', 'form.svelte');
    fs.writeFileSync(outputFilePath, html);
    console.log(`Generated Svelte form saved to: ${outputFilePath}`);
}
