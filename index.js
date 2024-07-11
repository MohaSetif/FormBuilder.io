#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import boxen from 'boxen'
import figlet from 'figlet'
import parsePrismaSchema from './utils/prismaParser.js'
import createHTMLForm from "./utils/HTML/createForm.js"
import createReactForm from './utils/React/createReactForm.js'
import createReactForm_ts from './utils/React/createReactForm_ts.js'
import createVueForm from './utils/Vue/createVueForm.js'
import createSvelteForm from './utils/Svelte/createSvelteForm.js'

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms))

async function scanPrismaSchemas(rootDir) {
    const prismaFiles = []

    async function scanDirectory(dir) {
        const files = await fs.promises.readdir(dir)
        for (const file of files) {
            const filePath = path.join(dir, file)
            const stats = await fs.promises.stat(filePath)
            if (stats.isDirectory()) {
                await scanDirectory(filePath)
            } else if (path.extname(filePath) === '.prisma') {
                prismaFiles.push(filePath)
            }
        }
    }

    await scanDirectory(rootDir)

    return prismaFiles
}

async function selectPrismaSchema(files) {
    const questions = [
        {
            type: 'list',
            name: 'selectedSchema',
            message: 'Choose a Prisma schema file:',
            choices: files,
        },
    ]

    const answers = await inquirer.prompt(questions)
    return answers.selectedSchema
}

async function selectModel(models) {
    const questions = [
        {
            type: 'list',
            name: 'selectedModel',
            message: 'Choose a model:',
            choices: models.map(model => model.name),
        },
    ]

    const answers = await inquirer.prompt(questions)
    return answers.selectedModel
}

async function getSchema() {
    const rootDir = process.cwd()
    const prismaFiles = await scanPrismaSchemas(rootDir)

    if (prismaFiles.length === 0) {
        console.log('No Prisma schema files found in the project.')
        return null
    }

    const selectedSchema = await selectPrismaSchema(prismaFiles)
    const models = parsePrismaSchema(selectedSchema)
    const selectedModel = await selectModel(models)
    const formDest = await inquirer.prompt({
        type: 'input',
        name: 'formDest',
        message: 'Enter the file destination for the form:'
    })

    return { schemaPath: selectedSchema, modelName: selectedModel, formDest: formDest.formDest }
}

async function main() {
    await sleep()
    const answers = await getSchema()

    if (!answers) {
        return // No Prisma schema files found
    }

    const { schemaPath, modelName, formDest } = answers
    const models = parsePrismaSchema(schemaPath)
    
    // Find the selected model
    const selectedModel = models.find(model => model.name === modelName)

    const frameworkDev = await inquirer.prompt({
        type: 'list',
        name: 'frmwork_dev',
        message: 'Enter the development framework:',
        choices: [
            'No Framework (HTML)',
            'React',
            'Vue',
            'Svelte'
        ]
    })

    if (frameworkDev.frmwork_dev === 'No Framework (HTML)'){
        createHTMLForm(selectedModel, formDest)
    }
    else if (frameworkDev.frmwork_dev === 'React') {
        const frameworkLang = await inquirer.prompt({
            type: 'list',
            name: 'frmwork_lang',
            message: 'Enter the development language: ',
            choices: [
                'JavaScript',
                'TypeScript'
            ]
        })

        if (frameworkLang.frmwork_lang === 'JavaScript') {
            createReactForm(selectedModel, formDest)
        } else {
            createReactForm_ts(selectedModel, formDest)
        }
    } else if (frameworkDev.frmwork_dev === 'Vue') {
        createVueForm(selectedModel, formDest)
    } else {
        createSvelteForm(selectedModel, formDest)
    }

    console.log(boxen('You have now generated your form successfully!', 
    { title: 'Congrats', titleAlignment: 'center', padding: 1, borderColor: 'cyan' }))
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
