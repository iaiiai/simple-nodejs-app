const mongoose = require("mongoose")
const { default: slugify } = require("slugify")
const Schema = mongoose.Schema
const marked = require("marked")
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const domPurify = createDomPurify(new JSDOM().window)


const articleSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        markdown: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        sanitizedHTML: {
            type: String,
            required: true
        },
        comments: [
            {
                type: Schema.Types.ObjectId, 
                ref: 'Comment'
            }
        ]
    }
)

articleSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, {lower: true, strict: true})
    }
    if (this.markdown) {
        this.sanitizedHTML = domPurify.sanitize(marked(this.markdown))
    }
    next()
}) // May cause error because there is arrow func

const Blog = mongoose.model('Blog', articleSchema)

module.exports = Blog