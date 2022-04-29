const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, 'Please enter your username'],
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Please enter your email'],
            match: [/.+\@.+\..+/, 'is not valid']
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [ this ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        // prevent duplicate of _id as 'id'
        id: false
    }
);

// get total count of friends on retrieval 
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('User', UserSchema);

//export user module
module.exports = User;

