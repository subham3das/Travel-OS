// ─── Package Inclusions, Exclusions, Packing & Add-ons Options ───────────────

export interface OptionItem {
  id: string;
  label: string;
  category?: string;
  icon?: string;
}

export interface AddOnOption {
  id: string;
  label: string;
  subtitle: string;
  defaultPrice: number;
  icon: string;
}

export const INCLUDED_OPTIONS_CONFIG: OptionItem[] = [
  { id: 'hotel_stay', label: 'Hotel Stay', category: 'Accommodation', icon: 'Hotel' },
  { id: 'breakfast', label: 'Breakfast', category: 'Meals', icon: 'Coffee' },
  { id: 'airport_pickup', label: 'Airport Pickup', category: 'Transportation', icon: 'Car' },
  { id: 'sightseeing', label: 'Sightseeing', category: 'Activities', icon: 'Glasses' },
  { id: 'inner_line_permit', label: 'Inner Line Permit', category: 'Permits', icon: 'FileText' },
  { id: 'tour_guide', label: 'Tour Guide', category: 'Guide', icon: 'UserCheck' },
  { id: 'camping', label: 'Camping', category: 'Activities', icon: 'Tent' },
  { id: 'bonfire', label: 'Bonfire', category: 'Activities', icon: 'Flame' },
  { id: 'travel_insurance', label: 'Travel Insurance', category: 'Insurance', icon: 'Shield' },
  { id: 'local_transport', label: 'Local Transport', category: 'Transportation', icon: 'Bus' },
  { id: 'lunch', label: 'Lunch', category: 'Meals', icon: 'Utensils' },
  { id: 'dinner', label: 'Dinner', category: 'Meals', icon: 'UtensilsCrossed' },
  { id: 'camp_stay', label: 'Camp Stay', category: 'Accommodation', icon: 'Tent' },
  { id: 'homestay', label: 'Homestay', category: 'Accommodation', icon: 'Home' },
  { id: 'airport_drop', label: 'Airport Drop', category: 'Transportation', icon: 'Car' },
  { id: 'national_park_entry', label: 'National Park Entry', category: 'Permits', icon: 'Trees' },
  { id: 'trek_leader', label: 'Trek Leader', category: 'Guide', icon: 'User' },
  { id: 'river_rafting', label: 'River Rafting', category: 'Activities', icon: 'Waves' },
  { id: 'bike_rental', label: 'Bike Rental', category: 'Activities', icon: 'Bike' },
];

export const EXCLUDED_OPTIONS_CONFIG: OptionItem[] = [
  { id: 'flight_tickets', label: 'Flight Tickets' },
  { id: 'personal_expenses', label: 'Personal Expenses' },
  { id: 'laundry', label: 'Laundry' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'camera_fees', label: 'Camera Fees' },
  { id: 'medical_expenses', label: 'Medical Expenses' },
  { id: 'tips', label: 'Tips' },
  { id: 'alcohol', label: 'Alcohol' },
  { id: 'extra_meals', label: 'Extra Meals' },
  { id: 'adventure_activities', label: 'Adventure Activities' },
];

export const PACKING_OPTIONS_CONFIG: OptionItem[] = [
  { id: 'jacket', label: 'Jacket' },
  { id: 'gloves', label: 'Gloves' },
  { id: 'sunscreen', label: 'Sunscreen' },
  { id: 'power_bank', label: 'Power Bank' },
  { id: 'id_proof', label: 'ID Proof' },
  { id: 'trekking_shoes', label: 'Trekking Shoes' },
  { id: 'medicines', label: 'Medicines' },
  { id: 'water_bottle', label: 'Water Bottle' },
  { id: 'sunglasses', label: 'Sunglasses' },
  { id: 'raincoat', label: 'Raincoat' },
];

export const ADDON_OPTIONS_CONFIG: AddOnOption[] = [
  { id: 'bike_rental', label: 'Bike Rental', subtitle: 'Royal Enfield 350cc', defaultPrice: 2500, icon: 'Bike' },
  { id: 'atv_ride', label: 'ATV Ride', subtitle: '30 Min Adventure Ride', defaultPrice: 1800, icon: 'Car' },
  { id: 'photography', label: 'Photography', subtitle: 'Professional Travel Photos', defaultPrice: 1500, icon: 'Camera' },
  { id: 'camping_upgrade', label: 'Camping Upgrade', subtitle: 'Premium Tent Stay', defaultPrice: 2000, icon: 'Tent' },
  { id: 'room_upgrade', label: 'Room Upgrade', subtitle: 'Upgrade to Premium Room', defaultPrice: 2000, icon: 'Bed' },
  { id: 'airport_pickup_upgrade', label: 'Airport Pickup Upgrade', subtitle: 'Premium Vehicle', defaultPrice: 1200, icon: 'Car' },
];
