import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useNgoDonation, useNgoDonations } from '@/store/ngoDonations.store';

export function useNgoDetail(id: string | undefined) {
  const donation = useNgoDonation(id);
  const loadDonation = useNgoDonations((state) => state.loadDonation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useFocusEffect(useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);
    if (!id) { setLoading(false); setError('Donation not found.'); return; }
    void loadDonation(id).catch(() => {
      if (active) setError(useNgoDonations.getState().error ?? 'Could not load donation.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, loadDonation]));
  return { donation, loading, error };
}
