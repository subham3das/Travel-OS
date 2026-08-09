import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { ManageTeamHeader } from '../../components/team/ManageTeamHeader';
import { TripSummaryCard } from '../../components/team/TripSummaryCard';
import { AssignedTeamCard } from '../../components/team/AssignedTeamCard';
import { StaffCard } from '../../components/team/StaffCard';
import { VehicleCard } from '../../components/team/VehicleCard';
import { EmergencyContactsCard } from '../../components/team/EmergencyContactsCard';
import { TeamNotesCard } from '../../components/team/TeamNotesCard';
import { StickyTeamActionBar } from '../../components/team/StickyTeamActionBar';
import {
  MOCK_ASSIGNED_TEAM,
  MOCK_AVAILABLE_STAFF,
  MOCK_ASSIGNED_VEHICLE,
  MOCK_TRIP_CONTACTS,
  MOCK_TEAM_NOTES,
  AssignedStaffMember,
  AvailableStaffMember,
} from '../../data/staff';
import { MOCK_TRIP_DETAILS } from '../../data/tripDetails';

/**
 * Agency Manage Operational Team Page
 * Route: /agency/trips/:tripId/team (Protected: APPROVED agencies only)
 */
export const AgencyManageTeamPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  const currentTripId = tripId || 'LD-1505-2024';

  const [assignedTeam, setAssignedTeam] = useState<AssignedStaffMember[]>(MOCK_ASSIGNED_TEAM);
  const [availableStaff, setAvailableStaff] = useState<AvailableStaffMember[]>(MOCK_AVAILABLE_STAFF);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');

  // Filtered available staff based on search & role dropdown
  const filteredAvailableStaff = useMemo(() => {
    return availableStaff.filter((st) => {
      const matchesRole = selectedRole === 'All Roles' || st.role === selectedRole;
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        st.name.toLowerCase().includes(query) ||
        st.role.toLowerCase().includes(query) ||
        st.languages.some((l) => l.toLowerCase().includes(query));

      return matchesRole && matchesSearch;
    });
  }, [availableStaff, searchTerm, selectedRole]);

  // Handler: Auto Suggest Team
  const handleAutoSuggest = () => {
    alert('✨ AI Auto Suggestion: Optimal guide Tsering Namgyal & driver Sandeep Thapa selected based on trip rating and availability!');
  };

  // Handler: Replace Staff
  const handleReplaceStaff = (staffId: string) => {
    const member = assignedTeam.find((m) => m.id === staffId);
    if (member) {
      alert(`Replace ${member.name} (${member.role}) — select a replacement from Available Staff below.`);
    }
  };

  // Handler: Assign Available Staff
  const handleAssignStaff = (staff: AvailableStaffMember) => {
    setAvailableStaff((prev) =>
      prev.map((s) => (s.id === staff.id ? { ...s, isAssigned: !s.isAssigned } : s))
    );

    // Update assigned team
    setAssignedTeam((prev) =>
      prev.map((m) => {
        if (m.role === staff.role) {
          return {
            ...m,
            name: staff.name,
            phone: staff.phone,
            experienceText: `${staff.experienceYears} Years Exp.`,
            avatar: staff.avatar,
            isAssigned: true,
          };
        }
        return m;
      })
    );
  };

  // Handler: Save Assignments
  const handleSaveAssignments = () => {
    // Navigate back to trip details page with teamAssigned=true signal
    navigate(`/agency/trips/${currentTripId}?teamAssigned=true`);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-28 md:pb-24">
        <DashboardHeader />

        {/* Top Sticky Header */}
        <ManageTeamHeader tripId={currentTripId} />

        {/* Main Body Container */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-4xl mx-auto w-full">
          {/* Trip Summary Card */}
          <TripSummaryCard
            tripId={currentTripId}
            packageName={MOCK_TRIP_DETAILS.packageName}
            coverImage={MOCK_TRIP_DETAILS.coverImage}
            dateRangeText={MOCK_TRIP_DETAILS.dateRangeText}
            destinationRoute={MOCK_TRIP_DETAILS.destinationRoute}
            travelerCount={MOCK_TRIP_DETAILS.travelerCount}
            capacity={MOCK_TRIP_DETAILS.capacity}
            statusText={MOCK_TRIP_DETAILS.statusText}
          />

          {/* Assigned Team Section */}
          <AssignedTeamCard
            assignedTeam={assignedTeam}
            onAutoSuggest={handleAutoSuggest}
            onReplace={handleReplaceStaff}
            onAssign={(role) => alert(`Assign staff for role ${role}`)}
          />

          {/* Available Staff Section */}
          <StaffCard
            staffList={filteredAvailableStaff}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            onAssignStaff={handleAssignStaff}
            onViewMore={() => alert('Loading more staff records...')}
          />

          {/* 2-Column: Vehicle & Emergency Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VehicleCard
              vehicle={MOCK_ASSIGNED_VEHICLE}
              onChangeVehicle={() => alert('Change vehicle assignment popup coming soon')}
            />
            <EmergencyContactsCard contacts={MOCK_TRIP_CONTACTS} />
          </div>

          {/* Team Internal Notes Section */}
          <TeamNotesCard
            notes={MOCK_TEAM_NOTES}
            onAddNote={() => alert('Add internal staff note modal coming soon')}
          />
        </main>
      </div>

      {/* Sticky Bottom Save Action Bar */}
      <StickyTeamActionBar onSave={handleSaveAssignments} />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default AgencyManageTeamPage;
