export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Supermarket Management System
        </p>
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-gray-600">Products</p>
                <p className="text-2xl font-bold text-blue-600">0</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <p className="text-sm text-gray-600">Orders</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <p className="text-sm text-gray-600">Users</p>
                <p className="text-2xl font-bold text-yellow-600">0</p>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-purple-600">$0</p>
              </div>
            </div>
          </div>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
