import React from 'react';
import { render } from '@testing-library/react';
import HomePage from './HomePage';

jest.mock('../services/apiService');

describe('HomePage component', () => {
  const homePage = render(
      <HomePage />
  );

  test('match previous HomePage snapshot', () => {
    expect(homePage).toMatchSnapshot();
  });
})