"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("doctor")
  const [specialty, setSpecialty] = useState("")
  const [description, setDescription] = useState("")
  const [paymentRequiredAmount, setPaymentRequiredAmount] = useState(0)
  const [profileUrl, setProfileUrl] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signUpNewUser } = useAuth()
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const additionalInfo = {
        fullName,
        profileUrl,
        ...(role === "doctor" && {
          specialty,
          description,
          paymentRequiredAmount: Number.parseFloat(paymentRequiredAmount),
        }),
      }

      const result = await signUpNewUser(email, password, role, additionalInfo)

      if (result.success) {
        navigate("/signin")
      } else {
        setError(result.error.message || "Sign-up failed.")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSignUp} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="url"
            placeholder="Profile URL (optional)"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
          />
        </div>
        {role === "doctor" && (
          <>
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                step="0.01"
                min="0"
                placeholder="Payment Required Amount"
                value={paymentRequiredAmount}
                onChange={(e) => setPaymentRequiredAmount(e.target.value)}
              />
            </div>
          </>
        )}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>
        {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
      </form>
      <p className="text-center text-gray-500 text-xs">
        Already have an account?{" "}
        <Link to="/signin" className="text-blue-500 hover:text-blue-800">
          Sign In
        </Link>
      </p>
    </div>
  )
}

export default Signup

