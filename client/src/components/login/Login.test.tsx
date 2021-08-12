import React from 'react';
import { render } from '@testing-library/react';
import Login from './Login';

jest.mock('../services/apiService');

describe('Login component', () => {
  const login = render(
      <Login />
  );

  test('match previous Login snapshot', () => {
    expect(login).toMatchSnapshot();
  });
})