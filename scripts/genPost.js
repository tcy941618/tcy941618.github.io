const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const dayjs = require("dayjs");

const rootPath = path.resolve('./')
const postPath = path.resolve(rootPath,'posts')
const distPath = path.resolve(rootPath,'_posts')

let current = 1

const genPosts = (dir='') => {
    const files = fs.readdirSync(path.join(postPath,dir), {withFileTypes: true})
    files.forEach(file=>{
        if(file.isDirectory()) {
            genPosts(path.join(dir, file.name))
        }else {
            const distDir = path.join(distPath, dir)
            const distFile = path.join(distDir,file.name)
            mkdirp.sync(distDir)
            
            
            if(file.name.endsWith('.md')) {
                const filename = path.join(distDir,dayjs().subtract((Math.random()*30+5)*current, 'days').format("YYYY-MM-DD")+'-'+file.name)
                fs.copyFileSync(path.join(postPath,dir,file.name), filename, fs.constants.COPYFILE_FICLONE)
                const header = Buffer.from(`---\ntitle: ${file.name.substring(0,file.name.length-3)}\n---\n`)
                const content = fs.readFileSync(filename)
                fs.writeFileSync(filename,header+content)
                current += 1
            }else {
                fs.copyFileSync(path.join(postPath,dir,file.name), distFile, fs.constants.COPYFILE_FICLONE)
            }
        }
    })
}

rimraf.sync(distPath)
genPosts()