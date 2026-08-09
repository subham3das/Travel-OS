// ─── Agency Applications Mock Data ───────────────────────────────────────────

import { AgencyVerificationStatus } from '../../agency-panel/types/agency';

export interface AgencyApplicationRecord {
  id: string;
  agencyId: string;
  agencyName: string;
  logo: string;
  ownerName: string;
  ownerEmail: string;
  location: string;
  submittedOn: string;
  status: AgencyVerificationStatus;
}

export const MOCK_RECENT_APPLICATIONS: AgencyApplicationRecord[] = [
  {
    id: 'app-101',
    agencyId: 'ag-101',
    agencyName: 'Wanderlust Holidays',
    logo: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100',
    ownerName: 'Rohit Sharma',
    ownerEmail: 'rohit@wanderlust.com',
    location: 'Dibrugarh, Assam',
    submittedOn: '8 May 2026, 10:30 AM',
    status: AgencyVerificationStatus.PENDING,
  },
  {
    id: 'app-102',
    agencyId: 'ag-102',
    agencyName: 'NorthEast Explorers',
    logo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100',
    ownerName: 'Ananya Das',
    ownerEmail: 'ananya@northeastexplorers.com',
    location: 'Guwahati, Assam',
    submittedOn: '8 May 2026, 09:15 AM',
    status: AgencyVerificationStatus.UNDER_REVIEW,
  },
  {
    id: 'app-103',
    agencyId: 'ag-103',
    agencyName: 'Himalayan Trails',
    logo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100',
    ownerName: 'Manish Thapa',
    ownerEmail: 'manish@himalayantrails.com',
    location: 'Gangtok, Sikkim',
    submittedOn: '7 May 2026, 04:45 PM',
    status: AgencyVerificationStatus.APPROVED,
  },
  {
    id: 'app-104',
    agencyId: 'ag-104',
    agencyName: 'Blue Horizon Travels',
    logo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100',
    ownerName: 'Vikram Mehta',
    ownerEmail: 'vikram@bluehorizon.com',
    location: 'Jaipur, Rajasthan',
    submittedOn: '7 May 2026, 02:20 PM',
    status: AgencyVerificationStatus.UNDER_REVIEW,
  },
  {
    id: 'app-105',
    agencyId: 'ag-105',
    agencyName: 'Summit Journey',
    logo: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=100',
    ownerName: 'Pema Tsering',
    ownerEmail: 'pema@summitjourney.com',
    location: 'Leh, Ladakh',
    submittedOn: '7 May 2026, 11:05 AM',
    status: AgencyVerificationStatus.REJECTED,
  },
];
