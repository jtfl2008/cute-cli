const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Generator = require('./generator')
module.exports = async function (name, options) {
  const cwd = process.cwd()
  const targetDir = path.resolve(cwd, name)
  // 判断目录是否存在
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      // 是否强制覆盖
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite'
            },
            {
              name: 'Cancel',
              value: false
            }
          ]
        }
      ])
      if (!action) {
        return
      } else {
        // 删除存在目录
        console.log(`\r\nRemoving...`)
        await fs.remove(targetDir)
      }
    }
  }
  const generator = new Generator(name, targetDir)
  generator.create()
}
