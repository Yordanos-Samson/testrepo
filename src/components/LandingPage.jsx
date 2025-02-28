import { Link } from "react-router-dom"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">CareSync</h1>
          <div>
            <Link to="/signin" className="text-blue-600 hover:text-blue-800 mr-4">
              Sign In
            </Link>
            <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Welcome to CareSync</h2>
        <p className="text-xl mb-8">Streamline your healthcare management with our comprehensive solution</p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Patient Management</h3>
            <p>Efficiently manage patient records and information</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Appointment Scheduling</h3>
            <p>Easy and intuitive appointment booking system</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Medical Records</h3>
            <p>Secure and organized medical record management</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage

