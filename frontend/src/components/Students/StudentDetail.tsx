import React from "react";
import { Student, Batch, Subject } from "../../utils/constants";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorModal from "../Modals/Status Modals/ErrorModal";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdLibraryBooks, MdPerson, MdGroup } from "react-icons/md";
import NoDataImg from "../../assets/images/nodata.svg";
import BookSVG from "../../assets/images/book.svg";

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
    <div className="px-3 py-1 bg-[var(--color-secondary)] rounded-md shadow-sm">{value}</div>
  </div>
);

const StudentDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student as Student | undefined;
  const [error, setError] = React.useState<string>("");

  if (!student) {
    setError("Unable to fetch Student data, try again");
    setTimeout(() => {
      setError("");
      navigate(-1);
    }, 2000);
    return <ErrorModal error={error} />;
  }

  return (
    <div className="flex-grow">
      <div
        onClick={() => navigate(-1)}
        title="Go Back"
        className="p-2 bg-[var(--color-primary)] max-w-max rounded-full cursor-pointer hover:scale-105 transition"
      >
        <IoMdArrowRoundBack className="text-2xl" />
      </div>

      <h1 className="text-2xl font-bold text-center">Student Details</h1>

      <div className="bg-[var(--color-secondary)] p-6 rounded-2xl shadow-lg space-y-6">
        {/* Student Info */}
        <div>
          <SectionHeader icon={<MdPerson />} title="Student Info" />
          <InfoRow
            label="Name"
            value={`${student.firstName} ${student.lastName}`}
          />
          <InfoRow label="Email" value={student.email} />
          <InfoRow label="Roll No" value={student.user_id} />
          <InfoRow
            label="Status"
            value={
              <span
                className={`font-medium px-2 py-1 rounded-full ${
                  student.status === "inactive"
                    ? " text-red-700"
                    : " text-green-700"
                }`}
              >
                {student.status === "inactive" ? "Inactive" : "Active"}
              </span>
            }
          />
        </div>

        {/* Enrolled Subjects */}
        <div>
          <SectionHeader icon={<MdLibraryBooks />} title="Enrolled Subjects" />
          {student.enrolledSubjects.length === 0 ? (
            <div className="flex flex-col items-center text-gray-400 gap-2">
              <img src={NoDataImg} alt="No Data" className="h-[10vh]" />
              <p>No enrolled subjects.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 tablet:grid-cols-2 laptop-sm:grid-cols-4 gap-4">
              {student.enrolledSubjects.map((subject: Subject, index) => (
                <div
                  key={index}
                  className="bg-[var(--color-secondary)] border border-[var(--color-primary)] shadow-md rounded-xl flex flex-col items-center p-4 gap-2 text-center"
                >
                  <img
                    src={BookSVG}
                    alt="Book"
                    className="h-14 laptop-sm:h-16"
                  />
                  <div className="font-semibold">{subject.name}</div>
                  <div className="text-sm text-gray-400">{subject.code}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Batches */}
        <div>
          <SectionHeader icon={<MdGroup />} title="Assigned Batches" />
          {student.batches.length === 0 ? (
            <div className="flex flex-col items-center text-gray-500 gap-2">
              <img src={NoDataImg} alt="No Data" className="h-[10vh]" />
              <p>No assigned batches</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 tablet:grid-cols-2 laptop-sm:grid-cols-4 gap-4">
              {student.batches.map((batch: Batch, index) => (
                <div
                  key={index}
                  className="bg-[var(--color-secondary)] border border-[var(--color-primary)] shadow-md rounded-xl flex flex-col items-center p-4 gap-2 text-center"
                >
                  <img
                    src={BookSVG}
                    alt="Book"
                    className="h-14 laptop-sm:h-16"
                  />
                  <div className="font-semibold">{batch.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
