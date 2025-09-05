// import { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import Layout from '../components/Layout';

// const UserProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const { currentUser } = useAuth();

//   useEffect(() => {
//     fetchUserProfile();
//   }, [currentUser]);

//   const fetchUserProfile = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:8000/api/profile', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setProfile(data.user);
//         setStats(data.stats);
//       } else {
//         setError(data.message || 'Failed to fetch profile');
//       }
//     } catch (error) {
//       setError('Failed to fetch profile. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//         </div>
//       </Layout>
//     );
//   }

//   if (error) {
//     return (
//       <Layout>
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <span className="text-red-700">{error}</span>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   if (!profile) {
//     return null;
//   }

//   return (
//     <Layout>
//       <div className="max-w-2xl mx-auto px-4 py-8">
//         {/* Profile Header - Redesigned */}
//         <div className="text-center mb-8">
//           <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
//             {profile.name?.charAt(0)?.toUpperCase() || 'U'}
//           </div>
//           <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
//           <p className="text-gray-600">Kanpur Citizen</p>
//         </div>

//         <div className="border-t border-gray-200 pt-6 mb-8">
//           <h2 className="text-xl font-bold text-gray-800 mb-6">My Impact</h2>
//           <div className="grid grid-cols-3 gap-4 mb-8">
//             <div className="text-center">
//               <div className="text-2xl font-bold text-gray-800">{stats?.totalPoints || 0}</div>
//               <div className="text-gray-600 text-sm">Total Points</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-gray-800">{stats?.totalReports || 0}</div>
//               <div className="text-gray-600 text-sm">Reports Made</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-gray-800">82</div>
//               <div className="text-gray-600 text-sm">Items Recycled</div>
//             </div>
//           </div>
//         </div>

//         {/* Reports History - Redesigned */}
//         <div className="border-t border-gray-200 pt-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-6">My Reports History</h2>
          
//           {stats?.totalReports > 0 ? (
//             <div className="space-y-4">
//               {/* Sample reports - replace with actual data */}
//               <div className="bg-white rounded-lg p-4 border border-gray-200">
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="font-semibold text-gray-800">Road Cleanliness</h3>
//                   <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Pending</span>
//                 </div>
//                 <p className="text-gray-600 text-sm">Kakadeo</p>
//               </div>
              
//               <div className="bg-white rounded-lg p-4 border border-gray-200">
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="font-semibold text-gray-800">Blocked Drain</h3>
//                   <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">In Progress</span>
//                 </div>
//                 <p className="text-gray-600 text-sm">Swaroop Nagar</p>
//               </div>
              
//               <div className="bg-white rounded-lg p-4 border border-gray-200">
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="font-semibold text-gray-800">Garbage Dump</h3>
//                   <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Resolved</span>
//                 </div>
//                 <p className="text-gray-600 text-sm">Civil Lines</p>
//               </div>
              
//               <button 
//                 onClick={() => window.location.href = '/my-reports'}
//                 className="w-full mt-4 text-green-600 font-semibold py-2 border border-green-600 rounded-lg hover:bg-green-50"
//               >
//                 View All
//               </button>
//             </div>
//           ) : (
//             <div className="text-center py-8 bg-gray-50 rounded-lg">
//               <p className="text-gray-500">You haven't submitted any reports yet</p>
//               <button 
//                 onClick={() => window.location.href = '/'}
//                 className="mt-4 text-green-600 font-semibold py-2 px-4 border border-green-600 rounded-lg hover:bg-green-50"
//               >
//                 Report Your First Issue
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default UserProfile;
// import { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import Layout from '../components/Layout';

// const UserProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [stats, setStats] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const { currentUser } = useAuth();

//   useEffect(() => {
//     fetchUserProfile();
//     fetchUserReports();
//   }, [currentUser]);

//   const fetchUserProfile = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:8000/api/profile', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setProfile(data.user);
//         setStats(data.stats);
//       } else {
//         setError(data.message || 'Failed to fetch profile');
//       }
//     } catch (error) {
//       setError('Failed to fetch profile. Please try again.');
//     }
//   };

//   const fetchUserReports = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:8000/api/reports/my-reports', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setReports(data.reports || []);
//       } else {
//         setError(data.message || 'Failed to fetch reports');
//       }
//     } catch (error) {
//       setError('Failed to fetch reports. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//         </div>
//       </Layout>
//     );
//   }

//   if (error) {
//     return (
//       <Layout>
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <span className="text-red-700">{error}</span>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   if (!profile) {
//     return null;
//   }

//   return (
//     <Layout>
//       <div className="max-w-2xl mx-auto px-4 py-8">
//         {/* Profile Header - Redesigned */}
//         <div className="text-center mb-8">
//           <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
//             {profile.name?.charAt(0)?.toUpperCase() || 'U'}
//           </div>
//           <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
//           <p className="text-gray-600">Kanpur Citizen</p>
//         </div>

//         <div className="border-t border-gray-200 pt-6 mb-8">
//           <h2 className="text-xl font-bold text-gray-800 mb-6">My Impact</h2>
//           <div className="grid grid-cols-3 gap-4 mb-8">
//             <div className="text-center">
//               <div className="text-2xl font-bold text-gray-800">{stats?.totalPoints || 0}</div>
//               <div className="text-gray-600 text-sm">Total Points</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-gray-800">{stats?.totalReports || 0}</div>
//               <div className="text-gray-600 text-sm">Reports Made</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-gray-800">82</div>
//               <div className="text-gray-600 text-sm">Items Recycled</div>
//             </div>
//           </div>
//         </div>

//         {/* Reports History - Redesigned */}
//         <div className="border-t border-gray-200 pt-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-6">My Reports History</h2>
          
//           {reports.length > 0 ? (
//             <div className="space-y-4">
//               {reports.slice(0, 3).map((report) => (
//                 <div key={report._id} className="bg-white rounded-lg p-4 border border-gray-200">
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="font-semibold text-gray-800">
//                       {report.description ? 
//                         (report.description.length > 30 
//                           ? report.description.substring(0, 30) + '...' 
//                           : report.description) 
//                         : "Waste Report"
//                       }
//                     </h3>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       report.status === 'resolved' ? 'bg-green-100 text-green-800' :
//                       report.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
//                       'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {report.status === 'resolved' ? 'Resolved' : 
//                        report.status === 'in-progress' ? 'In Progress' : 'Pending'}
//                     </span>
//                   </div>
//                   <p className="text-gray-600 text-sm">
//                     {report.location?.address || 
//                       (report.location ? 
//                         `${report.location.latitude?.toFixed(6)}, ${report.location.longitude?.toFixed(6)}` 
//                         : "Unknown location")
//                     }
//                   </p>
//                 </div>
//               ))}
              
//               <button 
//                 onClick={() => window.location.href = '/my-reports'}
//                 className="w-full mt-4 text-green-600 font-semibold py-2 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
//               >
//                 View All
//               </button>
//             </div>
//           ) : (
//             <div className="text-center py-8 bg-gray-50 rounded-lg">
//               <p className="text-gray-500">You haven't submitted any reports yet</p>
//               <button 
//                 onClick={() => window.location.href = '/'}
//                 className="mt-4 text-green-600 font-semibold py-2 px-4 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
//               >
//                 Report Your First Issue
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default UserProfile;

// import { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import Layout from '../components/Layout';

// const UserProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [stats, setStats] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const { currentUser, logout } = useAuth();

//   useEffect(() => {
//     fetchUserProfile();
//     fetchUserReports();
//   }, [currentUser]);

//   const fetchUserProfile = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:8000/api/profile', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setProfile(data.user);
//         setStats(data.stats);
//       } else {
//         setError(data.message || 'Failed to fetch profile');
//       }
//     } catch (error) {
//       setError('Failed to fetch profile. Please try again.');
//     }
//   };

//   const fetchUserReports = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:8000/api/reports/my-reports', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setReports(data.reports || []);
//       } else {
//         setError(data.message || 'Failed to fetch reports');
//       }
//     } catch (error) {
//       setError('Failed to fetch reports. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     } catch (err) {
//       console.error('Logout failed', err);
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//         </div>
//       </Layout>
//     );
//   }

//   if (error) {
//     return (
//       <Layout>
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <span className="text-red-700">{error}</span>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   if (!profile) {
//     return null;
//   }

//   return (
//     <Layout>
//       <div className="max-w-2xl mx-auto px-4 py-8">
//         {/* Profile Header */}
//         <div className="text-center mb-8">
//           <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
//             {profile.name?.charAt(0)?.toUpperCase() || 'U'}
//           </div>
//           <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
//           <p className="text-gray-600">Kanpur Citizen</p>

//           {/* Logout Button */}
//           <button 
//             onClick={handleLogout}
//             className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition-colors"
//           >
//             Logout
//           </button>
//         </div>

//         {/* My Impact */}
//         <div className="border-t border-gray-200 pt-6 mb-8">
//           <h2 className="text-xl font-bold text-gray-800 mb-6">My Impact</h2>
//           <div className="grid grid-cols-3 gap-4 mb-8">
//             <div className="text-center">
//               <div className="text-2xl font-bold text-gray-800">{stats?.totalPoints || 0}</div>
//               <div className="text-gray-600 text-sm">Total Points</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-gray-800">{stats?.totalReports || 0}</div>
//               <div className="text-gray-600 text-sm">Reports Made</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-gray-800">82</div>
//               <div className="text-gray-600 text-sm">Items Recycled</div>
//             </div>
//           </div>
//         </div>

//         {/* Reports History */}
//         <div className="border-t border-gray-200 pt-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-6">My Reports History</h2>
          
//           {reports.length > 0 ? (
//             <div className="space-y-4">
//               {reports.slice(0, 3).map((report) => (
//                 <div key={report._id} className="bg-white rounded-lg p-4 border border-gray-200">
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="font-semibold text-gray-800">
//                       {report.description ? 
//                         (report.description.length > 30 
//                           ? report.description.substring(0, 30) + '...' 
//                           : report.description) 
//                         : "Waste Report"
//                       }
//                     </h3>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       report.status === 'resolved' ? 'bg-green-100 text-green-800' :
//                       report.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
//                       'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {report.status === 'resolved' ? 'Resolved' : 
//                        report.status === 'in-progress' ? 'In Progress' : 'Pending'}
//                     </span>
//                   </div>
//                   <p className="text-gray-600 text-sm">
//                     {report.location?.address || 
//                       (report.location ? 
//                         `${report.location.latitude?.toFixed(6)}, ${report.location.longitude?.toFixed(6)}` 
//                         : "Unknown location")
//                     }
//                   </p>
//                 </div>
//               ))}
              
//               <button 
//                 onClick={() => window.location.href = '/my-reports'}
//                 className="w-full mt-4 text-green-600 font-semibold py-2 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
//               >
//                 View All
//               </button>
//             </div>
//           ) : (
//             <div className="text-center py-8 bg-gray-50 rounded-lg">
//               <p className="text-gray-500">You haven't submitted any reports yet</p>
//               <button 
//                 onClick={() => window.location.href = '/'}
//                 className="mt-4 text-green-600 font-semibold py-2 px-4 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
//               >
//                 Report Your First Issue
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default UserProfile;
// import { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import Layout from '../components/Layout';

// const UserProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [stats, setStats] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const { currentUser, logout } = useAuth();

//   useEffect(() => {
//     fetchUserProfile();
//     fetchUserReports();
//   }, [currentUser]);

//   const fetchUserProfile = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:8000/api/profile', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setProfile(data.user);
//         setStats(data.stats);
//       } else {
//         setError(data.message || 'Failed to fetch profile');
//       }
//     } catch {
//       setError('Failed to fetch profile. Please try again.');
//     }
//   };

//   const fetchUserReports = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:8000/api/reports/my-reports', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setReports(data.reports || []);
//       } else {
//         setError(data.message || 'Failed to fetch reports');
//       }
//     } catch {
//       setError('Failed to fetch reports. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     } catch (err) {
//       console.error('Logout failed', err);
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
//         </div>
//       </Layout>
//     );
//   }

//   if (error) {
//     return (
//       <Layout>
//         <div className="max-w-xl mx-auto mt-10 bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
//           <div className="flex items-center">
//             <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
//             </svg>
//             <span className="text-red-700 font-medium">{error}</span>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   if (!profile) return null;

//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto px-6 py-10">
//         {/* Profile Header */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
//           <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-4xl font-bold text-white mx-auto mb-4 shadow-md">
//             {profile.name?.charAt(0)?.toUpperCase() || 'U'}
//           </div>
//           <h1 className="text-3xl font-extrabold text-gray-900">{profile.name}</h1>
//           <p className="text-gray-500">Kanpur Citizen</p>
//           <button
//             onClick={handleLogout}
//             className="mt-5 px-6 py-2 bg-red-600 text-white font-semibold rounded-xl shadow hover:bg-red-700 transition"
//           >
//             Logout
//           </button>
//         </div>

//         {/* My Impact */}
//         <div className="mt-10">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">My Impact</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//             <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
//               <div className="text-3xl font-bold text-green-600">{stats?.totalPoints || 0}</div>
//               <p className="text-gray-500 mt-1">Total Points</p>
//             </div>
//             <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
//               <div className="text-3xl font-bold text-green-600">{stats?.totalReports || 0}</div>
//               <p className="text-gray-500 mt-1">Reports Made</p>
//             </div>
//             <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
//               <div className="text-3xl font-bold text-green-600">82</div>
//               <p className="text-gray-500 mt-1">Items Recycled</p>
//             </div>
//           </div>
//         </div>

//         {/* Reports History */}
//         <div className="mt-12">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">My Reports History</h2>
//           {reports.length > 0 ? (
//             <div className="space-y-4">
//               {reports.slice(0, 3).map((report) => (
//                 <div key={report._id} className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="font-semibold text-gray-800 text-lg">
//                       {report.description
//                         ? report.description.length > 40
//                           ? report.description.substring(0, 40) + '...'
//                           : report.description
//                         : "Waste Report"}
//                     </h3>
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         report.status === 'resolved'
//                           ? 'bg-green-100 text-green-700'
//                           : report.status === 'in-progress'
//                           ? 'bg-blue-100 text-blue-700'
//                           : 'bg-yellow-100 text-yellow-700'
//                       }`}
//                     >
//                       {report.status === 'resolved'
//                         ? 'Resolved'
//                         : report.status === 'in-progress'
//                         ? 'In Progress'
//                         : 'Pending'}
//                     </span>
//                   </div>
//                   <p className="text-gray-500 text-sm">
//                     {report.location?.address ||
//                       (report.location
//                         ? `${report.location.latitude?.toFixed(6)}, ${report.location.longitude?.toFixed(6)}`
//                         : "Unknown location")}
//                   </p>
//                 </div>
//               ))}

//               <button
//                 onClick={() => (window.location.href = '/my-reports')}
//                 className="w-full mt-4 py-3 text-green-600 font-semibold border border-green-600 rounded-xl hover:bg-green-50 transition"
//               >
//                 View All Reports
//               </button>
//             </div>
//           ) : (
//             <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
//               <p className="text-gray-500">You haven&apos;t submitted any reports yet</p>
//               <button
//                 onClick={() => (window.location.href = '/')}
//                 className="mt-4 px-6 py-2 text-green-600 font-semibold border border-green-600 rounded-xl hover:bg-green-50 transition"
//               >
//                 Report Your First Issue
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default UserProfile;
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    fetchUserProfile();
    fetchUserReports();
  }, [currentUser]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setProfile(data.user);
        setStats(data.stats);
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch {
      setError('Failed to fetch profile. Please try again.');
    }
  };

  const fetchUserReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/reports/my-reports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setReports(data.reports || []);
      } else {
        setError(data.message || 'Failed to fetch reports');
      }
    } catch {
      setError('Failed to fetch reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto mt-10 bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-md">
                  {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Kanpur Citizen
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>

          {/* Stats Overview */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              Impact Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats?.totalPoints || 0}</div>
                    <p className="text-sm text-gray-500">Points</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats?.totalReports || 0}</div>
                    <p className="text-sm text-gray-500">Reports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Recent Reports
            </h2>
            {reports.length > 0 && (
              <button
                onClick={() => (window.location.href = '/my-reports')}
                className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>

          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.slice(0, 3).map((report) => (
                <div key={report._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition group">
                  <div className="flex items-start space-x-4 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg mt-1 ${
                      report.status === 'resolved'
                        ? 'bg-green-100 text-green-700'
                        : report.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {report.status === 'resolved' ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : report.status === 'in-progress' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">
                        {report.description || "Waste Report"}
                      </h3>
                      <p className="text-sm text-gray-500 truncate flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {report.location?.address || "Unknown location"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${
                      report.status === 'resolved'
                        ? 'bg-green-100 text-green-700'
                        : report.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {report.status === 'resolved'
                      ? 'Resolved'
                      : report.status === 'in-progress'
                      ? 'In Progress'
                      : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto border border-gray-100">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-4">You haven't submitted any reports yet</p>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Report Your First Issue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;

