import { type ComponentType, useEffect, useState } from 'react';

type DashboardComponent = ComponentType;

export default function HomePage() {
  const [Dashboard, setDashboard] = useState<DashboardComponent | null>(null);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      const module = await import('../components/UserDashboardContent');
      if (active) {
        setDashboard(() => module.default as DashboardComponent);
      }
    };

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (!Dashboard) {
    return (
      <main>
        <h1>User Dashboard</h1>
        <p>Hardcoded users dataset with client-side sorting and pagination.</p>
      </main>
    );
  }

  return <Dashboard />;
}
