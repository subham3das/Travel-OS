import { useState, useEffect, useCallback } from 'react';
import { agencyProfileService } from '../services/agencyProfile.service';
import { CompleteAgencyProfile, AgencySettingsData, INITIAL_AGENCY_PROFILE } from '../data/profile';

export function useAgencyProfile() {
  const [profile, setProfile] = useState<CompleteAgencyProfile>(INITIAL_AGENCY_PROFILE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);

    try {
      const data = await agencyProfileService.getProfile();
      setProfile(data);
    } catch (err: any) {
      console.error('Failed to load agency profile:', err);
      setIsError(true);
      setErrorMessage(err.message || 'Unable to retrieve agency profile data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: any): Promise<CompleteAgencyProfile> => {
    try {
      const updated = await agencyProfileService.updateProfile(updates);
      setProfile(updated);
      return updated;
    } catch (err: any) {
      console.error('Failed to update agency profile:', err);
      throw err;
    }
  };

  const updateSettings = async (settings: Partial<AgencySettingsData>): Promise<AgencySettingsData> => {
    try {
      const updatedSettings = await agencyProfileService.updateSettings(settings);
      setProfile((prev) => ({
        ...prev,
        settings: updatedSettings,
      }));
      return updatedSettings;
    } catch (err: any) {
      console.error('Failed to update agency settings:', err);
      throw err;
    }
  };

  return {
    profile,
    isLoading,
    isError,
    errorMessage,
    refetch: fetchProfile,
    updateProfile,
    updateSettings,
    setProfile,
  };
}
