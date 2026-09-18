import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { agencyPackagesService, AgencyPackage, AgencyPackageStats } from '../../services/agencyPackages.service';
import { Loader2 } from 'lucide-react';

/**
 * Agency Package Management Page
 * Route: /agency/packages (Protected: APPROVED agencies only)
 */
export const AgencyPackagesPage: React.FC = () => {
  const navigate = useNavigate();

  const [packagesList, setPackagesList] = useState<AgencyPackage[]>([]);
  const [stats, setStats] = useState<AgencyPackageStats>({ total: 0, published: 0, draft: 0, archived: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<PackageFilterType>('All');
  const [isLoading, setIsLoading] = useState(true);

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

  const handleDuplicatePackage = async (id: string) => {
    try {
      const cloned = await agencyPackagesService.duplicatePackage(id);
      setPackagesList((prev) => [cloned, ...prev]);
      setStats((prev) => ({ ...prev, draft: prev.draft + 1, total: prev.total + 1 }));
    } catch (err) {
      console.error('Error duplicating package:', err);
    }
  };

  const handleArchivePackage = async (id: string) => {
    try {
      const updated = await agencyPackagesService.updatePackageStatus(id, 'Archived');
      setPackagesList((prev) => prev.map((p) => (p.id === id || p.packageId === id ? updated : p)));
      fetchPackages();
    } catch (err) {
      console.error('Error archiving package:', err);
    }
  };

  const handleHidePackage = async (id: string) => {
    try {
      const current = packagesList.find((p) => p.id === id || p.packageId === id);
      const nextStatus = current?.status === 'Hidden' ? 'Active' : 'Hidden';
      const updated = await agencyPackagesService.updatePackageStatus(id, nextStatus);
      setPackagesList((prev) => prev.map((p) => (p.id === id || p.packageId === id ? updated : p)));
      fetchPackages();
    } catch (err) {
      console.error('Error toggling package visibility:', err);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveFilter('All');
  };

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
          ) : packagesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {packagesList.map((pkg, idx) => (
                <PackageCard
                  key={pkg.id || pkg.packageId}
                  pkg={pkg}
                  index={idx}
                  onView={handleViewPackage}
                  onEdit={handleEditPackage}
                  onDuplicate={handleDuplicatePackage}
                  onArchive={handleArchivePackage}
                  onHide={handleHidePackage}
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
    </div>
  );
};

export default AgencyPackagesPage;
