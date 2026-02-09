
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useIsMobile, useIsCompact } from './hooks';
import { Layout } from './components';
import { 
  HomePage, 
  RetreatsPage, 
  RetreatDetailsPage,
  RetreatSchedulePage,
  RetreatJourneyPage,
  InstructorsPage, 
  InstructorDetailsPage,
  BreathingPage,
  SavedPage,
  SavedGuidesPage,
  SavedRetreatsPage,
  ProfilePage,
  StudentProfilePage,
  OrganizerPage,
  OrganizerDetailsPage,
  PaywallPage,
  InstructorDashboardPage,
  DevPage,
  AuthPage,
  AdminDashboardPage
} from './pages';
import { InvestorDemoPage } from './pages/InvestorDemoPage';
import { ErrorBoundary } from './ErrorBoundary';

export default function App() {
  const isMobile = useIsMobile();
  const isCompact = useIsCompact();

  return (
    <div className={`${isMobile ? "is-mobile" : "is-desktop"} ${isCompact ? "mode-compact" : ""}`}>
      <ErrorBoundary>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              
              <Route path="retreats" element={<RetreatsPage />} />
              <Route path="retreats/:id" element={<RetreatDetailsPage />} />
              <Route path="retreats/:id/schedule" element={<RetreatSchedulePage />} />
              <Route path="retreats/:id/journey" element={<RetreatJourneyPage />} />
              
              <Route path="instructors" element={<InstructorsPage />} />
              <Route path="instructors/:id" element={<InstructorDetailsPage />} />
              
              <Route path="organizers/:id" element={<OrganizerDetailsPage />} />
              
              <Route path="breathing" element={<BreathingPage />} />
              <Route path="saved" element={<SavedPage />} />
              <Route path="saved/guides" element={<SavedGuidesPage />} />
              <Route path="saved/retreats" element={<SavedRetreatsPage />} />
              
              <Route path="profile" element={<ProfilePage />} />
              <Route path="students/:id" element={<StudentProfilePage />} />
              
              <Route path="organizer" element={<OrganizerPage />} />
              <Route path="instructor-dashboard" element={<InstructorDashboardPage />} />
              <Route path="admin" element={<AdminDashboardPage />} />
              
              <Route path="paywall" element={<PaywallPage />} />
              <Route path="investor" element={<InvestorDemoPage />} />
              
              <Route path="dev" element={<DevPage />} />
              <Route path="auth" element={<AuthPage />} />
              
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>
        </HashRouter>
      </ErrorBoundary>
    </div>
  );
}
