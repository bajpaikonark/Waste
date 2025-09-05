// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import AuthModal from './AuthModal';
// import ProfileDropdown from './ProfileDropdown';
// import BottomNavbar from './BottomNavbar';
// import ReportWaste from './ReportWaste';

// const navigation = [
//   { title: "Services", path: "#services" },
//   { title: "About", path: "#about" },
//   { title: "How It Works", path: "#how-it-works" },
//   { title: "Contact", path: "#contact" },
// ];

// const Layout = ({ children }) => {
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [activeService, setActiveService] = useState(null);
//   const { currentUser } = useAuth();

//   // Function to handle report button click
//   const handleReportClick = () => {
//     setActiveService("report-waste");
//   };

//   // Function to close the report view
//   const handleCloseReport = () => {
//     setActiveService(null);
//   };

//   const Brand = () => (
//     <div className="flex items-center justify-between py-5 md:block">
//       <a href="/">
//         <div className="flex items-center">
//           <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//           </svg>
//           <span className="ml-2 text-xl font-bold text-gray-800">EcoWaste</span>
//         </div>
//       </a>
//       <div className="md:hidden">
//         <button
//           className="menu-btn text-gray-500 hover:text-gray-800"
//           onClick={() => setIsMobileOpen(!isMobileOpen)}
//         >
//           {isMobileOpen ? (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           ) : (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={1.5}
//               stroke="currentColor"
//               className="w-6 h-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
//               />
//             </svg>
//           )}
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="relative min-h-screen flex flex-col">
//       {/* Gradient background */}
//       <div
//         className="absolute inset-0 blur-xl h-[580px]"
//         style={{
//           background:
//             "linear-gradient(143.6deg, rgba(16, 185, 129, 0) 20.79%, rgba(16, 185, 129, 0.2) 40.92%, rgba(16, 185, 129, 0.1) 70.35%)",
//         }}
//       ></div>

//       <div className="relative flex flex-col flex-grow">
//         {/* Header */}
//         <header>
//           <div className={`md:hidden ${isMobileOpen ? "mx-2 pb-5" : "hidden"}`}>
//             <Brand />
//           </div>
//           <nav
//             className={`pb-5 md:text-sm ${
//               isMobileOpen
//                 ? "absolute top-0 inset-x-0 bg-white shadow-lg rounded-xl border mx-2 mt-2 md:shadow-none md:border-none md:mx-0 md:mt-0 md:relative md:bg-transparent"
//                 : ""
//             }`}
//           >
//             <div className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8">
//               <Brand />
//               <div
//                 className={`flex-1 items-center mt-8 md:mt-0 md:flex ${
//                   isMobileOpen ? "block" : "hidden"
//                 }`}
//               >
//                 {/* Desktop navigation links */}
//                 <ul className="flex-1 justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
//                   {navigation.map((item, idx) => (
//                     <li
//                       key={idx}
//                       className="text-gray-700 hover:text-gray-900"
//                     >
//                       <a
//                         href={item.path}
//                         className="block"
//                         onClick={() => setIsMobileOpen(false)}
//                       >
//                         {item.title}
//                       </a>
//                     </li>
//                   ))}
//                 </ul>

//                 {/* Auth buttons */}
//                 <div className="items-center justify-end mt-6 space-y-6 md:flex md:mt-0">
//                   {currentUser ? (
//                     <ProfileDropdown />
//                   ) : (
//                     <button
//                       onClick={() => setIsAuthModalOpen(true)}
//                       className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-full"
//                     >
//                       Sign in
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                         className="w-5 h-5"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </nav>
//         </header>

//         {/* Page content */}
//         <main className="flex-grow pb-16 md:pb-0">
//           {activeService === "report-waste" ? (
//             <div className="max-w-screen-xl mx-auto px-4 py-12">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800">Report Waste</h2>
//                 <button
//                   onClick={handleCloseReport}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//               <ReportWaste onSuccess={handleCloseReport} onClose={handleCloseReport} />
//             </div>
//           ) : (
//             children
//           )}
//         </main>

