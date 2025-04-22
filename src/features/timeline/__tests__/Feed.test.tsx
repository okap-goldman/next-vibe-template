import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Feed } from '../components/Feed';

describe('<Feed>', () => {
  it('renders loading state initially', () => {
    render(<Feed />);
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('renders post list after loading', async () => {
    render(<Feed />);
    // Wait for the posts to load (handled by MSW)
    const articles = await screen.findAllByRole('article');
    expect(articles).toHaveLength(3);

    // Verify post content
    expect(screen.getAllByText('First Post')).not.toHaveLength(0);
    expect(screen.getAllByText('Second Post')).not.toHaveLength(0);
    expect(screen.getAllByText('Third Post')).not.toHaveLength(0);
  });
});
