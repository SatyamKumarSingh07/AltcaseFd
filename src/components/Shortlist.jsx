import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { Share2, Trash2, File, XCircle } from 'lucide-react';

function Shortlist() {
  const [shortlist, setShortlist] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('shortlist') || '[]');
    setShortlist(saved);
  }, []);

  const removeFromShortlist = (id) => {
    const updated = shortlist.filter((fd) => fd.id !== id);
    localStorage.setItem('shortlist', JSON.stringify(updated));
    setShortlist(updated);
  };

  const clearShortlist = () => {
    localStorage.setItem('shortlist', JSON.stringify([]));
    setShortlist([]);
    alert('Shortlist cleared!');
  };

  const shareShortlist = () => {
    const summary = shortlist
      .map((fd) => `${fd.issuer}: ${fd.interest_rate}% for ${fd.tenure}`)
      .join('\n');
    navigator.clipboard.writeText(summary);
    alert('Shortlist copied to clipboard! Paste to share.');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(30, 64, 175); // bank-blue
    doc.text('My FD Shortlist', 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(0);
    shortlist.forEach((fd, index) => {
      doc.text(`${index + 1}. ${fd.issuer}: ${fd.interest_rate}% for ${fd.tenure} (Rating: ${fd.rating})`, 20, 30 + index * 10);
    });
    doc.save('fd_shortlist.pdf');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-4xl font-bold text-bank-blue">My Shortlist</h1>
      {shortlist.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 text-lg text-center"
        >
          No items shortlisted yet.
        </motion.p>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shortlist.map((fd, index) => (
              <motion.div
                key={fd.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border p-6 rounded-xl shadow-lg bg-white min-w-[280px] hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-bank-blue"
              >
                <h2 className="text-xl font-semibold text-bank-blue mb-3">{fd.issuer}</h2>
                <p className="text-gray-600">Interest Rate: {fd.interest_rate}%</p>
                <p className="text-gray-600">Tenure: {fd.tenure}</p>
                <p className="text-gray-600">Rating: {fd.rating}</p>
                <p className="text-gray-600">Lock-in: {fd.lock_in_period}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => removeFromShortlist(fd.id)}
                  className="mt-4 p-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-2 w-full animate-pulse"
                  aria-label="Remove from shortlist"
                >
                  <Trash2 size={16} />
                  Remove
                </motion.button>
              </motion.div>
            ))}
          </div>
          <div className="flex gap-4 mt-6 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={shareShortlist}
              className="flex-1 p-3 rounded-lg bg-gradient-to-r from-bank-blue to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 animate-pulse"
              aria-label="Share shortlist"
            >
              <Share2 size={20} />
              Share
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToPDF}
              className="flex-1 p-3 rounded-lg bg-gradient-to-r from-bank-accent to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 animate-pulse"
              aria-label="Export to PDF"
            >
              <File size={20} />
              Export PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearShortlist}
              className="flex-1 p-3 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-200 flex items-center justify-center gap-2 animate-pulse"
              aria-label="Clear shortlist"
            >
              <XCircle size={20} />
              Clear Shortlist
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Shortlist;