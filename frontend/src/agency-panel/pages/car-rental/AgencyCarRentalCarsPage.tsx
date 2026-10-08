import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Plus,
  Search,
  Trash2,
  Edit2,
  CheckCircle2,
  Star,
  Users,
  Fuel,
  ShieldCheck,
  X,
  Eye,
  Calendar,
  Award,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  Power,
  Check,
  Copy,
} from 'lucide-react';
import { agencyCarRentalService } from '../../services/agencyCarRental.service';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { VehicleDetailsDrawer } from '../../components/car-rental/VehicleDetailsDrawer';
import { VehiclePhotoUploadGrid } from '../../components/car-rental/VehiclePhotoUploadGrid';
import { ComplianceDocumentUpload } from '../../components/car-rental/ComplianceDocumentUpload';
import { useToast } from '../../../user-panel/context/ToastContext';

export const AgencyCarRentalCarsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [cars, setCars] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<'all' | 'ROUTE_BOOKING' | 'SELF_DRIVE_RENTAL'>('all');
  const [selectedCarForDrawer, setSelectedCarForDrawer] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Route Pricing Modal State (Per-Route Workspace)
  const [managingRoutesCar, setManagingRoutesCar] = useState<any | null>(null);
  const [carRoutes, setCarRoutes] = useState<any[]>([]);
  const [isRoutesLoading, setIsRoutesLoading] = useState(false);
  const [isRouteFormOpen, setIsRouteFormOpen] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [previewRoute, setPreviewRoute] = useState<any | null>(null);
  const [routeForm, setRouteForm] = useState({
    pickup: '',
    destination: '',
    routeName: '',
    distanceKm: 50,
    estimatedDuration: '1 hr 15 mins',
    oneWayPrice: 1800,
    roundTripPrice: 3400,
    extraKmCharge: 14,
    waitingChargePerHour: 150,
    nightCharge: 300,
    driverAllowancePerDay: 400,
    maxDistanceKm: 600,
    advanceBookingHours: 2,
    tollIncluded: true,
    parkingIncluded: false,
    stateTaxIncluded: true,
    bookingEnabled: true,
    status: 'active' as 'active' | 'disabled',
    notes: '',
  });
  const [isSavingRoute, setIsSavingRoute] = useState(false);

  // New/Edit vehicle form state (Strictly Separated Models)
  const [carForm, setCarForm] = useState({
    name: '',
    brand: '',
    type: 'suv',
    category: 'outstation',
    serviceType: 'ROUTE_BOOKING' as 'ROUTE_BOOKING' | 'SELF_DRIVE_RENTAL',
    vehicleSubCategory: 'car' as 'car' | 'bike',
    city: 'Mumbai',
    seats: 5,
    luggageBags: 2,
    fuel: 'Diesel',
    transmission: 'Manual',
    hasAC: true,
    driverIncluded: true,
    engineCC: 150,

    // Route Booking Exclusive Fields (Phase 3)
    oneWayPrice: 2800,
    roundTripPrice: 5200,
    routeExtraKmCharge: 14,
    waitingChargePerHour: 150,
    nightCharge: 300,
    driverAllowancePerDay: 400,
    tollIncluded: true,
    parkingIncluded: false,
    stateTaxIncluded: true,
    maxDistanceKm: 600,
    minBookingHours: 4,
    advanceBookingHours: 2,

    // Self-Drive Rental Exclusive Fields (Phase 4)
    pickupLocation: '',
    rentalHourlyRate: 200,
    rentalDailyRate: 2500,
    rentalWeeklyRate: 15000,
    rentalMonthlyRate: 45000,
    securityDeposit: 3000,
    includedKmPerDay: 300,
    rentalExtraKmCharge: 12,
    lateReturnChargePerHour: 200,
    fuelPolicy: 'same_to_same',
    minRentalDurationHours: 4,
    maxRentalDurationDays: 90,
    pickupTime: '09:00',
    returnTime: '21:00',
    minAgeRequirement: 21,
    drivingLicenseRequirement: 'Valid Driving License (Min 1 year)',
    helmetIncluded: true,
    insuranceCoverIncluded: true,
    roadsideAssistanceIncluded: true,

    // Compliance & Details
    registrationNumber: '',
    rcNumber: '',
    rcDocument: '',
    insurancePolicyNumber: '',
    insuranceExpiryDate: '',
    permitType: 'All India Tourist Permit (AITP)',
    permitDocument: '',
    pollutionCertificateNumber: '',
    pollutionExpiryDate: '',
    description: '',
    thumbnail: '',
    images: [] as string[],
    features: ['Air Conditioning', 'Power Steering', 'GPS Navigation'],
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
  });

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      const data = await agencyCarRentalService.getCars();
      setCars(data);
    } catch (err: any) {
      console.error('Failed to load cars:', err);
      showToast(err.message || 'Failed to load fleet', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleToggleAvailability = async (carId: string, current: boolean) => {
    try {
      await agencyCarRentalService.updateCar(carId, { isAvailable: !current });
      setCars(cars.map((c) => (c._id === carId ? { ...c, isAvailable: !current } : c)));
      showToast(`Vehicle ${!current ? 'marked Available' : 'marked Unavailable'}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update vehicle', 'error');
    }
  };

  const handleDeleteCar = async (carId: string) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from your active fleet?')) return;
    try {
      await agencyCarRentalService.deleteCar(carId);
      setCars(cars.filter((c) => c._id !== carId));
      showToast('Vehicle removed from fleet successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete vehicle', 'error');
    }
  };

  const openRoutesModal = async (car: any) => {
    setManagingRoutesCar(car);
    setIsRouteFormOpen(false);
    setEditingRouteId(null);
    setPreviewRoute(null);
    setIsRoutesLoading(true);
    try {
      const routes = await agencyCarRentalService.getVehicleRoutes(car._id);
      setCarRoutes(routes);
    } catch (err: any) {
      console.error('Failed to load routes:', err);
      setCarRoutes(car.routes || []);
    } finally {
      setIsRoutesLoading(false);
    }
  };

  const handleOpenAddRoute = () => {
    setEditingRouteId(null);
    setPreviewRoute(null);
    setRouteForm({
      pickup: '',
      destination: '',
      routeName: '',
      distanceKm: 50,
      estimatedDuration: '1 hr 15 mins',
      oneWayPrice: 1800,
      roundTripPrice: 3400,
      extraKmCharge: 14,
      waitingChargePerHour: 150,
      nightCharge: 300,
      driverAllowancePerDay: 400,
      maxDistanceKm: 600,
      advanceBookingHours: 2,
      tollIncluded: true,
      parkingIncluded: false,
      stateTaxIncluded: true,
      bookingEnabled: true,
      status: 'active',
      notes: '',
    });
    setIsRouteFormOpen(true);
  };

  const handleOpenEditRoute = (route: any) => {
    setEditingRouteId(route._id);
    setPreviewRoute(null);
    setRouteForm({
      pickup: route.pickup || route.fromLocation || '',
      destination: route.destination || route.toLocation || '',
      routeName: route.routeName || '',
      distanceKm: Number(route.distanceKm || route.distance) || 50,
      estimatedDuration: route.estimatedDuration || route.duration || '',
      oneWayPrice: Number(route.pricing?.oneWayPrice ?? route.price) || 1800,
      roundTripPrice: route.pricing?.roundTripPrice ? Number(route.pricing.roundTripPrice) : 0,
      extraKmCharge: route.pricing?.extraKmCharge !== undefined ? Number(route.pricing.extraKmCharge) : 14,
      waitingChargePerHour: route.pricing?.waitingChargePerHour !== undefined ? Number(route.pricing.waitingChargePerHour) : 150,
      nightCharge: route.pricing?.nightCharge !== undefined ? Number(route.pricing.nightCharge) : 300,
      driverAllowancePerDay: route.pricing?.driverAllowancePerDay !== undefined ? Number(route.pricing.driverAllowancePerDay) : 400,
      maxDistanceKm: route.rules?.maxDistanceKm !== undefined ? Number(route.rules.maxDistanceKm) : 600,
      advanceBookingHours: route.rules?.advanceBookingHours !== undefined ? Number(route.rules.advanceBookingHours) : 2,
      tollIncluded: route.pricing?.tollIncluded ?? true,
      parkingIncluded: route.pricing?.parkingIncluded ?? false,
      stateTaxIncluded: route.pricing?.stateTaxIncluded ?? true,
      bookingEnabled: route.rules?.bookingEnabled ?? true,
      status: route.status || 'active',
      notes: route.notes || '',
    });
    setIsRouteFormOpen(true);
  };

  const handleDuplicateRoute = async (routeId: string) => {
    if (!managingRoutesCar) return;
    try {
      setIsRoutesLoading(true);
      await agencyCarRentalService.duplicateVehicleRoute(managingRoutesCar._id, routeId);
      const updatedRoutes = await agencyCarRentalService.getVehicleRoutes(managingRoutesCar._id);
      setCarRoutes(updatedRoutes);
      setCars((prev) =>
        prev.map((c) =>
          c._id === managingRoutesCar._id ? { ...c, routes: updatedRoutes } : c
        )
      );
      showToast('Route duplicated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to duplicate route', 'error');
    } finally {
      setIsRoutesLoading(false);
    }
  };

  const handleSaveRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingRoutesCar) return;

    const fromLoc = routeForm.pickup.trim();
    const toLoc = routeForm.destination.trim();

    if (!fromLoc || !toLoc) {
      showToast('Please enter pickup and destination locations', 'error');
      return;
    }

    if (fromLoc.toLowerCase() === toLoc.toLowerCase()) {
      showToast('Pickup and destination locations cannot be identical', 'error');
      return;
    }

    if (!routeForm.oneWayPrice || Number(routeForm.oneWayPrice) <= 0) {
      showToast('Please enter a valid One Way Fare greater than 0', 'error');
      return;
    }

    // Client-side duplicate check (Phase 11)
    const duplicate = carRoutes.some(
      (r) =>
        r._id !== editingRouteId &&
        r.status !== 'archived' &&
        (r.pickup || r.fromLocation || '').trim().toLowerCase() === fromLoc.toLowerCase() &&
        (r.destination || r.toLocation || '').trim().toLowerCase() === toLoc.toLowerCase()
    );
    if (duplicate) {
      showToast(`A route from "${fromLoc}" to "${toLoc}" already exists for this vehicle.`, 'error');
      return;
    }

    const payload = {
      pickup: fromLoc,
      destination: toLoc,
      fromLocation: fromLoc,
      toLocation: toLoc,
      routeName: routeForm.routeName.trim(),
      distanceKm: Number(routeForm.distanceKm) || 0,
      estimatedDuration: routeForm.estimatedDuration.trim() || undefined,
      duration: routeForm.estimatedDuration.trim() || undefined,
      price: Number(routeForm.oneWayPrice),
      pricing: {
        oneWayPrice: Number(routeForm.oneWayPrice),
        roundTripPrice: Number(routeForm.roundTripPrice) > 0 ? Number(routeForm.roundTripPrice) : undefined,
        extraKmCharge: Number(routeForm.extraKmCharge) || 14,
        waitingChargePerHour: Number(routeForm.waitingChargePerHour) || 150,
        nightCharge: Number(routeForm.nightCharge) || 300,
        driverAllowancePerDay: Number(routeForm.driverAllowancePerDay) || 400,
        tollIncluded: Boolean(routeForm.tollIncluded),
        parkingIncluded: Boolean(routeForm.parkingIncluded),
        stateTaxIncluded: Boolean(routeForm.stateTaxIncluded),
      },
      rules: {
        maxDistanceKm: Number(routeForm.maxDistanceKm) || 600,
        advanceBookingHours: Number(routeForm.advanceBookingHours) || 2,
        bookingEnabled: Boolean(routeForm.bookingEnabled),
      },
      status: routeForm.status,
      notes: routeForm.notes.trim() || undefined,
    };

    try {
      setIsSavingRoute(true);
      if (editingRouteId) {
        await agencyCarRentalService.updateVehicleRoute(
          managingRoutesCar._id,
          editingRouteId,
          payload
        );
        showToast('Route updated successfully', 'success');
      } else {
        await agencyCarRentalService.addVehicleRoute(managingRoutesCar._id, payload);
        showToast('Route added successfully', 'success');
      }

      // Refresh routes list
      const updatedRoutes = await agencyCarRentalService.getVehicleRoutes(managingRoutesCar._id);
      setCarRoutes(updatedRoutes);
      setCars((prev) =>
        prev.map((c) =>
          c._id === managingRoutesCar._id ? { ...c, routes: updatedRoutes } : c
        )
      );
      setIsRouteFormOpen(false);
      setEditingRouteId(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to save route', 'error');
    } finally {
      setIsSavingRoute(false);
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    if (!managingRoutesCar) return;
    if (!window.confirm('Are you sure you want to delete this route?')) return;

    try {
      await agencyCarRentalService.deleteVehicleRoute(managingRoutesCar._id, routeId);
      const updatedRoutes = carRoutes.filter((r) => r._id !== routeId);
      setCarRoutes(updatedRoutes);
      setCars((prev) =>
        prev.map((c) =>
          c._id === managingRoutesCar._id ? { ...c, routes: updatedRoutes } : c
        )
      );
      showToast('Route deleted successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete route', 'error');
    }
  };

  const handleToggleRoute = async (routeId: string) => {
    if (!managingRoutesCar) return;
    try {
      const res = await agencyCarRentalService.toggleVehicleRouteStatus(
        managingRoutesCar._id,
        routeId
      );
      const updatedRoutes = carRoutes.map((r) =>
        r._id === routeId ? { ...r, status: res.status } : r
      );
      setCarRoutes(updatedRoutes);
      setCars((prev) =>
        prev.map((c) =>
          c._id === managingRoutesCar._id ? { ...c, routes: updatedRoutes } : c
        )
      );
      showToast(`Route ${res.status === 'active' ? 'enabled' : 'disabled'}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle route status', 'error');
    }
  };

  const openAddModal = () => {
    setEditingCarId(null);
    setCarForm({
      name: '',
      brand: '',
      type: 'suv',
      category: 'outstation',
      serviceType: 'ROUTE_BOOKING',
      vehicleSubCategory: 'car',
      city: 'Mumbai',
      seats: 5,
      luggageBags: 2,
      fuel: 'Diesel',
      transmission: 'Manual',
      hasAC: true,
      driverIncluded: true,
      engineCC: 150,

      // Route Booking Defaults
      oneWayPrice: 2800,
      roundTripPrice: 5200,
      routeExtraKmCharge: 14,
      waitingChargePerHour: 150,
      nightCharge: 300,
      driverAllowancePerDay: 400,
      tollIncluded: true,
      parkingIncluded: false,
      stateTaxIncluded: true,
      maxDistanceKm: 600,
      minBookingHours: 4,
      advanceBookingHours: 2,

      // Self-Drive Rental Defaults
      pickupLocation: '',
      rentalHourlyRate: 200,
      rentalDailyRate: 2500,
      rentalWeeklyRate: 15000,
      rentalMonthlyRate: 45000,
      securityDeposit: 3000,
      includedKmPerDay: 300,
      rentalExtraKmCharge: 12,
      lateReturnChargePerHour: 200,
      fuelPolicy: 'same_to_same',
      minRentalDurationHours: 4,
      maxRentalDurationDays: 90,
      pickupTime: '09:00',
      returnTime: '21:00',
      minAgeRequirement: 21,
      drivingLicenseRequirement: 'Valid Driving License (Min 1 year)',
      helmetIncluded: true,
      insuranceCoverIncluded: true,
      roadsideAssistanceIncluded: true,

      // Compliance
      registrationNumber: '',
      rcNumber: '',
      rcDocument: '',
      insurancePolicyNumber: '',
      insuranceExpiryDate: '',
      permitType: 'All India Tourist Permit (AITP)',
      permitDocument: '',
      pollutionCertificateNumber: '',
      pollutionExpiryDate: '',
      description: '',
      thumbnail: '',
      images: [],
      features: ['Air Conditioning', 'Power Steering', 'GPS Navigation'],
      ownerName: '',
      ownerPhone: '',
      ownerEmail: '',
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (car: any) => {
    setEditingCarId(car._id);
    const isSelfDrive = car.serviceType === 'SELF_DRIVE_RENTAL' || car.serviceType === 'self_drive_car' || car.serviceType === 'self_drive_bike';
    setCarForm({
      name: car.name || '',
      brand: car.brand || '',
      type: car.type || 'suv',
      category: car.category || 'outstation',
      serviceType: isSelfDrive ? 'SELF_DRIVE_RENTAL' : 'ROUTE_BOOKING',
      vehicleSubCategory: car.vehicleSubCategory || (car.serviceType === 'self_drive_bike' ? 'bike' : 'car'),
      city: car.city || 'Mumbai',
      seats: car.specs?.seats || (isSelfDrive && car.vehicleSubCategory === 'bike' ? 2 : 5),
      luggageBags: car.specs?.luggageBags || (isSelfDrive && car.vehicleSubCategory === 'bike' ? 1 : 2),
      fuel: car.specs?.fuel || 'Diesel',
      transmission: car.specs?.transmission || 'Automatic',
      hasAC: isSelfDrive && car.vehicleSubCategory === 'bike' ? false : (car.specs?.hasAC !== false),
      driverIncluded: !isSelfDrive,
      engineCC: car.specs?.engineCC || 150,

      // Route Pricing (only loaded if Route Booking)
      oneWayPrice: car.routePricing?.oneWayPrice || car.dailyPrice || 2800,
      roundTripPrice: car.routePricing?.roundTripPrice || 0,
      routeExtraKmCharge: car.routePricing?.extraKmCharge || 14,
      waitingChargePerHour: car.routePricing?.waitingChargePerHour || 150,
      nightCharge: car.routePricing?.nightCharge || 300,
      driverAllowancePerDay: car.routePricing?.driverAllowancePerDay || 400,
      tollIncluded: car.routePricing?.tollIncluded !== false,
      parkingIncluded: Boolean(car.routePricing?.parkingIncluded),
      stateTaxIncluded: car.routePricing?.stateTaxIncluded !== false,
      maxDistanceKm: car.routePricing?.maxDistanceKm || 600,
      minBookingHours: car.routePricing?.minBookingHours || 4,
      advanceBookingHours: car.routePricing?.advanceBookingHours || 2,

      // Self-Drive Rental Pricing & Policies (only loaded if Self-Drive)
      pickupLocation: car.pickupLocation || car.city || '',
      rentalHourlyRate: car.rentalPricing?.hourlyRate || 200,
      rentalDailyRate: car.rentalPricing?.dailyRate || car.dailyPrice || 2500,
      rentalWeeklyRate: car.rentalPricing?.weeklyRate || 15000,
      rentalMonthlyRate: car.rentalPricing?.monthlyRate || 45000,
      securityDeposit: car.rentalPolicies?.securityDeposit ?? car.fixedDepositAmount ?? 3000,
      includedKmPerDay: car.rentalPolicies?.includedKmPerDay ?? 300,
      rentalExtraKmCharge: car.rentalPolicies?.extraKmCharge ?? 12,
      lateReturnChargePerHour: car.rentalPolicies?.lateReturnChargePerHour || 200,
      fuelPolicy: car.rentalPolicies?.fuelPolicy || 'same_to_same',
      minRentalDurationHours: car.rentalPolicies?.minRentalDurationHours ?? 4,
      maxRentalDurationDays: car.rentalPolicies?.maxRentalDurationDays ?? 90,
      pickupTime: '09:00',
      returnTime: '21:00',
      minAgeRequirement: 21,
      drivingLicenseRequirement: 'Valid Driving License (Min 1 year)',
      helmetIncluded: true,
      insuranceCoverIncluded: true,
      roadsideAssistanceIncluded: true,

      // Compliance
      registrationNumber: car.registrationNumber || 'MH 02 CZ 8920',
      rcNumber: car.rcNumber || 'IN-RC-2023-991204',
      rcDocument: car.rcDocument || '',
      insurancePolicyNumber: car.insurancePolicyNumber || 'POL-ICICI-COMM-89104',
      insuranceExpiryDate: car.insuranceExpiryDate ? new Date(car.insuranceExpiryDate).toISOString().split('T')[0] : '2026-12-18',
      permitType: car.permitType || 'All India Tourist Permit (AITP)',
      permitDocument: car.permitDocument || '',
      pollutionCertificateNumber: car.pollutionCertificateNumber || 'PUCC-MH-2024-5821',
      pollutionExpiryDate: car.pollutionExpiryDate ? new Date(car.pollutionExpiryDate).toISOString().split('T')[0] : '2026-10-14',
      description: car.description || '',
      thumbnail: car.thumbnail || '',
      images: car.images && car.images.length > 0 ? car.images : [car.thumbnail || ''],
      features: car.features || ['Air Conditioning', 'GPS Navigation', 'Fastag Enabled'],
      ownerName: car.owner?.name || 'Mahindra Fleet Logistics',
      ownerPhone: car.owner?.phone || '+91 98201 44510',
      ownerEmail: car.owner?.email || 'fleet@ownerpartner.com',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carForm.brand.trim() || !carForm.name.trim()) {
      showToast('Please enter vehicle brand and model name', 'error');
      return;
    }

    const isRoute = carForm.serviceType === 'ROUTE_BOOKING';
    const isSelfDrive = carForm.serviceType === 'SELF_DRIVE_RENTAL';
    const isBike = isSelfDrive && carForm.vehicleSubCategory === 'bike';

    // Model specific validation (Phases 2 & 4)
    if (isSelfDrive) {
      if (!carForm.rentalDailyRate || Number(carForm.rentalDailyRate) <= 0) {
        showToast('Please enter a valid Daily Tariff for Self-Drive Rental', 'error');
        return;
      }
      if (!carForm.pickupLocation.trim()) {
        showToast('Please enter a Pickup Location / Hub for Self-Drive Rental', 'error');
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const payload: any = {
        name: carForm.name.trim(),
        brand: carForm.brand.trim(),
        type: carForm.type,
        category: carForm.category,
        serviceType: carForm.serviceType,
        vehicleSubCategory: isBike ? 'bike' : 'car',
        city: carForm.city || 'Mumbai',
        specs: {
          seats: isBike ? 2 : Number(carForm.seats || 5),
          doors: isBike ? 0 : 4,
          luggageBags: isBike ? 1 : Number(carForm.luggageBags || 2),
          fuel: carForm.fuel,
          transmission: carForm.transmission,
          hasAC: isBike ? false : carForm.hasAC,
          driverIncluded: isRoute,
          engineCC: isBike ? Number(carForm.engineCC || 150) : undefined,
        },
        registrationNumber: carForm.registrationNumber,
        rcNumber: carForm.rcNumber,
        rcDocument: carForm.rcDocument,
        insurancePolicyNumber: carForm.insurancePolicyNumber,
        insuranceExpiryDate: carForm.insuranceExpiryDate ? new Date(carForm.insuranceExpiryDate) : new Date('2027-01-01'),
        permitType: carForm.permitType,
        permitDocument: carForm.permitDocument,
        pollutionCertificateNumber: carForm.pollutionCertificateNumber,
        pollutionExpiryDate: carForm.pollutionExpiryDate ? new Date(carForm.pollutionExpiryDate) : new Date('2027-01-01'),
        owner: {
          name: carForm.ownerName,
          phone: carForm.ownerPhone,
          email: carForm.ownerEmail,
        },
        description: carForm.description,
        thumbnail: carForm.thumbnail || (isBike ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800' : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop'),
        images: carForm.images.length > 0 ? carForm.images : [carForm.thumbnail],
        features: carForm.features,
      };

      if (isRoute) {
        // Route Booking: Fares are configured per-route under Manage Routes
        payload.driver = {
          name: 'Professional Chauffeur',
          experienceYears: 5,
          rating: 4.9,
          tripsCount: 45,
          languages: ['Hindi', 'English'],
          isVerified: true,
        };
      } else {
        // PHASE 4: Strictly include ONLY Self-Drive Rental pricing
        payload.pickupLocation = carForm.pickupLocation.trim();
        payload.dailyPrice = Number(carForm.rentalDailyRate);
        payload.fixedDepositAmount = Number(carForm.securityDeposit);
        payload.rentalPricing = {
          hourlyRate: carForm.rentalHourlyRate ? Number(carForm.rentalHourlyRate) : undefined,
          dailyRate: Number(carForm.rentalDailyRate),
          weeklyRate: carForm.rentalWeeklyRate ? Number(carForm.rentalWeeklyRate) : undefined,
          monthlyRate: carForm.rentalMonthlyRate ? Number(carForm.rentalMonthlyRate) : undefined,
        };
        payload.rentalPolicies = {
          securityDeposit: Number(carForm.securityDeposit),
          includedKmPerDay: Number(carForm.includedKmPerDay),
          extraKmCharge: Number(carForm.rentalExtraKmCharge || 12),
          fuelPolicy: carForm.fuelPolicy,
          minRentalDurationHours: Number(carForm.minRentalDurationHours),
          maxRentalDurationDays: Number(carForm.maxRentalDurationDays),
        };
      }

      if (editingCarId) {
        const updated = await agencyCarRentalService.updateCar(editingCarId, payload);
        setCars(cars.map((c) => (c._id === editingCarId ? updated : c)));
        showToast('Vehicle updated successfully', 'success');
      } else {
        const created = await agencyCarRentalService.createCar(payload);
        setCars([created, ...cars]);
        showToast('Vehicle registered and published to fleet successfully!', 'success');
      }

      setIsAddModalOpen(false);
      setEditingCarId(null);
    } catch (err: any) {
      console.error('Failed to save vehicle:', err);
      showToast(err.message || 'Failed to save vehicle', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCars = cars.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || c.type?.toLowerCase() === selectedCategory.toLowerCase();

    const isSelfDriveCar =
      c.serviceType === 'SELF_DRIVE_RENTAL' ||
      c.serviceType === 'self_drive_car' ||
      c.serviceType === 'self_drive_bike';

    const matchesService =
      selectedServiceFilter === 'all' ||
      (selectedServiceFilter === 'ROUTE_BOOKING' && !isSelfDriveCar) ||
      (selectedServiceFilter === 'SELF_DRIVE_RENTAL' && isSelfDriveCar);

    return matchesSearch && matchesCategory && matchesService;
  });

  return (
    <div className="flex h-screen bg-[#F8F9FC] overflow-hidden font-sans select-none">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🚙</span>
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  Fleet & Vehicles Directory
                </h1>
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Manage your driver bookings, self-drive rental cars, bikes, tariffs, and permits.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-black transition-all shadow-md shadow-[#583BE8]/25 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>

          {/* Service Section Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            {[
              { id: 'all', label: 'All Fleet', icon: '🚙' },
              { id: 'ROUTE_BOOKING', label: 'Route Booking (Chauffeur)', icon: '👨‍✈️' },
              { id: 'SELF_DRIVE_RENTAL', label: 'Self-Drive Rentals', icon: '🔑' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedServiceFilter(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  selectedServiceFilter === tab.id
                    ? 'bg-[#583BE8] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by vehicle model, brand, plate number, or city..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] transition-colors shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {['all', 'suv', 'sedan', 'luxury', 'tempo_traveller', 'mini_bus'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold capitalize transition-all cursor-pointer shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-[#583BE8] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'all' ? 'All Types' : cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Fleet Grid */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-[#583BE8]/20 border-t-[#583BE8] animate-spin" />
              <span className="text-xs font-bold text-slate-400">Loading fleet inventory...</span>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-[#0F172A]">No vehicles found</h3>
              <p className="text-xs font-medium text-slate-400 max-w-sm mx-auto">
                Add your commercial fleet vehicles to start accepting bookings from verified travelers.
              </p>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#583BE8] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Vehicle</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCars.map((car) => {
                const totalTrips = car.totalTrips ?? 34;
                const rating = car.averageRating ?? 4.8;
                const permit = car.permitType ?? 'Commercial Permit • All India';

                return (
                  <motion.div
                    key={car._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative h-44 bg-slate-100 overflow-hidden">
                        {car.thumbnail || car.images?.[0] ? (
                          <img
                            src={car.thumbnail || car.images[0]}
                            alt={car.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                            🚗 No Image
                          </div>
                        )}

                        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap max-w-[80%]">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
                            {car.type}
                          </span>
                          {car.serviceType === 'SELF_DRIVE_RENTAL' || car.serviceType === 'self_drive_car' || car.serviceType === 'self_drive_bike' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black">
                              {car.vehicleSubCategory === 'bike' ? 'Self-Drive Bike' : 'Self-Drive Rental'}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-purple-600/90 text-white text-[9px] font-black">
                              Route Booking
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full bg-slate-800/90 text-white text-[9px] font-black">
                            {car.registrationNumber || 'MH 02 CZ 8920'}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(car._id, car.isAvailable)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black border transition-colors cursor-pointer ${
                              car.isAvailable
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {car.isAvailable ? 'Available' : 'Booked'}
                          </button>
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-4 space-y-3">
                        {/* Title: e.g. Toyota Innova Crysta */}
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                            {car.brand}
                          </span>
                          <h3 className="text-base font-black text-[#0F172A] truncate">
                            {car.brand} {car.name}
                          </h3>
                        </div>

                        {/* Specs: 7 Seats • Automatic • Diesel */}
                        <div className="text-xs font-bold text-slate-600 flex items-center gap-2">
                          <span>{car.specs?.seats || 7} Seats</span>
                          <span className="text-slate-300">•</span>
                          <span>{car.specs?.transmission || 'Automatic'}</span>
                          <span className="text-slate-300">•</span>
                          <span>{car.specs?.fuel || 'Diesel'}</span>
                          {car.specs?.engineCC && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-amber-600 font-black">{car.specs.engineCC}cc</span>
                            </>
                          )}
                        </div>

                        {/* Permit / Pickup Location */}
                        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-xs">
                          {car.serviceType === 'SELF_DRIVE_RENTAL' || car.serviceType === 'self_drive_car' || car.serviceType === 'self_drive_bike' ? (
                            <>
                              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="font-bold text-[#0F172A] truncate">Pickup: {car.pickupLocation || car.city || 'Hub Location'}</span>
                            </>
                          ) : (
                            <>
                              <Award className="w-3.5 h-3.5 text-[#583BE8] shrink-0" />
                              <span className="font-bold text-[#0F172A] truncate">{permit}</span>
                            </>
                          )}
                        </div>

                        {/* Price & Telemetry Row */}
                        <div className="flex items-baseline justify-between pt-1">
                          <div>
                            {car.serviceType === 'SELF_DRIVE_RENTAL' || car.serviceType === 'self_drive_car' || car.serviceType === 'self_drive_bike' ? (
                              <>
                                <span className="text-[10px] font-bold text-slate-400 block">
                                  Deposit: ₹{(car.rentalPolicies?.securityDeposit ?? car.fixedDepositAmount ?? 3000).toLocaleString()}
                                </span>
                                <p className="text-lg font-black text-[#0F172A]">
                                  ₹{(car.rentalPricing?.dailyRate || car.dailyPrice || 2500).toLocaleString()}
                                  <span className="text-[11px] font-bold text-slate-400"> /day</span>
                                </p>
                              </>
                            ) : (
                              <>
                                <span className="text-[10px] font-bold text-slate-400 block">Routes Pricing</span>
                                {car.routes && car.routes.length > 0 ? (
                                  <p className="text-lg font-black text-[#0F172A]">
                                    from ₹{Math.min(...car.routes.map((r: any) => Number(r.pricing?.oneWayPrice ?? r.price) || 1800)).toLocaleString()}
                                    <span className="text-[11px] font-bold text-slate-400"> /trip</span>
                                  </p>
                                ) : (
                                  <p className="text-xs font-black text-[#583BE8] bg-purple-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                                    Configure in Routes
                                  </p>
                                )}
                              </>
                            )}
                          </div>

                          {/* 34 Trips • 4.8 Rating */}
                          <div className="text-right">
                            <div className="flex items-center justify-end gap-1 text-xs font-black text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-amber-500" />
                              <span>{rating} Rating</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                              {totalTrips} Trips Completed
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Model-Specific Quick Action Bar */}
                    {car.serviceType === 'SELF_DRIVE_RENTAL' || car.serviceType === 'self_drive_car' || car.serviceType === 'self_drive_bike' ? (
                      <div className="px-4 py-2 bg-emerald-50/70 border-t border-emerald-100 flex items-center justify-between text-xs font-black text-emerald-950">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate max-w-[200px]">{car.pickupLocation || car.city || 'Hub Station'}</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md font-bold uppercase">
                          {car.rentalPolicies?.fuelPolicy?.replace(/_/g, ' ') || 'Same to Same'}
                        </span>
                      </div>
                    ) : (
                      <div className="px-4 py-2 bg-indigo-50/70 border-t border-indigo-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950">
                          <MapPin className="w-3.5 h-3.5 text-[#583BE8]" />
                          <span>{car.routes?.length || 0} Fixed Routes</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => openRoutesModal(car)}
                          className="px-2.5 py-1 rounded-xl bg-white border border-indigo-200 text-[#583BE8] hover:bg-indigo-50 text-[11px] font-black cursor-pointer shadow-2xs transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Manage Routes</span>
                        </button>
                      </div>
                    )}

                    {/* Actions Footer: [View] [Edit] [Bookings] */}
                    <div className="p-3 bg-slate-50/80 border-t border-slate-100 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCarForDrawer(car)}
                        className="py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-black text-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditModal(car)}
                        className="py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-black text-[#583BE8] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/agency/car-rental/bookings?carId=${car._id}`)}
                        className="py-2 rounded-xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-black transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Bookings</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Slide-over Vehicle Details Drawer */}
          <VehicleDetailsDrawer
            isOpen={!!selectedCarForDrawer}
            car={selectedCarForDrawer}
            onClose={() => setSelectedCarForDrawer(null)}
            onEdit={(c) => {
              setSelectedCarForDrawer(null);
              openEditModal(c);
            }}
            onViewBookings={(c) => {
              setSelectedCarForDrawer(null);
              navigate(`/agency/car-rental/bookings?carId=${c._id}`);
            }}
          />

          {/* Add / Edit Vehicle Modal */}
          <AnimatePresence>
            {isAddModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsAddModalOpen(false)}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-lg font-black text-[#0F172A]">
                        {editingCarId ? 'Edit Vehicle Profile' : 'Register New Vehicle'}
                      </h2>
                      <p className="text-xs text-slate-400 font-medium">
                        Add specifications, commercial permits, RC, and tariff policies.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveCar} className="space-y-4 text-xs font-bold">
                    {/* Service Type Segmented Selection (Phase 2 & Phase 5) */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-700 block font-black text-xs">Vehicle Service Business Model *</label>
                        <span className="text-[10px] font-bold text-[#583BE8]">
                          {carForm.serviceType === 'ROUTE_BOOKING' ? 'Chauffeur / Route Service' : 'Customer Self-Drive'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          key="ROUTE_BOOKING"
                          type="button"
                          onClick={() => {
                            setCarForm((prev) => ({
                              ...prev,
                              serviceType: 'ROUTE_BOOKING',
                              vehicleSubCategory: 'car',
                              driverIncluded: true,
                              hasAC: true,
                              seats: prev.seats || 5,
                            }));
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            carForm.serviceType === 'ROUTE_BOOKING'
                              ? 'bg-white border-[#583BE8] shadow-xs ring-2 ring-[#583BE8]/20'
                              : 'bg-white/60 border-slate-200 hover:bg-white text-slate-500'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-black text-slate-900 text-xs">
                            <span className="text-base">👨‍✈️</span>
                            <span className="text-sm font-black">Route Booking</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium mt-1">
                            Point-to-point & inter-city routes • Chauffeur included • No daily tariffs or deposit
                          </span>
                        </button>

                        <button
                          key="SELF_DRIVE_RENTAL"
                          type="button"
                          onClick={() => {
                            setCarForm((prev) => ({
                              ...prev,
                              serviceType: 'SELF_DRIVE_RENTAL',
                              driverIncluded: false,
                            }));
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            carForm.serviceType === 'SELF_DRIVE_RENTAL'
                              ? 'bg-white border-emerald-600 shadow-xs ring-2 ring-emerald-600/20'
                              : 'bg-white/60 border-slate-200 hover:bg-white text-slate-500'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-black text-slate-900 text-xs">
                            <span className="text-base">🔑</span>
                            <span className="text-sm font-black">Self-Drive Rental</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium mt-1">
                            Customer self-drive • Daily/hourly tariff • Security deposit & fuel policy
                          </span>
                        </button>
                      </div>

                      {carForm.serviceType === 'SELF_DRIVE_RENTAL' && (
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 mt-1">
                          <span className="text-[11px] font-bold text-slate-500">Rental Sub-Category:</span>
                          <button
                            type="button"
                            onClick={() => setCarForm((prev) => ({ ...prev, vehicleSubCategory: 'car', seats: 5, hasAC: true }))}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              carForm.vehicleSubCategory === 'car'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            🚗 Four-Wheeler (Car)
                          </button>
                          <button
                            type="button"
                            onClick={() => setCarForm((prev) => ({ ...prev, vehicleSubCategory: 'bike', seats: 2, hasAC: false }))}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              carForm.vehicleSubCategory === 'bike'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            🏍️ Two-Wheeler (Bike)
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Common Vehicle Details */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-600 block mb-1">Brand Name *</label>
                        <input
                          type="text"
                          required
                          value={carForm.brand}
                          onChange={(e) => setCarForm({ ...carForm, brand: e.target.value })}
                          placeholder="e.g. Toyota"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#583BE8]"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 block mb-1">Model Name *</label>
                        <input
                          type="text"
                          required
                          value={carForm.name}
                          onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                          placeholder="e.g. Innova Crysta"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#583BE8]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-600 block mb-1">Body Type</label>
                        <select
                          value={carForm.type}
                          onChange={(e) => setCarForm({ ...carForm, type: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#583BE8]"
                        >
                          <option value="suv">SUV</option>
                          <option value="sedan">Sedan</option>
                          <option value="luxury">Luxury</option>
                          <option value="tempo_traveller">Tempo Traveller</option>
                          <option value="mini_bus">Mini Bus</option>
                          <option value="hatchback">Hatchback</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-600 block mb-1">Fuel Type</label>
                        <select
                          value={carForm.fuel}
                          onChange={(e) => setCarForm({ ...carForm, fuel: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#583BE8]"
                        >
                          <option value="Diesel">Diesel</option>
                          <option value="Petrol">Petrol</option>
                          <option value="Electric">Electric</option>
                          <option value="CNG">CNG</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-600 block mb-1">Transmission</label>
                        <select
                          value={carForm.transmission}
                          onChange={(e) => setCarForm({ ...carForm, transmission: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#583BE8]"
                        >
                          <option value="Automatic">Automatic</option>
                          <option value="Manual">Manual</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-600 block mb-1">City / Base Station</label>
                        <input
                          type="text"
                          value={carForm.city}
                          onChange={(e) => setCarForm({ ...carForm, city: e.target.value })}
                          placeholder="e.g. Mumbai"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#583BE8]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-600 block mb-1">Seating Capacity</label>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={carForm.seats}
                          onChange={(e) => setCarForm({ ...carForm, seats: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#583BE8]"
                        />
                      </div>

                      <div>
                        <label className="text-slate-600 block mb-1">Luggage Bags Capacity</label>
                        <input
                          type="number"
                          min={0}
                          max={20}
                          value={carForm.luggageBags}
                          onChange={(e) => setCarForm({ ...carForm, luggageBags: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#583BE8]"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={carForm.hasAC}
                            onChange={(e) => setCarForm({ ...carForm, hasAC: e.target.checked })}
                            className="w-4 h-4 rounded text-[#583BE8] focus:ring-[#583BE8]"
                          />
                          <span className="text-slate-700 font-bold text-xs">Air Conditioned</span>
                        </label>
                      </div>
                    </div>

                    {/* PHASE 2 — ROUTE BOOKING: PRICING CONFIGURED PER ROUTE (MANAGE ROUTES) */}
                    {carForm.serviceType === 'ROUTE_BOOKING' && (
                      <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200/80 space-y-3">
                        <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                          <span className="font-black text-purple-950 text-xs flex items-center gap-1.5">
                            <span>👨‍✈️</span>
                            <span>Chauffeur & Route Booking Operating Model</span>
                          </span>
                          <span className="text-[10px] font-bold text-[#583BE8] bg-purple-100/80 px-2 py-0.5 rounded-md">
                            Per-Route Pricing • Manage Routes
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-purple-900/90 font-medium leading-relaxed">
                          <div className="space-y-1">
                            <p className="font-bold text-purple-950">
                              Route fares, round-trip charges, allowances, and rules are configured per route under <span className="font-black text-[#583BE8]">Manage Routes</span>.
                            </p>
                            <p className="text-[11px] text-purple-800/80">
                              Every route operates independently. You configure vehicle-level specs, amenities, and policies on this form, while each route has its own point-to-point pricing.
                            </p>
                          </div>
                          {editingCarId && (
                            <button
                              type="button"
                              onClick={() => {
                                const targetCar = cars.find((c) => c._id === editingCarId);
                                if (targetCar) {
                                  setIsAddModalOpen(false);
                                  openRoutesModal(targetCar);
                                }
                              }}
                              className="px-3.5 py-2 rounded-xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-black shrink-0 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <MapPin className="w-3.5 h-3.5" />
                              <span>Manage Routes Now</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* PHASE 4 — SELF-DRIVE RENTAL PRICING & POLICIES */}
                    {carForm.serviceType === 'SELF_DRIVE_RENTAL' && (
                      <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3.5">
                        <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                          <span className="font-black text-emerald-950 text-xs flex items-center gap-1.5">
                            <span>🔑</span>
                            <span>Self-Drive Rental Tariffs & Policies</span>
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                            No Route Pricing • Security Deposit Enabled
                          </span>
                        </div>

                        {/* Pickup Hub Address */}
                        <div>
                          <label className="text-slate-600 block mb-1">Pickup & Return Location / Hub *</label>
                          <input
                            type="text"
                            required
                            value={carForm.pickupLocation}
                            onChange={(e) => setCarForm({ ...carForm, pickupLocation: e.target.value })}
                            placeholder="e.g. Airport Terminal 2 Hub or Andheri West Station"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600"
                          />
                        </div>

                        {/* Tariffs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div>
                            <label className="text-slate-600 block mb-1">Hourly Tariff (₹)</label>
                            <input
                              type="number"
                              value={carForm.rentalHourlyRate}
                              onChange={(e) => setCarForm({ ...carForm, rentalHourlyRate: Number(e.target.value) })}
                              placeholder="e.g. 200"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-slate-600 block mb-1">Daily Tariff (₹) *</label>
                            <input
                              type="number"
                              required
                              value={carForm.rentalDailyRate}
                              onChange={(e) => setCarForm({ ...carForm, rentalDailyRate: Number(e.target.value) })}
                              placeholder="e.g. 2500"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-slate-600 block mb-1">Weekly Tariff (₹)</label>
                            <input
                              type="number"
                              value={carForm.rentalWeeklyRate}
                              onChange={(e) => setCarForm({ ...carForm, rentalWeeklyRate: Number(e.target.value) })}
                              placeholder="e.g. 15000"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-slate-600 block mb-1">Monthly Tariff (₹)</label>
                            <input
                              type="number"
                              value={carForm.rentalMonthlyRate}
                              onChange={(e) => setCarForm({ ...carForm, rentalMonthlyRate: Number(e.target.value) })}
                              placeholder="e.g. 45000"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                            />
                          </div>
                        </div>

                        {/* Deposit, Included KM, Fuel Policy */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div>
                            <label className="text-slate-600 block mb-1">Security Deposit (₹) *</label>
                            <input
                              type="number"
                              required
                              value={carForm.securityDeposit}
                              onChange={(e) => setCarForm({ ...carForm, securityDeposit: Number(e.target.value) })}
                              placeholder="e.g. 3000"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-slate-600 block mb-1">Included KM/Day</label>
                            <input
                              type="number"
                              value={carForm.includedKmPerDay}
                              onChange={(e) => setCarForm({ ...carForm, includedKmPerDay: Number(e.target.value) })}
                              placeholder="e.g. 300"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-slate-600 block mb-1">Extra KM Charge (₹/km)</label>
                            <input
                              type="number"
                              value={carForm.rentalExtraKmCharge}
                              onChange={(e) => setCarForm({ ...carForm, rentalExtraKmCharge: Number(e.target.value) })}
                              placeholder="e.g. 12"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-slate-600 block mb-1">Fuel Policy</label>
                            <select
                              value={carForm.fuelPolicy}
                              onChange={(e) => setCarForm({ ...carForm, fuelPolicy: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                            >
                              <option value="same_to_same">Same to Same</option>
                              <option value="full_to_full">Full to Full</option>
                              <option value="free_fuel">Free Fuel Included</option>
                            </select>
                          </div>
                        </div>

                        {/* Duration Limits & Late Charges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div>
                            <label className="text-slate-600 block mb-1">Late Return (₹/hr)</label>
                            <input
                              type="number"
                              value={carForm.lateReturnChargePerHour}
                              onChange={(e) => setCarForm({ ...carForm, lateReturnChargePerHour: Number(e.target.value) })}
                              placeholder="e.g. 200"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-slate-600 block mb-1">Min Duration (Hours)</label>
                            <input
                              type="number"
                              value={carForm.minRentalDurationHours}
                              onChange={(e) => setCarForm({ ...carForm, minRentalDurationHours: Number(e.target.value) })}
                              placeholder="e.g. 4"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-slate-600 block mb-1">Max Duration (Days)</label>
                            <input
                              type="number"
                              value={carForm.maxRentalDurationDays}
                              onChange={(e) => setCarForm({ ...carForm, maxRentalDurationDays: Number(e.target.value) })}
                              placeholder="e.g. 90"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-slate-600 block mb-1">Min Age (Years)</label>
                            <input
                              type="number"
                              value={carForm.minAgeRequirement}
                              onChange={(e) => setCarForm({ ...carForm, minAgeRequirement: Number(e.target.value) })}
                              placeholder="e.g. 21"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                            />
                          </div>
                        </div>

                        {/* Pickup/Return Timing & License */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="text-slate-600 block mb-1">Pickup Time Window</label>
                            <input
                              type="time"
                              value={carForm.pickupTime}
                              onChange={(e) => setCarForm({ ...carForm, pickupTime: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-slate-600 block mb-1">Return Time Window</label>
                            <input
                              type="time"
                              value={carForm.returnTime}
                              onChange={(e) => setCarForm({ ...carForm, returnTime: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-slate-600 block mb-1">License Requirement</label>
                            <input
                              type="text"
                              value={carForm.drivingLicenseRequirement}
                              onChange={(e) => setCarForm({ ...carForm, drivingLicenseRequirement: e.target.value })}
                              placeholder="Valid Driving License"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                            />
                          </div>
                        </div>

                        {/* Inclusions & Bike CC */}
                        <div className="flex flex-wrap items-center gap-4 pt-1">
                          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                            <input
                              type="checkbox"
                              checked={carForm.insuranceCoverIncluded}
                              onChange={(e) => setCarForm({ ...carForm, insuranceCoverIncluded: e.target.checked })}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600"
                            />
                            <span>Comprehensive Insurance</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                            <input
                              type="checkbox"
                              checked={carForm.roadsideAssistanceIncluded}
                              onChange={(e) => setCarForm({ ...carForm, roadsideAssistanceIncluded: e.target.checked })}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600"
                            />
                            <span>24/7 Roadside Assistance</span>
                          </label>
                          {carForm.vehicleSubCategory === 'bike' && (
                            <>
                              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                                <input
                                  type="checkbox"
                                  checked={carForm.helmetIncluded}
                                  onChange={(e) => setCarForm({ ...carForm, helmetIncluded: e.target.checked })}
                                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600"
                                />
                                <span>Helmet Included</span>
                              </label>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-600">Displacement (CC):</span>
                                <input
                                  type="number"
                                  value={carForm.engineCC}
                                  onChange={(e) => setCarForm({ ...carForm, engineCC: Number(e.target.value) })}
                                  placeholder="e.g. 350"
                                  className="w-24 px-2 py-1 rounded-xl border border-slate-200 bg-white font-mono"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Compliance & RC */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#583BE8] block">
                          Compliance & Registration Details
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          Official Vehicle Documents
                        </span>
                      </div>

                      {/* Row 1: Plate Number & RC Number (Text Boxes) */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-600 block mb-1">Plate / Reg Number *</label>
                          <input
                            type="text"
                            value={carForm.registrationNumber}
                            onChange={(e) => setCarForm({ ...carForm, registrationNumber: e.target.value })}
                            placeholder="MH 02 CZ 8920"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-600 block mb-1">RC Number</label>
                          <input
                            type="text"
                            value={carForm.rcNumber}
                            onChange={(e) => setCarForm({ ...carForm, rcNumber: e.target.value })}
                            placeholder="IN-RC-2023-991204"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* Row 2: Permit Type & Insurance Policy Number (Text Boxes) */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-600 block mb-1">Permit Type</label>
                          <input
                            type="text"
                            value={carForm.permitType}
                            onChange={(e) => setCarForm({ ...carForm, permitType: e.target.value })}
                            placeholder="All India Tourist Permit (AITP)"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-600 block mb-1">Insurance Policy Number</label>
                          <input
                            type="text"
                            value={carForm.insurancePolicyNumber}
                            onChange={(e) => setCarForm({ ...carForm, insurancePolicyNumber: e.target.value })}
                            placeholder="POL-ICICI-COMM-89104"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* Document Uploads: ONLY RC and Permit */}
                      <div className="pt-2 border-t border-slate-200/70 space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          Document Attachments (RC & Permit Only)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <ComplianceDocumentUpload
                            label="RC Document (Upload Copy)"
                            subtitle="Upload RC photo or PDF copy"
                            value={carForm.rcDocument}
                            onChange={(url) => setCarForm({ ...carForm, rcDocument: url })}
                          />
                          <ComplianceDocumentUpload
                            label="Permit Document (Upload Copy)"
                            subtitle="Upload Commercial / AITP permit"
                            value={carForm.permitDocument}
                            onChange={(url) => setCarForm({ ...carForm, permitDocument: url })}
                          />
                        </div>
                      </div>
                    </div>

                    <VehiclePhotoUploadGrid
                      images={carForm.images}
                      thumbnail={carForm.thumbnail}
                      onChange={(newImages, newThumb) =>
                        setCarForm({
                          ...carForm,
                          images: newImages,
                          thumbnail: newThumb,
                        })
                      }
                    />

                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(false)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-xl bg-[#583BE8] hover:bg-[#492de0] text-white font-black transition-all shadow-md shadow-[#583BE8]/20 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? 'Saving...' : editingCarId ? 'Update Vehicle' : 'Register Vehicle'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Route Pricing Management Modal */}
          <AnimatePresence>
            {managingRoutesCar && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
                >
                  {/* Modal Header */}
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#583BE8]" />
                        <h2 className="text-lg font-black text-[#0F172A]">
                          Route Workspace — {managingRoutesCar.brand} {managingRoutesCar.name}
                        </h2>
                      </div>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">
                        Configure independent point-to-point routes, fares, allowances, and rules for this vehicle.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setManagingRoutesCar(null);
                        setPreviewRoute(null);
                        setIsRouteFormOpen(false);
                      }}
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 overflow-y-auto space-y-5 flex-1">
                    {/* Add Route Button / Form Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                          Supported Routes ({carRoutes.length})
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {carRoutes.filter((r) => r.status !== 'disabled').length} Active
                        </span>
                      </div>
                      {!isRouteFormOpen && (
                        <button
                          type="button"
                          onClick={handleOpenAddRoute}
                          className="px-3.5 py-1.5 rounded-xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Route</span>
                        </button>
                      )}
                    </div>

                    {/* Preview Route Overlay / Box */}
                    {previewRoute && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white space-y-3 border border-indigo-500/30 shadow-lg">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-xs font-black uppercase tracking-wider text-indigo-200 flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Traveler Booking Preview</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setPreviewRoute(null)}
                            className="text-white/60 hover:text-white text-xs font-bold"
                          >
                            Close Preview
                          </button>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 text-base font-black">
                              <span>{previewRoute.pickup}</span>
                              <span className="text-indigo-400">→</span>
                              <span>{previewRoute.destination}</span>
                              {previewRoute.routeName && (
                                <span className="px-2 py-0.5 rounded-md bg-white/15 text-[10px] text-white font-bold">
                                  {previewRoute.routeName}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-white/70 font-semibold mt-1">
                              <span>{previewRoute.distanceKm || previewRoute.distance || 0} km</span>
                              <span>•</span>
                              <span>{previewRoute.estimatedDuration || previewRoute.duration || 'Fast Route'}</span>
                              <span>•</span>
                              <span className="text-emerald-400">
                                {previewRoute.pricing?.tollIncluded !== false ? 'Toll Included' : 'Toll Excluded'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-white/60 uppercase block">One Way Fare</span>
                            <span className="text-2xl font-black text-emerald-400">
                              ₹{(previewRoute.pricing?.oneWayPrice || previewRoute.price || 0).toLocaleString()}
                            </span>
                            {previewRoute.pricing?.roundTripPrice && (
                              <span className="text-xs text-indigo-300 block">
                                Round Trip: ₹{previewRoute.pricing.roundTripPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PHASE 5: Add / Edit Form Inline Panel */}
                    <AnimatePresence>
                      {isRouteFormOpen && (
                        <motion.form
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          onSubmit={handleSaveRoute}
                          className="bg-indigo-50/60 border border-indigo-200/80 rounded-3xl p-5 space-y-4"
                        >
                          <div className="flex items-center justify-between border-b border-indigo-100 pb-2.5">
                            <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#583BE8]" />
                              <span>{editingRouteId ? 'Edit Route Pricing & Rules' : 'Add New Supported Route'}</span>
                            </h4>
                            <button
                              type="button"
                              onClick={() => {
                                setIsRouteFormOpen(false);
                                setEditingRouteId(null);
                              }}
                              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>

                          {/* Section 1: Route Locations */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase text-indigo-900 tracking-wider">
                              1. Route Locations & Details
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                  From (Pickup Location) *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={routeForm.pickup}
                                  onChange={(e) => setRouteForm({ ...routeForm, pickup: e.target.value })}
                                  placeholder="e.g. Dibrugarh"
                                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#583BE8]"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                  To (Destination Location) *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={routeForm.destination}
                                  onChange={(e) => setRouteForm({ ...routeForm, destination: e.target.value })}
                                  placeholder="e.g. Tinsukia"
                                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#583BE8]"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                  Route Name (optional)
                                </label>
                                <input
                                  type="text"
                                  value={routeForm.routeName}
                                  onChange={(e) => setRouteForm({ ...routeForm, routeName: e.target.value })}
                                  placeholder="e.g. Highway Express"
                                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#583BE8]"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                  Estimated Distance (KM)
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={routeForm.distanceKm}
                                  onChange={(e) => setRouteForm({ ...routeForm, distanceKm: Number(e.target.value) })}
                                  placeholder="e.g. 50"
                                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#583BE8]"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                  Estimated Duration
                                </label>
                                <input
                                  type="text"
                                  value={routeForm.estimatedDuration}
                                  onChange={(e) => setRouteForm({ ...routeForm, estimatedDuration: e.target.value })}
                                  placeholder="e.g. 1 hr 15 mins"
                                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#583BE8]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Section 2: Route Pricing */}
                          <div className="space-y-2 pt-1 border-t border-indigo-100">
                            <span className="text-[10px] font-black uppercase text-indigo-900 tracking-wider">
                              2. Route Fares & Charges (Specific to this Route)
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                  One Way Fare (₹) *
                                </label>
                                <input
                                  type="number"
                                  required
                                  min="100"
                                  step="50"
                                  value={routeForm.oneWayPrice}
                                  onChange={(e) => setRouteForm({ ...routeForm, oneWayPrice: Number(e.target.value) })}
                                  placeholder="e.g. 1800"
                                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-black text-[#583BE8] focus:outline-none focus:border-[#583BE8]"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                  Round Trip Fare (₹)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  step="50"
                                  value={routeForm.roundTripPrice}
                                  onChange={(e) => setRouteForm({ ...routeForm, roundTripPrice: Number(e.target.value) })}
                                  placeholder="e.g. 3400"
                                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-800 focus:outline-none focus:border-[#583BE8]"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                  Extra KM (₹/km)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={routeForm.extraKmCharge}
                                  onChange={(e) => setRouteForm({ ...routeForm, extraKmCharge: Number(e.target.value) })}
                                  placeholder="e.g. 14"
                                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#583BE8]"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                  Waiting Charge (₹/hr)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={routeForm.waitingChargePerHour}
                                  onChange={(e) => setRouteForm({ ...routeForm, waitingChargePerHour: Number(e.target.value) })}
                                  placeholder="e.g. 150"
                                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#583BE8]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                  Night Charge (₹)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={routeForm.nightCharge}
                                  onChange={(e) => setRouteForm({ ...routeForm, nightCharge: Number(e.target.value) })}
                                  placeholder="e.g. 300"
                                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#583BE8]"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                  Driver Allowance (₹/day)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={routeForm.driverAllowancePerDay}
                                  onChange={(e) => setRouteForm({ ...routeForm, driverAllowancePerDay: Number(e.target.value) })}
                                  placeholder="e.g. 400"
                                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#583BE8]"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                  Max Distance (KM)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={routeForm.maxDistanceKm}
                                  onChange={(e) => setRouteForm({ ...routeForm, maxDistanceKm: Number(e.target.value) })}
                                  placeholder="e.g. 600"
                                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#583BE8]"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                  Advance Booking (Hrs)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={routeForm.advanceBookingHours}
                                  onChange={(e) => setRouteForm({ ...routeForm, advanceBookingHours: Number(e.target.value) })}
                                  placeholder="e.g. 2"
                                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#583BE8]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Section 3: Inclusions & Settings */}
                          <div className="space-y-2 pt-1 border-t border-indigo-100">
                            <span className="text-[10px] font-black uppercase text-indigo-900 tracking-wider">
                              3. Inclusions & Route Rules
                            </span>
                            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={routeForm.tollIncluded}
                                  onChange={(e) => setRouteForm({ ...routeForm, tollIncluded: e.target.checked })}
                                  className="w-4 h-4 rounded text-[#583BE8] focus:ring-[#583BE8]"
                                />
                                <span>Toll Included</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={routeForm.parkingIncluded}
                                  onChange={(e) => setRouteForm({ ...routeForm, parkingIncluded: e.target.checked })}
                                  className="w-4 h-4 rounded text-[#583BE8] focus:ring-[#583BE8]"
                                />
                                <span>Parking Included</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={routeForm.stateTaxIncluded}
                                  onChange={(e) => setRouteForm({ ...routeForm, stateTaxIncluded: e.target.checked })}
                                  className="w-4 h-4 rounded text-[#583BE8] focus:ring-[#583BE8]"
                                />
                                <span>State Tax Included</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={routeForm.bookingEnabled}
                                  onChange={(e) => setRouteForm({ ...routeForm, bookingEnabled: e.target.checked })}
                                  className="w-4 h-4 rounded text-[#583BE8] focus:ring-[#583BE8]"
                                />
                                <span>Booking Enabled</span>
                              </label>
                            </div>
                          </div>

                          {/* Notes */}
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Route Notes (optional)
                            </label>
                            <input
                              type="text"
                              value={routeForm.notes}
                              onChange={(e) => setRouteForm({ ...routeForm, notes: e.target.value })}
                              placeholder="e.g. Scenic route via highway, includes AC and refreshments"
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#583BE8]"
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-2 pt-2 border-t border-indigo-100">
                            <button
                              type="button"
                              onClick={() => {
                                setIsRouteFormOpen(false);
                                setEditingRouteId(null);
                              }}
                              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isSavingRoute}
                              className="px-5 py-2 rounded-xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-black cursor-pointer shadow-xs disabled:opacity-50"
                            >
                              {isSavingRoute ? 'Saving...' : editingRouteId ? 'Update Route' : 'Save Route'}
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {/* PHASE 6: Routes List */}
                    {isRoutesLoading ? (
                      <div className="py-12 text-center text-xs font-bold text-slate-400">
                        Loading routes...
                      </div>
                    ) : carRoutes.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                        <MapPin className="w-6 h-6 text-slate-300 mx-auto" />
                        <h4 className="text-xs font-black text-[#0F172A]">No fixed routes configured yet</h4>
                        <p className="text-[11px] font-medium text-slate-400">
                          Add the point-to-point routes this vehicle operates on with specific fares and inclusions.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {carRoutes.map((route) => {
                          const isActive = route.status !== 'disabled';
                          const oneWayFare = Number(route.pricing?.oneWayPrice ?? route.price) || 0;
                          const roundTripFare = route.pricing?.roundTripPrice ? Number(route.pricing.roundTripPrice) : undefined;
                          const distance = route.distanceKm || route.distance || 0;
                          const duration = route.estimatedDuration || route.duration;
                          const bookingsCount = route.totalBookings || 0;

                          return (
                            <div
                              key={route._id}
                              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                isActive
                                  ? 'bg-white border-slate-200 shadow-2xs'
                                  : 'bg-slate-50/80 border-slate-200/60 opacity-60'
                              }`}
                            >
                              <div className="space-y-1.5 min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-black text-[#0F172A]">{route.pickup}</span>
                                  <span className="text-slate-400 font-bold">→</span>
                                  <span className="text-sm font-black text-[#0F172A]">{route.destination}</span>
                                  {route.routeName && (
                                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#583BE8] text-[10px] font-extrabold border border-purple-200">
                                      {route.routeName}
                                    </span>
                                  )}
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                      isActive
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-slate-100 text-slate-500'
                                    }`}
                                  >
                                    {isActive ? 'Active' : 'Disabled'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium flex-wrap">
                                  {distance > 0 && <span>{distance} km</span>}
                                  {duration && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-slate-400" />
                                      {duration}
                                    </span>
                                  )}
                                  <span className="text-indigo-600 font-semibold">
                                    {bookingsCount} {bookingsCount === 1 ? 'Booking' : 'Bookings'}
                                  </span>
                                  {route.pricing?.tollIncluded !== false && (
                                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                      Tolls Included
                                    </span>
                                  )}
                                  {route.notes && (
                                    <span className="text-slate-400 italic truncate max-w-xs">
                                      • {route.notes}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                <div className="text-right">
                                  <div className="flex items-baseline justify-end gap-1.5">
                                    <span className="text-base font-black text-[#0F172A]">
                                      ₹{oneWayFare.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400">One-way</span>
                                  </div>
                                  {roundTripFare && (
                                    <span className="text-[11px] font-bold text-[#583BE8] block">
                                      RT: ₹{roundTripFare.toLocaleString()}
                                    </span>
                                  )}
                                </div>

                                {/* PHASE 6 & 10: Actions: Edit, Duplicate, Disable / Enable, Delete, Preview */}
                                <div className="flex items-center gap-1.5 border-l border-slate-100 pl-3">
                                  <button
                                    type="button"
                                    onClick={() => setPreviewRoute(route)}
                                    title="Preview Route Card"
                                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDuplicateRoute(route._id)}
                                    title="Duplicate Route"
                                    className="p-1.5 rounded-lg bg-white border border-indigo-200 text-[#583BE8] hover:bg-indigo-50 text-xs font-bold transition-colors cursor-pointer"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditRoute(route)}
                                    title="Edit Route"
                                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleRoute(route._id)}
                                    title={isActive ? 'Disable Route' : 'Enable Route'}
                                    className={`p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                                      isActive
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                    }`}
                                  >
                                    <Power className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRoute(route._id)}
                                    title="Delete Route"
                                    className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default AgencyCarRentalCarsPage;
