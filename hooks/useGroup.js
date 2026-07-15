import { useState, useEffect, useCallback } from 'react';
import useGroupStore from '../store/groupStore';
import { getMyGroup, getGroupMembers } from '../services/groupService';

export function useGroup() {
  const { group, members, setGroup, setMembers } = useGroupStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    console.log('Fetching group and member data');
    setIsLoading(true);
    setError(null);
    try {
      const [g, m] = await Promise.all([getMyGroup(), getGroupMembers()]);
      setGroup(g.data || g);
      setMembers(m.data || m);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load group');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, []);

  return { group, members, isLoading, error, refresh };
}
