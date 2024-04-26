"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createForm = void 0;
var path = require("path");
var fs = require("fs");
var createForm = function (models) {
    var html = "<!DOCTYPE html>\n    <html lang=\"en\">\n        <form method='post' action=''>";
    models.forEach(function (model) {
        html += '\n';
        html += '\t';
        html += "<h2>Model: ".concat(model.name, "</h2>");
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
                    html += '\n';
                    html += '\t';
                    html += "<label for=\"".concat(label, "\">").concat(label, ":</label>");
                    html += '\n';
                    html += '\t';
                    html += "<input type=\"".concat(htmlType, "\" name=\"").concat(label, "\" />");
                    html += '\n';
                    html += '\n';
                }
            }
        });
    });
    html += "</form>\n    </html>";
    var outputFilePath = path.join('.', 'form.html');
    fs.writeFileSync(outputFilePath, html);
    console.log("Generated HTML form saved to: ".concat(outputFilePath));
};
exports.createForm = createForm;
