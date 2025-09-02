import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Comparison from './components/Comparison.jsx';
import Shortlist from './components/Shortlist.jsx';
import BookingPreview from './components/BookingPreview.jsx';
import FDList from './components/FDList.jsx';

function App() {
  const [selectedFDs, setSelectedFDs] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 to-indigo-500 transition-colors duration-500">
      <div className="container mx-auto p-6">
        <nav className="sticky top-0 z-50 flex justify-between items-center mb-8 bg-yellow-200 p-4 rounded-xl shadow-lg transition-shadow duration-300">
          <div className="flex gap-6">
            <Link to="/" className="text-lg font-semibold text-bank-blue hover:text-blue-600 transition-colors duration-200 animate-pulse" aria-label="Go to FD List">Home</Link>
            <Link to="/compare" className="text-lg font-semibold text-bank-blue hover:text-blue-600 transition-colors duration-200 animate-pulse" aria-label="Go to Compare">Compare</Link>
            <Link to="/shortlist" className="text-lg font-semibold text-bank-blue hover:text-blue-600 transition-colors duration-200 animate-pulse" aria-label="Go to Shortlist">Shortlist</Link>
            <Link to="/booking" className="text-lg font-semibold text-bank-blue hover:text-blue-600 transition-colors duration-200 animate-pulse" aria-label="Go to Booking Preview">Book Preview</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<FDList setSelectedFDs={setSelectedFDs} />} />
          <Route path="/compare" element={<Comparison selectedFDs={selectedFDs} />} />
          <Route path="/shortlist" element={<Shortlist />} />
          <Route path="/booking" element={<BookingPreview />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;