import React from 'react';
import { render, screen } from '@testing-library/react';
import WorkProgressBar from "./components/WorkProgressBar";

test('renders 0% when worklog array is empty', () => {
  render(<WorkProgressBar worklogs={[]}/>);
  const linkElement = screen.getByText(/0%/i);
  expect(linkElement).toBeInTheDocument();
});
