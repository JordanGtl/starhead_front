import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { VersionProvider } from "./contexts/VersionContext";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Ships from "./pages/Ships";
import ShipDetail from "./pages/ShipDetail";
import ShipCompare from "./pages/ShipCompare";
import ShipLoadout from "./pages/ShipLoadout";
import SearchPage from "./pages/SearchPage";
import Weapons from "./pages/Weapons";
import WeaponDetail from "./pages/WeaponDetail";
import Locations from "./pages/Locations";
import LocationDetail from "./pages/LocationDetail";
import Vehicles from "./pages/Vehicles";
import Components from "./pages/Components";
import ComponentDetail from "./pages/ComponentDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Manufacturers from "./pages/Manufacturers";
import ManufacturerDetail from "./pages/ManufacturerDetail";
import Factions from "./pages/Factions";
import Missions from "./pages/Missions";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import NewsAdmin from "./pages/admin/NewsAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import Lore from "./pages/Lore";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import SpectrumTracker from "./pages/SpectrumTracker";
import SpectrumPostDetail from "./pages/SpectrumPostDetail";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import LoadoutTool from "./pages/tools/LoadoutTool";
import CraftingSimulator from "./pages/tools/CraftingSimulator";
import RefiningSimulator from "./pages/tools/RefiningSimulator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <VersionProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ships" element={<Ships />} />
            <Route path="/ships/compare" element={<ShipCompare />} />
            <Route path="/ships/:id/loadout" element={<ShipLoadout />} />
            <Route path="/ships/:id" element={<ShipDetail />} />
            <Route path="/weapons" element={<Weapons />} />
            <Route path="/weapons/:id" element={<WeaponDetail />} />
            <Route path="/components" element={<Components />} />
            <Route path="/components/:id" element={<ComponentDetail />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:id" element={<LocationDetail />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/manufacturers" element={<Manufacturers />} />
            <Route path="/manufacturers/:slug" element={<ManufacturerDetail />} />
            <Route path="/factions" element={<Factions />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/lore" element={<Lore />} />
            <Route path="/tools/loadout" element={<LoadoutTool />} />
            <Route path="/tools/crafting" element={<CraftingSimulator />} />
            <Route path="/tools/refining" element={<RefiningSimulator />} />
            <Route path="/news" element={<News />} />
            <Route path="/spectrum" element={<SpectrumTracker />} />
            <Route path="/spectrum/:id" element={<SpectrumPostDetail />} />
            <Route path="/news/:rsiId" element={<NewsDetail />} />
            <Route path="/admin/news" element={<AdminRoute><NewsAdmin /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UsersAdmin /></AdminRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </VersionProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
