AltcaseFd - Fixed Deposit Explorer
A modern, responsive React application designed to help users browse, filter, compare, and book Fixed Deposits (FDs) with a user-friendly interface and advanced features like an FD recommender and FAQ modal.
🚀 Project Overview
AltcaseFd is a feature-rich React component that empowers users to explore Fixed Deposit options offered by banks. It provides intuitive filtering, sorting, and comparison tools, along with a recommendation engine to find the best FD based on investment amount and tenure preferences. The application is built with accessibility, performance, and user experience in mind, making it an ideal tool for financial decision-making.
This project showcases my expertise in React, modern JavaScript, and UI/UX design, demonstrating my ability to build scalable, interactive, and accessible web applications.
✨ Key Features

Search & Filter: Search FDs by bank name, filter by minimum interest rate and tenure, and sort by interest rate for tailored results.
FD Recommender: A smart tool that suggests the best FD based on user-provided investment amount and preferred tenure.
Comparison Tool: Allows users to compare up to three FDs side-by-side for informed decision-making.
Shortlist & Booking: Save FDs to a local storage-based shortlist and navigate to a booking page to proceed with investments.
Interactive FAQ Modal: A responsive modal with FAQs to educate users about Fixed Deposits, ensuring accessibility with react-modal.
Animations: Smooth transitions and hover effects using framer-motion for an engaging user experience.
Dark Mode: Supports light and dark themes for better usability and accessibility.
Responsive Design: Optimized for both desktop and mobile devices with a clean, modern UI.

🛠️ Tech Stack

Frontend: React, JavaScript (ES6+), JSX
Libraries:
framer-motion: For animations and transitions
react-modal: For accessible modal dialogs
react-tooltip: For tooltips on FD ratings and lock-in periods
lucide-react: For lightweight, customizable icons
react-router-dom: For navigation to the booking page


Styling: Tailwind CSS (assumed based on class names like bg-bank-blue, dark:bg-gray-800)
Data Management: JSON-based data (fds.json) for FD details, with local storage for shortlisting
Accessibility: ARIA labels and react-modal app element binding for screen reader compatibility
Version Control: Git, hosted on GitHub

📂 Project Structure
AltcaseFd/
├── src/
│   ├── components/
│   │   └── FDList.jsx       # Main React component for FD browsing
│   ├── data/
│   │   └── fds.json         # Sample FD data
│   └── App.jsx              # Root component (assumed)
├── public/
│   └── index.html           # HTML entry point
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation

🚀 Getting Started
Prerequisites

Node.js (v16 or higher)
npm or yarn

Installation

Clone the repository:git clone https://github.com/SatyamKumarSingh07/AltcaseFd.git
cd AltcaseFd


Install dependencies:npm install


Start the development server:npm start



Usage

Browse FDs: Use the search bar to find FDs by bank name or apply filters for interest rate and tenure.
Compare FDs: Select up to three FDs to compare their details.
FD Recommender: Enter an investment amount and tenure to get personalized FD suggestions.
Shortlist: Add FDs to your shortlist, stored locally in the browser.
Book FD: Click "Book FD" to navigate to the booking page.
FAQs: Access the FAQ modal for quick answers about Fixed Deposits.

🧠 Technical Highlights

State Management: Efficient use of React's useState for managing filters, search queries, and selected FDs.
Routing: Seamless navigation to the booking page using react-router-dom.
Performance: Optimized rendering with memoized filters and minimal re-renders.
Accessibility: ARIA labels, focus management, and modal accessibility with Modal.setAppElement('#root').
Error Handling: Input validation for interest rate and investment amount with user-friendly error messages.
Responsive Design: Tailwind CSS ensures a consistent experience across devices.
Animations: framer-motion adds smooth transitions for modals, buttons, and FD cards, enhancing UX.

🌟 Why This Project Stands Out

User-Centric Design: Built with a focus on simplicity, accessibility, and interactivity, making financial decisions intuitive.
Scalability: Modular code structure allows easy addition of new features, such as advanced filtering or API integration.
Modern Tech Stack: Leverages industry-standard tools like React, Tailwind CSS, and Framer Motion, showcasing proficiency in frontend development.
Problem-Solving: The FD recommender algorithm filters and sorts FDs based on user input, demonstrating logical and analytical skills.
Attention to Detail: Features like tooltips, dark mode, and animations reflect a commitment to polished, professional work.

📝 Future Enhancements

Integrate a backend API to fetch real-time FD data.
Add advanced filtering options (e.g., by rating or lock-in period).
Implement user authentication for personalized shortlists.
Enhance the comparison tool with visual charts for interest rates and returns.
Add unit tests using Jest and React Testing Library for robustness.

🤝 Contributing
Contributions are welcome! Please:

Fork the repository.
Create a feature branch (git checkout -b feature/YourFeature).
Commit your changes (git commit -m "Add YourFeature").
Push to the branch (git push origin feature/YourFeature).
Open a pull request.

📧 Contact

GitHub: SatyamKumarSingh07

Built with 💻 and ☕ by Satyam Kumar Singh
