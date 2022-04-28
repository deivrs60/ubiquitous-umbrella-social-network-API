const { User, Thought } = require('../models');

const userController = {

    // /api/users

    // get all users
    getAllUsers(req, res) {
        User.find({})
            .then(dbUser => {
                res.json(dbUser);
            })
            .catch(err => {
                res.json(err);
            });
    },

    // get a single user by id and populate thought and friend data
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then((dbUserData) => {
                if(!UserData) {
                    res.status(404).json({ message: "No user with this ID was found."});
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });

    },


    // POST new user
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    },

    // PUT: update a user by its id
    updateUser({ params, body}, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true })
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user with this ID was found.'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },


    // DELETE to remove a user by its id
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    },
    

    //////// /api/users/:userId/friends/:friendId ///////

    //POST: add a friend to friend's list
    addFriend({ params }, res) {
        console.log(params);
        User.findOneAndUpdate(
            {_id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true }
        ).then((dbUserData) => {
            if (!dbUserData) {
             res.status(404).json({ message: 'No user with this ID was found' });
             return;
            }
        })
        .catch((err) => res.status(400).json(err));
    },

    // DELETE: remove friend from friend list
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            {_id: params.userId },
            { new: true }
        )
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user with ID was found' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    }
};


module.exports = userController;