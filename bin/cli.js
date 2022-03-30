#! /usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const figlet = require('figlet')

program
  .command('create <app-name>')
  .description('create a new project powered by cute-cli')
  .option('-f,--force', 'overwrite target directory if it exist')
  .action((name, options) => {
    require('../lib/create.js')(name, options)
  })

program
  .version(`v${require('../package.json').version}`)
  .usage('<command> [options]')

program.on('--help', () => {
  // 使用 figlet 绘制 Logo
  console.log(
    '\r\n' +
      figlet.textSync('cute-cli', {
        font: 'Dancing Font',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
      })
  )

  // 新增说明信息
  console.log(
    `\r\nRun ${chalk.cyan(
      `cute-cli <command> --help`
    )} for detailed usage of given command\r\n`
  )
})
program.parse(process.argv)
