import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Search,
    Filter,
    Calendar,
    TrendingUp,
    FileText,
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight,
    SortDesc,
    Clock,
    Building,
    User,
    LogOut,
    Upload,
    BarChart3,
} from 'lucide-react'
import { analysisService, transformAnalysisData } from '../services/analysisService'
import AnalysisCard from '../components/AnalysisCard'
import AnalysisModal from '../components/AnalysisModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import LoadingSpinner from '../components/LoadingSpinner'

const PastAnalyses = () => {
    const [analyses, setAnalyses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('created_at')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalAnalyses, setTotalAnalyses] = useState(0)
    const [selectedAnalysis, setSelectedAnalysis] = useState(null)
    const [showAnalysisModal, setShowAnalysisModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteAnalysisId, setDeleteAnalysisId] = useState(null)
    const [analytics, setAnalytics] = useState(null)
    const [filterBy, setFilterBy] = useState('all')

    const navigate = useNavigate()
    const itemsPerPage = 12

    useEffect(() => {
        fetchAnalyses()
    }, [currentPage, searchTerm, sortBy, filterBy])

    const fetchAnalyses = async () => {
        try {
            setLoading(true)
            const response = await analysisService.getPastAnalyses(currentPage, itemsPerPage, searchTerm, sortBy)

            // Transform API data to component format
            const transformedAnalyses = response.analyses.map(transformAnalysisData)

            setAnalyses(transformedAnalyses)
            setTotalAnalyses(response.total)
            setTotalPages(response.total_pages)

            // Calculate analytics from the data
            calculateAnalytics(transformedAnalyses)

            setError(null)
        } catch (err) {
            setError('Failed to fetch past analyses. Please try again.')
            console.error('Fetch error:', err)
        } finally {
            setLoading(false)
        }
    }

    const calculateAnalytics = (analysesData) => {
        if (!analysesData.length) {
            setAnalytics({
                total_analyses: 0,
                average_match_score: 0,
                highest_match_score: 0,
                recent_analyses: 0,
            })
            return
        }

        const matchScores = analysesData.map((a) => a.match_percentage)
        const avgScore = matchScores.reduce((sum, score) => sum + score, 0) / matchScores.length
        const maxScore = Math.max(...matchScores)

        // Recent analyses (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const recentCount = analysesData.filter((a) => new Date(a.created_at) > thirtyDaysAgo).length

        setAnalytics({
            total_analyses: analysesData.length,
            average_match_score: Math.round(avgScore * 10) / 10,
            highest_match_score: maxScore,
            recent_analyses: recentCount,
        })
    }

    const handleViewAnalysis = (analysisId) => {
        const analysis = analyses.find((a) => a.analysis_id === analysisId)
        if (analysis) {
            setSelectedAnalysis(analysis)
            setShowAnalysisModal(true)
        }
    }

    const handleDeleteAnalysis = (analysisId) => {
        setDeleteAnalysisId(analysisId)
        setShowDeleteModal(true)
    }

    const confirmDelete = async () => {
        try {
            // await analysisService.deleteAnalysis(deleteAnalysisId);
            setAnalyses(analyses.filter((a) => a.analysis_id !== deleteAnalysisId))
            setTotalAnalyses((prev) => prev - 1)
            setShowDeleteModal(false)
            setDeleteAnalysisId(null)
        } catch (err) {
            alert('Failed to delete analysis')
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated')
        navigate('/login')
    }

    const filteredAnalyses = analyses.filter((analysis) => {
        const matchesSearch =
            analysis.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (analysis.company && analysis.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
            analysis.candidate_name.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilter =
            filterBy === 'all' ||
            (filterBy === 'high_match' && analysis.match_percentage >= 80) ||
            (filterBy === 'medium_match' && analysis.match_percentage >= 60 && analysis.match_percentage < 80) ||
            (filterBy === 'low_match' && analysis.match_percentage < 60)

        return matchesSearch && matchesFilter
    })

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <header className='bg-white shadow-sm border-b'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        <div className='flex items-center space-x-4'>
                            <div className='bg-purple-600 rounded-lg p-2'>
                                <BarChart3 className='w-6 h-6 text-white' />
                            </div>
                            <h1 className='text-xl font-bold text-gray-900'>Past Analyses</h1>
                        </div>
                        <div className='flex items-center space-x-4'>
                            <button
                                onClick={() => navigate('/upload')}
                                className='flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors'
                            >
                                <Upload className='w-4 h-4' />
                                <span>New Analysis</span>
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors'
                            >
                                <TrendingUp className='w-4 h-4' />
                                <span>Dashboard</span>
                            </button>
                            <div className='flex items-center space-x-2'>
                                <User className='w-5 h-5 text-gray-500' />
                                <span className='text-gray-700'>Welcome, User</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className='flex items-center space-x-2 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md'
                            >
                                <LogOut className='w-4 h-4' />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Analytics Summary */}
                {analytics && (
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
                        <div className='bg-white rounded-lg shadow p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-gray-600'>Total Analyses</p>
                                    <p className='text-3xl font-bold text-gray-900'>{analytics.total_analyses}</p>
                                </div>
                                <FileText className='w-10 h-10 text-blue-500' />
                            </div>
                        </div>
                        <div className='bg-white rounded-lg shadow p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-gray-600'>Average Score</p>
                                    <p className='text-3xl font-bold text-gray-900'>{analytics.average_match_score}%</p>
                                </div>
                                <TrendingUp className='w-10 h-10 text-green-500' />
                            </div>
                        </div>
                        <div className='bg-white rounded-lg shadow p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-gray-600'>Best Match</p>
                                    <p className='text-3xl font-bold text-gray-900'>{analytics.highest_match_score}%</p>
                                </div>
                                <TrendingUp className='w-10 h-10 text-yellow-500' />
                            </div>
                        </div>
                        <div className='bg-white rounded-lg shadow p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-gray-600'>This Month</p>
                                    <p className='text-3xl font-bold text-gray-900'>{analytics.recent_analyses}</p>
                                </div>
                                <Clock className='w-10 h-10 text-purple-500' />
                            </div>
                        </div>
                    </div>
                )}

                {/* Search and Filter Bar */}
                <div className='bg-white rounded-lg shadow p-6 mb-8'>
                    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                        <div className='flex flex-col sm:flex-row gap-4 flex-1'>
                            {/* Search */}
                            <div className='relative flex-1 max-w-md'>
                                <Search className='absolute left-3 top-3.5 h-4 w-4 text-gray-400' />
                                <input
                                    type='text'
                                    placeholder='Search by job title, company, or candidate...'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                                />
                            </div>

                            {/* Filter by Match Score */}
                            <div className='relative'>
                                <Filter className='absolute left-3 top-3.5 h-4 w-4 text-gray-400' />
                                <select
                                    value={filterBy}
                                    onChange={(e) => setFilterBy(e.target.value)}
                                    className='pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white'
                                >
                                    <option value='all'>All Matches</option>
                                    <option value='high_match'>High Match (80%+)</option>
                                    <option value='medium_match'>Medium Match (60-79%)</option>
                                    <option value='low_match'>Low Match (&lt;60%)</option>
                                </select>
                            </div>
                        </div>

                        {/* Sort */}
                        <div className='flex items-center space-x-2'>
                            <SortDesc className='w-4 h-4 text-gray-400' />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white'
                            >
                                <option value='created_at'>Latest First</option>
                                <option value='match_percentage'>Highest Match</option>
                                <option value='job_title'>Job Title</option>
                                <option value='company'>Company</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
                        <p className='text-red-800'>{error}</p>
                        <button onClick={fetchAnalyses} className='mt-2 text-red-600 hover:text-red-800 font-medium'>
                            Try Again
                        </button>
                    </div>
                )}

                {/* Analyses Grid */}
                {filteredAnalyses.length === 0 ? (
                    <div className='text-center py-16'>
                        <FileText className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>No analyses found</h3>
                        <p className='text-gray-600 mb-6'>
                            {searchTerm || filterBy !== 'all'
                                ? 'Try adjusting your search or filters.'
                                : 'Start by analyzing your first resume against a job description.'}
                        </p>
                        <button
                            onClick={() => navigate('/upload')}
                            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors'
                        >
                            Create First Analysis
                        </button>
                    </div>
                ) : (
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8'>
                            {filteredAnalyses.map((analysis) => (
                                <AnalysisCard
                                    key={analysis.analysis_id}
                                    analysis={analysis}
                                    onView={() => handleViewAnalysis(analysis.analysis_id)}
                                    onDelete={() => handleDeleteAnalysis(analysis.analysis_id)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className='flex items-center justify-between bg-white rounded-lg shadow p-4'>
                                <div className='text-sm text-gray-700'>
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalAnalyses)} of{' '}
                                    {totalAnalyses} results
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className='flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        <ChevronLeft className='w-4 h-4 mr-1' />
                                        Previous
                                    </button>
                                    <span className='px-4 py-2 text-sm font-medium'>
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className='flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        Next
                                        <ChevronRight className='w-4 h-4 ml-1' />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Analysis Detail Modal */}
            {showAnalysisModal && selectedAnalysis && (
                <AnalysisModal
                    analysis={selectedAnalysis}
                    onClose={() => {
                        setShowAnalysisModal(false)
                        setSelectedAnalysis(null)
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <DeleteConfirmModal
                    onConfirm={confirmDelete}
                    onCancel={() => {
                        setShowDeleteModal(false)
                        setDeleteAnalysisId(null)
                    }}
                />
            )}
        </div>
    )
}

export default PastAnalyses
