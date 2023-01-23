const express = require("express")
const cors = require("cors")
// const multer=require("multer")
const port = 8080 || process.env.port
const app = express()
const { v4: uniKeyGenerator } = require("uuid")
const path = require("path")
const usersShema = require("./users")
const fileupload = require("express-fileupload")
const { default: mongoose } = require("mongoose")
const uri = `mongodb+srv://bharath:bharath2410@cluster0.hikgtpx.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery', true)
mongoose.connect(uri, (err) => {
    if (err) {
        console.log("connect to mongodb fail");
    } else {
        console.log("connected to mongodb ");
    }
})

app.use(cors());
app.use(express.json());
app.use(fileupload())


app.listen(port, () => { console.log("server is ready"); })
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//         const filename = Date.now() + "_" + file.originalname;
//         cb(null, filename)
//     }
// })


// const upload = multer({ storage: storage });

app.post("/uploads", (req, res) => {
    const { username, location, Description: description } = req.body
    const { imagefile } = req.files
    const unickey = uniKeyGenerator();
    const fragments = imagefile.name.split(".")
    const fileExt = fragments[fragments.length - 1]
    const fileName = unickey + "." + fileExt
    const likes=Math.random()*100
    // console.log(fileName);
    if (['jpeg', 'jpg', 'png', 'svg'].includes(fileExt)) {
        imagefile.mv("./uploads/" + fileName, async (err) => {
            if (err) {
                res.json({ message: err })
            } else {
                const user = new usersShema({
                    username,
                    location,
                    description,
                    imagefile: fileName,
                    date: new Date()
                })
                // console.log(user);
                try {
                    await user.save()
                    res.json({ message: "pushed data into database successfully" })
                }
                catch (e) {
                    res.json({ message: e })
                }
            }

        })
    } else {
        res.json({ message: "please upload a image file" })
    }
})

app.get("/all", async (req, res) => {
    try {
        const alldata = await usersShema.find()
        res.json({ result: alldata })
    } catch (e) {
        res.json({ message: e })
    }
})

app.get("/image/:fileName", (req, res) => {
    // console.log("ok");
    res.sendFile(path.join(__dirname, `/uploads/${req.params.fileName}`))
})