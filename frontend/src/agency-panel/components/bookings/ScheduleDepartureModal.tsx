import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Users, DollarSign, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { agencyDepartureService, ScheduleDeparturePayload } from '../../services/agencyDeparture.service';
import { agencyPackagesService } from '../../services/agencyPackages.service';

export interface ScheduleDepartureSuccessResult {
  packageId: string;
  departureId?: string;
  autoActivated?: boolean;
}

interface ScheduleDepartureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result?: ScheduleDepartureSuccessResult) => void;
  defaultPackageId?: string;
  autoActivateOnSuccess?: boolean;
}

export const ScheduleDepartureModal: React.FC<ScheduleDepartureModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultPackageId,
  autoActivateOnSuccess = true,
}) => {
  const [packages, setPackages] = useState<
    Array<{ id: string; packageId: string; title: string; price: number; totalSeats: number; status: string }>
  >([]);
  const [selectedPackageId, setSelectedPackageId] = useState(defaultPackageId || '');
  const [departureDate, setDepartureDate] = useState('');
  const [capacity, setCapacity] = useState<number>(20);
  const [bookingOpens, setBookingOpens] = useState('');
  const [bookingCloses, setBookingCloses] = useState('');
  const [priceOverride, setPriceOverride] = useState<string>('');
  const [autoActivate, setAutoActivate] = useState<boolean>(autoActivateOnSuccess);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultPackageId) {
      setSelectedPackageId(defaultPackageId);
    }
  }, [defaultPackageId]);

  useEffect(() => {
    setAutoActivate(autoActivateOnSuccess);
  }, [autoActivateOnSuccess]);

  useEffect(() => {
    if (isOpen) {
      setError(null);

      // Set today as default booking opens
      const todayStr = new Date().toISOString().split('T')[0];
      setBookingOpens(todayStr);

      // Default departure date 14 days out
      const twoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setDepartureDate(twoWeeks);
      setBookingCloses(twoWeeks);

      // Fetch agency packages
      setIsLoadingPackages(true);
      agencyPackagesService
        .getPackages({ limit: 100 })
        .then((res) => {
          const rawItems = res?.items || [];
          const list = rawItems.map((p: any) => ({
            id: p.id || p._id,
            packageId: p.packageId || p.id,
            title: p.packageName || p.title || 'Untitled Package',
            price: p.price || 0,
            totalSeats: p.raw?.totalSeats || p.totalSeats || 20,
            status: p.status || 'Draft',
          }));

          setPackages(list);

          const targetPkgId = defaultPackageId || selectedPackageId;
          if (targetPkgId) {
            const matched = list.find((p) => p.id === targetPkgId || p.packageId === targetPkgId);
            if (matched) {
              setSelectedPackageId(matched.id);
              setCapacity(matched.totalSeats || 20);
              if (matched.status !== 'Active') {
                setAutoActivate(true);
              }
            } else {
              setSelectedPackageId(targetPkgId);
            }
          } else if (list.length > 0) {
            setSelectedPackageId(list[0].id);
            setCapacity(list[0].totalSeats || 20);
            if (list[0].status !== 'Active') {
              setAutoActivate(true);
            }
          }
        })
        .catch((err) => {
          console.error('Failed to fetch agency package templates:', err);
          setError('Failed to load packages. Please check your connection.');
        })
        .finally(() => {
          setIsLoadingPackages(false);
        });
    }
  }, [isOpen, defaultPackageId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackageId) {
      setError('Please select a package template');
      return;
    }
    if (!departureDate) {
      setError('Please select a departure date');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const payload: ScheduleDeparturePayload = {
        packageId: selectedPackageId,
        departureDate,
        capacity: Number(capacity) || 20,
        bookingOpens: bookingOpens || undefined,
        bookingCloses: bookingCloses || departureDate,
        priceOverride: priceOverride ? Number(priceOverride) : undefined,
      };

      const createdDeparture = await agencyDepartureService.scheduleDeparture(payload);

      let autoActivated = false;
      if (autoActivate) {
        try {
          await agencyPackagesService.updatePackageStatus(selectedPackageId, 'Active');
          autoActivated = true;
        } catch (activateErr: any) {
          console.warn('Auto-activation post departure note:', activateErr);
          // If activation failed due to another missing field, we still successfully created departure
        }
      }

      onSuccess({
        packageId: selectedPackageId,
        departureId: createdDeparture?.id,
        autoActivated,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to schedule departure');
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayDateString = new Date().toISOString().split('T')[0];
  const selectedPkg = packages.find((p) => p.id === selectedPackageId || p.packageId === selectedPackageId);
  const isCurrentlyNotActive = selectedPkg ? selectedPkg.status !== 'Active' : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-7 border border-slate-100 flex flex-col space-y-5"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#583BE8]">
              <Sparkles className="w-3.5 h-3.5" />
              Reuse Package Template
            </div>
            <h2 className="text-xl font-black text-[#0F172A] mt-0.5">Schedule New Departure</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 flex items-center justify-between gap-2">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Package Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Package Template</span>
              {isLoadingPackages && (
                <span className="text-[10px] text-purple-600 font-semibold flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading templates...
                </span>
              )}
            </label>
            <div className="relative">
              <select
                value={selectedPackageId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedPackageId(val);
                  const pkg = packages.find((p) => p.id === val || p.packageId === val);
                  if (pkg) {
                    setCapacity(pkg.totalSeats || 20);
                    if (pkg.status !== 'Active') setAutoActivate(true);
                  }
                }}
                disabled={isLoadingPackages}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#583BE8]/20 focus:border-[#583BE8] transition-all disabled:opacity-60 cursor-pointer"
              >
                {isLoadingPackages ? (
                  <option value="">Loading package templates...</option>
                ) : packages.length === 0 ? (
                  <option value="">No package templates available</option>
                ) : (
                  <>
                    {!selectedPackageId && <option value="">Select a package template...</option>}
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.title} (₹{pkg.price.toLocaleString('en-IN')}) {pkg.status !== 'Active' ? `[${pkg.status}]` : ''}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#583BE8] shrink-0" />
              <span>All images, itinerary, hotels &amp; policies copy automatically.</span>
            </p>
          </div>

          {/* Departure Date & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#583BE8]" />
                Departure Date
              </label>
              <input
                type="date"
                required
                min={todayDateString}
                value={departureDate}
                onChange={(e) => {
                  setDepartureDate(e.target.value);
                  setBookingCloses(e.target.value);
                }}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#583BE8]/20 focus:border-[#583BE8] transition-all cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#583BE8]" />
                Capacity (Seats)
              </label>
              <input
                type="number"
                min="1"
                required
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#583BE8]/20 focus:border-[#583BE8] transition-all"
              />
            </div>
          </div>

          {/* Booking Window */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Booking Opens</label>
              <input
                type="date"
                value={bookingOpens}
                onChange={(e) => setBookingOpens(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#583BE8]/20 focus:border-[#583BE8] transition-all cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Booking Closes</label>
              <input
                type="date"
                value={bookingCloses}
                onChange={(e) => setBookingCloses(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#583BE8]/20 focus:border-[#583BE8] transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Optional Price Override */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#583BE8]" />
              Price Override (Optional)
            </label>
            <input
              type="number"
              placeholder="Leave empty to use package default price"
              value={priceOverride}
              onChange={(e) => setPriceOverride(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#583BE8]/20 focus:border-[#583BE8] transition-all"
            />
          </div>

          {/* Auto-Activate Package Option */}
          {isCurrentlyNotActive && (
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200/80 cursor-pointer select-none hover:bg-purple-50 transition-colors">
              <input
                type="checkbox"
                checked={autoActivate}
                onChange={(e) => setAutoActivate(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#583BE8] rounded accent-[#583BE8] cursor-pointer shrink-0"
              />
              <div className="text-left leading-tight">
                <p className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <span>Automatically activate package</span>
                  <span className="text-[9px] font-bold text-[#583BE8] bg-purple-100 px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Auto-Publish
                  </span>
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  Once saved, this package automatically satisfies all requirements and goes live immediately.
                </p>
              </div>
            </label>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingPackages}
              className="px-5 py-2.5 rounded-2xl bg-[#583BE8] text-white text-xs font-black shadow-lg shadow-[#583BE8]/20 hover:bg-[#472ec4] transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSubmitting ? 'Scheduling...' : autoActivate ? 'Save & Activate Package' : 'Save Departure'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ScheduleDepartureModal;
