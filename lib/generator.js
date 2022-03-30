const path = require('path')
const ora = require('ora')
const inquirer = require('inquirer')
const { promisify } = require('util')
const downLoadGitRepo = require('download-git-repo')
const { getRepoList, getTagList } = require('./http')
const chalk = require('chalk')
const shell = require('shelljs')
async function onLoading(fn, msg, ...args) {
  const spinner = ora(msg)
  spinner.start()
  try {
    const result = await fn(...args)
    spinner.succeed()
    return result
  } catch (error) {
    spinner.fail('failed', error)
  }
}
class Generator {
  constructor(name, targetDir) {
    this.name = name
    this.targetDir = targetDir
    this.downLoadGitRepo = promisify(downLoadGitRepo)
  }
  async create() {
    // const repo = await this.getRepo()

    // const tag = await this.getTag(repo)

    // console.log(`仓库: ${repo}，版本：${tag}`)
    // await this.downLoad(repo, tag)
    // console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
    await this.installPackages()
  }
  async getRepo() {
    const repoList = await onLoading(getRepoList, 'loading repo list')

    if (!repoList) return

    const repoNameList = repoList.map(item => item.name)
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repoNameList,
      message: 'please select a repo'
    })
    return repo
  }
  async getTag(repo) {
    const tagList = await onLoading(getTagList, 'loading tag list', repo)
    if (!tagList) return

    const tagNameList = tagList.map(item => item.name)
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagNameList,
      message: 'please select a tag'
    })
    return tag
  }
  async downLoad(repo, tag) {
    const requsetUrl = `zhurong-cli/${repo}${tag ? '#' + tag : ''}`
    await onLoading(
      this.downLoadGitRepo,
      'downloading template',
      requsetUrl,
      path.resolve(process.cwd(), this.targetDir)
    )
  }
  async installPackages() {
    const appPath = shell.pwd()
    shell.cd(path.resolve(process.cwd(), this.name))
    await onLoading()
    function install() {
      return new Promise((resolve, reject) => {
        shell.exec('npm install', (code, stdout, stderr) => {
          if (code !== 0) {
            console.log(`\r\n  ${chalk.red('依赖下载失败')}`)
            reject(stderr)
          }
          resolve(stdout)
        })
      })
    }
    await onLoading(install, 'installing packages')
    console.log(`\r\n  ${chalk.cyan('依赖下载成功')}`)
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    console.log(`\r\n  ${chalk.cyan('npm run serve')}\r\n`)
    // const spinner = ora('依赖下载中...')
    // spinner.start()
    // if (!shell.exec('npm install').code) {
    //   spinner.succeed()
    //   console.log(`\r\n  ${chalk.cyan('依赖下载成功')}`)
    //   console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    //   console.log(`\r\n  ${chalk.cyan('npm run serve')}\r\n`)
    //   // shell.exec('npm run serve')
    // } else {
    //   console.log(`\r\n  ${chalk.red('依赖下载失败')}`)
    // }
  }
}

module.exports = Generator
