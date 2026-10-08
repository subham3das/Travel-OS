import React from 'react';
import { Route, Outlet } from 'react-router-dom';
import { ProtectedRoute } from '../../routes/ProtectedRoute';
import { PublicRoute } from '../../routes/PublicRoute';
import { OnboardingRoute } from '../../routes/OnboardingRoute';
import { WebsiteThemeProvider } from '../context/WebsiteThemeContext';

import { SplashPage } from '../pages/Splash/SplashPage';
import { OnboardingPage } from '../pages/Onboarding/OnboardingPage';
import { LoginPage } from '../pages/Login/LoginPage';
import { SignupPage } from '../pages/Signup/SignupPage';
import { ForgotPasswordPage } from '../pages/ForgotPassword/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPassword/ResetPasswordPage';
import { ProfileSetupPage } from '../pages/ProfileSetup/ProfileSetupPage';
import { TravelPreferencesPage } from '../pages/Preferences/TravelPreferencesPage';
import { WelcomePage } from '../pages/Welcome/WelcomePage';

import { HomePage } from '../pages/Home/HomePage';
import { ExplorePage } from '../pages/Explore/ExplorePage';
import { MyTripsPage } from '../pages/Trips/MyTripsPage';
import { TripDetailsPage } from '../pages/TripDetails/TripDetailsPage';
import { TravelDocumentsPage } from '../pages/TravelDocuments/TravelDocumentsPage';
import { TripReviewPage } from '../pages/Review/TripReviewPage';
import { NotificationsPage } from '../pages/Notifications/NotificationsPage';
import { ProfilePage } from '../pages/Profile/ProfilePage';
import { CarRentalPage } from '../pages/CarRental/CarRentalPage';
import { VehicleDetailsPage } from '../pages/CarRental/VehicleDetailsPage';

import { SearchPage } from '../pages/Search/SearchPage';
import { DestinationDetailsPage } from '../pages/Destination/DestinationDetailsPage';
import { AgencyListingPage } from '../pages/AgencyListing/AgencyListingPage';
import { AgencyDetailsPage } from '../pages/AgencyDetails/AgencyDetailsPage';
import { PackageDetailsPage } from '../pages/PackageDetails/PackageDetailsPage';
import { BookingCheckoutPage } from '../pages/BookingCheckout/BookingCheckoutPage';
import { BookingSuccessPage } from '../pages/BookingCheckout/BookingSuccessPage';

import { EditProfilePage } from '../pages/Profile/EditProfilePage';
import { SavedDestinationsPage } from '../pages/Profile/SavedDestinationsPage';
import { SettingsPage } from '../pages/Settings/SettingsPage';
import { ChatListPage } from '../pages/Chat/ChatListPage';
import { ChatRoomPage } from '../pages/Chat/ChatRoomPage';
import { BookingDetailsPage } from '../pages/BookingDetails/BookingDetailsPage';
import { TravelerProfilePage } from '../pages/TravelerProfile/TravelerProfilePage';

/**
 * Isolated Website Theme Wrapper
 */
const WebsiteThemeWrapper: React.FC = () => (
  <WebsiteThemeProvider>
    <Outlet />
  </WebsiteThemeProvider>
);

