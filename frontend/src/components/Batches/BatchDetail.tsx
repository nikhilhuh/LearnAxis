import React from "react";
import { Batch } from "../../utils/constants";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorModal from "../Modals/Status Modals/ErrorModal";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  MdLibraryBooks,
  MdPerson,
  MdSchedule,
  MdMeetingRoom,
  MdGroup,
} from "react-icons/md";
import { useUser } from "../../context/UserContext";
import { editBatchSyllabus } from "../../services/api/apiCalls/common/editBatchSyllabus";
import SuccessModal from "../Modals/Status Modals/SuccessModal";

const SectionHeader = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="flex items-center gap-2 text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
    {icon}
    <span>{title}</span>
  </div>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between items-center gap-4 flex-wrap mb-2">
    <div className="text-gray-400 font-medium">{label}</div>
    <div className="px-3 py-1 bg-[var(--color-secondary)] rounded-md shadow-sm">
      {value}
    </div>
  </div>
);

const BatchDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { UserDetails } = useUser();
  const batch = location.state?.batch as Batch | undefined;
  const [success, setSuccess] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [isEditingSyllabus, setIsEditingSyllabus] =
    React.useState<boolean>(false);
  const [syllabusInput, setSyllabusInput] = React.useState<
    { title: string; done: boolean }[]
  >(batch?.syllabus || []);

  if (!batch) {
    setError("Unable to fetch Batch data, try again");
    setTimeout(() => {
      setError("");
      navigate(-1);
    }, 2000);
    return <ErrorModal error={error} />;
  }

  const handleSubmitSyllabus = async () => {
    if (
      !UserDetails ||
      (UserDetails.role !== "admin" && UserDetails.role !== "teacher")
    )
      return;
    try {
      const syllabusTitles: string[] = syllabusInput.map((item) => item.title);

      const result = await editBatchSyllabus(
        UserDetails.email,
        batch.name,
        syllabusTitles
      );

      if (result.success) {
        setSuccess(result.message || "Syllabus updated successfully");
        setTimeout(() => {
          setSuccess("");
          navigate(-1);
        }, 2000);
      } else {
        setError(result.message || "Something went wrong.");
        setTimeout(() => setError(""), 2000);
      }
    } catch (err: any) {
      setError("Something went wrong.");
      setTimeout(() => setError(""), 2000);
    }
  };

  if (!UserDetails) return null;
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

      <h1 className="text-2xl font-bold text-center">Batch Details</h1>

      <div className="bg-[var(--color-secondary)] p-6 rounded-2xl shadow-lg space-y-6">
        {/* Batch Info */}
        <div>
          <SectionHeader
            icon={<MdLibraryBooks className="text-xl" />}
            title="Batch Info"
          />
          <InfoRow label="Batch Name" value={batch.name} />
          <InfoRow
            label="Subject"
            value={`${batch.subject.name} - ${batch.subject.code}`}
          />
        </div>

        {/* Teacher Info */}
        <div>
          <SectionHeader
            icon={<MdPerson className="text-xl" />}
            title="Teacher Info"
          />
          <InfoRow
            label="Name"
            value={`${batch.teacher.firstName} ${batch.teacher.lastName}`}
          />
          <InfoRow label="Email" value={batch.teacher.email} />
        </div>

        {/* Schedule Info */}
        <div>
          <SectionHeader
            icon={<MdSchedule className="text-xl" />}
            title="Schedule"
          />
          <InfoRow
            label="Start Date"
            value={
              batch.startDate
                ? new Date(batch.startDate).toLocaleDateString("en-IN")
                : "Not available"
            }
          />
          <InfoRow
            label="End Date"
            value={
              batch.endDate
                ? new Date(batch.endDate).toLocaleDateString("en-IN")
                : "Still ongoing"
            }
          />

          <InfoRow
            label="Days"
            value={
              <div className="flex gap-2 flex-wrap">
                {batch.schedule.day.map((day, idx) => (
                  <span key={idx} className="px-2 py-1 rounded-full text-sm">
                    {day}
                  </span>
                ))}
              </div>
            }
          />
          <InfoRow label="Time" value={batch.schedule.time} />
          <InfoRow label="Total Days" value={batch.days} />
        </div>

        {/* Room Info */}
        <div>
          <SectionHeader
            icon={<MdMeetingRoom className="text-xl" />}
            title="Room Info"
          />
          <InfoRow label="Room Name" value={batch.room.name} />
          <InfoRow label="Capacity" value={batch.room.capacity ?? "N/A"} />
        </div>

        {/* Students Info */}
        <div>
          <SectionHeader
            icon={<MdGroup className="text-xl" />}
            title="Students"
          />
          <InfoRow label="Total Students" value={batch.students.length} />
        </div>
        {/* Syllabus Info */}
        <div>
          <SectionHeader
            icon={<MdLibraryBooks className="text-xl" />}
            title="Syllabus & Completion"
          />
          <InfoRow label="Completion" value={`${batch.completion ?? 0} %`} />

          <div className="mb-2">
            <div className="flex justify-between items-center">
              <div className="text-gray-400 font-medium mb-1">Syllabus</div>
              {UserDetails.role !== "student" && !isEditingSyllabus ? (
                <button
                  title="Edit Syllabus"
                  className="text-blue-600 text-sm cursor-pointer"
                  onClick={() => setIsEditingSyllabus(true)}
                >
                  ✏️ Edit
                </button>
              ) : null}
            </div>

            {!isEditingSyllabus ? (
              batch.syllabus?.length > 0 ? (
                <ul className="list-disc ml-6 space-y-1 bg-[var(--color-secondary)] p-3 rounded-md shadow-inner">
                  {batch.syllabus.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm flex justify-between items-center"
                    >
                      <span>{item.title}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          item.done
                            ? "bg-green-200 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.done ? "Done" : "Pending"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-3 py-1 bg-[var(--color-secondary)] rounded-md shadow-sm text-sm text-gray-400">
                  No syllabus items added.
                </div>
              )
            ) : (
              <div className="space-y-2">
                {syllabusInput.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      id={`syllabus-${idx}`}
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...syllabusInput];
                        updated[idx].title = e.target.value;
                        setSyllabusInput(updated);
                      }}
                      disabled={item.done}
                      className={`w-full p-1 rounded border ${
                        item.done ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    />
                    <input
                      type="checkbox"
                      id={`syllabusCheckbox-${idx}`}
                      checked={item.done}
                      disabled
                      className="cursor-not-allowed"
                      title="Cannot change status from here"
                    />
                    {!item.done && (
                      <button
                        className="text-red-500 cursor-pointer"
                        onClick={() => {
                          const updated = syllabusInput.filter(
                            (_, i) => i !== idx
                          );
                          setSyllabusInput(updated);
                        }}
                        title="Remove"
                      >
                        ✖
                      </button>
                    )}
                  </div>
                ))}
                <button
                  className="text-green-600 text-sm underline cursor-pointer"
                  onClick={() =>
                    setSyllabusInput([
                      ...syllabusInput,
                      { title: "", done: false },
                    ])
                  }
                >
                  + Add Syllabus Item
                </button>
                <div className="flex gap-3 mt-2">
                  <button
                    title="Save changes to syllabus"
                    className="bg-green-600 text-white px-3 py-1 rounded cursor-pointer hover:scale-105"
                    onClick={() => {
                      handleSubmitSyllabus();
                      setIsEditingSyllabus(false);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="text-red-500 cursor-pointer"
                    onClick={() => {
                      setSyllabusInput(batch.syllabus || []);
                      setIsEditingSyllabus(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetail;
