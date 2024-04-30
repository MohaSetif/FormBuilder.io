#!usr/bin/env node

import inquirer from 'inquirer';

async function getSchema() {
    const questions = [
        {
            type: 'input',
            name: 'schema_path',
            message: 'Enter the path for the schema:',
            default: './prisma/User.prisma'
        },
        {
            type: 'input',
            name: 'form_dest',
            message: 'Enter the destination for the form:'
        },
        {
            type: 'input',
            name: 'frmwork_dev',
            message: 'Enter the development framework:'
        }
    ];

    const answers = await inquirer.prompt(questions);
    return answers;
}

async function main() {
    const answers = await getSchema();
    console.log('Answers:', answers);
}

main();