const mongoose = require('mongoose');
const schema   = mongoose.Schema;

const topicUsrSchema = new schema({
    topics: 
    [{ type: String, ref: 'Topic', default: [], unique: false}],
    userID:
    {
        type: String,
        required: [true, "the userid is required"],
        unique: true
    }
});

module.exports = mongoose.model("Topic_User", topicUsrSchema);