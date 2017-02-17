'use strict';

const Code = require('code');
const Lab = require('lab');
const expect = Code.expect;
const lab = exports.lab = Lab.script();

//BDD
const describe = lab.describe;
const it = lab.it;
const after = lab.after;

//pull in hapi server
const Server = require('../../server.js');


describe('user:AuthenicateUser', () => {
    it('will authenticate user', (done) => {
        const request = {
            method: 'POST',
            url: '/api/users/authenticate',
            payload: JSON.stringify({
                username: 'Baxter',
                password: 'password'
            })
        };

        Server.inject(request, (response) => {
            expect(response.statusCode).to.equal(201);

            done();
        });
    });
});
