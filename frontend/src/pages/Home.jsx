import { useState, useEffect } from "react";
import { useAuth} from '../context/AuthContext';
import ReportWaste from '../components/ReportWaste';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from "../components/AdminDashboard";
import { useLocation } from 'react-router-dom';

const Home = () => {
  const [activeService, setActiveService] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, loading: authloading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);
useEffect(() => {
    if (location.state?.openReport) {
      setActiveService("report-waste");
      // Clear state so it doesn’t persist on refresh/back navigation
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };
   useEffect(() => {
  if (!authloading && !currentUser) {
    navigate('/login');
  }
}, [currentUser,authloading, navigate]);

  if (authloading) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </Layout>
    );
  }
 if (!currentUser) {
   // navigate('/login');
    return null;
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect to login if not authenticated
 
  if (currentUser.role === 'admin') {
    return (
      <Layout>
        <AdminDashboard />
      </Layout>
    );
  }

  const handleReportSuccess = () => {
    setActiveService(null);
    fetchDashboardData();
  };

  const handleCloseReport = () => {
    setActiveService(null);
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (error) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>Error loading dashboard: {error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {activeService === "report-waste" ? (
        <div className="max-w-screen-xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Report Waste</h2>
            <button
              onClick={handleCloseReport}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ReportWaste onSuccess={handleReportSuccess} />
        </div>
      ) : (
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back,</h1>
            <h2 className="text-3xl font-bold text-green-600">{currentUser?.name || 'User'}</h2>
          </div>

          {/* Report Issue Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Report an issue</h3>
            <p className="text-gray-600 mb-6">Your report makes our community cleaner. Thank you for your contribution.</p>
            <button
              onClick={() => setActiveService("report-waste")}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Report Now
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-gray-800">{dashboardData?.stats?.userPoints || 0}</div>
              <div className="text-gray-600 text-sm">Points Earned</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-gray-800">{dashboardData?.stats?.userReports || 0}</div>
              <div className="text-gray-600 text-sm">Total Reports</div>
            </div>
          </div>

          {/* Recent Reports - Enhanced with Light Green Background */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Reports</h3>
              <div className="text-sm text-green-600 font-medium">
                {dashboardData?.stats?.userResolvedReports || 0} Resolved
              </div>
            </div>
            
            {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentActivity.slice(0, 3).map((activity, index) => {
                  const report = activity.reportId ? 
                    dashboardData.recentReports?.find(r => r._id === activity.reportId) : null;
                  
                  if (!report) return null;
                  
                  return (
                    <div key={index} className="bg-green-50 border border-green-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-800 text-lg">
                          {report.description ? 
                            (report.description.length > 40 
                              ? report.description.substring(0, 40) + '...' 
                              : report.description) 
                            : "Waste Report"
                          }
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          report.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status === 'resolved' ? 'Resolved' : 
                          report.status === 'in-progress' ? 'In Progress' : 'Pending'}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">
                          {report.location?.address || 
                            (report.location ? 
                              `${report.location.latitude?.toFixed(6)}, ${report.location.longitude?.toFixed(6)}` 
                              : "Unknown location")
                          }
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{formatDate(report.createdAt)}</span>
                        {report.status === 'resolved' && (
                          <span className="flex items-center text-green-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            +20 points
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">You haven't submitted any reports yet</p>
                <button
                  onClick={() => setActiveService("report-waste")}
                  className="mt-4 text-green-600 font-medium hover:text-green-700"
                >
                  Submit your first report
                </button>
              </div>
            )}
            
            {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 && (
              <button 
                onClick={() => navigate('/my-reports')}
                className="w-full mt-6 flex items-center justify-center text-green-600 font-semibold py-3 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                View All Reports
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Home;