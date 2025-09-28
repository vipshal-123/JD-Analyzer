import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, FileText, ChevronLeft, ChevronRight, Clock, User, LogOut, Upload, BarChart3 } from 'lucide-react'
import AnalysisCard from '../components/AnalysisCard'
import AnalysisModal from '../components/AnalysisModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import LoadingSpinner from '../components/LoadingSpinner'
import { deleteAnalysis, pastAnalysis } from '@/services/v1/agent/agent.service'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import { openToast } from '@/redux/slice/toastSlice'
import type { RootState } from '@/redux/store'
import isEmpty from 'is-empty'

interface Analysis {
    _id: string
    job_title: string
    company?: string
    candidate_name: string
    match_percentage: number
    created_at: string
}

interface Analytics {
    total_analyses: number
    average_match_score: number
    highest_match_score: number
    recent_analyses: number
}

const PastAnalyses: React.FC = () => {
    const [analyses, setAnalyses] = useState<Analysis[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [totalAnalyses, setTotalAnalyses] = useState<number>(0)
    const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null)
    const [showAnalysisModal, setShowAnalysisModal] = useState<boolean>(false)
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const [deleteAnalysisId, setDeleteAnalysisId] = useState<string | null>(null)
    const [analytics, setAnalytics] = useState<Analytics | null>(null)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
    const state = useTypedSelector((state) => state?.auth)

    const itemsPerPage = 12

    const fetchAnalyses = useCallback(async () => {
        try {
            setLoading(true)

            const response = await pastAnalysis({ currentPage, itemsPerPage })

            if (response.success) {
                setAnalyses(response.data as Analysis[])
                const { paginate } = response
                setTotalAnalyses(paginate?.total_items || 0)
                setTotalPages(paginate?.total_pages || 0)

                if (response?.analytics) {
                    setAnalytics(response.analytics as Analytics)
                }
            } else {
                dispatch(openToast({ message: response.message, type: 'error' }))
            }
        } catch (err) {
            console.error('Fetch error:', err)
            setError('Something went wrong')
            dispatch(openToast({ message: 'Something went wrong', type: 'error' }))
        } finally {
            setLoading(false)
        }
    }, [currentPage, dispatch])

    useEffect(() => {
        fetchAnalyses()
    }, [currentPage, fetchAnalyses])

    const handleViewAnalysis = (analysisId: string) => {
        console.log('analysisId: ', analysisId)
        const analysis = analyses.find((a) => a._id === analysisId)
        if (analysis) {
            setSelectedAnalysis(analysis)
            setShowAnalysisModal(true)
        }
    }

    const handleDeleteAnalysis = (analysisId: string) => {
        setDeleteAnalysisId(analysisId)
        setShowDeleteModal(true)
    }

    const confirmDelete = async () => {
        try {
            const response = await deleteAnalysis(deleteAnalysisId)
            if (response?.success) {
                setAnalyses(analyses.filter((a) => a._id !== deleteAnalysisId))
                setTotalAnalyses((prev) => prev - 1)
                setShowDeleteModal(false)
                setDeleteAnalysisId(null)
                dispatch(openToast({ message: response.message, type: 'success' }))
            } else {
                dispatch(openToast({ message: response.message, type: 'error' }))
            }
        } catch (error) {
            console.log('error: ', error)
            dispatch(openToast({ message: 'Something went wrong', type: 'error' }))
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated')
        navigate('/login')
    }

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <header className='bg-white shadow-sm border-b'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        <div onClick={() => navigate('/upload')} className='flex items-center cursor-pointer space-x-4'>
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
                                <span className='text-gray-700'>Welcome, {state?.name || 'User'}</span>
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

                {error && (
                    <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
                        <p className='text-red-800'>{error}</p>
                        <button onClick={fetchAnalyses} className='mt-2 text-red-600 hover:text-red-800 font-medium'>
                            Try Again
                        </button>
                    </div>
                )}
                {isEmpty(analyses) ? (
                    <div className='text-center py-16'>
                        <FileText className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>No analyses found</h3>
                        <button
                            onClick={() => navigate('/upload')}
                            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors'
                        >
                            Create First Analysis
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8'>
                        {analyses.map((analysis) => (
                            <AnalysisCard
                                key={analysis._id}
                                analysis={analysis}
                                onView={() => handleViewAnalysis(analysis._id)}
                                onDelete={() => handleDeleteAnalysis(analysis._id)}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className='flex items-center justify-between bg-white rounded-lg shadow p-4'>
                        <div className='text-sm text-gray-700'>
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalAnalyses)} of {totalAnalyses}{' '}
                            results
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
            </main>

            {/* Modals */}
            {showAnalysisModal && selectedAnalysis && (
                <AnalysisModal
                    analysis={selectedAnalysis}
                    onClose={() => {
                        setShowAnalysisModal(false)
                        setSelectedAnalysis(null)
                    }}
                />
            )}

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
