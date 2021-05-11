const express = require("express")
const mongoose = require("mongoose")
const Article = require("./models/article_model")
const methodOverride = require("method-override")
const app = express()
const articleRouter = require("./routes/articles")

app.use(express.urlencoded( { extended: false } ))
app.use(methodOverride('_method'))

mongoose.connect("mongodb+srv://admin:200520072012@cluster0.pkm41.mongodb.net/myblog?retryWrites=true&w=majority", { useNewUrlParser: true , useUnifiedTopology: true })
    .then((result) => {
        console.log("Connected to database.")
        app.listen(process.env.PORT || 5000)
    })
    .catch((err) => {
        console.log(err)
    })
app.set("view engine", 'ejs')


app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ date: "desc" });
    res.render('index', {article: articles})
})


app.use('/articles', articleRouter)