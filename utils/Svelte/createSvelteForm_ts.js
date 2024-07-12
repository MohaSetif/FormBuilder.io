import * as path from "path";
import * as fs from 'fs';

var createSvelteForm_ts = function (model, formDest) {
    var name = model.name, attributes = model.attributes;
    var getInputType = function (type) {
        switch (type) {
            case 'String': return 'text';
            case 'Int':
            case 'Float': return 'number';
            case 'Boolean': return 'checkbox';
            case 'DateTime': return 'datetime-local';
            default: return 'text';
        }
    };
    var getDefaultValue = function (type) {
        switch (type) {
            case 'String': return "''";
            case 'Int': return '0';
            case 'Float': return '0.0';
            case 'Boolean': return 'false';
            case 'DateTime': return 'new Date().toISOString().slice(0, 16)';
            default: return 'null';
        }
    };
    var getTypeScriptType = function (type) {
        switch (type) {
            case 'String': return 'string';
            case 'Int':
            case 'Float': return 'number';
            case 'Boolean': return 'boolean';
            case 'DateTime': return 'string';
            default: return 'any';
        }
    };
    var formContent = "\n<script lang=\"ts\">\n  import { createEventDispatcher } from 'svelte';\n\n  const dispatch = createEventDispatcher<{submit: ".concat(name, "FormData}>();\n\n  interface ").concat(name, "FormData {\n    ").concat(attributes.map(function (attr) { return "".concat(attr.name).concat(attr.optional ? '?' : '', ": ").concat(getTypeScriptType(attr.type), ";"); }).join('\n    '), "\n  }\n\n  ").concat(attributes.map(function (attr) { return "let ".concat(attr.name, ": ").concat(getTypeScriptType(attr.type), " = ").concat(getDefaultValue(attr.type), ";"); }).join('\n  '), "\n\n  $: formData: ").concat(name, "FormData = {\n    ").concat(attributes.map(function (attr) { return attr.name; }).join(',\n    '), "\n  };\n\n  function handleSubmit() {\n    dispatch('submit', formData);\n  }\n</script>\n\n<form on:submit|preventDefault={handleSubmit}>\n  <h2>").concat(name, " Form</h2>\n  ").concat(attributes.map(function (attr) { return "\n  <div>\n    <label for=\"".concat(attr.name, "\">").concat(attr.name, "</label>\n    <input\n      id=\"").concat(attr.name, "\"\n      name=\"").concat(attr.name, "\"\n      type=\"").concat(getInputType(attr.type), "\"\n      bind:value={").concat(attr.name, "}\n      ").concat(attr.optional ? '' : 'required', "\n    />\n  </div>"); }).join('\n  '), "\n  <button type=\"submit\">Submit</button>\n</form>\n\n<style>\n  form {\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n  }\n</style>\n");
    var outputPath = path.join(process.cwd(), formDest, "".concat(name, "Form.svelte"));
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, formContent);
    console.log("Generated Svelte TypeScript form saved to: ".concat(outputPath));
};

export default createSvelteForm_ts
