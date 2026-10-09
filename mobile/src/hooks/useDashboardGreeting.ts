import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/services/auth';

export default function useDashboardGreeting() {
  const [name, setName] = useState('');

  useEffect(() => {
    let active = true;
    void getCurrentUser().then((user) => {
      if (active) setName(user.name.trim().split(/\s+/)[0]);
    }).catch(() => {
      // Keep the welcome note visible if the profile cannot be loaded.
    });
    return () => { active = false; };
  }, []);

  return name ? `Hi ${name}!` : 'Welcome back!';
}
