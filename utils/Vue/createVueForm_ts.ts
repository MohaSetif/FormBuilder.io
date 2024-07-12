import * as path from "path";
import * as fs from 'fs';

interface Attribute {
  name: string;
  type: string;
  optional: boolean;
}

interface Model {
  name: string;
  attributes: Attribute[];
}

export const createVueForm_ts = (model: Model, formDest: string) => {
  const { name, attributes } = model;
  
  const template = `
<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

interface FormData {
  ${attributes
    .filter(attr => !(/^(created|updated)?at$/i.test(attr.name)))
    .map(attr => `${attr.name}: ${mapTypeToTS(attr.type)}${attr.optional ? ' | null' : ''}`)
    .join(';\n  ')};
}

const schema = yup.object({
  ${attributes
    .filter(attr => !(/^(created|updated)?at$/i.test(attr.name)))
    .map(attr => `${attr.name}: ${getYupValidation(attr)}`)
    .join(',\n  ')}
});

const { handleSubmit, errors, values } = useForm<FormData>({
  validationSchema: schema,
});

const onSubmit = handleSubmit(async (formData) => {
  try {
    const response = await fetch('https://example.com/api/${name.toLowerCase()}', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      alert('Form submitted successfully!');
      // Reset form
      Object.keys(formData).forEach(key => (values[key] = ''));
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    alert('Form submission failed. Please try again.');
    console.error(error);
  }
});
</script>

<template>
  <form @submit="onSubmit">
    <h2>${name} Form</h2>
    ${attributes
      .filter(attr => !(/^(created|updated)?at$/i.test(attr.name)))
      .map(attr => `
    <div class="mb-4">
      <label for="${attr.name}">${formatLabel(attr.name)}:</label>
      <input
        v-model="values.${attr.name}"
        type="${getInputType(attr.type)}"
        id="${attr.name}"
        name="${attr.name}"
      />
      <p v-if="errors.${attr.name}">{{ errors.${attr.name} }}</p>
    </div>`
      ).join('')}
    <button type="submit">
      Submit
    </button>
  </form>
</template>
`;

  const outputFilePath = path.join(process.cwd(), formDest, `${name}Form.vue`);
  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
  fs.writeFileSync(outputFilePath, template);
  console.log(`Generated Vue form saved to: ${outputFilePath}`);
};

function mapTypeToTS(type: string): string {
  const typeMap: { [key: string]: string } = {
    String: 'string',
    Int: 'number',
    Float: 'number',
    DateTime: 'Date',
    Boolean: 'boolean',
  };
  return typeMap[type] || 'any';
}

function getInputType(type: string): string {
  const inputTypeMap: { [key: string]: string } = {
    String: 'text',
    Int: 'number',
    Float: 'number',
    DateTime: 'datetime-local',
    Boolean: 'checkbox',
  };
  return inputTypeMap[type] || 'text';
}

function getYupValidation(attr: Attribute): string {
  const { type, optional } = attr;
  let validation = 'yup';

  switch (type) {
    case 'String':
      validation += '.string()';
      break;
    case 'Int':
    case 'Float':
      validation += '.number()';
      break;
    case 'DateTime':
      validation += '.date()';
      break;
    case 'Boolean':
      validation += '.boolean()';
      break;
    default:
      validation += '.mixed()';
  }

  if (!optional) {
    validation += '.required()';
  }

  return validation;
}

function formatLabel(name: string): string {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

export default createVueForm_ts;