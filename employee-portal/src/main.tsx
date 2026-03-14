import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 1. Import QueryClient และ QueryClientProvider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 2. สร้าง instance ของ QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ตั้งค่าพื้นฐาน (Optional)
      staleTime: 1000 * 60 * 5, // ข้อมูลจะสดใหม่เป็นเวลา 5 นาที
      retry: 1, // ถ้า Error ให้ลองใหม่ 1 ครั้ง
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 3. หุ้ม App ด้วย Provider และส่ง client เข้าไป */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)