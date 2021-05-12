const express = require("express")
const router = express.Router()
const Article = require("../models/article_model")
const Comment = require("../models/article_comment.js")

router.get('/new', (req, res) => {
    res.render("articles/newarticle", {articles: new Article()})
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render("articles/edit", {articles: article})
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({slug: req.params.slug})
    let renderedComment = await Comment.find({articleLink: req.params.slug}).sort({date: "desc"})
    if (article == null) res.render('E404', {articles: article});
    res.render('articles/show', {articles: article, comments: renderedComment})
})

router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))


router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    try {
        await Comment.remove({articleID: req.params.id}, function (error) {
            if (!error) {
                console.log("REMOVED")
            }
            else {
                console.log("PROBLEM")
            }
        })
    } catch (error) {
        res.send("Error, can't find comments")
    }
    res.redirect('/')
})

router.post('/comment/:slug', async (req, res) => {
    let getArticleID = await Article.findOne({slug: req.params.slug})
    let comment = new Comment(
        {
            username: req.body.user,
            commentText: req.body.comment,
            articleLink: req.params.slug,
            articleID: getArticleID._id
        }
    )
    const article = await Article.findOne({slug: req.params.slug})
    let renderedComment = await Comment.find({articleLink: req.params.slug}).sort({date: "desc"})
    try {
        comment = await comment.save()
        console.log("[COMMENT] Succesfully saved comment")
        res.redirect(`/articles/${req.params.slug}`)
    } catch (err) {
        console.log(err)
        res.redirect("/E304/error")
    }
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.text = req.body.text
        article.markdown = req.body.markdown
        try {
            article = await article.save()
            console.log("Succesfully saved data to database.")
            res.redirect(`/articles/${article.slug}`)
        }
        catch (e) {
            console.log("some error in articles js function saveArticleAndRedirect")
            console.log(e)
            res.render(`articles/${path}`, {articles: article})
        }
    }
}

module.exports = router