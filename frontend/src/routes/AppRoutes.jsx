import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Upload from '../pages/Upload'
import Syllabus from '../pages/Syllabus'
import PracticeHub from '../pages/PracticeHub'
import TestData from '../pages/TestData'
import AdminDashboardAI from '../pages/AdminDashboardAI'
import AdminBulkImport from '../pages/AdminBulkImport'
import AdminBulkImportSimple from '../pages/AdminBulkImportSimple'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/syllabus" element={<Syllabus />} />
      <Route path="/practice-hub" element={<PracticeHub />} />
      <Route path="/test-data" element={<TestData />} />
      <Route path="/admin" element={<AdminDashboardAI />} />
      <Route path="/admin/import" element={<AdminBulkImport />} />
      <Route path="/admin/bulk-import" element={<AdminBulkImportSimple />} />
    </Routes>
  )
}
