import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings,
  Car,
  Building2,
  Phone,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  Save,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { agencyCarRentalService, CarRentalProfileData } from '../../services/agencyCarRental.service';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { useToast } from '../../../user-panel/context/ToastContext';

export const AgencyCarRentalSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [carRentalStatus, setCarRentalStatus] = useState<string>('APPROVED');

  const [formData, setFormData] = useState<CarRentalProfileData>({
    businessName: '',
    emergencyContact: '',
    workingHours: '24/7 Service',
    description: '',
    fleetSize: 5,
    operatingCities: ['Mumbai', 'Pune', 'Goa'],
    bankDetails: {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      upiId: '',
    },
  });

  const [citiesInput, setCitiesInput] = useState('Mumbai, Pune, Goa');

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await agencyCarRentalService.getProfile();
      setCarRentalStatus(res.carRentalVerificationStatus);

      if (res.carRentalProfile) {
        setFormData({
          businessName: res.carRentalProfile.businessName || res.name || '',
          emergencyContact: res.carRentalProfile.emergencyContact || '',
          workingHours: res.carRentalProfile.workingHours || '24/7 Service',
          description: res.carRentalProfile.description || '',
          fleetSize: res.carRentalProfile.fleetSize || 5,
          operatingCities: res.carRentalProfile.operatingCities || ['Mumbai', 'Pune', 'Goa'],
          bankDetails: {
            accountHolderName: res.carRentalProfile.bankDetails?.accountHolderName || '',
            bankName: res.carRentalProfile.bankDetails?.bankName || '',
            accountNumber: res.carRentalProfile.bankDetails?.accountNumber || '',
            ifscCode: res.carRentalProfile.bankDetails?.ifscCode || '',
            upiId: res.carRentalProfile.bankDetails?.upiId || '',
          },
        });

        if (res.carRentalProfile.operatingCities) {
          setCitiesInput(res.carRentalProfile.operatingCities.join(', '));
        }
      }
    } catch (err: any) {
      console.error('Failed to load car rental profile:', err);
      showToast(err.message || 'Failed to load profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const parsedCities = citiesInput
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const payload: Partial<CarRentalProfileData> = {
        ...formData,
        operatingCities: parsedCities,
      };

      await agencyCarRentalService.updateProfile(payload);
      showToast('Car Rental profile settings updated successfully', 'success');
    } catch (err: any) {
      console.error('Failed to update settings:', err);
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Persistent Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader />

        <main className="p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 space-y-6 max-w-4xl w-full mx-auto">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-purple-100 text-[#583BE8] text-xs font-bold uppercase tracking-wider">
                  Car Rental Division
                </span>
                <span className="text-xs text-slate-400 font-medium">• Business Settings</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Car Rental Settings
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Configure your fleet dispatch parameters, operating hubs, and payout destination.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1.5 ${
                carRentalStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                <ShieldCheck className="w-4 h-4" />
                <span>{carRentalStatus === 'APPROVED' ? 'Approved Partner' : carRentalStatus}</span>
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs animate-pulse space-y-4">
              <div className="w-1/3 h-6 bg-slate-200 rounded-lg" />
              <div className="w-full h-10 bg-slate-100 rounded-xl" />
              <div className="w-2/3 h-10 bg-slate-100 rounded-xl" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Card 1: Operating Profile */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#583BE8] flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Rental Brand & Identity</h3>
                    <p className="text-xs text-slate-400">Displayed to travelers across car search and booking cards</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Business / Fleet Brand Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.businessName || ''}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-3 outline-none focus:border-[#583BE8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Active Fleet Size (Approx.)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formData.fleetSize || 1}
                      onChange={(e) => setFormData({ ...formData, fleetSize: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-3 outline-none focus:border-[#583BE8]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Operating Cities (comma-separated)
                    </label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:border-[#583BE8]">
                      <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        value={citiesInput}
                        onChange={(e) => setCitiesInput(e.target.value)}
                        placeholder="e.g. Mumbai, Pune, Goa, Delhi, Bangalore"
                        className="w-full bg-transparent text-xs font-medium p-3 outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Travelers searching in these cities will find your vehicles.
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Rental Service Bio & Policies
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your maintenance standards, driver etiquette, and vehicle sanitization protocols..."
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-3 outline-none focus:border-[#583BE8]"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: 24/7 Operations & Emergency */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Roadside Assistance & Support</h3>
                    <p className="text-xs text-slate-400">Available to customers during active rental trips</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      24/7 Emergency Helpline Number
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact || ''}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      placeholder="+91 98765 00000"
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-3 outline-none focus:border-[#583BE8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Working Hours / Shift
                    </label>
                    <input
                      type="text"
                      value={formData.workingHours || ''}
                      onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                      placeholder="e.g. 24 Hours / 7 Days a week"
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-3 outline-none focus:border-[#583BE8]"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Payout Bank Account */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Settlement Bank Account</h3>
                    <p className="text-xs text-slate-400">Direct deposit destination for online car rental advance payments</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Account Beneficiary Name
                    </label>
                    <input
                      type="text"
                      value={formData.bankDetails?.accountHolderName || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, accountHolderName: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-3 outline-none focus:border-[#583BE8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Bank Name</label>
                    <input
                      type="text"
                      value={formData.bankDetails?.bankName || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, bankName: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-3 outline-none focus:border-[#583BE8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      value={formData.bankDetails?.accountNumber || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, accountNumber: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-3 outline-none focus:border-[#583BE8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">IFSC Code</label>
                    <input
                      type="text"
                      value={formData.bankDetails?.ifscCode || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, ifscCode: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-3 outline-none focus:border-[#583BE8]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Save Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/agency/car-rental/dashboard')}
                  className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-[#583BE8] hover:bg-[#472ecc] text-white font-black text-xs rounded-xl shadow-lg shadow-[#583BE8]/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default AgencyCarRentalSettingsPage;
