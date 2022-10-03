import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { TransactionContext, TransactionProvider } from './context/TransactionContext'
import './index.css'
TransactionContext

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TransactionProvider>
      <App />
    </TransactionProvider>
  </React.StrictMode>
)
