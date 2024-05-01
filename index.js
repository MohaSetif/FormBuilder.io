#!usr/bin/env node

import inquirer from 'inquirer'
import boxen from 'boxen'
import figlet from 'figlet'

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms))

async function getSchema() {
    const questions = [
        {
            type: 'input',
            name: 'schema_path',
            message: 'Enter the path for the schema:',
        },
        {
            type: 'input',
            name: 'form_dest',
            message: 'Enter the destination for the form:'
        },
        {
            type: 'list',
            name: 'frmwork_dev',
            message: 'Enter the development framework:',
            choices: [
                'React',
                'Vue',
                'Svelte'
            ]
        }, {
            type: 'list',
            name: 'frmwork_lang',
            message: 'Enter the development language: ',
            choices: [
                'JavaScript',
                'TypeScript'
            ],
            when: (answers) => answers.frmwork_dev === 'React'
        }
    ]

    const answers = await inquirer.prompt(questions)
    return answers
}

async function main() {
    await sleep()
    await getSchema()
    console.log(boxen('You have now generated your form successfully!', 
    {title: 'Congrats', titleAlignment: 'center', padding: 1, borderColor: 'cyan'}))
}

figlet("FormBuilder.io", function (err, data) {
    if (err) {
      console.log("Something went wrong...")
      console.dir(err)
      return
    }
    console.log(data)
  })

main()