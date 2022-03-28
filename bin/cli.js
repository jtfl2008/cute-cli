#! /usr/bin/env node

const program = require('commander');

program
  .command('create <app-name>')
  .description('create a new project powered by cute-cli')
  .option('-f,--force', 'overwrite target directory if it exist')
  .action((name, options) => {
    console.log('name:', name, 'options:', options);
  });

program
  .version(`v${require('../package.json').version}`)
  .usage('<command> [options]');

program.parse(process.argv);
