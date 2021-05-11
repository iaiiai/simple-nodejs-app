const express = require("express")
const router = express.Router()
const Article = require("../models/article_model")

router.get('/new', (req, res) => {
    res.render("articles/newarticle", {articles: new Article()})
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render("articles/edit", {articles: article})
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({slug: req.params.slug})
    console.log(req.params.slug)
    if (article == null) res.render('E404', {articles: article})
    res.render('articles/show', {articles: article})
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
    res.redirect('/')
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.text = req.body.text
        article.markdown = req.body.markdown
        console.log(req)
        try {
            article = await article.save()
            console.log("Succesfully saved data to database.")
            res.redirect(`/articles/${article.slug}`)
        }
        catch (e) {
            console.log(e)
            res.render(`articles/${path}`, {articles: article})
        }
    }
}

module.exports = router