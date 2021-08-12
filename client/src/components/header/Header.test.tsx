import React from 'react';
import { render } from '@testing-library/react';
import Header from './Header';

jest.mock('../services/apiService');

describe('Header component', () => {
  const header = render(
      <Header />
  );

  test('match previous Header snapshot', () => {
    expect(header).toMatchSnapshot();
  });
})