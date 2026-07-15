import { useState, useEffect, useCallback } from 'react';
import useMemberStore from '../store/memberStore';
import { getMyProfile, getDashboard } from '../services/memberService';

export function useMember() {
  const { member, dashboard, setMember, setDashboard } = useMemberStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    console.log('Fetching latest member profile and dashboard data');
    setIsLoading(true);
    setError(null);
    try {
      const [profile, dash] = await Promise.all([getMyProfile(), getDashboard()]);
      const profileData = profile.data?.data ?? profile.data ?? profile;
      const dashData = dash.data?.data ?? dash.data ?? dash;
      setMember(profileData);
      setDashboard(dashData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load member data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, []);

  return { member, dashboard, isLoading, error, refresh };
}
