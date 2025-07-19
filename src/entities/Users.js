// src/entities/Users.js
import { EntitySchema } from 'typeorm';

const Users = new EntitySchema({
  name: 'users',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
      length: 100,
    },
    age: {
      type: Number,
    },
    email: {
      type: String,
      length: 100,
    },
    address: {
      type: String,
      length: 255,
    },
    occupation: {
      type: String,
      length: 100,
    },
  },
});

export default Users;
