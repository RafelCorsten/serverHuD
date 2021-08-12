import request, { Test } from 'supertest';
const supertest = require('supertest');
const { app, server } = require('../index');
import { User } from '../Models/user.model';
import bcrypt from "bcrypt";
import { initialUser } from './helpers';
import jwt from "jsonwebtoken";

const api = supertest(server)

let accessToken: string;

describe('Users', () => {

  beforeAll(async () => {
    await User.destroy({
      truncate: true
    });

    initialUser.password = await bcrypt.hash(initialUser.password, 10);
    await User.create(initialUser);
  });


  describe('/register', () => {

    test('Post should return 409, when creating a repeated user', async () => {

      await api
        .post('/register')
        .send({
          "email": "test@gmail.com",
          "password": "password23432"
        })
        .expect(409);

      expect((await User.findAndCountAll()).count).toBe(1);
    });

    test('Post should return 201, when creating new user', async () => {

      await api
        .post('/register')
        .send({
          "email": "mr.jdchase@gmail.com",
          "password": "password"
        })
        .expect(201);
    });


    test('Post should return 400, when creating user without password', async () => {

      await api
        .post('/register')
        .send({
          "email": "test@gmail.com",
          "password": ""
        })
        .expect(400);
    });

    test('Post should return 400, when creating user without email', async () => {

      await api
        .post('/register')
        .send({
          "email": "",
          "password": "password23432"
        })
        .expect(400);
    });

    afterAll(() => {
      server.close();
    });
  });

  describe('/login', () => {

    test('Post should return 403, when loging in with unexisting email', async () => {

      await api
        .post('/login')
        .send({
          "email": "tes@gmail.com",
          "password": "password243"
        })
        .expect(403);
    });

    test('Post should return 401, when loging in with wrong email', async () => {

      await api
        .post('/login')
        .send({
          "email": "",
          "password": "password243"
        })
        .expect(401);
    });

    test('Post should return 401, when loging in with wrong password', async () => {

      await api
        .post('/login')
        .send({
          "email": "test@gmail.com",
          "password": ""
        })
        .expect(401);
    });

    test('Post should return 200, when loging in correctly', async () => {

      await api
        .post('/login')
        .send({
          "email": "test@gmail.com",
          "password": "password"
        })
        .expect(200);
    });

    afterAll(() => {
      server.close();
    });
  });
});


describe('Servers', () => {

  beforeAll(async () => {
    const user = await User.findOne({ where: { email: initialUser.email } });

    accessToken = jwt.sign(
      { _id: user?.id },
      process.env.SECRET_KEY || "insecureuY47Qf2xo3M9kKjF67hq",
      { expiresIn: "7d" }
    );
  });

  describe('/servers', () => {

    describe('GET', () => {

      test('Get should return 404, when there are no servers on the user', async () => {
        await api
          .get('/servers')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      test('Get should return 401, when there is a wrong no token', async () => {
        await api
          .get('/servers')
          .set('Authorization', `Bearer justatoken`)
          .expect(401);
      });

      test('Get should return 200, when adding a server to a user and then retrieving the same server', async () => {

        await api
          .post('/servers')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            "url": "http://neverssl.com",
            "optionalUrl": "localhost:8080",
            "name": "never"
          })
          .expect(201);

        let user : any = await User.findOne({ where: { email: initialUser.email } });
        expect(user.servers.length).toBe(1);

        await api
          .get('/servers')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);
      });
    });

    describe('POST', () => {
      test('Post should return 201, adding a server to a user', async () => {

        let postUser: any = await User.findOne({ where: { email: initialUser.email } });
        expect(postUser.servers.length).toBe(1);

        await api
          .post('/servers')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            "url": "http://neverssl.com",
            "optionalUrl": "localhost:8080",
            "name": "never"
          })
          .expect(201);

        postUser = await User.findOne({ where: { email: initialUser.email } });
        expect(postUser.servers.length).toBe(2);
      });

      test('Post should return 401, adding a server with no authorization token', async () => {
        await api
          .post('/servers')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer xd`)
          .send({
            "url": "http://neverssl.com",
            "optionalUrl": "localhost:8080",
            "name": "never"
          })
          .expect(401);
      });
    });


    afterAll(() => {
      server.close();
    });
  });

  describe('/servers/:id', () => {

    describe('GET', () => {

      test('Get should return 404, when there are no servers on the user', async () => {
        await api
          .get('/servers/2csKa')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      test('Get should return 401, when there is a wrong no token', async () => {
        await api
          .get('/servers/2csKaP')
          .set('Authorization', `Bearer justatoken`)
          .expect(401);
      });

      test('Get should return 200, when adding a server to a user and then retrieving the same server by id', async () => {

        let getUser: any = await User.findOne({ where: { email: initialUser.email } });
        expect(getUser.servers.length).toBe(2);

        await api
          .post('/servers')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            "url": "http://neverssl.com",
            "optionalUrl": "localhost:8080",
            "name": "never"
          })
          .expect(201);

        getUser = await User.findOne({ where: { email: initialUser.email } });
        expect(getUser.servers.length).toBe(3);

        await api
          .get('/servers/2csKaP')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);
      });

    });


    afterAll(() => {
      server.close();
    });
  });

  describe('/servers/delete/:id', () => {

    describe('PUT', () => {

      test('Put should return 204, when there are no servers on the user', async () => {
        await api
          .put('/servers/delete/2csKa')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(204);
      });

      test('Put should return 204, when put a server that doesnt exist', async () => {
        await api
          .put('/servers/delete/2csK')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(204);
      });

      test('Get should return 401, when there is a wrong no token', async () => {
        await api
          .put('/servers/delete/2csKaP')
          .set('Authorization', `Bearer justatoken`)
          .expect(401);
      });

      test('Put should return 204, when deleting a server', async () => {

        let user: any = await User.findOne({ where: { email: initialUser.email } });
        expect(user.servers.length).toBe(3);

        await api
          .post('/servers')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            "url": "http://neverssl.com",
            "optionalUrl": "localhost:8080",
            "name": "never"
          })
          .expect(201);


        user = await User.findOne({ where: { email: initialUser.email } });
        expect(user.servers.length).toBe(4);

        await api
          .put('/servers/delete/2csKaP')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(204);

        user = await User.findOne({ where: { email: initialUser.email } });
        expect(user.servers.length).toBe(0);
      });

    });


    afterAll(() => {
      server.close();
    });
  });
});
