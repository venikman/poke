import { render } from '@rstest/browser-react';
import Page from './home';

test('renders RS Stack hello world headline', async () => {
  await render(<Page />);
  const pageText = document.body.textContent ?? '';
  expect(pageText).toContain('Hello World');
  expect(pageText).toContain('RS Stack');
});

test('does not render AI chat controls', async () => {
  await render(<Page />);

  const textarea = document.querySelector('textarea');
  const sendButton = Array.from(document.querySelectorAll('button')).find((button) =>
    button.textContent?.includes('Send Message'),
  );

  expect(textarea).toBeNull();
  expect(sendButton).toBeUndefined();
});
