import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { BrandBadge } from './components/BrandLogo';
import { MarketplacePage } from './pages/MarketplacePage';
import { UploadPage } from './pages/UploadPage';
import { MyIntelPage } from './pages/MyIntelPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<MarketplacePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/intel" element={<MyIntelPage />} />
          </Routes>
        </main>
        {/* Brand badge — fixed to viewport bottom-right, immune to container sizing */}
        <BrandBadge />
      </div>
    </BrowserRouter>
  );
}

export default App;
