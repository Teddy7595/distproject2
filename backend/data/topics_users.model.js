const mongoose = require('mongoose');
const unique   = require('mongoose-unique-validator');
const schema   = mongoose.Schema;

const topicUsrSchema = new schema({
    topics: 
    {
        type: Array,
        default: []
    },
    userID:
    {
        type: mongoose.Schema.Types.ObjectId,
        unique: [true, "The userid must be unique"],
        required: [true, "the userid is required"],
    }
});

topicUsrSchema.plugin(unique);

module.exports = mongoose.model("Topic_User", topicUsrSchema);