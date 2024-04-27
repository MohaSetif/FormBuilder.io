"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVueForm = void 0;
var path = require("path");
var fs = require("fs");
var createVueForm = function (models) {
    var html = "\n    <template>\n        <div>\n            <form @submit.prevent=\"handleSubmit\">";
    models.forEach(function (model) {
        html += "\n\t\t<h2>Model: ".concat(model.name, "</h2>");
        model.attributes.forEach(function (attribute) {
            var label = attribute.name;
            var typeMap = {
                String: "text",
                Int: "number",
                Float: "number",
                DateTime: "date",
                Boolean: "checkbox",
            };
            var htmlType = typeMap[attribute.type];
            var shouldIgnoreCreation = /^(created)?at$/i.test(attribute.name);
            var shouldIgnoreUpdate = /^(updated)?at$/i.test(attribute.name);
            if (!shouldIgnoreCreation && !shouldIgnoreUpdate) {
                if (typeMap[attribute.type]) {
                    html += "\n\t\t<label for=\"".concat(label, "\">").concat(label, ":</label>");
                    html += "\n\t\t<input v-model=\"".concat(label, "\" type=\"").concat(htmlType, "\" name=\"").concat(label, "\" />");
                    html += '\n';
                }
            }
        });
    });
    html += "\n                <button type=\"submit\">Register</button>\n            </form>\n        </div>\n    </template>\n\n    <script>\n    export default {\n        data() {\n            return {";
    models.forEach(function (model) {
        model.attributes.forEach(function (attribute) {
            var shouldIgnoreCreation = /^(created)?at$/i.test(attribute.name);
            var shouldIgnoreUpdate = /^(updated)?at$/i.test(attribute.name);
            if (!shouldIgnoreCreation && !shouldIgnoreUpdate) {
                html += "\n                ".concat(attribute.name, ": '',");
            }
        });
    });
    html += "\n            };\n        },\n        methods: {\n            async handleSubmit() {\n                const response = await fetch('https://example.com/api/register', {\n                    method: 'POST',\n                    headers: {\n                        'Content-Type': 'application/json',\n                    },\n                    body: JSON.stringify({";
    models.forEach(function (model, index) {
        model.attributes.forEach(function (attribute, idx) {
            html += "".concat(attribute.name, ": this.").concat(attribute.name);
            if (index !== models.length - 1 || idx !== model.attributes.length - 1) {
                html += ',\n\t\t\t\t\t\t';
            }
        });
    });
    html += "\n                    }),\n                });\n\n                if (response.ok) {\n                    alert('Registration successful!');\n                } else {\n                    alert('Registration failed. Please try again.');\n                }\n            },\n        },\n    };\n    </script>\n    ";
    var outputFilePath = path.join('.', 'form.vue');
    fs.writeFileSync(outputFilePath, html);
    console.log("Generated Vue form saved to: ".concat(outputFilePath));
};
exports.createVueForm = createVueForm;
