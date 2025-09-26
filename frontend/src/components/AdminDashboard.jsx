
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    page: 1,
    limit: 10
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, [filters]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams(filters).toString();
      
      const response = await fetch(`http://localhost:8000/api/reports/admin/reports?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setReports(data.reports);
      } else {
        setError(data.message || 'Failed to fetch reports');
      }
    } catch (error) {
      setError('Failed to fetch reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/reports/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const updateStatus = async (reportId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/reports/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh reports
        fetchReports();
        fetchStats();
        setSelectedReport(null); // Close detail view if open
      } else {
        setError(data.message || 'Failed to update status');
      }
    } catch (error) {
      setError('Failed to update status. Please try again.');
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage waste reports submitted by users</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
          <button 
            onClick={() => setError('')}
            className="mt-2 text-red-600 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats Overview - Mobile responsive grid */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4 sm:gap-4">
          <div className="bg-white rounded-lg shadow p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total Reports</h3>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.totalReports}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Pending</h3>
            <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pendingReports}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">In Progress</h3>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.inProgressReports}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">Resolved</h3>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.resolvedReports}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h3 className="text-base font-medium text-gray-800 mb-3">Filters</h3>
        <div className="flex flex-wrap gap-2">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          
          <select
            value={filters.limit}
            onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value), page: 1 })}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      {/* Reports List - Mobile Cards */}
      <div className="block sm:hidden">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Reports</h3>
        
        {reports.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No reports found</p>
          </div>
        )}
        
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report._id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12">
                    <img 
                      className="h-12 w-12 rounded object-cover" 
                      src={report.imageUrl} 
                      alt={report.description || "Report image"} 
                    />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {report.description || 'No description'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{report.user.name}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  report.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status}
                </span>
              </div>
              
              <div className="text-xs text-gray-500 mb-3">
                {report.location.address || `${report.location.latitude.toFixed(4)}, ${report.location.longitude.toFixed(4)}`}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{formatDate(report.createdAt)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setSelectedReport(report)}
                  className="text-xs text-blue-600 font-medium"
                >
                  View Details
                </button>
                <select
                  value={report.status}
                  onChange={(e) => updateStatus(report._id, e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reports Table - Desktop */}
      <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded object-cover" src={report.imageUrl} alt={report.description} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {report.description || 'No description'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{report.user.name}</div>
                    <div className="text-sm text-gray-500">{report.user.email}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                    {report.location.address || `${report.location.latitude.toFixed(4)}, ${report.location.longitude.toFixed(4)}`}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      report.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={report.status}
                      onChange={(e) => updateStatus(report._id, e.target.value)}
                      className="block w-full pl-3 pr-10 py-1 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {reports.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No reports found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {reports.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(filters.page - 1) * filters.limit + 1}</span> to{' '}
            <span className="font-medium">{Math.min(filters.page * filters.limit, reports.length)}</span> of{' '}
            <span className="font-medium">{reports.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilters({...filters, page: Math.max(1, filters.page - 1)})}
              disabled={filters.page === 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setFilters({...filters, page: filters.page + 1})}
              disabled={reports.length < filters.limit}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Report Detail Modal for Mobile */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 sm:hidden">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">Report Details</h3>
              <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <img 
                  src={selectedReport.imageUrl} 
                  alt={selectedReport.description} 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600">Description</h4>
                <p className="mt-1 text-gray-900">{selectedReport.description || 'No description provided'}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600">Submitted By</h4>
                <p className="mt-1 text-gray-900">{selectedReport.user.name}</p>
                <p className="text-gray-600">{selectedReport.user.email}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600">Location</h4>
                <p className="mt-1 text-gray-900">
                  {selectedReport.location.address || 
                    `${selectedReport.location.latitude.toFixed(6)}, ${selectedReport.location.longitude.toFixed(6)}`
                  }
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600">Status</h4>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedReport.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  selectedReport.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedReport.status}
                </span>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600">Date Submitted</h4>
                <p className="mt-1 text-gray-900">{formatDate(selectedReport.createdAt)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Update Status</h4>
                <select
                  value={selectedReport.status}
                  onChange={(e) => updateStatus(selectedReport._id, e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;