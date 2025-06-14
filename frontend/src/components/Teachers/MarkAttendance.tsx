import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorModal from "../../components/Modals/Status Modals/ErrorModal";
import SuccessModal from "../../components/Modals/Status Modals/SuccessModal";
import { Batch, Student } from "../../utils/constants";
import { useUser } from "../../context/UserContext";
import { addAttendance } from "../../services/api/apiCalls/teacher/addAttendance";
import NoDataImg from "../../assets/images/nodata.svg";
import { IoMdArrowRoundBack } from "react-icons/io";
import Cliploader from "../Loaders/Cliploader";

const MarkAttendance: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { UserDetails } = useUser();

  const batch = state?.batch as Batch | undefined;

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [date, setDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [records, setRecords] = useState<Record<string, string>>({});
  const [topicsCovered, setTopicsCovered] = React.useState<string[]>([]);

  useEffect(() => {
    if (!batch) {
      setError("Batch not found. Please go back and select a valid batch.");
      return;
    }
    setStudents(batch.students || []);
  }, [batch]);

  const toggleStatus = (email: string) => {
    setRecords((prev) => ({
      ...prev,
      [email]: prev[email] === "present" ? "absent" : "present",
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!UserDetails?.email) {
        setError("User not authenticated.");
        return;
      }
      setLoading(true);
      const attendanceRecords = students.map((student) => ({
        email: student.email,
        status: records[student.email] || "absent",
      }));

      const result = await addAttendance(UserDetails.email, topicsCovered, {
        batchId: batch?.name,
        date,
        records: attendanceRecords,
      });

      if (result.success) {
        setSuccess("Attendance submitted successfully.");
        setTimeout(() => {
          setSuccess("");
          navigate("/teacher/attendance");
        }, 2000);
      } else {
        setError(result.message || "Failed to submit attendance.");
        setTimeout(() => setError(""), 2000);
      }
    } catch (err) {
      setError("Failed to submit attendance.");
      setTimeout(() => setError(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow">
      {error && <ErrorModal error={error} />}
      {success && <SuccessModal success={success} />}
      <div
        onClick={() => navigate(-1)}
        title="Go Back"
        className="p-2 bg-[var(--color-primary)] max-w-max rounded-full cursor-pointer hover:scale-105 transition"
      >
        <IoMdArrowRoundBack className="text-2xl" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-2 mt-2">
        Mark Attendance - {batch?.name}
      </h2>

      <div className="mb-4">
        <h2 className="font-semibold mb-1">Topics Covered</h2>
        {batch?.syllabus && batch.syllabus.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {batch.syllabus.map((topic: any, idx: number) => {
              const isSelected = topicsCovered.includes(topic.title);

              const handleClick = () => {
                if (topic.done) return; // Prevent clicks on completed topics

                setTopicsCovered(
                  (prev) =>
                    prev.includes(topic.title)
                      ? prev.filter((t) => t !== topic.title) // deselect if already selected
                      : [...prev, topic.title] // select if not selected
                );
              };

              return (
                <div
                  key={idx}
                  title={
                    topic.done
                      ? "Already completed"
                      : isSelected
                      ? "Click to remove as covered"
                      : "Click to mark covered"
                  }
                  onClick={handleClick}
                  className={`px-4 py-1 border rounded-full flex items-center justify-center gap-2
        ${topic.done ? "border-green-500 border-2 bg-green-400 text-black" : ""}
        ${isSelected ? " border-green-500 bg-green-300 text-black" : ""}
        ${topic.done ? "cursor-not-allowed" : "cursor-pointer"}
      `}
                >
                  <span>{topic.title}</span>
                  {topic.done && <span>✔️</span>}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-400">Syllabus not updated</div>
        )}
      </div>

      <div className="mb-2">
        <label htmlFor="attendance-date" className="block font-semibold mb-1">
          Attendance of
        </label>
        <input
          type="date"
          id="attendance-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-3 py-2 cursor-pointer"
        />
      </div>

      {students.length === 0 ? (
        <div className="w-full flex flex-col items-center text-center translate-y-1/2 gap-4">
          <img src={NoDataImg} alt="No Data" className="h-[25vh] w-auto" />
          <p className="text-gray-400">No students found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto w-full rounded shadow">
            <table className="w-full table-auto text-center">
              <thead className="bg-[var(--color-primary)]/80">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Roll No</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => {
                  const email = student.email;
                  const isPresent = records[email] === "present";
                  const nextStatus = isPresent ? "Absent" : "Present";

                  return (
                    <tr
                      key={idx}
                      className="even:bg-[var(--color-primaryHover)]/60 odd:bg-[var(--color-secondary)]/60"
                    >
                      <td className="p-2">{idx + 1}</td>
                      <td className="p-2">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="p-2">{student.user_id}</td>
                      <td className="p-2">
                        <button
                          title={`Mark ${nextStatus}`}
                          onClick={() => toggleStatus(email)}
                          className={`px-3 py-1 rounded cursor-pointer ${
                            isPresent
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {isPresent ? "Present" : "Absent"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`float-right mt-6 px-6 py-2 font-semibold rounded transition 
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
    }
  `}
          >
            {loading ? <Cliploader size={10} /> : "Submit Attendance"}
          </button>
        </>
      )}
    </div>
  );
};

export default MarkAttendance;
