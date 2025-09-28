import React, { useState } from 'react'
import { AlertTriangle, X, Trash2 } from 'lucide-react'

interface DeleteConfirmModalProps {
    onConfirm: () => Promise<void> | void
    onCancel: () => void
    itemName?: string
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ onConfirm, onCancel, itemName = 'analysis' }) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleConfirm = async () => {
        setIsDeleting(true)
        try {
            await onConfirm()
        } catch (error) {
            console.error('Delete failed:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-xl shadow-xl w-full max-w-md'>
                <div className='p-6'>
                    <div className='flex items-start space-x-4 mb-4'>
                        <div className='flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
                            <AlertTriangle className='w-6 h-6 text-red-600' />
                        </div>
                        <div className='flex-1'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-1'>Delete {itemName}</h3>
                            <p className='text-gray-600'>Are you sure you want to delete this {itemName}?</p>
                        </div>
                        <button onClick={onCancel} disabled={isDeleting} className='text-gray-400 hover:text-gray-600 disabled:opacity-50'>
                            <X className='w-5 h-5' />
                        </button>
                    </div>

                    <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
                        <div className='flex items-start space-x-2'>
                            <Trash2 className='w-4 h-4 text-red-500 mt-0.5 flex-shrink-0' />
                            <div>
                                <p className='text-sm text-red-800 font-medium mb-1'>This action cannot be undone</p>
                                <p className='text-xs text-red-700'>
                                    All data related to this {itemName} will be permanently removed from our servers.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0'>
                        <button
                            onClick={onCancel}
                            disabled={isDeleting}
                            className='w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isDeleting}
                            className='w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center'
                        >
                            {isDeleting ? (
                                <>
                                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className='w-4 h-4 mr-2' />
                                    Delete {itemName}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmModal
