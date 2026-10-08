import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { PackagesHeader } from '../../components/packages/PackagesHeader';
import { PackageStats } from '../../components/packages/PackageStats';
import { PackageSearch } from '../../components/packages/PackageSearch';
import { PackageFilters, PackageFilterType } from '../../components/packages/PackageFilters';
import { PackageCard } from '../../components/packages/PackageCard';
import { EmptyPackagesState } from '../../components/packages/EmptyPackagesState';
import { CreatePackageCTA } from '../../components/packages/CreatePackageCTA';
import { PackageStatusConfirmModal, PackageConfirmActionType } from '../../components/packages/PackageStatusConfirmModal';
import { ScheduleDepartureModal } from '../../components/bookings/ScheduleDepartureModal';
import { agencyPackagesService, AgencyPackage, AgencyPackageStats } from '../../services/agencyPackages.service';
import { agencySocketService } from '../../services/agencySocket.service';
import { Loader2, CheckCircle2 } from 'lucide-react';

/**
 * Agency Package Management Page
 * Route: /agency/packages (Protected: APPROVED agencies only)
 */
export const AgencyPackagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramFilter = searchParams.get('status') || searchParams.get('filter');

  const [packagesList, setPackagesList] = useState<AgencyPackage[]>([]);
  const [stats, setStats] = useState<AgencyPackageStats>({ total: 0, published: 0, draft: 0, archived: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<PackageFilterType>(
    paramFilter === 'Needs Setup' || paramFilter === 'attention'
      ? 'Needs Setup'
      : paramFilter === 'Ready to Sell'
      ? 'Ready to Sell'
      : 'All'
  );
  const [isLoading, setIsLoading] = useState(true);

  // Status Action Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    actionType: PackageConfirmActionType | null;
    pkg: AgencyPackage | null;
    isLoading: boolean;
    errorMessage: string | null;
  }>({
    isOpen: false,
    actionType: null,
    pkg: null,
    isLoading: false,
    errorMessage: null,
  });

  // Schedule Departure Modal State
  const [scheduleModal, setScheduleModal] = useState<{
    isOpen: boolean;
    packageId?: string;
    autoActivateOnSuccess?: boolean;
  }>({
    isOpen: false,
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const fetchPackages = useCallback(async () => {
    try {
      setIsLoading(true);
      const [pkgsRes, statsRes] = await Promise.all([
        agencyPackagesService.getPackages({
          search: searchTerm || undefined,
          status: activeFilter !== 'All' ? activeFilter : undefined,
        }),
        agencyPackagesService.getPackageStats(),
      ]);

      setPackagesList(pkgsRes.items || []);
      setStats(statsRes);
    } catch (err) {
      console.error('Failed to load agency packages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, activeFilter]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Real-time synchronization via WebSockets across all open agency tabs
  useEffect(() => {
    const unsubscribe = agencySocketService.onPackageStatusUpdated((data) => {
      setPackagesList((prev) =>
        prev.map((p) =>
          p.id === data.id || p.packageId === data.packageId
            ? { ...p, status: data.status }
            : p
        )
      );
      // Silently refresh stats
      agencyPackagesService.getPackageStats().then(setStats).catch(() => {});
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Action handlers
  const handleCreatePackage = () => {
    navigate('/agency/packages/create');
  };

  const handleViewPackage = (packageId: string) => {
    navigate(`/agency/packages/${packageId}`);
  };

  const handleEditPackage = (packageId: string) => {
    navigate(`/agency/packages/${packageId}/edit`);
  };

  // 1. Activate Package Handler (Opens confirmation modal)
  const handleActivatePackage = (packageId: string) => {
    const pkg = packagesList.find((p) => p.id === packageId || p.packageId === packageId);
    if (!pkg) return;
    setConfirmModal({
      isOpen: true,
      actionType: 'activate',
      pkg,
      isLoading: false,
      errorMessage: null,
    });
  };

  // 2. Deactivate Package Handler (Opens confirmation modal)
  const handleDeactivatePackage = (packageId: string) => {
    const pkg = packagesList.find((p) => p.id === packageId || p.packageId === packageId);
    if (!pkg) return;
    setConfirmModal({
      isOpen: true,
      actionType: 'deactivate',
      pkg,
      isLoading: false,
      errorMessage: null,
    });
  };

  // 3. Reschedule Departure Handler (Opens schedule departure modal or navigates to departures)
  const handleRescheduleDeparture = (packageId: string, autoActivate = false) => {
    setScheduleModal({
      isOpen: true,
      packageId,
      autoActivateOnSuccess: autoActivate,
    });
  };

  // 4. Archive Package Handler
  const handleArchivePackage = (packageId: string) => {
    const pkg = packagesList.find((p) => p.id === packageId || p.packageId === packageId);
    if (!pkg) return;
    setConfirmModal({
      isOpen: true,
      actionType: 'archive',
      pkg,
      isLoading: false,
      errorMessage: null,
    });
  };

  // 5. Hide Package Handler (Toggles visibility immediately)
  const handleHidePackage = async (packageId: string) => {
    const current = packagesList.find((p) => p.id === packageId || p.packageId === packageId);
    if (!current) return;
    const nextStatus = current.status === 'Hidden' ? 'Active' : 'Hidden';
    try {
      const updated = await agencyPackagesService.updatePackageStatus(packageId, nextStatus);
      setPackagesList((prev) =>
        prev.map((p) => (p.id === packageId || p.packageId === packageId ? updated : p))
      );
      fetchPackages();
    } catch (err: any) {
      console.error('Error toggling package visibility:', err);
    }
  };

  // 6. Delete Package Handler
  const handleDeletePackage = (packageId: string) => {
    const pkg = packagesList.find((p) => p.id === packageId || p.packageId === packageId);
    if (!pkg) return;
    setConfirmModal({
      isOpen: true,
      actionType: 'delete',
      pkg,
      isLoading: false,
      errorMessage: null,
    });
  };

  // Confirm Modal Execution Logic
  const handleConfirmAction = async () => {
    const { actionType, pkg } = confirmModal;
    if (!actionType || !pkg) return;

    setConfirmModal((prev) => ({ ...prev, isLoading: true, errorMessage: null }));

    try {
      if (actionType === 'activate') {
        const updated = await agencyPackagesService.updatePackageStatus(pkg.id, 'Active');
        setPackagesList((prev) =>
          prev.map((p) => (p.id === pkg.id || p.packageId === pkg.id ? updated : p))
        );
        fetchPackages();
        setConfirmModal({ isOpen: false, actionType: null, pkg: null, isLoading: false, errorMessage: null });
      } else if (actionType === 'deactivate') {
        const updated = await agencyPackagesService.updatePackageStatus(pkg.id, 'Inactive');
        setPackagesList((prev) =>
          prev.map((p) => (p.id === pkg.id || p.packageId === pkg.id ? updated : p))
        );
        fetchPackages();
        setConfirmModal({ isOpen: false, actionType: null, pkg: null, isLoading: false, errorMessage: null });
      } else if (actionType === 'archive') {
        const updated = await agencyPackagesService.updatePackageStatus(pkg.id, 'Archived');
        setPackagesList((prev) =>
          prev.map((p) => (p.id === pkg.id || p.packageId === pkg.id ? updated : p))
        );
        fetchPackages();
        setConfirmModal({ isOpen: false, actionType: null, pkg: null, isLoading: false, errorMessage: null });
      } else if (actionType === 'delete') {
        await agencyPackagesService.deletePackage(pkg.id);
        setPackagesList((prev) =>
          prev.filter((p) => p.id !== pkg.id && p.packageId !== pkg.id)
        );
        fetchPackages();
        setConfirmModal({ isOpen: false, actionType: null, pkg: null, isLoading: false, errorMessage: null });
      }
    } catch (err: any) {
      console.error(`Failed to execute ${actionType} on package:`, err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        `Action ${actionType} could not be completed. Please try again.`;
      // Keep modal open to display validation failure message
      setConfirmModal((prev) => ({
        ...prev,
        isLoading: false,
        errorMessage: msg,
      }));
    }
  };

  const deduplicatedPackages = useMemo(() => {
    const seen = new Set<string>();
    return packagesList.filter((pkg) => {
      const key = pkg.id || pkg.packageId;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [packagesList]);

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-12">
        {/* Top Header */}
        <DashboardHeader />

        {/* Sticky Packages Actions Header */}
        <PackagesHeader onCreatePackage={handleCreatePackage} />

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Summary Stats Grid */}
          <PackageStats
            total={stats.total}
            published={stats.published}
            draft={stats.draft}
            archived={stats.archived}
            readyToSell={stats.readyToSell}
            needsSetup={stats.needsSetup}
            onSelectFilter={(filter) => setActiveFilter(filter as any)}
          />

          {/* Search & Filter Controls */}
          <div className="space-y-3">
            <PackageSearch
              value={searchTerm}
              onChange={setSearchTerm}
            />

            <PackageFilters
              activeFilter={activeFilter}
              onChange={setActiveFilter}
            />
          </div>

          {/* Packages List Grid or Empty State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#583BE8]" />
              <p className="text-xs font-bold text-slate-500">Loading tour packages...</p>
            </div>
          ) : deduplicatedPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {deduplicatedPackages.map((pkg, idx) => (
                <PackageCard
                  key={pkg.id || pkg.packageId}
                  pkg={pkg}
                  index={idx}
                  onView={handleViewPackage}
                  onEdit={handleEditPackage}
                  onActivate={handleActivatePackage}
                  onDeactivate={handleDeactivatePackage}
                  onReschedule={handleRescheduleDeparture}
                  onArchive={handleArchivePackage}
                  onHide={handleHidePackage}
                  onDelete={handleDeletePackage}
                />
              ))}
            </div>
          ) : (
            <EmptyPackagesState
              onCreatePackage={handleCreatePackage}
            />
          )}

          {/* Quick Create CTA Bar (Mobile only) */}
          <CreatePackageCTA onCreatePackage={handleCreatePackage} />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />

      {/* Package Status Action Confirmation Dialog */}
      <PackageStatusConfirmModal
        isOpen={confirmModal.isOpen}
        actionType={confirmModal.actionType}
        pkg={confirmModal.pkg}
        isLoading={confirmModal.isLoading}
        errorMessage={confirmModal.errorMessage}
        onConfirm={handleConfirmAction}
        onClose={() =>
          setConfirmModal({ isOpen: false, actionType: null, pkg: null, isLoading: false, errorMessage: null })
        }
        onScheduleDeparture={(pkgId, autoActivate) => handleRescheduleDeparture(pkgId, autoActivate ?? true)}
        onEditPackage={(pkgId) => handleEditPackage(pkgId)}
      />

      {/* Schedule / Reschedule Departure Modal with Auto-Activation */}
      <ScheduleDepartureModal
        isOpen={scheduleModal.isOpen}
        defaultPackageId={scheduleModal.packageId}
        autoActivateOnSuccess={scheduleModal.autoActivateOnSuccess}
        onClose={() => setScheduleModal({ isOpen: false, packageId: undefined, autoActivateOnSuccess: false })}
        onSuccess={(res) => {
          setScheduleModal({ isOpen: false, packageId: undefined, autoActivateOnSuccess: false });
          fetchPackages();
          if (res?.autoActivated) {
            showToast('Departure scheduled and package automatically activated!');
          } else {
            showToast('Departure scheduled successfully!');
          }
        }}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-slate-900/95 backdrop-blur-sm text-white text-xs font-bold rounded-2xl shadow-xl border border-slate-700/50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};

export default AgencyPackagesPage;
