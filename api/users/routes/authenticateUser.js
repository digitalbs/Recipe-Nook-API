'use strict';

const Boom = require('boom');
const User = require('../model/User');
const authenticateUserSchema = require('../schemas/authenticateUser');
const verifyUserCredentials = require('../util/userFunctions').verifyUserCredentials;
const createToken = require('../util/token');

module.exports = {
    method: 'POST',
    path: '/users/authenticate',
    config: {
        description: 'Authenticates User for Recipe Nook',
        //before route handler runs, verify user is unique
        pre: [{
            method: verifyUserCredentials,
            assign: 'user'
        }],
        handler: (req, res) => {
            res({
                id_token: createToken(req.pre.user)
            }).code(201);
        },
        tags: ['api'],
        auth: false,
        validate: {
            payload: authenticateUserSchema
        }
    }
};
