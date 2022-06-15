const { Schema, model, Types: { ObjectId } } = require('mongoose');

const URL_PATTERN = /^https?:\/\/(.+)/;

const housingSchema = new Schema({
    name: { type: String, required: true, minlength: [6, 'The Name should be at least 6 characters'] },
    type: { type: String, required: true, enum: ['Apartment', 'Villa', 'House'] },
    year: {
        type: Number, required: true, validate: {
            validator(value) {
                return 1850 <= value && value <= 2021;
            },
            message: 'The Year should be between 1850 and 2021'
        }
    },
    city: { type: String, required: true, minlength: [4, 'The City should be at least 4 characters'] },
    image: {
        type: String, required: true, validate: {
            validator(value) {
                return URL_PATTERN.test(value);
            },
            message: 'The Home Image should starts with http:// or https://'
        }
    },
    description: { type: String, required: true, maxlength: [60, 'The Description should be maximum of 60 characters'] },
    avPieces: {
        type: Number, required: true, validate: {
            validator(value) {
                return 0 <= value && value <= 10
            },
            message: 'The Available Pieces should be positive number'
        }
    },
    rentedHome: { type: [ObjectId], ref: 'User', default: [] },
    owner: { type: ObjectId, ref: 'User' }
});

const Housing = model('Housing', housingSchema);

module.exports = Housing;