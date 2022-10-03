import React from 'react'

const Loader = () => {
  return (
    <div className='flex justify-center items-center py-2'>
      <div className='animate-spin rounded-full h-20 w-20 border-b-2 border-blue-700'/>
    </div>
  )
}

export default Loader