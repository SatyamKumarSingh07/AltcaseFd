import { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import { Tooltip } from 'react-tooltip';
import { Search, Filter, RefreshCw, ArrowUp, HelpCircle, Loader2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import fds from '../data/fds.json';

// Bind modal to app element for accessibility
Modal.setAppElement('#root');

function FDList({ setSelectedFDs }) {
  const [filteredFDs, setFilteredFDs] = useState(fds);
  const [interestRate, setInterestRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [localSelected, setLocalSelected] = useState([]);
  const [recommendAmount, setRecommendAmount] = useState('');
  const [recommendTenure, setRecommendTenure] = useState('');
  const [showRecommender, setShowRecommender] = useState(false);
  const [recommendedFD, setRecommendedFD] = useState(null);
  const [sortOrder, setSortOrder] = useState('default');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const faqs = [
    {
      question: "What is a Fixed Deposit (FD)?",
      answer: "A Fixed Deposit is a financial product offered by banks where you invest a lump sum for a fixed period at a fixed interest rate, earning guaranteed returns."
    },
    {
      question: "What does AAA rating mean?",
      answer: "AAA rating indicates the highest level of safety, meaning the issuer is very unlikely to default on payments."
    },
    {
      question: "What is a lock-in period?",
      answer: "The lock-in period is the time during which you cannot withdraw your FD funds without incurring a penalty."
    },
    {
      question: "How do I choose the best FD?",
      answer: "Consider factors like interest rate, tenure, safety rating, and minimum investment amount. Use the FD Recommender to find options that match your needs."
    }
  ];

  const handleFilter = () => {
    let filtered = [...fds];
    if (interestRate) {
      const rate = parseFloat(interestRate);
      if (!isNaN(rate)) {
        filtered = filtered.filter((fd) => fd.interest_rate >= rate);
      } else {
        alert('Please enter a valid interest rate.');
        return;
      }
    }
    if (tenure) {
      filtered = filtered.filter((fd) => fd.tenure.toLowerCase().includes(tenure.toLowerCase()));
    }
    if (searchQuery) {
      filtered = filtered.filter((fd) => fd.issuer.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (sortOrder === 'interest') {
      filtered.sort((a, b) => b.interest_rate - a.interest_rate);
    }
    setFilteredFDs(filtered);
  };

  const clearFilters = () => {
    setInterestRate('');
    setTenure('');
    setSearchQuery('');
    setSortOrder('default');
    setFilteredFDs(fds);
  };

  const toggleSelect = (fd) => {
    let newSelected = [...localSelected];
    if (newSelected.find((item) => item.id === fd.id)) {
      newSelected = newSelected.filter((item) => item.id !== fd.id);
    } else if (newSelected.length < 3) {
      newSelected.push(fd);
    } else {
      alert('You can compare up to 3 FDs.');
      return;
    }
    setLocalSelected(newSelected);
    setSelectedFDs(newSelected);
  };

  const addToShortlist = (fd) => {
    const shortlist = JSON.parse(localStorage.getItem('shortlist') || '[]');
    if (!shortlist.find((item) => item.id === fd.id)) {
      localStorage.setItem('shortlist', JSON.stringify([...shortlist, fd]));
      alert('Added to shortlist!');
    } else {
      alert('This FD is already in your shortlist.');
    }
  };

  const recommendFD = () => {
    setAmountError('');
    setIsLoading(true);
    const amount = parseFloat(recommendAmount);
    let recommended = [...fds];
    if (!isNaN(amount) && amount > 0) {
      recommended = recommended.filter((fd) => amount >= fd.minimum_investment);
    } else {
      setAmountError('Please enter a valid positive number.');
      setIsLoading(false);
      return;
    }
    if (recommendTenure) {
      recommended = recommended.filter((fd) => fd.tenure.toLowerCase().includes(recommendTenure.toLowerCase()));
    }
    if (recommended.length === 0) {
      setAmountError('No FDs match your criteria.');
      setRecommendedFD(null);
      setIsLoading(false);
      return;
    }
    recommended = recommended.sort((a, b) => b.interest_rate - a.interest_rate)[0];
    setTimeout(() => {
      setRecommendedFD(recommended || null);
      setIsLoading(false);
    }, 500);
  };

  const handleBookFD = (fd) => {
    navigate('/booking', { state: { selectedFD: fd } });
  };

  return (
    <div className="space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-bank-blue dark:text-violet-800 text-center"
      >
        Discover Fixed Deposits
      </motion.h1>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-bank-accent text-red-500 font-bold p-3 rounded-xl hover:bg-green-300 transition-colors duration-200 flex items-center justify-center gap-2 shadow-md"
      >
        <HelpCircle size={20} />
        FD Help & FAQs
      </motion.button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            width: '500px',
            overflowY: 'auto',
            position: 'fixed',
          },
          overlay: {
            backgroundColor: 'rgba(20, 20, 0, 0.5)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
        className="dark:bg-gray-800 dark:text-white"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-bank-blue dark:text-black mb-4">FD Help & FAQs</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-800">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(false)}
            className="mt-6 w-full bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            Close
          </motion.button>
        </motion.div>
      </Modal>

      <div className="relative">
        <input
          type="text"
          placeholder="Search by Bank (e.g., HDFC)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyUp={handleFilter}
          className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-bank-blue pr-10 transition-all duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          aria-label="Search by bank"
        />
        <Search className="absolute right-3 top-3 text-gray-400 dark:text-gray-300" size={20} />
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowRecommender(!showRecommender)}
        className="w-full bg-bank-blue text-white p-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 shadow-md"
      >
        <Filter size={20} />
        {showRecommender ? 'Hide Recommender' : 'FD Recommender'}
      </motion.button>
      {showRecommender && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 text-bank-blue dark:text-white">Find Your Perfect FD</h2>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 relative">
              <input
                type="number"
                placeholder="Investment Amount (₹)"
                value={recommendAmount}
                onChange={(e) => {
                  setRecommendAmount(e.target.value);
                  setAmountError('');
                }}
                className={`border p-3 rounded-lg focus:outline-none focus:ring-2 w-full ${
                  amountError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-bank-blue'
                } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                aria-label="Investment amount"
                aria-describedby={amountError ? 'amount-error' : undefined}
              />
              {amountError && (
                <p id="amount-error" className="text-red-500 text-sm mt-1">{amountError}</p>
              )}
            </div>
            <input
              type="text"
              placeholder="Preferred Tenure (e.g., 3 years)"
              value={recommendTenure}
              onChange={(e) => setRecommendTenure(e.target.value)}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-blue flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              aria-label="Preferred tenure"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={recommendFD}
              disabled={isLoading}
              className={`bg-bank-accent text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
              }`}
              aria-label="Recommend an FD"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Recommend'}
            </motion.button>
          </div>
          {recommendedFD && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 bg-green-100 dark:bg-green-900 rounded-lg"
            >
              <h3 className="font-bold text-bank-accent dark:text-green-400">Recommended FD:</h3>
              <p className="text-gray-800 dark:text-gray-200">{recommendedFD.issuer} at {recommendedFD.interest_rate}% for {recommendedFD.tenure}</p>
            </motion.div>
          )}
        </motion.div>
      )}
    
      <div className="flex gap-4 flex-wrap items-center">
        <input
          type="number"
          placeholder="Min Interest Rate (%)"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-blue flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          aria-label="Minimum interest rate"
        />
        <input
          type="text"
          placeholder="Tenure (e.g., 3 years)"
          value={tenure}
          onChange={(e) => setTenure(e.target.value)}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-blue flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          aria-label="Tenure"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSortOrder(sortOrder === 'interest' ? 'default' : 'interest')}
          className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
          aria-label="Sort by interest rate"
        >
          <ArrowUp size={20} />
          Sort by Rate
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFilter}
          className="bg-bank-blue text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          aria-label="Apply filters"
        >
          <Filter size={20} />
          Apply
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearFilters}
          className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
          aria-label="Clear filters"
        >
          <RefreshCw size={20} />
          Clear
        </motion.button>
      </div>
      {/* FD List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredFDs.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 dark:text-gray-400 text-lg col-span-full"
          >
            No FDs match your criteria.
          </motion.p>
        ) : (
          filteredFDs.map((fd, index) => (
            <motion.div
              key={fd.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="border p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-bank-blue dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold text-bank-blue dark:text-white mb-3">{fd.issuer}</h2>
              <p className="text-gray-600 dark:text-gray-300">Interest Rate: {fd.interest_rate}%</p>
              <p className="text-gray-600 dark:text-gray-300">Tenure: {fd.tenure}</p>
              <div className="text-gray-600 dark:text-gray-300">
                Rating: {fd.rating}{' '}
                <span
                  data-tooltip-id={`rating-${fd.id}`}
                  data-tooltip-content="AAA: Highest safety; AA+: Very high safety."
                  className="text-bank-blue dark:text-blue-400 cursor-help"
                >
                  ℹ️
                </span>
                <Tooltip id={`rating-${fd.id}`} place="top" />
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Lock-in: {fd.lock_in_period}{' '}
                <span
                  data-tooltip-id={`lockin-${fd.id}`}
                  data-tooltip-content="Period where you can't withdraw without penalty."
                  className="text-bank-blue dark:text-blue-400 cursor-help"
                >
                  ℹ️
                </span>
                <Tooltip id={`lockin-${fd.id}`} place="top" />
              </div>
              <div className="flex gap-3 mt-4 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSelect(fd)}
                  className={`flex-1 p-3 rounded-lg text-black bg-amber-200 ${
                    localSelected.find((item) => item.id === fd.id)
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-bank-accent hover:bg-blue-300'
                  } transition-colors duration-200`}
                  aria-label={localSelected.find((item) => item.id === fd.id) ? 'Remove from comparison' : 'Add to comparison'}
                >
                  {localSelected.find((item) => item.id === fd.id) ? 'Remove Compare' : 'Add Compare'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToShortlist(fd)}
                  className="flex-1 p-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
                  aria-label="Add to shortlist"
                >
                  Shortlist
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBookFD(fd)}
                  className="flex-1 p-3 rounded-lg bg-bank-blue text-black bg-amber-200 hover:bg-blue-300 transition-colors duration-200"
                  aria-label="Book this FD"
                >
                  <BookOpen size={16} className="inline mr-2" />
                  Book FD
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default FDList;