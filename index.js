#!/usr/bin/env node
const {spawn}=require('child_process')
const program = require('commander');
const download = require('git-clone');
const shell = require('shelljs');
const open=require('open')
const clear = require('clear');
const chalk = require('chalk');
program.version('1.0.0', '-v, --version')

let newpj=name=>{
    let giturl='git@github.com:vuejs/vue-next-webpack-preview.git'
    download(giturl, `./${name}`, function (err) {
        shell.rm('-rf', `${name}/.git`);
        shell.cd(name)
        shell.exec('npm install')
        clear();
        console.log(chalk.red(`
                🏭创建${name}项目!!
                cd ${name} 进入项目
                vue3-cli start 启动项目
        `))
    })
    //clone(giturl,`./${name}`,null, function() {})
}
let run=()=>{
   // shell.exec('npm run dev')
    let cp=spawn('npm',['run','dev'])
    cp.stdout.pipe(process.stdout)
    cp.stderr.pipe(process.stderr)
    cp.on('close',()=>{
        //clear();
        console.log('成功启动')
    })
    cp.stdout.on("data", data => { 
        let str=data.toString('utf-8');
        let res=str.match(/(http:\/\/localhost:\d{4,5}\/)/ig);
        if(res){
            let url=res[0]
            open(url);
        }
    });
    
}
let start=async ()=>{
    await open('http://localhost:8080/');
}
program.command('new <name>')
    .description('初始化项目')
    .action(newpj);
program.command('start')
    .description('run project')
    .action(run);
program.command('run')
    .description('预览项目')
    .action(start)
program.parse(process.argv);