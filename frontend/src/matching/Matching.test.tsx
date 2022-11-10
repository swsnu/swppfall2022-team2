import { render, screen } from '@testing-library/react';
import Matching from './Matching';

describe('Matching', () => {
  it('render', () => {
    render(<Matching />);
    screen.getByText('Start');
  });
});