//         {/* Mobile Bottom Navbar */}
//         <BottomNavbar onReportClick={handleReportClick} />

//         {/* Authentication modal */}
//         <AuthModal
//           isOpen={isAuthModalOpen}
//           onClose={() => setIsAuthModalOpen(false)}
//         />
//       </div>
//     </div>
//   );
// };

// export default Layout;

// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import AuthModal from './AuthModal';
// import ProfileDropdown from './ProfileDropdown';
// import ReportWaste from './ReportWaste';

// const navigation = [
//   { title: "Dashboard", path: "#" },
// ];

// const Layout = ({ children }) => {
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [activeService, setActiveService] = useState(null);
//   const { currentUser } = useAuth();

//   const handleReportClick = () => {
//     setActiveService("report-waste");
//   };

//   const handleCloseReport = () => {
//     setActiveService(null);
//   };

//   const Brand = () => (
//     <div className="flex items-center justify-between py-5 md:block">
//       <a href="/">
//         <div className="flex items-center">
//           <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//           </svg>
//           <span className="ml-2 text-xl font-bold text-gray-800">EcoWaste</span>
//         </div>
//       </a>
//       <div className="md:hidden">
//         <button
//           className="menu-btn text-gray-500 hover:text-gray-800"
//           onClick={() => setIsMobileOpen(!isMobileOpen)}
//         >
//           {isMobileOpen ? (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           ) : (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={1.5}
//               stroke="currentColor"
//               className="w-6 h-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
//               />
//             </svg>
//           )}
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="relative min-h-screen flex flex-col">
//       {/* Gradient background */}
//       <div
//         className="absolute inset-0 blur-xl h-[580px]"
//         style={{
//           background:
//             "linear-gradient(143.6deg, rgba(16, 185, 129, 0) 20.79%, rgba(16, 185, 129, 0.2) 40.92%, rgba(16, 185, 129, 0.1) 70.35%)",
//         }}
//       ></div>

//       <div className="relative flex flex-col flex-grow">
//         {/* Header */}
//         <header>
//           <div className={`md:hidden ${isMobileOpen ? "mx-2 pb-5" : "hidden"}`}>
//             <Brand />
//           </div>
//           <nav
//             className={`pb-5 md:text-sm ${
//               isMobileOpen
//                 ? "absolute top-0 inset-x-0 bg-white shadow-lg rounded-xl border mx-2 mt-2 md:shadow-none md:border-none md:mx-0 md:mt-0 md:relative md:bg-transparent"
//                 : ""
//             }`}
//           >
//             <div className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8">
//               <Brand />
//               <div
//                 className={`flex-1 items-center mt-8 md:mt-0 md:flex ${
//                   isMobileOpen ? "block" : "hidden"
//                 }`}
//               >
//                 {/* Desktop navigation links */}
//                 <ul className="flex-1 justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
//                   {navigation.map((item, idx) => (
//                     <li
//                       key={idx}
//                       className="text-gray-700 hover:text-gray-900"
//                     >
//                       <a
//                         href={item.path}
//                         className="block"
//                         onClick={() => setIsMobileOpen(false)}
//                       >
//                         {item.title}
//                       </a>
//                     </li>
//                   ))}
//                 </ul>

//                 {/* Auth buttons and camera icon */}
//                 <div className="items-center justify-end mt-6 space-y-6 md:flex md:mt-0 md:space-y-0 md:space-x-4">
//                   {currentUser && (
//                     <button
//                       onClick={handleReportClick}
//                       className="flex items-center justify-center p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
//                       title="Report Waste"
//                     >
//                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                     </button>
//                   )}
                  
//                   {currentUser ? (
//                     <ProfileDropdown />
//                   ) : (
//                     <button
//                       onClick={() => setIsAuthModalOpen(true)}
//                       className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-full"
//                     >
//                       Sign in
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                         className="w-5 h-5"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </nav>
//         </header>

//         {/* Page content */}
//         <main className="flex-grow">
//           {activeService === "report-waste" ? (
//             <div className="max-w-screen-xl mx-auto px-4 py-12">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800">Report Waste</h2>
//                 <button
//                   onClick={handleCloseReport}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//               <ReportWaste onSuccess={handleCloseReport} onClose={handleCloseReport} />
//             </div>
//           ) : (
//             children
//           )}
//         </main>

