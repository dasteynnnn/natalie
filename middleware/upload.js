const SFTPClient = require("ssh2-sftp-client") 
const path = require('path')

const stfpUpload = async (file) => {
    // initialize the SFTP client
    const sftp = new SFTPClient()

    let ext = path.extname(file.originalname)
    const remoteFile = Date.now() + ext
    
    try {
        // connect to the FTP/FTPS server
        await sftp.connect({
            host: "127.0.0.1",
            username: "foo",
            password: "pass",
        })
        
        // perform operations on the SFTP server...
        await sftp.put(file, remoteFile); 
    } catch(e) {
        console.log(e)
    }
    
    // close the client connection
    await sftp.close()
}

//const path = require('path')
const multer = require('multer')
//const SFTPClient = require("ssh2-sftp-client") 

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/')
//     },
//     filename: (req, file, cb) => {
//         let ext = path.extname(file.originalname)
//         cb(null, Date.now() + ext)
//     }
// })

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/')
    },
    filename: (req, file, cb) => {
        console.log(file)
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})

var upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg'){
            callback(null, true)
        } else {
            console.log("Invalid File Type")
            callback(null, false)
        }
    }
})

module.exports = upload