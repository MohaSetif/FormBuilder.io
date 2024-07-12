import * as fs from 'fs';
import * as path from 'path';

var createReactForm_ts = function (model, formDest) {
    var name = model.name, attributes = model.attributes;
    function getValidationRules(attr) {
        var rules = {};
        if (!attr.optional) {
            rules.required = 'This field is required';
        }
        switch (attr.type) {
            case 'String':
                rules.maxLength = { value: 255, message: 'Max length is 255 characters' };
                break;
            case 'Int':
            case 'Float':
                rules.min = { value: 0, message: 'Value must be positive' };
                break;
            case 'DateTime':
                rules.validate = '(value) => !isNaN(Date.parse(value)) || "Invalid date"';
                break;
        }
        return JSON.stringify(rules).replace('"(value)', '(value').replace(')"', ')');
    }
    function getInputType(type) {
        switch (type) {
            case 'String': return 'text';
            case 'Int': return 'number';
            case 'Float': return 'number';
            case 'Boolean': return 'checkbox';
            case 'DateTime': return 'datetime-local';
            default: return 'text';
        }
    }
    function getTypeScriptType(type) {
        switch (type) {
            case 'String': return 'string';
            case 'Int':
            case 'Float': return 'number';
            case 'Boolean': return 'boolean';
            case 'DateTime': return 'string'; // Use string for datetime-local input
            default: return 'any';
        }
    }
    function generateFormField(attr) {
        if (attr.type === 'Boolean') {
            return "\n        <div key=\"".concat(attr.name, "\">\n          <label htmlFor=\"").concat(attr.name, "\">\n            <input\n              id=\"").concat(attr.name, "\"\n              type=\"checkbox\"\n              {...register(\"").concat(attr.name, "\", ").concat(getValidationRules(attr), ")}\n            />\n            ").concat(attr.name, "\n          </label>\n          {errors.").concat(attr.name, " && <span className=\"error\">{errors.").concat(attr.name, ".message}</span>}\n        </div>");
        }
        return "\n      <div key=\"".concat(attr.name, "\">\n        <label htmlFor=\"").concat(attr.name, "\">").concat(attr.name, "</label>\n        <input\n          id=\"").concat(attr.name, "\"\n          {...register(\"").concat(attr.name, "\", ").concat(getValidationRules(attr), ")}\n          type=\"").concat(getInputType(attr.type), "\"\n        />\n        {errors.").concat(attr.name, " && <span className=\"error\">{errors.").concat(attr.name, ".message}</span>}\n      </div>");
    }
    var formContent = "\nimport React from 'react';\nimport { useForm, SubmitHandler } from 'react-hook-form';\n\ninterface ".concat(name, "FormData {\n  ").concat(attributes.map(function (attr) { return "".concat(attr.name).concat(attr.optional ? '?' : '', ": ").concat(getTypeScriptType(attr.type), ";"); }).join('\n  '), "\n}\n\nexport const ").concat(name, "Form: React.FC = () => {\n  const { register, handleSubmit, formState: { errors }, reset } = useForm<").concat(name, "FormData>();\n\n  const onSubmit: SubmitHandler<").concat(name, "FormData> = async (data) => {\n    try {\n      // Replace with your API call\n      console.log(data);\n      alert('Form submitted successfully!');\n      reset(); // Reset form after successful submission\n    } catch (error) {\n      console.error('Error submitting form:', error);\n      alert('An error occurred. Please try again.');\n    }\n  };\n\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n      <h2>").concat(name, " Form</h2>\n      ").concat(attributes.map(function (attr) { return generateFormField(attr); }).join('\n      '), "\n      <button type=\"submit\">Submit</button>\n    </form>\n  );\n};\n  ");
    var outputPath = path.join(process.cwd(), formDest, "".concat(name, "Form.tsx"));
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, formContent);
    console.log("Generated React TypeScript form saved to: ".concat(outputPath));
};

export default createReactForm_ts;
