import * as path from "path";
import * as fs from 'fs';

export const createVueForm = (model, form) => {
    let html = `
    <template>
        <div>
            <form @submit.prevent="handleSubmit">`;


        html += `\n\t\t<h2>Model: ${model.name}</h2>`;

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

            if (!shouldIgnoreCreation && !shouldIgnoreUpdate) {
                if (typeMap[attribute.type]) {
                    html += `\n\t\t<label for="${label}">${label}:</label>`;
                    html += `\n\t\t<input v-model="${label}" type="${htmlType}" name="${label}" />`;
                    html += '\n';
                }
            }
        });


    html += `
                <button type="submit">Register</button>
            </form>
        </div>
    </template>

    <script>
    export default {
        data() {
            return {`;

        model.attributes.forEach(attribute => {
            const shouldIgnoreCreation = /^(created)?at$/i.test(attribute.name);
            const shouldIgnoreUpdate = /^(updated)?at$/i.test(attribute.name);

            if (!shouldIgnoreCreation && !shouldIgnoreUpdate) {
                html += `\n                
                ${attribute.name}: '',`;
            }
        });

    html += `
            };
        },
        methods: {
            async handleSubmit() {
                const response = await fetch('https://example.com/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({`;

        model.attributes.forEach((attribute, idx) => {
            html += `${attribute.name}: this.${attribute.name}`;

            if (idx !== model.attributes.length - 1) {
                html += ',\n\t\t\t\t\t\t';
            }
        });

    html += `
                    }),
                });

                if (response.ok) {
                    alert('Registration successful!');
                } else {
                    alert('Registration failed. Please try again.');
                }
            },
        },
    };
    </script>
    `;

    const outputFilePath = path.join('.', `${form}.vue`);
    fs.writeFileSync(outputFilePath, html);
    console.log(`Generated Vue form saved to: ${outputFilePath}`);
}

export default createVueForm;