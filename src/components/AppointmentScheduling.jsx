"use client"

import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

const AppointmentScheduling = () => {
  const [appointments, setAppointments] = useState([])
  const [newAppointment, setNewAppointment] = useState({ patient_id: "", doctor_id: "", date_time: "", reason: "" })
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAppointments()
    fetchPatients()
    fetchDoctors()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patients (full_name),
          doctors (full_name)
        `)
        .order("date_time", { ascending: true })

      if (error) throw error
      setAppointments(data)
    } catch (error) {
      setError("Could not fetch appointments")
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from("patients")
      .select("id, full_name")
      .order("full_name", { ascending: true })

    if (error) console.error("Error fetching patients:", error)
    else setPatients(data)
  }

  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from("doctors")
      .select("id, full_name")
      .order("full_name", { ascending: true })

    if (error) console.error("Error fetching doctors:", error)
    else setDoctors(data)
  }

  const handleInputChange = (e) => {
    setNewAppointment({ ...newAppointment, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data, error } = await supabase.from("appointments").insert([newAppointment]).select()

      if (error) throw error
      setAppointments([...appointments, data[0]])
      setNewAppointment({ patient_id: "", doctor_id: "", date_time: "", reason: "" })
    } catch (error) {
      setError("Could not add appointment")
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading appointments...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Appointment Scheduling</h2>

      {/* Add Appointment Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Schedule New Appointment</h3>
        <div className="grid grid-cols-2 gap-4">
          <select
            name="patient_id"
            value={newAppointment.patient_id}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.full_name}
              </option>
            ))}
          </select>
          <select
            name="doctor_id"
            value={newAppointment.doctor_id}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.full_name}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            name="date_time"
            value={newAppointment.date_time}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="reason"
            value={newAppointment.reason}
            onChange={handleInputChange}
            placeholder="Reason for appointment"
            className="p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Schedule Appointment
        </button>
      </form>

      {/* Appointment List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Patient</th>
                <th className="px-4 py-2">Doctor</th>
                <th className="px-4 py-2">Date & Time</th>
                <th className="px-4 py-2">Reason</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b">
                  <td className="px-4 py-2">{appointment.patients.full_name}</td>
                  <td className="px-4 py-2">{appointment.doctors.full_name}</td>
                  <td className="px-4 py-2">{new Date(appointment.date_time).toLocaleString()}</td>
                  <td className="px-4 py-2">{appointment.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AppointmentScheduling

