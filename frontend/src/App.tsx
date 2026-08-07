import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicRoute } from './routes/PublicRoute';
import { ProtectedRoute } from './routes/ProtectedRoute';

import { SplashPage } from './pages/Splash/SplashPage';
import { OnboardingPage } from './pages/Onboarding/OnboardingPage';
import { LoginPage } from './pages/Login/LoginPage';
import { SignupPage } from './pages/Signup/SignupPage';
import { ProfileSetupPage } from './pages/ProfileSetup/ProfileSetupPage';
import { TravelPreferencesPage } from './pages/Preferences/TravelPreferencesPage';
import { WelcomePage } from './pages/Welcome/WelcomePage';

import { HomePage } from './pages/Home/HomePage';
import { ExplorePage } from './pages/Explore/ExplorePage';
import { MyTripsPage } from './pages/Trips/MyTripsPage';
import { CommunityPage } from './pages/Community/CommunityPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { AgencyListingPage } from './pages/AgencyListing/AgencyListingPage';

import { SearchPage } from './pages/Search/SearchPage';
import { SearchResultsPage } from './pages/Search/SearchResultsPage';
import { DestinationDetailsPage } from './pages/Destination/DestinationDetailsPage';
import { AgencyDetailsPage } from './pages/AgencyDetails/AgencyDetailsPage';
import { PackageDetailsPage } from './pages/PackageDetails/PackageDetailsPage';
import { BookingFlowPage } from './pages/Booking/BookingFlowPage';

import { CreatePostPage } from './pages/Community/CreatePostPage';
import { StoryDetailsPage } from './pages/Community/StoryDetailsPage';
import { TravelerProfilePage } from './pages/Community/TravelerProfilePage';
import { PassportPage } from './pages/Community/PassportPage';
import { LeaderboardPage } from './pages/Community/LeaderboardPage';
import { TravelCircleDetailsPage } from './pages/Community/TravelCircleDetailsPage';

import { EditProfilePage } from './pages/Profile/EditProfilePage';
import { SavedDestinationsPage } from './pages/Profile/SavedDestinationsPage';
import { NotificationsPage } from './pages/Notifications/NotificationsPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { ChatPage } from './pages/Chat/ChatPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
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
            {/* Core 5 Bottom Nav Pages */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/my-trips" element={<MyTripsPage />} />
            <Route path="/trips" element={<MyTripsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Search & Marketplace Detail Routes */}
            <Route path="/search" element={<SearchPage />} />
            <Route path="/search/results" element={<SearchResultsPage />} />
            <Route path="/destination/:id" element={<DestinationDetailsPage />} />
            <Route path="/agencies" element={<AgencyListingPage />} />
            <Route path="/agency/:id" element={<AgencyDetailsPage />} />
            <Route path="/agency/:agencyId" element={<AgencyDetailsPage />} />
            <Route path="/package/:id" element={<PackageDetailsPage />} />
            <Route path="/package/:packageId" element={<PackageDetailsPage />} />
            <Route path="/booking/:packageId" element={<BookingFlowPage />} />
            <Route path="/booking/*" element={<BookingFlowPage />} />

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
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:id" element={<ChatPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
