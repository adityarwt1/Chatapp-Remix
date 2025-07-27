import { Link } from "@remix-run/react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">ChatApp</h1>
          <p className="text-gray-600">Connect with friends and family</p>
        </div>

        <div className="space-y-4">
          <Link
            to="/login"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors block text-center"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="w-full border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-medium hover:bg-blue-50 transition-colors block text-center"
          >
            Create Account
          </Link>
        </div>

       
      </div>
    </div>
  );
}
