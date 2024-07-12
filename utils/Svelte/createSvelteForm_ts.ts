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

const createSvelteForm_ts = (model: Model, formDest: string): void => {
  const { name, attributes } = model;

  const getInputType = (type: string): string => {
    switch (type) {
      case 'String': return 'text';
      case 'Int':
      case 'Float': return 'number';
      case 'Boolean': return 'checkbox';
      case 'DateTime': return 'datetime-local';
      default: return 'text';
    }
  };

  const getDefaultValue = (type: string): string => {
    switch (type) {
      case 'String': return "''";
      case 'Int': return '0';
      case 'Float': return '0.0';
      case 'Boolean': return 'false';
      case 'DateTime': return 'new Date().toISOString().slice(0, 16)';
      default: return 'null';
    }
  };

  const getTypeScriptType = (type: string): string => {
    switch (type) {
      case 'String': return 'string';
      case 'Int':
      case 'Float': return 'number';
      case 'Boolean': return 'boolean';
      case 'DateTime': return 'string';
      default: return 'any';
    }
  };

  const formContent = `
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{submit: ${name}FormData}>();

  interface ${name}FormData {
    ${attributes.map(attr => `${attr.name}${attr.optional ? '?' : ''}: ${getTypeScriptType(attr.type)};`).join('\n    ')}
  }

  ${attributes.map(attr => `let ${attr.name}: ${getTypeScriptType(attr.type)} = ${getDefaultValue(attr.type)};`).join('\n  ')}

  $: formData: ${name}FormData = {
    ${attributes.map(attr => attr.name).join(',\n    ')}
  };

  function handleSubmit() {
    dispatch('submit', formData);
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <h2>${name} Form</h2>
  ${attributes.map(attr => `
  <div>
    <label for="${attr.name}">${attr.name}</label>
    <input
      id="${attr.name}"
      name="${attr.name}"
      type="${getInputType(attr.type)}"
      bind:value={${attr.name}}
      ${attr.optional ? '' : 'required'}
    />
  </div>`).join('\n  ')}
  <button type="submit">Submit</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
`;

  const outputPath = path.join(process.cwd(), formDest, `${name}Form.svelte`);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, formContent);
  console.log(`Generated Svelte TypeScript form saved to: ${outputPath}`);
};

export default createSvelteForm_ts;