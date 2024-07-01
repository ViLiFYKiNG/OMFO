import { checkSchema } from 'express-validator';

export default checkSchema({
  email: {
    trim: true,
    errorMessage: 'Email is required!',
    notEmpty: true,
    isEmail: {
      errorMessage: 'Email should be in valid format!',
    },
  },
  firstName: {
    trim: true,
    notEmpty: true,
    errorMessage: 'First name is required!',
  },
  lastName: {
    trim: true,
    notEmpty: true,
    errorMessage: 'Last name is required!',
  },
  password: {
    trim: true,
    notEmpty: true,
    errorMessage: 'Password is required!',
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: 'Password length should be at least 8 characters!',
    },
  },
});
