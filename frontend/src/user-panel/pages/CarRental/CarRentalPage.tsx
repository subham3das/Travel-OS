import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  MessageSquare,
  SlidersHorizontal,
  Car,
  Search,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Heart,
  X,
  AlertCircle,
  Bike,
  Key,
  Calendar,
  MapPin,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Vehicle,
  VehicleCategory,
  VehicleType,
  CarRentalSearchParams,
  CarRentalFilterState,
} from '../../types/carRental';
import { carRentalService } from '../../services/carRental.service';
import { CarCategoryScroll } from '../../components/carRental/CarCategoryScroll';
import { CarSearchCard } from '../../components/carRental/CarSearchCard';
import { PopularCarCategories } from '../../components/carRental/PopularCarCategories';
import { VehicleCard } from '../../components/carRental/VehicleCard';
import { CarBookingModal } from '../../components/carRental/CarBookingModal';
import {
  CarFilterDrawer,
  INITIAL_FILTERS,
} from '../../components/carRental/CarFilterDrawer';
import { RecentlyViewedVehicles } from '../../components/carRental/RecentlyViewedVehicles';
import { RentalBookingModal } from '../../components/carRental/RentalBookingModal';
import { BottomNavigation } from '../../components/common/BottomNavigation';
import { BrandLogo } from '../../../common/brand';

