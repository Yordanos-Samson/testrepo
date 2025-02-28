"use client"

import { createContext, useEffect, useState, useContext } from "react"
import PropTypes from "prop-types"
import { supabase } from "../supabaseClient"

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  AuthContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
  }

  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (error) throw error
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    setData()

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])



  const getUserRole = async (userId) => {
  try {
    // Check if the user is a doctor
    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .select("id") // Only select the ID to minimize data transfer
      .eq("user_id", userId)
      .single();

    if (doctor) return "doctor";

    // Check if the user is an admin
    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("id") // Only select the ID to minimize data transfer
      .eq("user_id", userId)
      .single();

    if (admin) return "admin";

    // If the user is neither a doctor nor an admin
    if (doctorError && adminError) {
      console.error("Error fetching user role:", doctorError, adminError);
    }

    return null; // Unknown role
  } catch (error) {
    console.error("Error determining user role:", error);
    return null;
  }
};



  const value = {
    session,
    user,
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      const role = await getUserRole(data.user.id);
      console.log("Role:", role);
      console.log("Data:", data.user);
      return { user: data.user, role }
    },
    signUp: async (email, password, role, additionalInfo) => {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error

      if (role === "doctor") {
        await supabase.from("doctors").insert({
          user_id: data.user.id,
          email,
          full_name: additionalInfo.fullName,
          speciality: additionalInfo.specialty,
          description: additionalInfo.description,
          payment_required_amount: additionalInfo.paymentRequiredAmount,
        })
      } else if (role === "admin") {
        await supabase.from("admins").insert({
          user_id: data.user.id,
          email,
          full_name: additionalInfo.fullName,
        })
      }

      return { ...data, role }
    },
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

