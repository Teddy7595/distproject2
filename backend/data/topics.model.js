const mongoose = require('mongoose');
const unique   = require('mongoose-unique-validator');
const schema   = mongoose.Schema;

const topicSchema = new schema({
    topic: 
    {
        type: String,
        required: [true, 'You must put in a name to the new topic'],
        unique: [true, 'This element already exist!']
    }
});

topicSchema.plugin(unique);

module.exports = mongoose.model("Topic", topicSchema);