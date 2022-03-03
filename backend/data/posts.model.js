const mongoose = require('mongoose');
const schema   = mongoose.Schema;

const postSchema = new schema({
    topic: 
    {
        type: String,
        required: [true, 'You must put in a name to the new topic']
    },
    title:
    {
        type: String,
        required: [true, 'You must put in a title to this post']
    },
    desc:
    {
        type: String,
        required: [true, 'You must put in a description about this post']
    }
});

module.exports = mongoose.model("Post", postSchema);