import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAILS = ["admin@gmail.com",'ramagiri.saikumar02@gmail.com'];

export default function AdminDashboard({ user }) {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  // 🔐 Access protection
  useEffect(() => {
    if (!user || !ADMIN_EMAILS.includes(user.email)) {
      navigate("/"); // 🚫 redirect if not admin
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "chatHistory"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setChats(data);
    };
    fetchData();
  }, []);

  if (!user) return null;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📊 Admin Dashboard</h2>
      {chats.map((item, idx) => (
        <div key={idx} className="p-3 border mb-2">
          <p><strong>User:</strong> {item.email}</p>
          <p><strong>Q:</strong> {item.question}</p>
          <p><strong>A:</strong> {item.answer}</p>
          <p className="text-xs text-gray-500">{item.timestamp}</p>
        </div>
      ))}
    </div>
  );
}
