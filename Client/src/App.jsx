import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import { TripProvider } from './context/TripContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <TripProvider>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1a1a24',
                  color: '#fff',
                  border: '1px solid rgba(79, 115, 242, 0.3)',
                  borderRadius: '12px',
                },
                success: {
                  iconTheme: {
                    primary: '#4f73f2',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <AppRoutes />
          </TripProvider>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;