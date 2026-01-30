import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({
    totalRecords: 0,
    currentCGPA: 0,
    totalCredits: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCGPARecords();
  }, []);

  const fetchCGPARecords = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/cgpa/records');
      
      if (response.data.success) {
        setRecords(response.data.data.records);
        setSummary(response.data.data.summary);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch CGPA records');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGradeColor = (gpa) => {
    if (gpa >= 3.5) return '#27ae60';
    if (gpa >= 3.0) return '#f39c12';
    if (gpa >= 2.5) return '#e67e22';
    return '#e74c3c';
  };

  if (isLoading) {
    return <LoadingSpinner size="large" message="Loading your dashboard..." />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome back, {user?.firstName}! 👋</h1>
          <p>Track your academic progress and calculate your CGPA efficiently.</p>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card cgpa-card">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>Current CGPA</h3>
              <div 
                className="cgpa-value"
                style={{ color: getGradeColor(summary.currentCGPA) }}
              >
                {summary.currentCGPA.toFixed(2)}
              </div>
              <p>Out of 4.00</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">📚</div>
            <div className="card-content">
              <h3>Total Credits</h3>
              <div className="card-value">{summary.totalCredits}</div>
              <p>Credit hours completed</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">📝</div>
            <div className="card-content">
              <h3>Semesters</h3>
              <div className="card-value">{summary.totalRecords}</div>
              <p>Records maintained</p>
            </div>
          </div>

          <div className="summary-card action-card">
            <div className="card-icon">➕</div>
            <div className="card-content">
              <h3>Add New Semester</h3>
              <Link to="/calculator" className="action-button">
                Calculate CGPA
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Records Section */}
        <div className="records-section">
          <div className="section-header">
            <h2>Recent Semester Records</h2>
            {records.length > 0 && (
              <Link to="/calculator" className="view-all-btn">
                Add New Record
              </Link>
            )}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {records.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No CGPA records yet</h3>
              <p>Start by adding your first semester's grades to calculate your CGPA.</p>
              <Link to="/calculator" className="get-started-btn">
                Get Started
              </Link>
            </div>
          ) : (
            <div className="records-grid">
              {records.map((record) => (
                <div key={record._id} className="record-card">
                  <div className="record-header">
                    <h4>{record.semester} {record.year}</h4>
                    <div className="record-date">
                      {formatDate(record.createdAt)}
                    </div>
                  </div>
                  
                  <div className="record-stats">
                    <div className="stat">
                      <span className="stat-label">Semester GPA</span>
                      <span 
                        className="stat-value"
                        style={{ color: getGradeColor(record.semesterGPA) }}
                      >
                        {record.semesterGPA.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="stat">
                      <span className="stat-label">Cumulative CGPA</span>
                      <span 
                        className="stat-value"
                        style={{ color: getGradeColor(record.cumulativeCGPA) }}
                      >
                        {record.cumulativeCGPA.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="stat">
                      <span className="stat-label">Credits</span>
                      <span className="stat-value">
                        {record.totalCredits}
                      </span>
                    </div>
                  </div>

                  <div className="course-summary">
                    <h5>Courses ({record.courses.length})</h5>
                    <div className="course-list">
                      {record.courses.slice(0, 3).map((course, index) => (
                        <div key={index} className="course-item">
                          <span className="course-code">{course.courseCode}</span>
                          <span className="course-grade">{course.grade}</span>
                        </div>
                      ))}
                      {record.courses.length > 3 && (
                        <div className="course-item more-courses">
                          +{record.courses.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {records.length > 0 && (
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <Link to="/calculator" className="action-item">
                <div className="action-icon">📊</div>
                <div>
                  <h4>Calculate CGPA</h4>
                  <p>Add a new semester record</p>
                </div>
              </Link>
              
              <button className="action-item" onClick={fetchCGPARecords}>
                <div className="action-icon">🔄</div>
                <div>
                  <h4>Refresh Data</h4>
                  <p>Update your records</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;