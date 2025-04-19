import { execSync } from 'child_process';
import degit from 'degit';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import path from 'path';
import fs from 'fs';

const templates = ['quiz', 'chat', 'prompt-result', 'transform', 'cultural-scanner'];

const argv = yargs(hideBin(process.argv))
  .command('$0 <project-name>', 'Create a new OpenAI tool project', (yargs: any) => {
    yargs
      .positional('project-name', {
        describe: 'Name of the project',
        type: 'string',
      })
      .option('template', {
        alias: 't',
        describe: 'Template to use',
        choices: templates,
        demandOption: true,
      });
  })
  .help()
  .argv;

const { projectName, template } = argv as { projectName: string; template: string };

const repo = `user/openai-tool-template/templates/${template}`;
const emitter = degit(repo, { cache: false, force: true, verbose: true });

emitter.clone(projectName).then(() => {
  console.log(`Project cloned into ${projectName}`);
  process.chdir(projectName);
  execSync('npm install', { stdio: 'inherit' });
  console.log(`\nSuccess! Created ${projectName} using the ${template} template.`);
  console.log(`\nNext steps:\n  cd ${projectName}\n  npm run dev`);
}).catch((error: any) => {
  console.error('Error cloning template:', error);
});