export const CarRentalPage: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>('outstation');
  const [selectedType, setSelectedType] = useState<VehicleType | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [searchParams, setSearchParams] = useState<CarRentalSearchParams | null>(null);
  const [filters, setFilters] = useState<CarRentalFilterState>(INITIAL_FILTERS);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Favorites & Recently Viewed
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Vehicle[]>([]);
  const [activeViewTab, setActiveViewTab] = useState<'all' | 'saved'>('all');

  // Report Feedback Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Top-Level Mode: Driver-Based Booking vs Self-Drive Rentals
  const [serviceMode, setServiceMode] = useState<'driver' | 'rental'>('driver');
  const [rentalSubCategory, setRentalSubCategory] = useState<'car' | 'bike'>('car');
  const [rentalCity, setRentalCity] = useState('');
  const [rentalPickupDateTime, setRentalPickupDateTime] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [rentalReturnDateTime, setRentalReturnDateTime] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(18, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [rentalVehicles, setRentalVehicles] = useState<Vehicle[]>([]);
  const [isRentalLoading, setIsRentalLoading] = useState(false);
  const [selectedRentalVehicle, setSelectedRentalVehicle] = useState<Vehicle | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Load Self-Drive Rentals
  useEffect(() => {
    if (serviceMode !== 'rental') return;
    let isMounted = true;
    const fetchRentals = async () => {
      setIsRentalLoading(true);
      try {
        const res = await carRentalService.searchRentals({
          city: rentalCity || undefined,
          vehicleType: rentalSubCategory,
          pickupDateTime: rentalPickupDateTime,
          returnDateTime: rentalReturnDateTime,
        });
        if (isMounted) {
          setRentalVehicles(res.vehicles);
        }
      } catch (err) {
        console.error('Failed to load rentals:', err);
      } finally {
        if (isMounted) setIsRentalLoading(false);
      }
    };
    fetchRentals();
    return () => {
      isMounted = false;
    };
  }, [serviceMode, rentalSubCategory, rentalCity, rentalPickupDateTime, rentalReturnDateTime]);

  // Load vehicles from Backend
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const queryParams: any = {
          category: (selectedCategory as any) !== 'all' ? selectedCategory : undefined,
          type: selectedType || (filters.vehicleTypes.length === 1 ? filters.vehicleTypes[0] : undefined),
          pickup: searchParams?.pickupLocation || undefined,
          destination: searchParams?.dropLocation || undefined,
          hasAC: filters.hasAC !== null ? filters.hasAC : undefined,
          driverIncluded: filters.driverIncluded !== null ? filters.driverIncluded : undefined,
          priceRange: filters.priceRange,
          seats: filters.seats.length > 0 ? Math.min(...filters.seats) : undefined,
          fuel: filters.fuel.length === 1 ? filters.fuel[0] : undefined,
          transmission: filters.transmission.length === 1 ? filters.transmission[0] : undefined,
          sortBy: (filters as any).sortBy,
        };
        const data = await carRentalService.getVehicles(queryParams);
        if (isMounted) {
          setVehicles(data);
        }
      } catch {
        // Handled in service
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedType, searchParams, filters]);

  // Load Favorites from Backend & Recently Viewed
  useEffect(() => {
    const fetchSaved = async () => {
      const favs = await carRentalService.getFavorites();
      setFavorites(favs);
    };
    fetchSaved();
    setRecentlyViewed(carRentalService.getRecentlyViewed());
  }, []);

  const handleToggleFavorite = async (vehicleId: string) => {
    const isNowFavorite = await carRentalService.toggleFavorite(vehicleId);
    setFavorites((prev) =>
      isNowFavorite ? [...prev, vehicleId] : prev.filter((id) => id !== vehicleId)
    );
    showToast(isNowFavorite ? '❤️ Vehicle added to Saved List' : 'Vehicle removed from Saved List');
  };

  const handleOpenDetails = (vehicle: Vehicle) => {
    carRentalService.addToRecentlyViewed(vehicle);
    navigate(`/car-rental/${vehicle.id}`);
  };

  const handleStartBooking = (vehicle: Vehicle) => {
    carRentalService.addToRecentlyViewed(vehicle);
    navigate(`/car-rental/${vehicle.id}`);
  };

  const handleReportVehicle = async (vehicle: Vehicle) => {
    await carRentalService.reportListing(vehicle.id, 'User reported listing');
    showToast('Listing reported. Our quality team will review it within 24 hours.');
  };

  // Filtered vehicles logic
  const filteredVehicles = useMemo(() => {
    if (activeViewTab === 'saved') {
      return vehicles.filter((veh) => favorites.includes(veh.id));
    }
    return vehicles;
  }, [vehicles, activeViewTab, favorites]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] font-sans pb-28 selection:bg-[#FF4D6D]/20 selection:text-[#FF4D6D]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-black flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header Bar matching reference */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate('/home')}
            className="flex items-center hover:opacity-90 transition-opacity focus:outline-none cursor-pointer select-none"
            aria-label="ApnaTrip Home"
          >
            <BrandLogo
              theme="light"
              className="h-8 sm:h-9 w-auto"
              alt="ApnaTrip"
            />
          </button>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/notifications')}
              aria-label="Notifications"
              className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#FF4D6D] ring-2 ring-white" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/chat')}
              aria-label="Messages"
              className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* 2. Page Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Vehicle Services
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-1.5">
            <span>Reliable driver rides & self-drive rentals for every journey</span>
            <span>🚗🏍️</span>
          </p>
        </div>

        {/* 2.1 Top-Level Service Mode Switcher */}
        <div className="flex p-1.5 bg-slate-200/70 rounded-2xl gap-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => setServiceMode('driver')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              serviceMode === 'driver'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Car className="w-4 h-4 text-[#FF4D6D]" />
            <span>Driver-Based Booking</span>
          </button>

          <button
            type="button"
            onClick={() => setServiceMode('rental')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              serviceMode === 'rental'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-4 h-4 text-indigo-600" />
            <span>Self Drive Rentals</span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-black bg-indigo-50 text-indigo-600 border border-indigo-200">
              Cars & Bikes
            </span>
          </button>
        </div>

        {/* MODE A: DRIVER-BASED CAR BOOKING (EXISTING PRODUCTION WORKFLOW UNCHANGED) */}
        {serviceMode === 'driver' && (
          <>
            {/* 3. Horizontal Categories (Outstation, Local, Airport, Hourly, Self Drive, Luxury) */}
            <CarCategoryScroll
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setSelectedType(null);
              }}
            />

            {/* 4. Large Search Card */}
            <CarSearchCard
              category={selectedCategory}
              onSearch={(params) => {
                setSearchParams(params);
                const typeLabel = params.tripType ? params.tripType.replace('_', ' ') : 'rental';
                showToast(`Searching available ${typeLabel} cars...`);
              }}
            />

            {/* 5. Popular Categories (Horizontal Cards matching Explore) */}
            <PopularCarCategories
              selectedType={selectedType}
              onSelectType={(type) => {
                setSelectedType(selectedType === type ? null : type);
              }}
              onViewAll={() => setSelectedType(null)}
            />

            {/* 6. Active Filter Indicators & Controls */}
            <div className="flex items-center justify-between pt-2">
              {/* Tabs: All Vehicles vs Saved Vehicles */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveViewTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    activeViewTab === 'all'
                      ? 'bg-white text-[#0F172A] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All Vehicles
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewTab('saved')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeViewTab === 'saved'
                      ? 'bg-white text-rose-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>Saved ({favorites.length})</span>
                </button>
              </div>

              {/* Filter Drawer Trigger Button */}
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(true)}
                className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF4D6D]" />
                <span>Filters</span>
                {(filters.vehicleTypes.length > 0 ||
                  filters.seats.length > 0 ||
                  filters.fuel.length > 0 ||
                  filters.priceRange[1] < 15000) && (
                  <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
                )}
              </button>
            </div>

            {/* Active Type Filter Chip if selected */}
            {selectedType && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Filtering by:</span>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-[#FF4D6D] text-xs font-extrabold border border-rose-200">
                  <span className="capitalize">{selectedType.replace('_', ' ')}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedType(null)}
                    className="hover:opacity-75 focus:outline-none"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* 7. Featured Cars / Vehicle Listings */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
                  Featured Cars
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  {filteredVehicles.length} vehicles available
                </span>
              </div>

              {/* Listings Stack */}
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-full h-44 rounded-3xl bg-white border border-slate-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : filteredVehicles.length > 0 ? (
                <div className="space-y-4">
                  {filteredVehicles.map((veh) => (
                    <VehicleCard
                      key={veh.id}
                      vehicle={veh}
                      isFavorite={favorites.includes(veh.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectVehicle={handleOpenDetails}
                      onBookNow={handleStartBooking}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 bg-white rounded-3xl border border-slate-100 text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#FF4D6D] flex items-center justify-center mx-auto">
                    <Car className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-black text-[#0F172A]">No vehicles found</h4>
                    <p className="text-xs font-medium text-slate-400 max-w-sm mx-auto">
                      Try clearing your filters or selecting another vehicle category.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedType(null);
                      setFilters(INITIAL_FILTERS);
                      setActiveViewTab('all');
                    }}
                    className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 text-xs font-black hover:bg-slate-200 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </section>

            {/* 8. Recently Viewed Carousel */}
            <RecentlyViewedVehicles
              vehicles={recentlyViewed}
              onSelectVehicle={handleOpenDetails}
            />
          </>
        )}

        {/* MODE B: SELF DRIVE RENTALS (CARS & BIKES) */}
        {serviceMode === 'rental' && (
          <div className="space-y-5">
            {/* Sub-Category Toggle: Cars vs Bikes */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex p-1 bg-slate-100 rounded-2xl gap-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setRentalSubCategory('car')}
                  className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    rentalSubCategory === 'car'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Self Drive Cars</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRentalSubCategory('bike')}
                  className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    rentalSubCategory === 'bike'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>Self Drive Bikes</span>
                </button>
              </div>

              <span className="hidden sm:inline-block text-xs font-bold text-slate-400">
                {rentalVehicles.length} available
              </span>
            </div>

            {/* Rental Search Hub & Dates */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF4D6D]" />
                    Pickup City / Hub
                  </label>
                  <input
                    type="text"
                    value={rentalCity}
                    onChange={(e) => setRentalCity(e.target.value)}
                    placeholder="All Cities / Hubs"
                    className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    Pickup Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={rentalPickupDateTime}
                    onChange={(e) => setRentalPickupDateTime(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 outline-none cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    Return Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={rentalReturnDateTime}
                    onChange={(e) => setRentalReturnDateTime(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Rental Vehicle Listings */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
                  Available Self-Drive {rentalSubCategory === 'bike' ? 'Bikes' : 'Cars'}
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  {rentalVehicles.length} vehicles found
                </span>
              </div>

              {isRentalLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-full h-44 rounded-3xl bg-white border border-slate-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : rentalVehicles.length > 0 ? (
                <div className="space-y-4">
                  {rentalVehicles.map((veh) => {
                    const isBike = veh.vehicleSubCategory === 'bike';
                    const policies = veh.rentalPolicies || {
                      securityDeposit: 2000,
                      includedKmPerDay: 200,
                      extraKmCharge: 10,
                      fuelPolicy: 'same_to_same',
                    };
                    const quote = veh.rentalQuote;

                    return (
                      <div
                        key={veh.id}
                        className="w-full bg-white rounded-3xl border border-slate-100 p-4 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row gap-4 relative overflow-hidden"
                      >
                        {/* Image */}
                        <div className="relative w-full md:w-56 h-48 md:h-auto rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                          <img
                            src={veh.thumbnail}
                            alt={veh.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
                            Self-Drive {isBike ? 'Bike' : 'Car'}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-base sm:text-lg font-black text-[#0F172A]">
                                  {veh.name}
                                </h4>
                                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                                  <span>{veh.provider.name}</span>
                                  {veh.pickupLocation && (
                                    <>
                                      <span>•</span>
                                      <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                                        <MapPin className="w-3 h-3" /> {veh.pickupLocation}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Specs row */}
                            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-semibold text-slate-600">
                              {isBike ? (
                                <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 font-bold">
                                  {veh.specs.engineCC || 150} CC
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 font-bold">
                                  {veh.specs.seats} Seater
                                </span>
                              )}
                              <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 font-bold">
                                {veh.specs.transmission}
                              </span>
                              <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 font-bold">
                                {veh.specs.fuel}
                              </span>
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold">
                                {policies.includedKmPerDay} KM/day
                              </span>
                              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold">
                                ₹{policies.securityDeposit} Deposit (Refundable)
                              </span>
                            </div>
                          </div>

                          {/* Price & Action */}
                          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                            <div>
                              {quote ? (
                                <div>
                                  <div className="text-base sm:text-lg font-black text-indigo-600">
                                    ₹{quote.totalPayableAtBooking.toLocaleString()}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-400 block -mt-0.5">
                                    Total for {quote.durationHours} hrs ({quote.tierApplied.toUpperCase()})
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  <div className="text-base sm:text-lg font-black text-indigo-600">
                                    ₹{(veh.rentalPricing?.dailyRate || 1500).toLocaleString()}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-400 block -mt-0.5">
                                    per day (24 hrs)
                                  </span>
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRentalVehicle(veh);
                                setIsBookingModalOpen(true);
                              }}
                              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-sm shadow-indigo-600/25 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <span>Rent Now</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 bg-white rounded-3xl border border-slate-100 text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                    {rentalSubCategory === 'bike' ? (
                      <Bike className="w-6 h-6" />
                    ) : (
                      <Car className="w-6 h-6" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-black text-[#0F172A]">
                      No self-drive {rentalSubCategory === 'bike' ? 'bikes' : 'cars'} found
                    </h4>
                    <p className="text-xs font-medium text-slate-400 max-w-sm mx-auto">
                      Try selecting different dates or search without city filtering.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRentalCity('');
                    }}
                    className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 text-xs font-black hover:bg-slate-200 transition-colors"
                  >
                    Clear Location Filter
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

        {/* 9. ApnaTrip Verified Guarantee Banner */}
        <div className="w-full rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black">ApnaTrip Verified Ride & Rental Guarantee</h4>
              <p className="text-xs text-slate-300">
                100% sanitized vehicles, transparent pricing, verified providers, and 24/7 on-road support.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
          >
            Learn More
          </button>
        </div>
      </main>

      {/* Self-Drive Rental Booking Modal */}
      <RentalBookingModal
        vehicle={selectedRentalVehicle}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedRentalVehicle(null);
        }}
        defaultPickupDateTime={rentalPickupDateTime}
        defaultReturnDateTime={rentalReturnDateTime}
        defaultPickupLocation={rentalCity}
      />

      {/* 10. Filter Drawer */}
      <CarFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(f) => setFilters(f)}
      />

      {/* 11. Bottom Navigation Bar */}
      {!isFilterDrawerOpen && (
        <BottomNavigation activeTab="car-rental" />
      )}
    </div>
  );
};

export default CarRentalPage;
