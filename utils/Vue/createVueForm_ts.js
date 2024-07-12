import * as path from "path";
import * as fs from 'fs';

var createVueForm_ts = function (model, formDest) {
    var name = model.name, attributes = model.attributes;
    var template = "\n<script setup lang=\"ts\">\nimport { ref } from 'vue';\nimport { useForm } from 'vee-validate';\nimport * as yup from 'yup';\n\ninterface FormData {\n  ".concat(attributes
        .filter(function (attr) { return !(/^(created|updated)?at$/i.test(attr.name)); })
        .map(function (attr) { return "".concat(attr.name, ": ").concat(mapTypeToTS(attr.type)).concat(attr.optional ? ' | null' : ''); })
        .join(';\n  '), ";\n}\n\nconst schema = yup.object({\n  ").concat(attributes
        .filter(function (attr) { return !(/^(created|updated)?at$/i.test(attr.name)); })
        .map(function (attr) { return "".concat(attr.name, ": ").concat(getYupValidation(attr)); })
        .join(',\n  '), "\n});\n\nconst { handleSubmit, errors, values } = useForm<FormData>({\n  validationSchema: schema,\n});\n\nconst onSubmit = handleSubmit(async (formData) => {\n  try {\n    const response = await fetch('https://example.com/api/").concat(name.toLowerCase(), "', {\n      method: 'POST',\n      headers: {\n        'Content-Type': 'application/json',\n      },\n      body: JSON.stringify(formData),\n    });\n    \n    if (response.ok) {\n      alert('Form submitted successfully!');\n      // Reset form\n      Object.keys(formData).forEach(key => (values[key] = ''));\n    } else {\n      throw new Error('Submission failed');\n    }\n  } catch (error) {\n    alert('Form submission failed. Please try again.');\n    console.error(error);\n  }\n});\n</script>\n\n<template>\n  <form @submit=\"onSubmit\">\n    <h2>").concat(name, " Form</h2>\n    ").concat(attributes
        .filter(function (attr) { return !(/^(created|updated)?at$/i.test(attr.name)); })
        .map(function (attr) { return "\n    <div class=\"mb-4\">\n      <label for=\"".concat(attr.name, "\">").concat(formatLabel(attr.name), ":</label>\n      <input\n        v-model=\"values.").concat(attr.name, "\"\n        type=\"").concat(getInputType(attr.type), "\"\n        id=\"").concat(attr.name, "\"\n        name=\"").concat(attr.name, "\"\n      />\n      <p v-if=\"errors.").concat(attr.name, "\">{{ errors.").concat(attr.name, " }}</p>\n    </div>"); }).join(''), "\n    <button type=\"submit\">\n      Submit\n    </button>\n  </form>\n</template>\n");
    var outputFilePath = path.join(process.cwd(), formDest, "".concat(name, "Form.vue"));
    fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
    fs.writeFileSync(outputFilePath, template);
    console.log("Generated Vue form saved to: ".concat(outputFilePath));
};

function mapTypeToTS(type) {
    var typeMap = {
        String: 'string',
        Int: 'number',
        Float: 'number',
        DateTime: 'Date',
        Boolean: 'boolean',
    };
    return typeMap[type] || 'any';
}
function getInputType(type) {
    var inputTypeMap = {
        String: 'text',
        Int: 'number',
        Float: 'number',
        DateTime: 'datetime-local',
        Boolean: 'checkbox',
    };
    return inputTypeMap[type] || 'text';
}
function getYupValidation(attr) {
    var type = attr.type, optional = attr.optional;
    var validation = 'yup';
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
function formatLabel(name) {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); });
}

export default createVueForm_ts
