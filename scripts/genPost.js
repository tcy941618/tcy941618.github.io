const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')

const rootPath = path.resolve('./')
const postPath = path.resolve(rootPath,'posts')
const distPath = path.resolve(rootPath,'_posts')

const posts = []

const genPosts = (dir='') => {
    const files = fs.readdirSync(path.join(postPath,dir), {withFileTypes: true})
    files.forEach(file=>{
        if(file.isDirectory()) {
            genPosts(path.join(dir, file.name))
        }else {
            const distDir = path.join(distPath, dir)
            const distFile = path.join(distDir,file.name)
            mkdirp.sync(distDir)
            fs.copyFileSync(path.join(postPath,dir,file.name), distFile, fs.constants.COPYFILE_FICLONE)
            
            if(file.name.endsWith('.md')) {
                const header = Buffer.from('---\n---')
                const content = fs.readFileSync(distFile)
                fs.writeFileSync(distFile,header+content)
            }
        }
    })
}

rimraf.sync(distPath)
genPosts()