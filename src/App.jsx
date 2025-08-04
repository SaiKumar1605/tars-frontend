// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import Upload from "./components/Upload";      // ✅ Upload page
// import Dashboard from "./components/Dashboard"; // ✅ Optional dashboard
import { fetchSecureDocs } from "./api";
import EmailCalendar from "./components/EmailCalendar";
import AdminDashboard from "./components/AdminDashboard"; // For admin dashboard
import { auth } from "./firebase-config";
import { signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState(null);
  const ADMIN_EMAILS = ["admin@gmail.com",'ramagiri.saikumar02@gmail.com'];
  // const isAdmin = ADMIN_EMAILS.includes(user.email);
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);



  useEffect(() => {
    const saved = localStorage.getItem("tars_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);


  const loadDocs = async () => {
    const data = await fetchSecureDocs(user.token);
    setDocs(data);
  };

  if (!user) return <Login setUser={setUser} />;

  // Logout 
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);  // 👈 Also reset user state in your app
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };



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
          <Link to="/calendar" className="text-blue-600 underline">Calendar</Link>
          {isAdmin && <Link to="/admin" className="text-blue-600 underline">Admin</Link>}
          {user && (
            <button onClick={handleLogout} className="text-red-600 underline ml-4">
              Logout
            </button>
          )}
        </nav>

        <Routes>
          {/* ✅ Secure Docs test page (default route) */}
          <Route
            path="/"
            element={
              <div>
                <h1 className="text-xl font-bold">Welcome, {user.email} {user.token}</h1>
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
          <Route path="/calendar" element={<EmailCalendar user={user} />} />
          <Route path="/admin" element={<AdminDashboard user={user} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
