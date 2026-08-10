import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes/ProtectedRoute';
import { PublicRoute } from '../../routes/PublicRoute';

import { SplashPage } from '../pages/Splash/SplashPage';
import { OnboardingPage } from '../pages/Onboarding/OnboardingPage';
import { LoginPage } from '../pages/Login/LoginPage';
import { SignupPage } from '../pages/Signup/SignupPage';
import { ProfileSetupPage } from '../pages/ProfileSetup/ProfileSetupPage';
import { TravelPreferencesPage } from '../pages/Preferences/TravelPreferencesPage';
import { WelcomePage } from '../pages/Welcome/WelcomePage';

import { HomePage } from '../pages/Home/HomePage';
import { ExplorePage } from '../pages/Explore/ExplorePage';
import { MyTripsPage } from '../pages/Trips/MyTripsPage';
import { CommunityPage } from '../pages/Community/CommunityPage';
import { CreatePostPage } from '../pages/CreatePost/CreatePostPage';
import { PostCommentsPage } from '../pages/PostComments/PostCommentsPage';
import { TripDetailsPage } from '../pages/TripDetails/TripDetailsPage';
import { TravelDocumentsPage } from '../pages/TravelDocuments/TravelDocumentsPage';
import { TripReviewPage } from '../pages/Review/TripReviewPage';
import { NotificationsPage } from '../pages/Notifications/NotificationsPage';
import { ProfilePage } from '../pages/Profile/ProfilePage';

import { SearchPage } from '../pages/Search/SearchPage';
import { SearchResultsPage } from '../pages/Search/SearchResultsPage';
import { DestinationDetailsPage } from '../pages/Destination/DestinationDetailsPage';
import { AgencyListingPage } from '../pages/AgencyListing/AgencyListingPage';
import { AgencyDetailsPage } from '../pages/AgencyDetails/AgencyDetailsPage';
import { PackageDetailsPage } from '../pages/PackageDetails/PackageDetailsPage';
import { BookingCheckoutPage } from '../pages/BookingCheckout/BookingCheckoutPage';
import { BookingSuccessPage } from '../pages/BookingCheckout/BookingSuccessPage';

import { TravelerProfilePage } from '../pages/Community/TravelerProfilePage';
import { PassportPage } from '../pages/Community/PassportPage';
import { LeaderboardPage } from '../pages/Community/LeaderboardPage';
import { TravelCircleDetailsPage } from '../pages/Community/TravelCircleDetailsPage';
import { StoryDetailsPage } from '../pages/Community/StoryDetailsPage';

import { EditProfilePage } from '../pages/Profile/EditProfilePage';
import { SavedDestinationsPage } from '../pages/Profile/SavedDestinationsPage';
import { SettingsPage } from '../pages/Settings/SettingsPage';
import { ChatListPage } from '../pages/Chat/ChatListPage';
import { ChatRoomPage } from '../pages/Chat/ChatRoomPage';

export const UserRoutes = () => (
  <>
      {/* Splash Screen */}
      <Route path="/" element={<SplashPage />} />

      {/* Public / Unauthenticated Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Setup / Onboarding Steps (LoggedIn required) */}
      <Route path="/profile-setup" element={<ProfileSetupPage />} />
      <Route path="/travel-preferences" element={<TravelPreferencesPage />} />
      <Route path="/welcome" element={<WelcomePage />} />

      {/* Fully Protected Main & Detail Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Core Bottom Nav Pages */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/my-trips" element={<MyTripsPage />} />
        <Route path="/trips" element={<MyTripsPage />} />
        <Route path="/trips/:tripId" element={<TripDetailsPage />} />
        <Route path="/trips/:id" element={<TripDetailsPage />} />
        <Route path="/trips/:tripId/documents" element={<TravelDocumentsPage />} />
        <Route path="/trips/:id/documents" element={<TravelDocumentsPage />} />
        <Route path="/trips/:tripId/review" element={<TripReviewPage />} />
        <Route path="/trips/:id/review" element={<TripReviewPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/create" element={<CreatePostPage />} />
        <Route path="/community/post/:postId" element={<PostCommentsPage />} />
        <Route path="/community/user/:userId" element={<TravelerProfilePage />} />
        <Route path="/community/user/:id" element={<TravelerProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/chat" element={<ChatListPage />} />
        <Route path="/chat/:chatId" element={<ChatRoomPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Search & Marketplace Detail Routes */}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search/results" element={<SearchResultsPage />} />
        <Route path="/destination/:id" element={<DestinationDetailsPage />} />
        <Route path="/destination/:destinationId" element={<DestinationDetailsPage />} />
        <Route path="/agencies" element={<AgencyListingPage />} />
        <Route path="/agencies/:id" element={<AgencyDetailsPage />} />
        <Route path="/agencies/:agencyId" element={<AgencyDetailsPage />} />
        <Route path="/agency/:agencyId" element={<AgencyDetailsPage />} />
        <Route path="/package/:id" element={<PackageDetailsPage />} />
        <Route path="/package/:packageId" element={<PackageDetailsPage />} />
        <Route path="/booking/checkout/:packageId" element={<BookingCheckoutPage />} />
        <Route path="/booking/checkout/:id" element={<BookingCheckoutPage />} />
        <Route path="/booking/success/:bookingId" element={<BookingSuccessPage />} />
        <Route path="/booking/success" element={<BookingSuccessPage />} />
        <Route path="/booking/:packageId" element={<BookingCheckoutPage />} />
        <Route path="/booking/*" element={<BookingCheckoutPage />} />

        {/* Community Routes */}
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/story/:id" element={<StoryDetailsPage />} />
        <Route path="/traveler/:id" element={<TravelerProfilePage />} />
        <Route path="/passport" element={<PassportPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/circle/:id" element={<TravelCircleDetailsPage />} />

        {/* Profile Detail Routes */}
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/saved-destinations" element={<SavedDestinationsPage />} />
        <Route path="/saved-packages" element={<SavedDestinationsPage />} />
        <Route path="/wishlist" element={<SavedDestinationsPage />} />
        <Route path="/followers" element={<TravelerProfilePage />} />
        <Route path="/following" element={<TravelerProfilePage />} />
        <Route path="/my-reviews" element={<StoryDetailsPage />} />
        <Route path="/my-stories" element={<StoryDetailsPage />} />

        {/* Utility Routes */}
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </>
);
