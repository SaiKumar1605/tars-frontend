import { useState } from "react";
import axios from "axios";

export default function Upload({ user }) {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://tars-backend-i9c5.onrender.com/upload", formData, {
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

  // Inside same component below file upload
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false); 

  const askQuery = async () => {
    try {
      
      setLoading(true);
      const formData = new FormData();
      formData.append("question", question);


      const res = await axios.post(

        "https://tars-backend-i9c5.onrender.com/query",
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
        setAnswer(res.data.answer || "No answer returned.");
    } catch (err) {
            console.error(err);
            setAnswer("❌ Failed to get response.");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded">
      <h2 className="text-lg font-bold mb-4">Upload Document</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleUpload}
      >
        Upload
      </button>
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
        <button
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
          onClick={askQuery}
        >
          Ask
        </button>
        {loading && <p className="text-sm text-gray-500 mt-2">🧠 Thinking...</p>}
        {/* {answer && <p className="mt-4 bg-gray-100 p-3 rounded">{answer}</p>}  */}
        {/* {answer && (
          <pre className="mt-4 bg-gray-100 text-gray-900 p-4 rounded text-sm whitespace-pre-wrap border">
            {answer}
          </pre>
        )} */}
        {answer && (
          <div className="mt-4 bg-gray-100 text-gray-900 p-4 rounded text-sm whitespace-pre-wrap border">
            {answer}
          </div>
        )}

      </div>



    </div>
  );

  
}
