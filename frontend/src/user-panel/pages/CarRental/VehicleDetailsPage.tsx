import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Heart,
  Share2,
  CheckCircle2,
  Star,
  Users,
  Fuel,
  Cog,
  MapPin,
  ShieldCheck,
  Check,
  MinusCircle,
  ChevronRight,
  MessageSquare,
  X,
  Clock,
} from 'lucide-react';
import { Vehicle, VehicleReview, CarRoute } from '../../types/carRental';
import { carRentalService, resolveCarImage } from '../../services/carRental.service';
import { CarBookingModal } from '../../components/carRental/CarBookingModal';

export const VehicleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [reviews, setReviews] = useState<VehicleReview[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<CarRoute | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      const [car, revs] = await Promise.all([
        carRentalService.getVehicleById(id),
        carRentalService.getVehicleReviews(id),
      ]);
      if (!mounted) return;
      if (car && car.id !== id) {
        navigate(`/car-rental/${car.id}`, { replace: true });
      }
      setVehicle(car);
      if (car) {
        const defaultR =
          car.matchedRoute ||
          car.routes?.find((r) => r.status === 'active') ||
          car.routes?.[0] ||
          null;
        setSelectedRoute(defaultR);
      }
      setReviews(revs);
      setIsFavorite(carRentalService.isFavorite(car?.id || id));
      if (car) carRentalService.addToRecentlyViewed(car);
      setIsLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!vehicle) return;
    const now = await carRentalService.toggleFavorite(vehicle.id);
    setIsFavorite(now);
    showToast(now ? '❤️ Saved to favourites' : 'Removed from favourites');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: vehicle?.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied!');
    }
  };

  const handleChat = async () => {
    if (vehicle?.provider?.id) {
      try {
        const res = await carRentalService.initChat(
          vehicle.provider.id,
          vehicle.id,
          `Hi! I'm interested in booking ${vehicle.name}. Is it available?`
        );
        const convId = res.conversationId || res.id;
        if (convId) {
          navigate(`/chat/${convId}`);
          return;
        }
      } catch {
        // fallback to chat list
      }
    }
    navigate('/chat');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
        </header>
        <div className="p-4 space-y-4 max-w-4xl mx-auto w-full">
          <div className="h-64 w-full rounded-3xl bg-slate-100 animate-pulse" />
          <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-4xl">🚗</div>
        <h2 className="text-lg font-black text-[#0F172A]">Vehicle not found</h2>
        <p className="text-sm text-slate-400">This listing may have been removed or is unavailable.</p>
        <button onClick={() => navigate('/car-rental')} className="px-5 py-2.5 rounded-2xl bg-[#FF4D6D] text-white text-sm font-black cursor-pointer">
          Browse Cars
        </button>
      </div>
    );
  }

  const galleryImages = vehicle.images?.length > 0 ? vehicle.images : [vehicle.thumbnail];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] font-sans pb-32 selection:bg-[#FF4D6D]/20">
      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 16 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-black"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-black text-[#0F172A] truncate max-w-[200px]">{vehicle.name}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleFavorite}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
          </button>
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="relative h-60 sm:h-72 w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-xs">
            <img
              src={resolveCarImage(galleryImages[currentImgIdx], vehicle.type)}
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
            {/* Image counter */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
              {currentImgIdx + 1}/{galleryImages.length}
            </div>
            {/* Nav arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImgIdx(i => Math.max(0, i - 1))}
                  disabled={currentImgIdx === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow text-slate-700 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentImgIdx(i => Math.min(galleryImages.length - 1, i + 1))}
                  disabled={currentImgIdx === galleryImages.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow text-slate-700 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImgIdx(idx)}
                  className={`w-14 h-11 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    idx === currentImgIdx ? 'border-[#FF4D6D]' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <img src={resolveCarImage(img, vehicle.type)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title + Provider */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] leading-tight">{vehicle.name}</h1>
                {vehicle.provider.isVerified && <CheckCircle2 className="w-5 h-5 fill-sky-500 text-white shrink-0" />}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                {vehicle.rating > 0 ? (
                  <>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-black text-[#0F172A]">{vehicle.rating}</span>
                    <span className="text-xs text-slate-400 font-medium">({vehicle.reviewsCount} reviews)</span>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">No ratings yet</span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl font-black text-[#FF4D6D]">
                ₹{vehicle.pricing.basePricePerDay.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 font-bold">/day</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">by {vehicle.provider.name}</span>
            {vehicle.provider.isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-extrabold text-[10px]">
                <Check className="w-3 h-3" /> Verified Provider
              </span>
            )}
            <span className="flex items-center gap-1 text-slate-400 text-[11px]">
              <MapPin className="w-3 h-3" />{vehicle.provider.location}
            </span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: 'Seats', value: `${vehicle.specs.seats}`, icon: <Users className="w-4 h-4 text-slate-400 mb-1 mx-auto" /> },
            { label: 'Fuel', value: vehicle.specs.fuel, icon: <Fuel className="w-4 h-4 text-slate-400 mb-1 mx-auto" /> },
            { label: 'Trans.', value: vehicle.specs.transmission, icon: <Cog className="w-4 h-4 text-slate-400 mb-1 mx-auto" /> },
            { label: 'AC', value: vehicle.specs.hasAC ? 'Yes' : 'No', icon: <ShieldCheck className="w-4 h-4 text-slate-400 mb-1 mx-auto" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-white rounded-2xl p-2.5 border border-slate-100 shadow-2xs flex flex-col items-center">
              {icon}
              <span className="text-xs font-black text-[#0F172A] truncate w-full text-center">{value}</span>
              <span className="text-[10px] text-slate-400 font-bold">{label}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        {vehicle.description && (
          <p className="text-sm text-slate-600 leading-relaxed font-medium">{vehicle.description}</p>
        )}

        {/* Features */}
        {vehicle.specs.features?.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-base font-black text-[#0F172A]">Car Features</h2>
            <div className="flex flex-wrap gap-2">
              {vehicle.specs.features.map((f, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-indigo-500" />{f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Driver */}
        {vehicle.driver && vehicle.driver.name !== 'No driver assigned' ? (
          <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100 space-y-3">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">Your Driver</h2>
            <div className="flex items-center gap-3.5">
              {vehicle.driver.photo ? (
                <img
                  src={resolveCarImage(vehicle.driver.photo, 'driver')}
                  alt={vehicle.driver.name}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
                />
              ) : null}
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold text-[#0F172A]">{vehicle.driver.name}</h3>
                  {vehicle.driver.isVerified && <CheckCircle2 className="w-4 h-4 fill-sky-500 text-white" />}
                </div>
                {(vehicle.driver.rating ?? 0) > 0 ? (
                  <p className="text-xs text-amber-600 font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{vehicle.driver.rating}</span>
                    <span className="text-slate-400 font-medium">({vehicle.driver.tripsCount ?? 0} trips)</span>
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 font-medium">No ratings yet</p>
                )}
                {vehicle.driver.experienceYears ? (
                  <p className="text-[11px] text-slate-500 font-medium">
                    {vehicle.driver.experienceYears}+ Years
                    {vehicle.driver.languages?.length ? ` • ${vehicle.driver.languages.join(', ')}` : ''}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100 text-xs font-medium text-slate-500">
            No driver assigned yet. A commercial driver will be allocated upon booking confirmation.
          </div>
        )}

        {/* Inclusions */}
        {vehicle.inclusions && vehicle.inclusions.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-base font-black text-[#0F172A]">Inclusions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {vehicle.inclusions.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exclusions */}
        {vehicle.exclusions && vehicle.exclusions.length > 0 && (
          <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100/60 space-y-2.5">
            <h2 className="text-xs font-black text-rose-900 uppercase tracking-wider">Not Included</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {vehicle.exclusions.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-rose-800 font-semibold">
                  <MinusCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Routes & Fixed Pricing */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#0F172A]">Available Routes &amp; Pricing</h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {vehicle.routes?.filter((r) => r.status !== 'disabled' && r.status !== 'archived').length || 0} Routes Offered
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Each route has a fixed price set directly by the owner. No per-km charges or map fare estimates.
          </p>

          <div className="space-y-2.5">
            {vehicle.routes && vehicle.routes.filter((r) => r.status !== 'disabled' && r.status !== 'archived').length > 0 ? (
              vehicle.routes
                .filter((r) => r.status !== 'disabled' && r.status !== 'archived')
                .map((route, idx) => {
                  const isSelected =
                    (selectedRoute?._id && selectedRoute._id === route._id) ||
                    (selectedRoute?.pickup === route.pickup &&
                      selectedRoute?.destination === route.destination);
                  const oneWayPrice = route.pricing?.oneWayPrice ?? route.price ?? 0;
                  const roundTripPrice = route.pricing?.roundTripPrice;
                  const distance = route.distanceKm || route.distance;
                  const duration = route.estimatedDuration || route.duration;
                  return (
                    <div
                      key={route._id || route.id || idx}
                      onClick={() => setSelectedRoute(route)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-600/30'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-[#0F172A]">{route.pickup}</span>
                          <span className="text-slate-400">→</span>
                          <span className="text-sm font-black text-[#0F172A]">{route.destination}</span>
                          {route.routeName && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#583BE8] text-[10px] font-extrabold border border-purple-200">
                              {route.routeName}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium flex-wrap">
                          {distance ? <span>{distance} km</span> : null}
                          {duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {duration}
                            </span>
                          )}
                          {route.pricing?.tollIncluded !== false && (
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                              Tolls Included
                            </span>
                          )}
                          {route.notes && (
                            <span className="text-slate-400 italic">
                              • {route.notes}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="text-right">
                          <div className="flex items-baseline justify-end gap-1.5">
                            <span className="text-base font-black text-emerald-600">
                              ₹{oneWayPrice.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">One Way</span>
                          </div>
                          {roundTripPrice && (
                            <span className="text-[10px] font-bold text-[#583BE8] block">
                              RT: ₹{roundTripPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoute(route);
                            setIsBookingOpen(true);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          Book Route
                        </button>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 text-center text-xs text-slate-500 font-medium">
                No active routes currently available for this vehicle. Please contact the agency.
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#0F172A]">Reviews</h2>
            <span className="text-xs text-slate-400 font-semibold">{vehicle.reviewsCount} total</span>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-3xl p-5 border border-slate-100 text-center">
              <p className="text-xs text-slate-400 font-semibold">No reviews yet. Be the first to book!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map(rev => (
                <div key={rev.id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    {rev.userAvatar ? (
                      <img src={rev.userAvatar} alt={rev.userName} className="w-9 h-9 rounded-full object-cover border border-slate-100" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-sm">
                        {rev.userName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-[#0F172A]">{rev.userName}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 fill-sky-500 text-white" />
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{rev.rating}</span>
                        {rev.date && <span className="text-slate-400 font-medium ml-1">• {rev.date}</span>}
                      </div>
                    </div>
                  </div>
                  {rev.comment && (
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{rev.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cancellation Policy */}
        {vehicle.cancellationPolicy && (
          <div className="space-y-2.5">
            <h2 className="text-base font-black text-[#0F172A]">Cancellation Policy</h2>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">{vehicle.cancellationPolicy}</p>
            </div>
          </div>
        )}

        {/* Chat with Provider */}
        <button
          type="button"
          onClick={handleChat}
          className="w-full py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-[#0F172A] text-sm font-black flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          Chat with Provider
        </button>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div>
          <div className="text-xl font-black text-[#FF4D6D]">
            ₹{(
              (selectedRoute?.pricing?.oneWayPrice ?? selectedRoute?.price) ||
              vehicle.routePrice ||
              vehicle.pricing.fixedPrice ||
              vehicle.pricing.basePricePerDay ||
              0
            ).toLocaleString()}
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            {selectedRoute ? `${selectedRoute.pickup} → ${selectedRoute.destination}` : 'Select a Route'}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsBookingOpen(true)}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black text-sm shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
        >
          Proceed to Book
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Booking Modal */}
      <CarBookingModal
        vehicle={vehicle}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        defaultPickup={selectedRoute?.pickup}
        defaultDrop={selectedRoute?.destination}
        defaultRouteId={selectedRoute?._id || selectedRoute?.id}
        defaultRoutePrice={selectedRoute?.pricing?.oneWayPrice ?? selectedRoute?.price}
      />
    </div>
  );
};

export default VehicleDetailsPage;
