// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import Upload from "./components/Upload";      // ✅ Upload page
// import Dashboard from "./components/Dashboard"; // ✅ Optional dashboard
import { fetchSecureDocs } from "./api";



function App() {
  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState(null);

  const loadDocs = async () => {
    const data = await fetchSecureDocs(user.token);
    setDocs(data);
  };

  if (!user) return <Login setUser={setUser} />;

  // ############################ OLD ###################################

  // return (
  //   <div className="p-6">
  //     <h1 className="text-xl font-bold">Welcome, {user.email}</h1>
  //     <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded" onClick={loadDocs}>
  //       Load Secure Docs
  //     </button>
  //     {/* {docs && <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(docs, null, 2)}</pre>} */}
  //     {docs && (
  //     <pre className="mt-4 bg-gray-800 text-white p-4 rounded text-sm">
  //       {JSON.stringify(docs, null, 2)}
  //     </pre>
  //     )}
  //   </div>
  // );

  // ##########################################################################

  return (
    <BrowserRouter>
      <div className="p-6 space-y-6">
        <nav className="space-x-4">
          <Link to="/" className="text-blue-600 underline">Home</Link>
          <Link to="/upload" className="text-blue-600 underline">Upload</Link>
        </nav>

        <Routes>
          {/* ✅ Secure Docs test page (default route) */}
          <Route
            path="/"
            element={
              <div>
                <h1 className="text-xl font-bold">Welcome, {user.email}</h1>
                <button
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
                  onClick={loadDocs}
                >
                  Load Secure Docs
                </button>
                {docs && (
                  <pre className="mt-4 bg-gray-800 text-white p-4 rounded text-sm">
                    {JSON.stringify(docs, null, 2)}
                  </pre>
                )}
              </div>
            }
          />

          {/* ✅ Upload + Ask page */}
          <Route path="/upload" element={<Upload user={user} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
