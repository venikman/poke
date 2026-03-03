import { useEffect, useState } from 'react';

const FALLBACK_MESSAGE = 'Hello World from RS Stack';

type ApiHelloPayload = {
  message?: string;
};

export default function HomePage() {
  const [apiMessage, setApiMessage] = useState('Loading...');
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');

  useEffect(() => {
    let active = true;

    const loadMessage = async () => {
      try {
        const response = await fetch('/api/v1/hello');
        if (!response.ok) {
          throw new Error(`Unexpected status: ${response.status}`);
        }

        const payload = (await response.json()) as ApiHelloPayload;
        if (!payload.message) {
          throw new Error('Missing "message" in API response');
        }

        if (active) {
          setApiMessage(payload.message);
          setStatus('ready');
        }
      } catch {
        if (active) {
          setApiMessage(FALLBACK_MESSAGE);
          setStatus('fallback');
        }
      }
    };

    void loadMessage();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Hello World</h1>
      <p>RS Stack starter: React Router + Rsbuild + Hono + Rstest.</p>

      <section>
        <h2>API Message</h2>
        <p data-testid="api-message">{apiMessage}</p>
        <p>Status: {status}</p>
      </section>
    </main>
  );
}
