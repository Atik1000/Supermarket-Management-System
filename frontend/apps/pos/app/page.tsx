export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-12">
          <div className="text-6xl mb-6">🏪</div>
          <h1 className="text-4xl font-bold text-white mb-4">
            POS System
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Point of Sale Terminal
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-6">
              <p className="text-gray-400 mb-2">Terminal ID</p>
              <p className="text-2xl font-mono text-white">POS-001</p>
            </div>
            
            <a
              href="/login"
              className="block w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition text-lg"
            >
              Login to Start Session
            </a>
            
            <div className="grid grid-cols-3 gap-4 mt-8 text-gray-400 text-sm">
              <div>
                <p className="font-semibold text-white">Status</p>
                <p>Ready</p>
              </div>
              <div>
                <p className="font-semibold text-white">Cashier</p>
                <p>Not logged in</p>
              </div>
              <div>
                <p className="font-semibold text-white">Shift</p>
                <p>Not started</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
