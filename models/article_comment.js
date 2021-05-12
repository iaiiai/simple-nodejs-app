const mongoose = require("mongoose")
const Schema = mongoose.Schema

const commentSchema = new Schema( {
    username: {
        type: String,
        required: true
    },
    commentText: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    articleLink: {
        type: String,
        required: true
    },
    articleID: {
        type: String,
        required: true
    }
}
)

// commentSchema.pre('validate', function(next) {
//     if (this.commentAttachedTo) {
//         this.commentAttachedTo = 
//     }
// })

const Comment = mongoose.model('Comment', commentSchema) // May cause error
module.exports = Comment