'use strict';

let User = require('../model/User');
let Boom = require('boom');

module.exports = {
    method: 'GET',
    path: '/users',
    config: {
        description: 'Get all users registered on Recipe Nook',
        notes: ['Gets all users on Recipe Nook'],
        handler: (req, res) => {
            User
                .find()
                .select('-password -__v')
                .exec((err, users) => {
                    if (err) {
                        throw Boom.badRequest(err);
                    }

                    if (!users.length) {
                        throw Boom.notFound('No users found!');
                    }

                    res(users);
                });
        },
        tags: ['api'],
        //authenticates route. Only admins can view this
        auth: {
            strategy: 'jwt',
            scope: false
        }
    }
};
