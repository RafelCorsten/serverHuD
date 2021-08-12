import React from 'react';
import { render } from '@testing-library/react';
import Dashboard from './Dashboard';

jest.mock('../services/apiService');

describe('Dashboard component', () => {
  const dashboard = render(
      <Dashboard />
  );

  test('match previous Dashboard snapshot', () => {
    expect(dashboard).toMatchSnapshot();
  });
})