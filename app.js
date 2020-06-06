const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const render = require("./lib/htmlRenderer");
const { managerQu, engineerQu, internQu, newMember } = require("./lib/Questions");

const asyncWriteFile = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

employeeIdArr = [];
teamArr = [];

async function init() {
    try {
        console.log(`\nBuild your team:`);
        const { id, name, email, officeNumber } = await inquirer.prompt(managerQu);
        const manager = new Manager(name, id, email, officeNumber);
        employeeIdArr.push(id);
        teamArr.push(manager);
        await nextMember();
    }
    catch(err) {
        console.log(err);
    }
}

async function displayQuestions(role) {
    try {
        const { id, name, email, username, school } = await inquirer.prompt(role);

        switch (role) {
            case engineerQu:
                const engineer = new Engineer(name, id, email, username);
                employeeIdArr.push(id);
                teamArr.push(engineer);
                return nextMember();
            default:
                const intern = new Intern(name, id, email, school);
                employeeIdArr.push(id);
                teamArr.push(intern);
                return nextMember();
        }
    }
    catch(err) {
        console.log(err);
    }
}

async function nextMember() {
    try {
        const { teamMember } = await inquirer.prompt(newMember);
        switch (teamMember) {
            case "Engineer":
                return displayQuestions(engineerQu);
            case "Intern":
                return displayQuestions(internQu);
            default:
                console.log("Successfully created your team.");
                renderHTML();
        }
    }
    catch(err) {
        console.log(err);
    }
}

function checkDirectory(directory) {  
    try {
        fs.statSync(directory);
    } catch(e) {
        fs.mkdirSync(directory);
    }
}

init();
