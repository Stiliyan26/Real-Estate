const { Schema, model, Types: { ObjectId } } = require('mongoose');

//TODO change user model according to exam description
//TODO add validation
const NAME_PATTERN = /^[A-Z][a-z]+ [A-Z][a-z]+$/;

const userSchema = new Schema({
    name: {type: String, required: true, validate: {
        validator(value){
            return NAME_PATTERN.test(value);
        },
        message: 'The name should be in the following format -> (firstname lastname)'
    }},
    username: { type: String, required: true, minlength: [5, 'Username should be at least 5 characters long'] },
    hashedPassword: { type: String, required: true, minlength: [4, 'Password should be at least 4 characters long'] },
});

//TODO change index parameter to email if it is written on the exam description
userSchema.index({ username: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);

module.exports = User;