//         {/* Authentication modal */}
//         <AuthModal
//           isOpen={isAuthModalOpen}
//           onClose={() => setIsAuthModalOpen(false)}
//         />
//       </div>
//     </div>
//   );
// };

// export default Layout;

// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import AuthModal from './AuthModal';
// import ProfileDropdown from './ProfileDropdown';
// import MobileNavbar from './MobileNavbar';

// const Layout = ({ children }) => {
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const { currentUser } = useAuth();

//   const Brand = () => (
//     <div className="flex items-center justify-between py-5 md:block">
//       <a href="/">
//         <div className="flex items-center">
//           <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//           </svg>
//           <span className="ml-2 text-xl font-bold text-gray-800">EcoWaste</span>
//         </div>
//       </a>
//       <div className="md:hidden">
//         <button
//           className="menu-btn text-gray-500 hover:text-gray-800"
//           onClick={() => setIsMobileOpen(!isMobileOpen)}
//         >
//           {isMobileOpen ? (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           ) : (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={1.5}
//               stroke="currentColor"
//               className="w-6 h-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
//               />
//             </svg>
//           )}
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="relative min-h-screen flex flex-col">
//       {/* Gradient background */}
//       <div
//         className="absolute inset-0 blur-xl h-[580px]"
//         style={{
//           background:
//             "linear-gradient(143.6deg, rgba(16, 185, 129, 0) 20.79%, rgba(16, 185, 129, 0.2) 40.92%, rgba(16, 185, 129, 0.1) 70.35%)",
//         }}
//       ></div>

//       <div className="relative flex flex-col flex-grow">
//         {/* Header */}
//         <header>
//           <div className={`md:hidden ${isMobileOpen ? "mx-2 pb-5" : "hidden"}`}>
//             <Brand />
//           </div>
//           <nav
//             className={`pb-5 md:text-sm ${
//               isMobileOpen
//                 ? "absolute top-0 inset-x-0 bg-white shadow-lg rounded-xl border mx-2 mt-2 md:shadow-none md:border-none md:mx-0 md:mt-0 md:relative md:bg-transparent"
//                 : ""
//             }`}
//           >
//             <div className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8">
//               <Brand />
//               <div
//                 className={`flex-1 items-center mt-8 md:mt-0 md:flex ${
//                   isMobileOpen ? "block" : "hidden"
//                 }`}
//               >
//                 {/* Desktop navigation links */}
//                 <ul className="flex-1 justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
//                   {currentUser ? (
//                     // Show dashboard link for logged-in users
//                     <li className="text-gray-700 hover:text-gray-900">
//                       <a href="/" className="block">Dashboard</a>
//                     </li>
//                   ) : (
//                     // Show public navigation for non-logged-in users
//                     <>
//                       <li className="text-gray-700 hover:text-gray-900">
//                         <a href="#features" className="block" onClick={() => setIsMobileOpen(false)}>How It Works</a>
//                       </li>
//                       <li className="text-gray-700 hover:text-gray-900">
//                         <a href="#about" className="block" onClick={() => setIsMobileOpen(false)}>About</a>
//                       </li>
//                       <li className="text-gray-700 hover:text-gray-900">
//                         <a href="#contact" className="block" onClick={() => setIsMobileOpen(false)}>Contact</a>
//                       </li>
//                     </>
//                   )}
//                 </ul>

//                 {/* Auth buttons and camera icon */}
//                 <div className="items-center justify-end mt-6 space-y-6 md:flex md:mt-0 md:space-y-0 md:space-x-4">
//                   {currentUser ? (
//                     <>
//                       <button
//                         onClick={() => window.location.href = '/#report-waste'}
//                         className="flex items-center justify-center p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
//                         title="Report Waste"
//                       >
//                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                         </svg>
//                       </button>
//                       <ProfileDropdown />
//                     </>
//                   ) : (
//                     <button
//                       onClick={() => setIsAuthModalOpen(true)}
//                       className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-full"
//                     >
//                       Sign in
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                         className="w-5 h-5"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </nav>
//         </header>