export const UserRoutes = () => (
  <Route element={<WebsiteThemeWrapper />}>
    {/* Splash Screen */}
    <Route path="/" element={<SplashPage />} />

    {/* Public / Unauthenticated Routes */}
    <Route element={<PublicRoute />}>
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Route>

    {/* Setup / Onboarding Steps (LoggedIn required) */}
    <Route element={<OnboardingRoute />}>
      <Route path="/profile-setup" element={<ProfileSetupPage />} />
      <Route path="/travel-preferences" element={<TravelPreferencesPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
    </Route>

    {/* Fully Protected Main & Detail Routes */}
    <Route element={<ProtectedRoute />}>
      {/* Core Bottom Nav Pages */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/my-trips" element={<MyTripsPage />} />
      <Route path="/trips" element={<MyTripsPage />} />
      <Route path="/my-bookings" element={<MyTripsPage defaultTab="bookings" />} />
      <Route path="/bookings" element={<MyTripsPage defaultTab="bookings" />} />
      <Route path="/my-bookings/cars" element={<MyTripsPage defaultTab="bookings" />} />
      <Route path="/trips/:tripId" element={<TripDetailsPage />} />
      <Route path="/trips/:id" element={<TripDetailsPage />} />
      <Route path="/trips/:tripId/documents" element={<TravelDocumentsPage />} />
      <Route path="/trips/:id/documents" element={<TravelDocumentsPage />} />
      <Route path="/trips/:tripId/review" element={<TripReviewPage />} />
      <Route path="/trips/:id/review" element={<TripReviewPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/chat" element={<ChatListPage />} />
      <Route path="/chat/:chatId" element={<ChatRoomPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* Search & Marketplace Detail Routes */}
      <Route path="/search" element={<SearchPage />} />

      {/* Packages (both /packages/... and /package/...) */}
      <Route path="/packages/:packageId" element={<PackageDetailsPage />} />
      <Route path="/packages/:id" element={<PackageDetailsPage />} />
      <Route path="/package/:packageId" element={<PackageDetailsPage />} />
      <Route path="/package/:id" element={<PackageDetailsPage />} />

      {/* Destinations (both /destinations/... and /destination/...) */}
      <Route path="/destinations/:destinationId" element={<DestinationDetailsPage />} />
      <Route path="/destinations/:id" element={<DestinationDetailsPage />} />
      <Route path="/destination/:destinationId" element={<DestinationDetailsPage />} />
      <Route path="/destination/:id" element={<DestinationDetailsPage />} />

      {/* Agencies (both /agency/... and /agencies/...) */}
      <Route path="/agencies" element={<AgencyListingPage />} />
      <Route path="/agencies/:id" element={<AgencyDetailsPage />} />
      <Route path="/agencies/:agencyId" element={<AgencyDetailsPage />} />
      <Route path="/agency/:id" element={<AgencyDetailsPage />} />
      <Route path="/agency/:agencyId" element={<AgencyDetailsPage />} />

      {/* Cars & Rental (canonical /cars/:id and /car/:id and /car-rental/:id) */}
      <Route path="/car-rental" element={<CarRentalPage />} />
      <Route path="/car-rental/:id" element={<VehicleDetailsPage />} />
      <Route path="/cars/:id" element={<VehicleDetailsPage />} />
      <Route path="/cars/:vehicleId" element={<VehicleDetailsPage />} />
      <Route path="/car/:id" element={<VehicleDetailsPage />} />

      {/* Travelers */}
      <Route path="/traveler/:userId" element={<TravelerProfilePage />} />
      <Route path="/traveler/:id" element={<TravelerProfilePage />} />
      <Route path="/travelers/:userId" element={<TravelerProfilePage />} />

      {/* Bookings */}
      <Route path="/bookings/:bookingId" element={<BookingDetailsPage />} />
      <Route path="/bookings/:id" element={<BookingDetailsPage />} />
      <Route path="/car-bookings/:bookingId" element={<BookingDetailsPage />} />
      <Route path="/car-bookings/:id" element={<BookingDetailsPage />} />
      <Route path="/car-booking/:bookingId" element={<BookingDetailsPage />} />
      <Route path="/car-booking/:id" element={<BookingDetailsPage />} />
      <Route path="/booking/checkout/:packageId" element={<BookingCheckoutPage />} />
      <Route path="/booking/checkout/:id" element={<BookingCheckoutPage />} />
      <Route path="/booking/success/:bookingId" element={<BookingSuccessPage />} />
      <Route path="/booking/success" element={<BookingSuccessPage />} />
      <Route path="/booking/:bookingId" element={<BookingDetailsPage />} />
      <Route path="/booking/*" element={<BookingCheckoutPage />} />

      {/* Profile & Settings Sub-routes */}
      <Route path="/edit-profile" element={<EditProfilePage />} />
      <Route path="/profile/edit" element={<EditProfilePage />} />
      <Route path="/saved-destinations" element={<SavedDestinationsPage />} />
      <Route path="/wishlist" element={<SavedDestinationsPage />} />
      <Route path="/saved-trips" element={<SavedDestinationsPage />} />
      <Route path="/saved" element={<SavedDestinationsPage />} />
      <Route path="/passport" element={<TravelerProfilePage />} />
      <Route path="/profile/traveler" element={<TravelerProfilePage />} />

      {/* Packages listing alias */}
      <Route path="/packages" element={<ExplorePage />} />

      {/* Utility Routes */}
      <Route path="/settings" element={<SettingsPage />} />
    </Route>
  </Route>
);
