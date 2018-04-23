const axios = require('axios')
const path = require('path')
const fs = require('fs')
const download = require('image-downloader')
const { boardExists } = require('./boards')
const { getCommand } = require('./commands')

function showError (n = 0) {
    console.log('Incorrect Usage', n)
    process.exit(-1)
}

let board = false
let ids = false
let thread = false
let url = ''

if (process.argv.length < 4) showError(0)

for (let i = 2; i < process.argv.length - 1; i++) {
    if (i % 2 != 0) showError(1)
    let c = process.argv[i]
    let d = process.argv[++i]
    c = (c = getCommand(c.slice(1, c.length))) ? c : showError(2)

    switch (c) {
        case 'board':
            board = boardExists(d) ? d : showError(3)
            break
        case 'thread':
            thread = Number.isInteger(+d) ? d : showError(4)
            break
        case 'id':
            ids = d.length > 0 ? d.split(',') : showError(5)
            break
        default: showError(6)
    }
}

if (!(board && ids && thread)) showError(7)

fetch({board, thread, ids})

async function fetch ({board, thread, ids = false}) {
    const url = `https://a.4cdn.org/${board}/thread/${thread}.json`
    let imgurl = `https://i.4cdn.org/${board}/`
    let folder = path.resolve(__dirname, `images/${board}/${thread}`)
    createFolder({board, thread})

    try {
        let result = await axios.get(url)
        let posts = result.data.posts
        for (const post of posts) {
            if (ids && post.filename && ids.indexOf(post.id) != -1) {
                let filename = post.tim + post.ext                

                let options = {
                    url: imgurl + filename,
                    dest: folder
                }

                console.log('Downloading: ' + filename)
                
                await downloadIMG(options)
            }
        }
    } catch (error) {
        console.log(error)
    }

    function createFolder ({board, thread}) {
        let arr = ['images', board, thread]
        let dir = __dirname
        for (const folder of arr) {
            dir = path.resolve(dir, folder)

            if (!fs.existsSync(dir)) fs.mkdirSync(dir)
        }
    }

    async function downloadIMG (options) {
        try {
            const { filename, image } = await download.image(options)
            // console.log('done', filename) // => /path/to/dest/image.jpg 
        } catch (e) {
            throw e
        }
    }
}