//         {/* Page content */}
//         <main className="flex-grow">
//           {children}
//         </main>

//         {/* Authentication modal */}
//         <AuthModal
//           isOpen={isAuthModalOpen}
//           onClose={() => setIsAuthModalOpen(false)}
//         />
//       </div>
//     </div>
//   );
// };

// export default Layout;

// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import AuthModal from './AuthModal';
// import ProfileDropdown from './ProfileDropdown';
// import MobileNavbar from './MobileNavbar';
// import { Link } from 'react-router-dom';

// const Layout = ({ children }) => {
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const { currentUser } = useAuth();

//   const Brand = () => (
//     <div className="flex items-center justify-between py-5 md:block">
//       <Link to="/">
//         <div className="flex items-center">
//           <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//           </svg>
//           <span className="ml-2 text-xl font-bold text-gray-800">EcoWaste</span>
//         </div>
//       </Link>
//       <div className="md:hidden">
//         <button
//           className="menu-btn text-gray-500 hover:text-gray-800"
//           onClick={() => setIsMobileOpen(!isMobileOpen)}
//         >
//           {isMobileOpen ? (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           ) : (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={1.5}
//               stroke="currentColor"
//               className="w-6 h-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
//               />
//             </svg>
//           )}
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="relative min-h-screen flex flex-col">
//       {/* Gradient background */}
//       <div
//         className="absolute inset-0 blur-xl h-[580px]"
//         style={{
//           background:
//             "linear-gradient(143.6deg, rgba(16, 185, 129, 0) 20.79%, rgba(16, 185, 129, 0.2) 40.92%, rgba(16, 185, 129, 0.1) 70.35%)",
//         }}
//       ></div>

//       <div className="relative flex flex-col flex-grow">
//         {/* Header */}
//         <header>
//           <div className={`md:hidden ${isMobileOpen ? "mx-2 pb-5" : "hidden"}`}>
//             <Brand />
//           </div>
//           <nav
//             className={`pb-5 md:text-sm ${
//               isMobileOpen
//                 ? "absolute top-0 inset-x-0 bg-white shadow-lg rounded-xl border mx-2 mt-2 md:shadow-none md:border-none md:mx-0 md:mt-0 md:relative md:bg-transparent"
//                 : ""
//             }`}
//           >
//             <div className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8">
//               <Brand />
//               <div
//                 className={`flex-1 items-center mt-8 md:mt-0 md:flex ${
//                   isMobileOpen ? "block" : "hidden"
//                 }`}
//               >
//                 {/* Desktop navigation links */}
//                 <ul className="flex-1 justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
//                   {currentUser ? (
//                     // Show dashboard link for logged-in users
//                     <li className="text-gray-700 hover:text-gray-900">
//                       <Link to="/" className="block">Dashboard</Link>
//                     </li>
//                   ) : (
//                     // Show public navigation for non-logged-in users
//                     <>
//                       <li className="text-gray-700 hover:text-gray-900">
//                         <a href="#features" className="block" onClick={() => setIsMobileOpen(false)}>How It Works</a>
//                       </li>
//                       <li className="text-gray-700 hover:text-gray-900">
//                         <a href="#about" className="block" onClick={() => setIsMobileOpen(false)}>About</a>
//                       </li>
//                       <li className="text-gray-700 hover:text-gray-900">
//                         <a href="#contact" className="block" onClick={() => setIsMobileOpen(false)}>Contact</a>
//                       </li>
//                     </>
//                   )}
//                 </ul>

//                 {/* Auth buttons and camera icon */}
//                 <div className="items-center justify-end mt-6 space-y-6 md:flex md:mt-0 md:space-y-0 md:space-x-4">
//                   {currentUser ? (
//                     <>
//                       <button
//                         onClick={() => window.location.href = '/#report-waste'}
//                         className="flex items-center justify-center p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
//                         title="Report Waste"
//                       >
//                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                         </svg>
//                       </button>
//                       <ProfileDropdown />
//                     </>
//                   ) : (
//                     <button
//                       onClick={() => setIsAuthModalOpen(true)}
//                       className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-full"
//                     >
//                       Sign in
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                         className="w-5 h-5"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </nav>
//         </header>

