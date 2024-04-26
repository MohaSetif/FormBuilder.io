"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePrismaSchema = void 0;
var fs = require("fs");
function parsePrismaSchema(filePath) {
    var schema = fs.readFileSync(filePath, 'utf-8');
    var models = [];
    var currentModel = null;
    var lines = schema.split('\n');
    var isInside = false;
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var trimmed_line = line.trim();
        if (trimmed_line.startsWith('model ')) {
            if (currentModel !== null) {
                models.push(currentModel);
            }
            var modelName = trimmed_line.split(' ')[1];
            currentModel = {
                name: modelName,
                attributes: []
            };
            isInside = true;
        }
        else if (trimmed_line == '}' && isInside) {
            isInside = false;
        }
        else if (!trimmed_line.startsWith('//') && currentModel && isInside && trimmed_line) {
            var attribute_line = trimmed_line.replace(/[{?}]/g, '');
            var _a = attribute_line.split(/\s+/), attribute_name = _a[0], attribute_type = _a[1];
            var first_letter = attribute_name.charAt(0).toUpperCase();
            var remaining_letters = attribute_name.slice(1);
            var new_attribute_name = first_letter + remaining_letters;
            currentModel.attributes.push({
                name: new_attribute_name,
                type: attribute_type
            });
        }
    }
    if (currentModel != null) {
        models.push(currentModel);
    }
    return models;
}
exports.parsePrismaSchema = parsePrismaSchema;
