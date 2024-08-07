import * as fs from 'fs';
import * as path from 'path';

const createReactForm = (model, formDest) => {
  const { name, attributes } = model;

  function getValidationRules(attr) {
    const rules = {};
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
        rules.validate = (value) => !isNaN(Date.parse(value)) || 'Invalid date';
        break;
    }
    return JSON.stringify(rules);
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

  function generateFormField(attr) {
    if (attr.type === 'Boolean') {
      return `
        <div key="${attr.name}">
          <label htmlFor="${attr.name}">
            <input
              id="${attr.name}"
              name="${attr.name}"
              type="checkbox"
              {...register("${attr.name}", ${getValidationRules(attr)})}
            />
            ${attr.name}
          </label>
          {errors.${attr.name} && <span className="error">{errors.${attr.name}.message}</span>}
        </div>`;
    }

    return `
      <div key="${attr.name}">
        <label htmlFor="${attr.name}">${attr.name}</label>
        <input
          id="${attr.name}"
          name="${attr.name}"
          {...register("${attr.name}", ${getValidationRules(attr)})}
          type="${getInputType(attr.type)}"
        />
        {errors.${attr.name} && <span className="error">{errors.${attr.name}.message}</span>}
      </div>`;
  }

  const formContent = `
import React from 'react';
import { useForm } from 'react-hook-form';

export const ${name}Form = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      // Replace with your API call
      console.log(data);
      alert('Form submitted successfully!');
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>${name} Form</h2>
      ${attributes.map(attr => generateFormField(attr)).join('\n      ')}
      <button type="submit">Submit</button>
    </form>
  );
};
  `;

  const outputPath = path.join(process.cwd(), formDest, `${name}Form.jsx`);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, formContent);
  console.log(`Generated React form saved to: ${outputPath}`);
};

export default createReactForm;