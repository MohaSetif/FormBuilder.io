import * as path from "path";
import * as fs from 'fs';

export const createVueForm = (model, formDest) => {
  const { name, attributes } = model;

  const getInputType = (type) => {
    const inputTypeMap = {
      String: 'text',
      Int: 'number',
      Float: 'number',
      DateTime: 'datetime-local',
      Boolean: 'checkbox',
    };
    return inputTypeMap[type] || 'text';
  };

  const getDefaultValue = (type) => {
    const defaultValues = {
      String: "''",
      Int: '0',
      Float: '0',
      DateTime: "''",
      Boolean: 'false',
    };
    return defaultValues[type] || "''";
  };

  const formatLabel = (name) => {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const template = `
<template>
  <form @submit.prevent="onSubmit">
    <h2>${name} Form</h2>
    ${attributes
      .filter(attr => !(/^(created|updated)?at$/i.test(attr.name)))
      .map(attr => `
    <div class="mb-4">
      <label for="${attr.name}">${formatLabel(attr.name)}:</label>
      <input
        v-model="formData.${attr.name}"
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

<script>
import { reactive, ref } from 'vue';

export default {
  name: '${name}Form',
  setup() {
    const formData = reactive({
      ${attributes
        .filter(attr => !(/^(created|updated)?at$/i.test(attr.name)))
        .map(attr => `${attr.name}: ${getDefaultValue(attr.type)}`)
        .join(',\n      ')}
    });

    const errors = ref({});

    const validateForm = () => {
      const newErrors = {};
      ${attributes
        .filter(attr => !(/^(created|updated)?at$/i.test(attr.name)))
        .map(attr => `
      if (!formData.${attr.name}) {
        newErrors.${attr.name} = '${formatLabel(attr.name)} is required';
      }`).join('')}
      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
      if (!validateForm()) {
        return;
      }

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
          Object.keys(formData).forEach(key => {
            formData[key] = ${getDefaultValue('String')};
          });
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        alert('Form submission failed. Please try again.');
        console.error(error);
      }
    };

    return {
      formData,
      errors,
      onSubmit,
    };
  },
};

function getInputType(type) {
  const inputTypeMap = {
    String: 'text',
    Int: 'number',
    Float: 'number',
    DateTime: 'datetime-local',
    Boolean: 'checkbox',
  };
  return inputTypeMap[type] || 'text';
}

function getDefaultValue(type) {
  const defaultValues = {
    String: "''",
    Int: '0',
    Float: '0',
    DateTime: "''",
    Boolean: 'false',
  };
  return defaultValues[type] || "''";
}

function formatLabel(name) {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}
</script>

`;

  const outputFilePath = path.join(process.cwd(), formDest, `${name}Form.vue`);
  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
  fs.writeFileSync(outputFilePath, template);
  console.log(`Generated Vue form saved to: ${outputFilePath}`);
};

export default createVueForm;
