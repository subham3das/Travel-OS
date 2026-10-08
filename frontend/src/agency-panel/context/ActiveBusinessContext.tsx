import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { agencyCarRentalService, CarRentalProfileResponse } from '../services/agencyCarRental.service';
import { useAgencyAuth } from '../hooks/useAgencyAuth';

export type ActiveBusinessType = 'agency' | 'car_rental';

interface ActiveBusinessContextType {
  activeBusiness: ActiveBusinessType;
  carRentalStatus: 'NOT_REGISTERED' | 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  isCarRentalApproved: boolean;
  carRentalProfile: any;
  businessTypes: ('agency' | 'car_rental')[];
  isLoading: boolean;
  switchBusiness: (target: ActiveBusinessType) => void;
  refreshBusinessProfile: () => Promise<void>;
}

const ActiveBusinessContext = createContext<ActiveBusinessContextType | undefined>(undefined);

const STORAGE_KEY = 'agency_active_business';

export const ActiveBusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { agency } = useAgencyAuth();

  const [activeBusiness, setActiveBusiness] = useState<ActiveBusinessType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'car_rental') return 'car_rental';
      return 'agency';
    } catch {
      return 'agency';
    }
  });

  const [carRentalStatus, setCarRentalStatus] = useState<
    'NOT_REGISTERED' | 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'
  >('NOT_REGISTERED');
  const [carRentalProfile, setCarRentalProfile] = useState<any>(null);
  const [businessTypes, setBusinessTypes] = useState<('agency' | 'car_rental')[]>(['agency']);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Automatically sync active business based on current route path
  useEffect(() => {
    if (location.pathname.startsWith('/agency/car-rental')) {
      if (activeBusiness !== 'car_rental') {
        setActiveBusiness('car_rental');
        try {
          localStorage.setItem(STORAGE_KEY, 'car_rental');
        } catch (_) {}
      }
    } else if (location.pathname.startsWith('/agency/') && !location.pathname.startsWith('/agency/car-rental')) {
      if (activeBusiness !== 'agency') {
        setActiveBusiness('agency');
        try {
          localStorage.setItem(STORAGE_KEY, 'agency');
        } catch (_) {}
      }
    }
  }, [location.pathname, activeBusiness]);

  const refreshBusinessProfile = useCallback(async () => {
    if (!agency) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const data: CarRentalProfileResponse = await agencyCarRentalService.getProfile();
      setCarRentalStatus(data.carRentalVerificationStatus || 'NOT_REGISTERED');
      setCarRentalProfile(data.carRentalProfile);
      setBusinessTypes(data.businessTypes || ['agency']);
    } catch (err) {
      // Fallback from agency document if profile endpoint fails or offline
      if ((agency as any).carRentalVerificationStatus) {
        setCarRentalStatus((agency as any).carRentalVerificationStatus);
      }
      if ((agency as any).businessTypes) {
        setBusinessTypes((agency as any).businessTypes);
      }
    } finally {
      setIsLoading(false);
    }
  }, [agency]);

  useEffect(() => {
    refreshBusinessProfile();
  }, [refreshBusinessProfile]);

  const switchBusiness = useCallback(
    (target: ActiveBusinessType) => {
      if (target === activeBusiness) return;

      if (target === 'car_rental') {
        if (carRentalStatus === 'NOT_REGISTERED') {
          // Unregistered: Prompt to create/activate Car Rental business
          navigate('/agency/car-rental/activate');
          return;
        }
        if (carRentalStatus === 'PENDING' || carRentalStatus === 'UNDER_REVIEW') {
          navigate('/agency/car-rental/pending');
          return;
        }
        if (carRentalStatus === 'REJECTED') {
          navigate('/agency/car-rental/pending');
          return;
        }

        // Approved: Unlock Car Rental dashboard
        setActiveBusiness('car_rental');
        try {
          localStorage.setItem(STORAGE_KEY, 'car_rental');
        } catch (_) {}
        navigate('/agency/car-rental/dashboard');
      } else {
        // Switch back to Travel Agency
        setActiveBusiness('agency');
        try {
          localStorage.setItem(STORAGE_KEY, 'agency');
        } catch (_) {}
        navigate('/agency/dashboard');
      }
    },
    [activeBusiness, carRentalStatus, navigate]
  );

  return (
    <ActiveBusinessContext.Provider
      value={{
        activeBusiness,
        carRentalStatus,
        isCarRentalApproved: carRentalStatus === 'APPROVED',
        carRentalProfile,
        businessTypes,
        isLoading,
        switchBusiness,
        refreshBusinessProfile,
      }}
    >
      {children}
    </ActiveBusinessContext.Provider>
  );
};

export const useActiveBusiness = (): ActiveBusinessContextType => {
  const context = useContext(ActiveBusinessContext);
  if (!context) {
    throw new Error('useActiveBusiness must be used within an ActiveBusinessProvider');
  }
  return context;
};
