import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from 'framer-motion'
import { ClipLoader } from "react-spinners";

export default function Upload({ user }) {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [question, setQuestion] = useState("");
  // const [answer, setAnswer] = useState(""); // only for single answer (or) response
  const [chatHistory, setChatHistory] = useState([]); // 🧠 Chat messages
  const [loading, setLoading] = useState(false); 
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadMessage(res.data.message || "Uploaded successfully!");
    } catch (err) {
      console.error(err);
      setUploadMessage("❌ Upload failed.");
    }

  };

  const askQuery = async () => {
    if (!question.trim()) return; // UI CHAT (for handling empty question)
    if (!uploadMessage.toLowerCase().includes("success")) {    // Query works only when file is uploaded.
      alert("⚠️ Please upload a document first.");
      return;
    }


    setLoading(true);
    setChatHistory(prev => [...prev, { role: "user", content: question }]); // 👤 Add user msg
    setQuestion(""); // clear input



    try {
      
      // setLoading(true);      //BEfore UI CHat
      const formData = new FormData();
      formData.append("question", question);


      const res = await axios.post(

        `${import.meta.env.VITE_API_BASE}/query`,
        // { question: question },
        formData,
        {
            headers: {
            Authorization: `Bearer ${user.token}`,
            // "Content-Type": "application/json", // <-- Explicitly set
            "Content-Type": "multipart/form-data",
            },
        }
        );
        // setAnswer(res.data.answer || "No answer returned."); // Before CHAT UI for single answer
        setChatHistory(prev => [...prev, { role: "bot", content: res.data.answer || "No answer returned." }]);
    } catch (err) {
            console.error(err);
            // setAnswer("❌ Failed to get response."); // Before CHAT UI for single answer
            setChatHistory(prev => [...prev, { role: "bot", content: "❌ Failed to get response." }]);
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded">
      <h2 className="text-lg font-bold mb-4">Upload Document</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      
      {/* <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleUpload}
      >
        Upload
      </button> */}

      <motion.button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleUpload}
      >
        Upload
      </motion.button>


      {uploadMessage && <p className="mt-4 text-sm">{uploadMessage}</p>}

      <div className="mt-10">
        <h2 className="text-lg font-bold mb-4">Ask a Question</h2>
        <input
          type="text"
          className="border px-2 py-1 w-full"
          placeholder="Ask TARS something..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {/* <button
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
          onClick={askQuery}
        >
          Ask
        </button> */}

        <motion.button
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={askQuery}
        >
          Ask
        </motion.button>

        {/* {loading && <p className="text-sm text-gray-500 mt-2">🧠 Thinking...</p>} */} 
        
        {loading && (
          <div className="flex justify-center mt-2">
            <ClipLoader color="#10B981" size={24} />
          </div>
        )}


        {/* {answer && <p className="mt-4 bg-gray-100 p-3 rounded">{answer}</p>}  */}
        {/* {answer && (
          <pre className="mt-4 bg-gray-100 text-gray-900 p-4 rounded text-sm whitespace-pre-wrap border">
            {answer}
          </pre>
        )} */}
        {/* {answer && (
          <div className="mt-4 bg-gray-100 text-gray-900 p-4 rounded text-sm whitespace-pre-wrap border">
            {answer}
          </div>
        )} */}

        {/* 💬 Chat history display */}
        <div className="space-y-3 mt-6">
          {chatHistory.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-md text-sm whitespace-pre-wrap border shadow ${
                msg.role === "user" ? "bg-blue-100 text-black text-left" : "bg-green-100 text-black text-right"
              }`}
            >
              <strong>{msg.role === "user" ? "You" : "TARS"}:</strong> {msg.content}
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>



    </div>
  );

  
}
