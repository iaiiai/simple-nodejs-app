const express = require("express")
const router = express.Router()
const Comment = require("../models/article_comment.js")
const Article = require("../models/article_model")


router.post('/', async (req, res) => {
    let comment = new Comment(
        {
            username: req.body.user,
            commentText: req.body.comment,
            // articleLink: Article.findOne()
        }
    )
    console.log(req)
    try {
        comment = await comment.save()
        console.log("[COMMENT] Succesfully saved comment")
        saveCommentAndRedirect()
        res.render('articles/show')
    } catch (err) {
        console.log(err)
        res.redirect("/E304/error")
    }
})

function saveCommentAndRedirect (path) {
    return (req, res) => {
        console.log(req.path)
    }
}

module.exports = router