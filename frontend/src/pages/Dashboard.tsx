// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Upload, FileText, Briefcase, TrendingUp, Award, User, LogOut } from 'lucide-react';
import MatchScoreCard from '../components/MatchScoreCard';
import ResumeAnalysis from '../components/ResumeAnalysis';
import JobAnalysis from '../components/JobAnalysis';
import Recommendations from '../components/Recommendations';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisData, setAnalysisData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get analysis data from navigation state or localStorage
    const data = location.state?.analysisData || JSON.parse(localStorage.getItem('analysisData') || 'null');
    
    if (!data) {
      // If no analysis data, redirect to upload page
      navigate('/upload');
      return;
    }
    
    setAnalysisData(data);
    // Store in localStorage for persistence
    localStorage.setItem('analysisData', JSON.stringify(data));
  }, [location.state, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('analysisData');
    navigate('/login');
  };

  const handleNewAnalysis = () => {
    navigate('/upload');
  };

  if (!analysisData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'resume', label: 'Resume Analysis', icon: FileText },
    { id: 'job', label: 'Job Analysis', icon: Briefcase },
    { id: 'recommendations', label: 'Recommendations', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 rounded-lg p-2">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Resume Analyzer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleNewAnalysis}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>New Analysis</span>
              </button>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Welcome, User</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <MatchScoreCard data={analysisData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skills Matched</span>
                    <span className="font-semibold">{analysisData.match_analysis.skill_match.matched.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skills Missing</span>
                    <span className="font-semibold text-red-600">{analysisData.match_analysis.skill_match.missing.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience Level</span>
                    <span className={`font-semibold capitalize ${
                      analysisData.match_analysis.experience_level === 'match' 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                    }`}>
                      {analysisData.match_analysis.experience_level}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
                <div className="space-y-3">
                  {analysisData.recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-600 line-clamp-2">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'resume' && <ResumeAnalysis data={analysisData.parsed_resume} />}
        {activeTab === 'job' && <JobAnalysis data={analysisData.job_analysis} />}
        {activeTab === 'recommendations' && <Recommendations data={analysisData.recommendations} />}
      </main>
    </div>
  );
};

export default Dashboard;
