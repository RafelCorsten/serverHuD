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


  describe('REGISTER', () => {

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


  describe('POST', () => {
    test('Post should return 201', async () => {

      await api
        .post('/servers')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          "url": "http://neverssl.com",
          "optionalUrl": "",
          "name": "never"
        })
        .expect(201);
    });

  });


  afterAll(() => {
    server.close();
  });
});
