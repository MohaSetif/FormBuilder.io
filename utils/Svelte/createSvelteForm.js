"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSvelteForm = void 0;
var path = require("path");
var fs = require("fs");
var createSvelteForm = function (models) {
    var html = "<script>\n    ";
    models.forEach(function (model) {
        model.attributes.forEach(function (attribute) {
            html += "let ".concat(attribute.name, " = ");
            var typeMap = {
                String: "''",
                Int: "0",
                Float: "0.0",
                DateTime: "new Date()",
                Boolean: "false",
            };
            html += typeMap[attribute.type];
            html += ";\n";
        });
    });
    html += "\n    const handleSubmit = async () => {\n      const response = await fetch('https://example.com/api/register', {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json',\n        },\n        body: JSON.stringify({";
    models.forEach(function (model, index) {
        model.attributes.forEach(function (attribute, idx) {
            html += "".concat(attribute.name);
            if (index !== models.length - 1 || idx !== model.attributes.length - 1) {
                html += ', ';
            }
        });
    });
    html += "}),\n      });\n  \n      if (response.ok) {\n        alert('Registration successful!');\n      } else {\n        alert('Registration failed. Please try again.');\n      }\n    };\n  </script>\n  \n  <main>\n    <h1>Registration Form</h1>\n    <form on:submit|preventDefault={handleSubmit}>";
    models.forEach(function (model) {
        model.attributes.forEach(function (attribute) {
            html += "\n      <label>\n        ".concat(attribute.name, ":\n        <input bind:value={").concat(attribute.name, "} type=\"").concat(attribute.type === 'Boolean' ? 'checkbox' : attribute.type.toLowerCase(), "\" ");
            if (attribute.type === 'Boolean') {
                html += "checked=\"{".concat(attribute.name, "}\" ");
            }
            html += "required />\n      </label>";
        });
    });
    html += "\n      <button type=\"submit\">Register</button>\n    </form>\n  </main>";
    var outputFilePath = path.join('.', 'form.svelte');
    fs.writeFileSync(outputFilePath, html);
    console.log("Generated Svelte form saved to: ".concat(outputFilePath));
};
exports.createSvelteForm = createSvelteForm;