//         {/* Page content - add padding for mobile navbar */}
//         <main className="flex-grow pb-16 md:pb-0">
//           {children}
//         </main>

//         {/* Mobile Navbar for non-admin users */}
//         {currentUser && currentUser.role !== 'admin' && (
//           <MobileNavbar />
//         )}

//         {/* Authentication modal */}
//         <AuthModal
//           isOpen={isAuthModalOpen}
//           onClose={() => setIsAuthModalOpen(false)}
//         />
//       </div>
//     </div>
//   );
// };

// export default Layout;

// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import AuthModal from './AuthModal';
// import { Link } from 'react-router-dom';

// const Layout = ({ children }) => {
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const { currentUser } = useAuth();

//   const Brand = () => (
//     <Link to="/" className="flex items-center">
//       <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//       </svg>
//       <span className="ml-2 text-xl font-bold text-gray-800">EcoWaste</span>
//     </Link>
//   );

//   return (
//     <div className="relative min-h-screen flex flex-col">
//       {/* Gradient background */}
//       <div
//         className="absolute inset-0 blur-xl h-[580px]"
//         style={{
//           background:
//             "linear-gradient(143.6deg, rgba(16, 185, 129, 0) 20.79%, rgba(16, 185, 129, 0.2) 40.92%, rgba(16, 185, 129, 0.1) 70.35%)",
//         }}
//       ></div>

//       <div className="relative flex flex-col flex-grow">
//         {/* Header - Simplified like reference site */}
//         <header className="bg-white shadow-sm">
//           <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
//             <Brand />
            
//             <div className="flex items-center space-x-4">
//               {/* Camera icon for reporting waste */}
//               {currentUser && currentUser.role !== 'admin' && (
//                 <button
//                   onClick={() => window.location.href = '/#report-waste'}
//                   className="flex items-center justify-center p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
//                   title="Report Waste"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                 </button>
//               )}
              
//               {/* User profile icon (like VG in reference) */}
//               {currentUser ? (
//                 <Link to="/profile" className="flex items-center">
//                   <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
//                     {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
//                   </div>
//                 </Link>
//               ) : (
//                 <button
//                   onClick={() => setIsAuthModalOpen(true)}
//                   className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-full"
//                 >
//                   Sign in
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                     className="w-5 h-5"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="flex-grow">
//           {children}
//         </main>

//         {/* Authentication modal */}
//         <AuthModal
//           isOpen={isAuthModalOpen}
//           onClose={() => setIsAuthModalOpen(false)}
//         />
//       </div>
//     </div>
//   );
// };

// export default Layout;
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { Link } from 'react-router-dom';
import BottomNavbar from './BottomNavbar';

const Layout = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { currentUser } = useAuth();

  const Brand = () => (
    <Link to="/" className="flex items-center">
      <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <span className="ml-2 text-xl font-bold text-gray-800">SwacchConnect</span>
    </Link>
  );

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Gradient background */}
      <div
        className="absolute inset-0 blur-xl h-[580px]"
        style={{
          background:
            "linear-gradient(143.6deg, rgba(16, 185, 129, 0) 20.79%, rgba(16, 185, 129, 0.2) 40.92%, rgba(16, 185, 129, 0.1) 70.35%)",
        }}
      ></div>

      <div className="relative flex flex-col flex-grow">
        {/* Header - Simplified like reference site */}
        <header className="bg-white shadow-sm">
          <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
            <Brand />
            
            <div className="flex items-center space-x-4">
            
              
              {/* User profile icon (like VG in reference) */}
              {currentUser ? (
                <Link to="/profile" className="flex items-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </Link>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-full"
                >
                  Sign in
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-grow pb-16">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        {currentUser && currentUser.role !== 'admin' && (
          <BottomNavbar onReportClick={() => window.location.href = '/#report-waste'} />
        )}

        {/* Authentication modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Layout;