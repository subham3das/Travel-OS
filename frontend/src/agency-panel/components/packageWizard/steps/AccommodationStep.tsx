import React, { useState } from 'react';
import {
  Hotel,
  Plus,
  Trash2,
  CheckCircle2,
  Building,
  MapPin,
  Clock,
  Sparkles,
  BedDouble,
  FileText,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import { usePackageWizard } from '../../../context/PackageWizardContext';
import { PackageHotelEntry } from '../../../types/packageWizard';
import { UniversalImageUploader } from '../../../../components/common/UniversalImageUploader';

const HOTEL_CATEGORIES = [
  'Hotel',
  'Resort',
  'Luxury Resort',
  'Camp / Tent',
  'Homestay',
  'Cottage',
  'Heritage Villa',
  'Houseboat',
];

const COMMON_AMENITIES = [
  'Free WiFi',
  'Breakfast Included',
  'Dinner Included',
  'Restaurant',
  'Swimming Pool',
  'Mountain View',
  'Room Heater',
  'Air Conditioning',
  'Hot Water 24/7',
  'Parking',
  'Bonfire Area',
];

export const AccommodationStep: React.FC = () => {
  const {
    draft,
    toggleAccommodationConfirmed,
    addHotel,
    updateHotel,
    removeHotel,
  } = usePackageWizard();

  const isConfirmed = draft.stepAccommodation?.accommodationConfirmed ?? false;
  const hotels = draft.stepAccommodation?.hotels ?? [];

  const [newAmenityInputs, setNewAmenityInputs] = useState<Record<string, string>>({});
  const [newImageInputs, setNewImageInputs] = useState<Record<string, string>>({});

  const handleAddNewHotel = () => {
    addHotel({
      hotelName: '',
      hotelImages: [],
      category: 'Hotel',
      address: '',
      city: draft.step2?.primaryDestination || '',
      amenities: ['Free WiFi', 'Breakfast Included'],
      roomType: 'Deluxe Room',
      checkIn: '12:00 PM',
      checkOut: '11:00 AM',
      shortDescription: '',
      dayRange: `Day ${hotels.length + 1}`,
    });
  };

  const handleAddCustomAmenity = (hotelId: string) => {
    const text = (newAmenityInputs[hotelId] || '').trim();
    if (!text) return;
    const hotel = hotels.find((h) => h.id === hotelId);
    if (hotel) {
      const updated = Array.from(new Set([...hotel.amenities, text]));
      updateHotel(hotelId, { amenities: updated });
      setNewAmenityInputs((prev) => ({ ...prev, [hotelId]: '' }));
    }
  };

  const handleAddImage = (hotelId: string) => {
    const url = (newImageInputs[hotelId] || '').trim();
    if (!url) return;
    const hotel = hotels.find((h) => h.id === hotelId);
    if (hotel) {
      const updated = [...hotel.hotelImages, url];
      updateHotel(hotelId, { hotelImages: updated });
      setNewImageInputs((prev) => ({ ...prev, [hotelId]: '' }));
    }
  };

  const handleRemoveImage = (hotelId: string, imgIdx: number) => {
    const hotel = hotels.find((h) => h.id === hotelId);
    if (hotel) {
      const updated = hotel.hotelImages.filter((_, idx) => idx !== imgIdx);
      updateHotel(hotelId, { hotelImages: updated });
    }
  };

  const handleToggleAmenity = (hotelId: string, amenity: string) => {
    const hotel = hotels.find((h) => h.id === hotelId);
    if (!hotel) return;
    const exists = hotel.amenities.includes(amenity);
    const updated = exists
      ? hotel.amenities.filter((a) => a !== amenity)
      : [...hotel.amenities, amenity];
    updateHotel(hotelId, { amenities: updated });
  };

  return (
    <div className="space-y-6 select-none max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-2">
        <div className="flex items-center gap-2.5 text-[#583BE8]">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
            <Hotel className="w-5 h-5 text-[#583BE8]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0F172A] tracking-tight">
              Accommodation (Optional)
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              Specify confirmed stays or leave unconfirmed if travelers book their own stays.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Radio Selector */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-4">
        <label className="text-sm font-black text-[#0F172A] block">
          Have you already confirmed accommodation for this package?
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* YES Option */}
          <div
            onClick={() => toggleAccommodationConfirmed(true)}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
              isConfirmed
                ? 'border-[#583BE8] bg-purple-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name="accommodationConfirmed"
              checked={isConfirmed}
              onChange={() => toggleAccommodationConfirmed(true)}
              className="mt-1 w-4 h-4 text-[#583BE8] focus:ring-[#583BE8] cursor-pointer"
            />
            <div className="space-y-1">
              <div className="text-sm font-extrabold text-[#0F172A] flex items-center gap-1.5">
                <span>Yes, Accommodation Confirmed</span>
                {isConfirmed && <CheckCircle2 className="w-4 h-4 text-[#583BE8]" />}
              </div>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Add hotel, resort, or camp details that will be displayed transparently to travelers.
              </p>
            </div>
          </div>

          {/* NO Option */}
          <div
            onClick={() => toggleAccommodationConfirmed(false)}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
              !isConfirmed
                ? 'border-[#583BE8] bg-purple-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name="accommodationConfirmed"
              checked={!isConfirmed}
              onChange={() => toggleAccommodationConfirmed(false)}
              className="mt-1 w-4 h-4 text-[#583BE8] focus:ring-[#583BE8] cursor-pointer"
            />
            <div className="space-y-1">
              <div className="text-sm font-extrabold text-[#0F172A] flex items-center gap-1.5">
                <span>No Accommodation</span>
                {!isConfirmed && <CheckCircle2 className="w-4 h-4 text-[#583BE8]" />}
              </div>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                No accommodation will be shown on the package details page.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* When Confirmed: Show Hotel Form & Cards */}
      {isConfirmed && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#0F172A] tracking-tight">
              Confirmed Hotels / Stays ({hotels.length})
            </h3>
            <button
              type="button"
              onClick={handleAddNewHotel}
              className="px-4 py-2 rounded-xl bg-[#583BE8] hover:bg-[#472bd1] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Hotel</span>
            </button>
          </div>

          {hotels.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center mx-auto">
                <Building className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-[#0F172A]">No Hotels Added Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click below to add your first confirmed stay (e.g. Leh Hotel, Nubra Camp, etc.).
              </p>
              <button
                type="button"
                onClick={handleAddNewHotel}
                className="px-5 py-2.5 rounded-xl bg-[#583BE8] text-white text-xs font-black shadow-md hover:bg-[#472bd1] transition-all cursor-pointer"
              >
                + Add Hotel
              </button>
            </div>
          ) : (
            hotels.map((hotel, index) => (
              <div
                key={hotel.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-2xs space-y-5"
              >
                {/* Hotel Header with Day Range & Remove */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-purple-100 text-[#583BE8] text-xs font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                      Stay {index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeHotel(hotel.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 font-extrabold flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Day Range (e.g. Day 1-2, Day 3) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#0F172A] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Applicable Days</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Day 1-2 or Day 3"
                      value={hotel.dayRange || ''}
                      onChange={(e) => updateHotel(hotel.id, { dayRange: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A] focus:border-[#583BE8] focus:outline-none"
                    />
                  </div>

                  {/* Hotel Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#0F172A] flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>Hotel Category</span>
                    </label>
                    <select
                      value={hotel.category}
                      onChange={(e) => updateHotel(hotel.id, { category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A] focus:border-[#583BE8] focus:outline-none bg-white cursor-pointer"
                    >
                      {HOTEL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hotel Name */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-extrabold text-[#0F172A]">
                      Hotel Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Grand Heritage Resort / Nubra Luxury Camp"
                      value={hotel.hotelName}
                      onChange={(e) => updateHotel(hotel.id, { hotelName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A] focus:border-[#583BE8] focus:outline-none"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#0F172A] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>City / Area</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Leh, Nubra Valley, Pangong"
                      value={hotel.city}
                      onChange={(e) => updateHotel(hotel.id, { city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A] focus:border-[#583BE8] focus:outline-none"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#0F172A]">
                      Hotel Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Fort Road, Near Main Market"
                      value={hotel.address}
                      onChange={(e) => updateHotel(hotel.id, { address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A] focus:border-[#583BE8] focus:outline-none"
                    />
                  </div>

                  {/* Room Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#0F172A] flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                      <span>Room Type</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Deluxe Mountain View / Luxury Swiss Tent"
                      value={hotel.roomType}
                      onChange={(e) => updateHotel(hotel.id, { roomType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A] focus:border-[#583BE8] focus:outline-none"
                    />
                  </div>

                  {/* Check-In / Check-Out */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-600 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Check In</span>
                      </label>
                      <input
                        type="text"
                        placeholder="12:00 PM"
                        value={hotel.checkIn}
                        onChange={(e) => updateHotel(hotel.id, { checkIn: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A] focus:border-[#583BE8] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-600 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Check Out</span>
                      </label>
                      <input
                        type="text"
                        placeholder="11:00 AM"
                        value={hotel.checkOut}
                        onChange={(e) => updateHotel(hotel.id, { checkOut: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A] focus:border-[#583BE8] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-extrabold text-[#0F172A] flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Short Description</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Premium boutique stay nestled with panoramic views of snow-clad mountains."
                      value={hotel.shortDescription}
                      onChange={(e) => updateHotel(hotel.id, { shortDescription: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-[#0F172A] focus:border-[#583BE8] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Amenities */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-extrabold text-[#0F172A] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                      <span>Amenities</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_AMENITIES.map((am) => {
                        const isSelected = hotel.amenities.includes(am);
                        return (
                          <button
                            type="button"
                            key={am}
                            onClick={() => handleToggleAmenity(hotel.id, am)}
                            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#583BE8] text-white border-[#583BE8]'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {am}
                          </button>
                        );
                      })}
                    </div>

                    {/* Add Custom Amenity */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add custom amenity..."
                        value={newAmenityInputs[hotel.id] || ''}
                        onChange={(e) =>
                          setNewAmenityInputs((prev) => ({ ...prev, [hotel.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomAmenity(hotel.id);
                          }
                        }}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#583BE8] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCustomAmenity(hotel.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Hotel Images */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-extrabold text-[#0F172A] flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hotel & Room Images</span>
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">Max 8 images</span>
                    </label>

                    <UniversalImageUploader
                      multiple={true}
                      maxFiles={8}
                      value={hotel.hotelImages}
                      onChange={(val) => {
                        if (Array.isArray(val)) {
                          const urls = val.map((item) => (typeof item === 'string' ? item : item.url));
                          updateHotel(hotel.id, { hotelImages: urls });
                        } else if (val) {
                          const url = typeof val === 'string' ? val : val.url;
                          updateHotel(hotel.id, { hotelImages: [url] });
                        } else {
                          updateHotel(hotel.id, { hotelImages: [] });
                        }
                      }}
                      folder="travelos/hotels"
                      placeholder="Drag & drop hotel photos here"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AccommodationStep;
