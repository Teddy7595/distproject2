const mongoose = require('mongoose');
const unique   = require('mongoose-unique-validator');
const schema   = mongoose.Schema;

const topicSchema = new schema({
    topic: 
    {
        type: String,
        default: " ",
        require: [true, 'You must put in a name to the new topic']
    }
});

topicSchema.plugin(unique);

module.exports = mongoose.model("Topic", topicSchema);