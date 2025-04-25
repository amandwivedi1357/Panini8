import React from 'react'

function Loader({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-neutral-900 z-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600 dark:border-primary-400 border-solid"></div>
          <span className="mt-4 text-neutral-600 dark:text-neutral-300 font-medium">Loading...</span>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-600 dark:border-primary-400 border-solid"></div>
    </div>
  )
}

export default Loader