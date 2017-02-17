'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const User = require('../model/User');
const createUserSchema = require('../schemas/createUser');
const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser;
const createToken = require('../util/token');
const Joi = require('joi');
const Promise = require('bluebird');

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        //generate a SALT level 10 strength
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }

                resolve(hash);
            });
        });
    });
}

module.exports = [{
    method: 'POST',
    path: '/users',
    config: {
        description: 'Create a user for Recipe Nook.',
        notes: ['This endpoint will create a user on Recipe Nook. Before the handler is hit to create a user, it will verify if the user exists. If they do, it will respond back with an error.'],
        pre: [{
            method: verifyUniqueUser
        }],
        handler: (req, res) => {
            let user = new User();
            user.username = req.payload.username;
            user.admin = false;

            hashPassword(req.payload.password).then(hash => {
                user.password = hash;
                user.save((err, user) => {
                    if (err) {
                        throw Boom.badRequest(err);
                    }

                    //if user is saved successfully, issue a JWT
                    res({
                        id_token: createToken(user)
                    }).code(201);
                });
            }).catch(err => {
                throw Boom.badRequest(err);
            });
        },
        auth: false,
        tags: ['api'],
        validate: {
            payload: createUserSchema
        }
    }
}, {
    method: 'PUT',
    path: '/users/{id}',
    config: {
        description: 'Update a current user on the Recipe Nook website',
        handler: (req, res) => {
            User
                .findById(req.params.id, (err, user) => {
                    return user.save((err) => {
                        if (err) {
                            console.log(err);
                        }

                        res().code(200);
                    });
                });
        },
        tags: ['api']
    }
}, {
    method: 'DELETE',
    path: '/users/{id}',
    config: {
        description: 'Delete a user on the Recipe Nook website',
        handler: (req, res) => {
            User
                .find({
                    _id: req.params.id
                })
                .remove(() => {
                    console.log('removed user');
                    res().code(204);
                });
        },
        tags: ['api'],
        validate: {
            params: {
                id: Joi.string()
                    .required()
                    .description('id of the user being removed')
            }
        }
    }
}];
