const { Thought, User } = require('../models');

const thoughtController = {
    // GET all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
                .then(dbThought => {
                    res.json(dbThought);
                })
                .catch(err => {
                    res.json(err);
                });
    },

    // GET single thought by ID
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
                .then((dbThoughtData) => {
                    if(!dbThoughtData) {
                        res.status(404).json({ message: 'No thought with this ID was found' });
                        return;
                    }
                    res.json(dbThoughtData);
                })
                .catch(err => {
                    console.log(err);
                    res.sendStatus(400);
                });
    },

    // POST: create a new thought -- push thought to user's thoughts array
    createThought ({ body }, res) {
        Thought.create(body)
                .then((data ) => {
                    return User.findOneAndUpdate(
                        { _id: body.id },
                        { $push: { thoughts: data._id } },
                        { new: true });
                })
                .then(dbThoughtData => {
                    if(!dbThoughtData) {
                        res.status(404).json({ message: 'No Thought with this ID was found.' });
                        return;
                    }
                    res.json(dbThoughtData);
                })
                .catch(err => res.json(err));
    },

    // PUT: update thought by ID
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            {_id: params.id },
            body,
            { new: true, runValidators: true })
            .then(dbThoughtData => {
                if(!dbThoughtData) {
                    res.status(404).json({ message: 'No Thought with this ID was found.'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    // DELETE a thought by ID
    deleteThought({ params }, res) {
        Thought.findOneAndRemove(
            {_id: params.id})
            .then(deletedThought => {
                if(!deletedThought) {
                res.status(404).json({ message: 'No Thought with this ID was found'});
                return;
            }
            return User.findOneAndUpdate(
                { thoughts: params.id},
                {$pull: { thoughts: params.id} },
                { new: true }
            );
        }).then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No Thought with this ID was found.'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
        
    },



    











}
