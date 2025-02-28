"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../supabaseClient"

const AdminDashboard = () => {
  const { user } = useAuth()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("doctors").select("*").order("full_name", { ascending: true })

      if (error) throw error
      setDoctors(data)
    } catch (error) {
      setError("Could not fetch doctors")
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center mt-8">Loading admin dashboard...</div>
  if (error) return <div className="text-center mt-8 text-red-600">Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Welcome, Admin {user?.email}</h2>
        <p>Your role: {user?.role}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Registered Doctors</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Specialty</th>
              <th className="p-2 text-left">Consultations</th>
              <th className="p-2 text-left">Payment Required</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="border-b">
                <td className="p-2">{doctor.full_name}</td>
                <td className="p-2">{doctor.email}</td>
                <td className="p-2">{doctor.speciality || "Not specified"}</td>
                <td className="p-2">{doctor.consultations_given || 0}</td>
                <td className="p-2">${doctor.payment_required_amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard

