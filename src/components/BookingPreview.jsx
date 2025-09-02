import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import { CheckCircle, ArrowRight, X } from 'lucide-react';

// Bind modal to app element for accessibility
Modal.setAppElement('#root');

function BookingPreview() {
  const location = useLocation();
  const selectedFD = location.state?.selectedFD || {
    issuer: 'HDFC Bank',
    interest_rate: 6.5,
    tenure: '3 years',
    minimum_investment: 5000,
  }; // Fallback FD if none passed

  const [isModalOpen, setIsModalOpen] = useState(true); // Auto-open modal
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pan: '',
    investmentAmount: '',
  });
  const [errors, setErrors] = useState({});
  const [bookingDetails, setBookingDetails] = useState(null); // Store booking details after completion

  // Focus management for accessibility
  useEffect(() => {
    if (isModalOpen) {
      const firstInput = document.querySelector('input[name="name"]');
      if (firstInput) firstInput.focus();
    }
  }, [isModalOpen, step]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Valid email is required';
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone))
      newErrors.phone = 'Valid 10-digit phone number is required';
    if (!formData.pan.trim() || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan))
      newErrors.pan = 'Valid PAN (e.g., ABCDE1234F) is required';
    if (!formData.investmentAmount || formData.investmentAmount < selectedFD.minimum_investment)
      newErrors.investmentAmount = `Amount must be at least ₹${selectedFD.minimum_investment}`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateForm()) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const completeBooking = () => {
    setBookingDetails({
      ...formData,
      fd: selectedFD,
    });
    setIsModalOpen(false); // Close modal after booking
    setStep(1);
    setFormData({ name: '', email: '', phone: '', pan: '', investmentAmount: '' });
    setErrors({});
  };

  const resetFlow = () => {
    setIsModalOpen(false);
    setStep(1);
    setFormData({ name: '', email: '', phone: '', pan: '', investmentAmount: '' });
    setErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 min-h-screen p-4 sm:p-6"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-bank-blue dark:text-black">Preview FD Booking</h1>
      {/* Display Booking Details */}
      {bookingDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-bank-blue dark:border-gray-700"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-bank-blue dark:text-fuchsia-500 mb-4">Booking Details</h2>
          <p className="text-gray-600 dark:text-white text-sm sm:text-base">
            <span className="font-medium">Name:</span> {bookingDetails.name}
          </p>
          <p className="text-gray-600 dark:text-white text-sm sm:text-base">
            <span className="font-medium">Email:</span> {bookingDetails.email}
          </p>
          <p className="text-gray-600 dark:text-white text-sm sm:text-base">
            <span className="font-medium">Phone:</span> {bookingDetails.phone}
          </p>
          <p className="text-gray-600 dark:text-white text-sm sm:text-base">
            <span className="font-medium">PAN Number:</span> {bookingDetails.pan}
          </p>
          <p className="text-gray-600 dark:text-green-400 text-sm sm:text-base">
            <span className="font-medium">Investment Amount:</span> ₹{bookingDetails.investmentAmount}
          </p>
          <p className="text-gray-600 dark:text-red-600 text-sm sm:text-base">
            <span className="font-medium">Issuer:</span> {bookingDetails.fd.issuer}
          </p>
          <p className="text-gray-600 dark:text-yellow-300 text-sm sm:text-base">
            <span className="font-medium">Interest Rate:</span> {bookingDetails.fd.interest_rate}%
          </p>
          <p className="text-gray-600 dark:text-blue-400 text-sm sm:text-base">
            <span className="font-medium">Tenure:</span> {bookingDetails.fd.tenure}
          </p>
          <p className="text-bank-accent dark:text-green-400 text-sm sm:text-base mt-2">
            Booking completed successfully! (Preview only)
          </p>
        </motion.div>
      )}
      {/* Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={resetFlow}
        style={{
          content: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '85vh',
            padding: '1.5rem',
            borderRadius: '12px',
            backgroundColor: 'white',
            overflowY: 'auto',
            zIndex: 100,
            border: '1px solid #1E40AF',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          },
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
        className="dark:bg-gray-800 dark:text-black dark:border-gray-700"
        contentLabel="FD Booking Modal"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col h-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-bank-blue dark:text-black">
              {step === 1 ? 'Personal Details' : step === 2 ? 'Confirm FD Details' : 'Booking Complete'}
            </h2>
            <button
              onClick={resetFlow}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-800 dark:hover:text-gray-100"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm sm:text-base text-gray-700 dark:text-gray-800">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full border p-2 sm:p-3 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-bank-blue'
                    } dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base`}
                    aria-label="Full name"
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm sm:text-base text-gray-700 dark:text-gray-800">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full border p-2 sm:p-3 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-bank-blue'
                    } dark:bg-gray-700 dark:border-gray-600 dark:text-black text-sm sm:text-base`}
                    aria-label="Email address"
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm sm:text-base text-gray-700 dark:text-gray-800">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full border p-2 sm:p-3 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.phone ? 'border-red-500 focus:ring-red-500' : 'focus:ring-bank-blue'
                    } dark:bg-gray-700 dark:border-gray-600 dark:text-black text-sm sm:text-base`}
                    aria-label="Phone number"
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm sm:text-base text-gray-700 dark:text-gray-800">PAN Number</label>
                  <input
                    type="text"
                    name="pan"
                    value={formData.pan}
                    onChange={handleInputChange}
                    className={`w-full border p-2 sm:p-3 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.pan ? 'border-red-500 focus:ring-red-500' : 'focus:ring-bank-blue'
                    } dark:bg-gray-700 dark:border-gray-600 dark:text-black text-sm sm:text-base`}
                    aria-label="PAN number"
                    aria-describedby={errors.pan ? 'pan-error' : undefined}
                  />
                  {errors.pan && (
                    <p id="pan-error" className="text-red-500 text-xs sm:text-sm mt-1">{errors.pan}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm sm:text-base text-gray-700 dark:text-gray-800">Investment Amount (₹)</label>
                  <input
                    type="number"
                    name="investmentAmount"
                    value={formData.investmentAmount}
                    onChange={handleInputChange}
                    className={`w-full border p-2 sm:p-3 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.investmentAmount ? 'border-red-500 focus:ring-red-500' : 'focus:ring-bank-blue'
                    } dark:bg-gray-700 dark:border-gray-600 dark:text-black text-sm sm:text-base`}
                    aria-label="Investment amount"
                    aria-describedby={errors.investmentAmount ? 'amount-error' : undefined}
                  />
                  {errors.investmentAmount && (
                    <p id="amount-error" className="text-red-500 text-xs sm:text-sm mt-1">{errors.investmentAmount}</p>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="w-full bg-bank-accent text-black p-2 sm:p-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                  aria-label="Proceed to confirmation"
                >
                  Next <ArrowRight size={20} />
                </motion.button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-800">Confirm FD Details</h3>
                <p className="text-gray-600 dark:text-gray-800 text-sm sm:text-base">Issuer: {selectedFD.issuer}</p>
                <p className="text-gray-600 dark:text-gray-800 text-sm sm:text-base">Interest Rate: {selectedFD.interest_rate}%</p>
                <p className="text-gray-600 dark:text-gray-800 text-sm sm:text-base">Tenure: {selectedFD.tenure}</p>
                <p className="text-gray-600 dark:text-gray-800 text-sm sm:text-base">Investment Amount: ₹{formData.investmentAmount}</p>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-500 text-black p-2 sm:p-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm sm:text-base"
                    aria-label="Go back"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="flex-1 bg-bank-accent text-black p-2 sm:p-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                    aria-label="Confirm booking"
                  >
                    Confirm <CheckCircle size={20} />
                  </motion.button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <CheckCircle className="text-bank-accent mx-auto" size={40} />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-bank-blue dark:text-black">Booking Complete!</h3>
                <p className="text-gray-600 dark:text-gray-800 text-sm sm:text-base">Preview only – FD booked successfully!</p>
                <p className="text-gray-600 dark:text-gray-800 text-sm sm:text-base">
                  You’ve booked ₹{formData.investmentAmount} with {selectedFD.issuer} at {selectedFD.interest_rate}% for {selectedFD.tenure}.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={completeBooking}
                  className="w-full bg-bank-blue text-black p-2 sm:p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
                  aria-label="Complete booking and view details"
                >
                  View Booking Details
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </Modal>
    </motion.div>
  );
}

export default BookingPreview;