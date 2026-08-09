import React, { useState, useMemo } from 'react';
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
import { MOCK_AGENCY_PACKAGES, AgencyPackage } from '../../data/packages';

/**
 * Agency Package Management Page
 * Route: /agency/packages (Protected: APPROVED agencies only)
 */
export const AgencyPackagesPage: React.FC = () => {
  const navigate = useNavigate();

  const [packagesList, setPackagesList] = useState<AgencyPackage[]>(MOCK_AGENCY_PACKAGES);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<PackageFilterType>('All');

  // Computed summary statistics
  const stats = useMemo(() => {
    const total = packagesList.length;
    const published = packagesList.filter((p) => p.status === 'Active').length;
    const draft = packagesList.filter((p) => p.status === 'Draft').length;
    const archived = packagesList.filter((p) => p.status === 'Hidden' || p.status === 'Archived').length;
    return { total, published, draft, archived };
  }, [packagesList]);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packagesList.filter((p) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.packageName.toLowerCase().includes(query) ||
        p.destination.toLowerCase().includes(query) ||
        p.packageId.toLowerCase().includes(query);

      let matchesFilter = true;
      if (activeFilter === 'Active') matchesFilter = p.status === 'Active';
      else if (activeFilter === 'Draft') matchesFilter = p.status === 'Draft';
      else if (activeFilter === 'Hidden') matchesFilter = p.status === 'Hidden' || p.status === 'Archived';
      else if (activeFilter === 'Domestic') matchesFilter = p.packageType === 'Domestic';
      else if (activeFilter === 'International') matchesFilter = p.packageType === 'International';

      return matchesSearch && matchesFilter;
    });
  }, [packagesList, searchTerm, activeFilter]);

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

  const handleDuplicatePackage = (id: string) => {
    const target = packagesList.find((p) => p.id === id);
    if (!target) return;
    const newPkg: AgencyPackage = {
      ...target,
      id: `pkg-${Date.now()}`,
      packageId: `PKG-${Math.floor(1000 + Math.random() * 9000)}`,
      packageName: `${target.packageName} (Copy)`,
      status: 'Draft',
      bookings: 0,
      rating: 0,
      reviewCount: 0,
      lastUpdated: 'Just now',
    };
    setPackagesList((prev) => [newPkg, ...prev]);
    alert(`Created duplicate draft: "${newPkg.packageName}"`);
  };

  const handleArchivePackage = (id: string) => {
    setPackagesList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Archived' } : p))
    );
  };

  const handleHidePackage = (id: string) => {
    setPackagesList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 'Hidden' ? 'Active' : 'Hidden' } : p
      )
    );
  };

  const handleDeletePackage = (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      setPackagesList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-28 md:pb-24">
        <DashboardHeader />

        {/* Sticky Sub Header */}
        <PackagesHeader onCreatePackage={handleCreatePackage} />

        {/* Main Body */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-5 max-w-5xl mx-auto w-full">
          {/* Summary Stats Cards */}
          <PackageStats
            total={stats.total}
            published={stats.published}
            draft={stats.draft}
            archived={stats.archived}
          />

          {/* Search + Filter Chips */}
          <div className="space-y-3">
            <PackageSearch
              value={searchTerm}
              onChange={setSearchTerm}
              filterCount={activeFilter !== 'All' ? 1 : 0}
              onFilterClick={() => alert('Filter options — coming soon')}
            />
            <PackageFilters
              activeFilter={activeFilter}
              onChange={setActiveFilter}
            />
          </div>

          {/* Packages List */}
          <div className="space-y-3.5">
            {filteredPackages.length > 0 ? (
              <>
                {filteredPackages.map((pkg, idx) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    index={idx}
                    onView={handleViewPackage}
                    onEdit={handleEditPackage}
                    onDuplicate={handleDuplicatePackage}
                    onArchive={handleArchivePackage}
                    onHide={handleHidePackage}
                    onDelete={handleDeletePackage}
                  />
                ))}

                {/* Bottom CTA Card */}
                <CreatePackageCTA onCreatePackage={handleCreatePackage} />
              </>
            ) : (
              <EmptyPackagesState
                onCreatePackage={handleCreatePackage}
                title={searchTerm ? 'No matching packages found' : 'No Packages Yet'}
                subtitle={
                  searchTerm
                    ? 'Try searching for a different keyword or resetting your filters.'
                    : 'Create your first travel package and start receiving bookings.'
                }
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default AgencyPackagesPage;
