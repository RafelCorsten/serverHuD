import React from 'react';
import { render } from '@testing-library/react';
import Register from './Register';

jest.mock('../services/apiService');

describe('Register component', () => {
  const register = render(
      <Register />
  );

  test('match previous Register snapshot', () => {
    expect(register).toMatchSnapshot();
  });
})