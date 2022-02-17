const mongoose = require('mongoose');
const unique   = require('mongoose-unique-validator');
const schema   = mongoose.Schema;

const userSchema = new schema({
    pass: 
    {
        type: String,
        required: [true, "Password is required"]
    },
    user:
    {
        type: String,
        unique: [true, "The user must be unique"],
        required: [true, "Nickname is required"]
    }
});

userSchema.plugin(unique);

module.exports = mongoose.model("User", userSchema);