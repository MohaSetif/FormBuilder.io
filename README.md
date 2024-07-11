# FormBuilder.io

FormBuilder.io is a CLI tool designed to generate HTML, React, Vue, and Svelte forms from Prisma models. The tool scans your project for Prisma schema files, allows you to select a model, and then generates a form based on the attributes of that model.

## Features

- Automatically scans for Prisma schema files in your project.
- Supports form generation for HTML, React (JavaScript and TypeScript), Vue, and Svelte.
- Generates input fields based on Prisma model attributes.
- Ignores creation and update timestamp fields (e.g., `createdAt` and `updatedAt`).

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/FormBuilder.io.git
    cd FormBuilder.io
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

## Usage

1. Run the CLI tool:
    ```sh
    node index.js
    ```

2. Follow the prompts:
    - Choose a Prisma schema file.
    - Select a model from the chosen schema.
    - Enter the destination file name for the generated form.
    - Choose the development framework (HTML, React, Vue, or Svelte).

3. The generated form will be saved to the specified destination.

## Example

```sh
$ node index.js



 _____                    ____        _ _     _           _       
 |  ___|__  _ __ _ __ ___ | __ ) _   _(_) | __| | ___ _ __(_) ___  
 | |_ / _ \| '__| '_ ` _ \|  _ \| | | | | |/ _` |/ _ \ '__| |/ _ \ 
 |  _| (_) | |  | | | | | | |_) | |_| | | | (_| |  __/ |_ | | (_) |
 |_|  \___/|_|  |_| |_| |_|____/ \__,_|_|_|\__,_|\___|_(_)|_|\___/ 
                                                                   
? Choose a Prisma schema file: /path/to/your/prisma/schema.prisma
? Choose a model: User
? Enter the file destination for the form: UserForm
? Enter the development framework: No Framework (HTML)
