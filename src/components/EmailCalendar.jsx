import { useState } from "react";
import axios from "axios";

export default function EmailCalendar({ user }) {
  const [emailForm, setEmailForm] = useState({ to: "", subject: "", body: "" });
  const [calendarForm, setCalendarForm] = useState({ title: "", description: "", start: "", end: "" });

  const [emailStatus, setEmailStatus] = useState("");
  const [calendarStatus, setCalendarStatus] = useState("");

  const handleChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter(prev => ({ ...prev, [name]: value }));
  };

  const handleCalendarSubmit = async () => {

    setCalendarStatus("⏳ Creating event...");

    const formData = new FormData();
    formData.append("summary", calendarForm.title);
    formData.append("start", calendarForm.start);
    formData.append("end", calendarForm.end);

    try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE}/calendar/create`, formData, {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
        });
        setCalendarStatus(`✅ Event Created! [Open Event](${res.data.event_link})`);
    } catch (err) {
        console.error(err);
        setCalendarStatus("❌ Failed to create event.");
    }
  };




  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-10 p-4">

        <h1 className="text-2xl font-bold mb-6">📨 Send Email & 🗓️ Schedule Event</h1>

        {/* Email and Calendar forms will go here */}

        {/* 🗓️ Calendar Form */}

        {/* 🗓️ Calendar Form */}
        <div className="border p-4 rounded">

            <h2 className="text-xl font-semibold mb-4">🗓️ Create Calendar Event</h2>
            <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={calendarForm.title}
                onChange={(e) => handleChange(e, setCalendarForm)}
                className="border p-2 w-full mb-2"
            />
            <input
                type="text"
                name="start"
                placeholder="Start Time (e.g. 2025-08-01T12:00:00)"
                value={calendarForm.start}
                onChange={(e) => handleChange(e, setCalendarForm)}
                className="border p-2 w-full mb-2"
            />
            <input
                type="text"
                name="end"
                placeholder="End Time (e.g. 2025-08-01T13:00:00)"
                value={calendarForm.end}
                onChange={(e) => handleChange(e, setCalendarForm)}
                className="border p-2 w-full mb-2"
            />

            <button
                onClick={handleCalendarSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Create Event
            </button>

            {calendarStatus && (
                <p className="mt-3 text-sm text-blue-700">{calendarStatus}</p>
            )}

        </div>

    </div>
  );
}
