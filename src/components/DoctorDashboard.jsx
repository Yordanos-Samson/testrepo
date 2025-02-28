"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../supabaseClient"

const DoctorDashboard = () => {
  const { user } = useAuth()
  const [doctorInfo, setDoctorInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
console.log("User?.role",user?.role);
  useEffect(() => {
    if (user?.role === "doctor") {
      fetchDoctorInfo();
    }
  }, [user]);

  const fetchDoctorInfo = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("doctors").select("*").eq("user_id", user?.id).single()

      if (error) throw error
      setDoctorInfo(data)
    } catch (error) {
      setError("Could not fetch doctor information")
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center mt-8">Loading doctor information...</div>
  if (error) return <div className="text-center mt-8 text-red-600">Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Welcome, Dr. {doctorInfo?.full_name || user?.email}</h2>
        <p>
          <strong>Email:</strong> {doctorInfo?.email || user?.email}
        </p>
        <p>
          <strong>Specialty:</strong> {doctorInfo?.speciality || "Not specified"}
        </p>
        <p>
          <strong>Description:</strong> {doctorInfo?.description || "Not provided"}
        </p>
        <p>
          <strong>Payment Required Amount:</strong> ${doctorInfo?.payment_required_amount?.toFixed(2) || 0.0}
        </p>
        <p>
          <strong>Consultations Given:</strong> {doctorInfo?.consultations_given || 0}
        </p>
        {doctorInfo?.profile_url && (
          <p>
            <strong>Profile URL:</strong>{" "}
            <a
              href={doctorInfo.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {doctorInfo.profile_url}
            </a>
          </p>
        )}
        <p>Your role: {user?.role}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Upcoming Appointments</h2>
          <p>View and manage your upcoming appointments</p>
          {/* We'll add appointment functionality later */}
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Medical Records</h2>
          <p>Access and update patient medical records</p>
          {/* We'll add medical records functionality later */}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard

