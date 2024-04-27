"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReactForm_ts = void 0;
var path = require("path");
var fs = require("fs");
var createReactForm_ts = function (models) {
    var html = "import React, { useState } from 'react';\n\nconst RegistrationForm = () => {\n    ";
    var processedAttributes = new Set();
    models.forEach(function (model) {
        model.attributes.forEach(function (attribute) {
            var typeMap = {
                String: "text",
                Int: "number",
                Float: "number",
                DateTime: "datetime-local",
                Boolean: "checkbox",
            };
            var typeMap_ts = {
                String: "string",
                Int: "number",
                Float: "number",
                DateTime: "string",
                Boolean: "boolean",
            };
            var shouldIgnoreCreation = /^(created)?at$/i.test(attribute.name);
            var shouldIgnoreUpdate = /^(updated)?at$/i.test(attribute.name);
            if (!shouldIgnoreCreation && !shouldIgnoreUpdate && !processedAttributes.has(attribute.name)) {
                var first_letter = attribute.name.charAt(0).toUpperCase();
                var remaining_letters = attribute.name.slice(1);
                var new_attribute_name = first_letter + remaining_letters;
                html += '\t\t';
                html += "const [".concat(attribute.name, ", set").concat(new_attribute_name, "] = useState<").concat(typeMap_ts[attribute.type], ">(").concat(typeMap[attribute.type] === 'number' ? 0 : "''", ");\n");
                processedAttributes.add(attribute.name);
            }
        });
    });
    html += "\n    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {\n        e.preventDefault();\n    \n        const response = await fetch('https://example.com/api/register', {\n          method: 'POST',\n          headers: {\n            'Content-Type': 'application/json',\n          },\n          body: JSON.stringify({";
    models.forEach(function (model, index) {
        html += '\n';
        model.attributes.forEach(function (attribute, idx) {
            html += '\t\t\t\t\t\t\t';
            html += "".concat(attribute.name, ": ").concat(attribute.name);
            if (index !== models.length - 1 || idx !== model.attributes.length - 1) {
                html += ',';
                html += '\n';
            }
        });
    });
    html += "\n            }),\n        });\n    \n        if (response.ok) {\n          alert('Registration successful!');\n        } else {\n          alert('Registration failed. Please try again.');\n        }\n      };\n\n    return (\n      <div>\n        <h1>Registration Form</h1>\n        <form onSubmit={handleSubmit}>\n    ";
    models.forEach(function (model) {
        model.attributes.forEach(function (attribute) {
            var typeMap = {
                String: "text",
                Int: "number",
                Float: "number",
                DateTime: "datetime-local",
                Boolean: "checkbox",
            };
            var shouldIgnoreCreation = /^(created)?at$/i.test(attribute.name);
            var shouldIgnoreUpdate = /^(updated)?at$/i.test(attribute.name);
            if (!shouldIgnoreCreation && !shouldIgnoreUpdate) {
                var first_letter = attribute.name.charAt(0).toUpperCase();
                var remaining_letters = attribute.name.slice(1);
                var new_attribute_name = first_letter + remaining_letters;
                html += "\n                <label>".concat(new_attribute_name, ": \n                <input type=\"").concat(typeMap[attribute.type], "\" \n                      value={").concat(attribute.name, "} \n                      onChange={(e) => set").concat(new_attribute_name, "(e.target.value)} \n                      required />\n                </label>\n");
            }
        });
    });
    html += "\n          <button type=\"submit\">Register</button>\n        </form>\n      </div>\n    );\n};\n\nexport default RegistrationForm;\n";
    var outputFilePath = path.join('.', 'Form.tsx'); //Let the user choose his form file
    fs.writeFileSync(outputFilePath, html);
    console.log("Generated HTML form saved to: ".concat(outputFilePath));
};
exports.createReactForm_ts = createReactForm_ts;
