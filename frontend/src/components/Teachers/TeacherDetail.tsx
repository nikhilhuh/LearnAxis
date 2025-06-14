import React from "react";
import { Batch, Teacher } from "../../utils/constants";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorModal from "../Modals/Status Modals/ErrorModal";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdPerson, MdGroup } from "react-icons/md";
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

const TeacherDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const teacher = location.state?.teacher as Teacher | undefined;
  const [error, setError] = React.useState<string>("");

  if (!teacher) {
    setError("Unable to fetch Teacher data, try again");
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

      <h1 className="text-2xl font-bold text-center">Teacher Details</h1>

      <div className="bg-[var(--color-secondary)] p-6 rounded-2xl shadow-lg space-y-6">
        {/* Student Info */}
        <div>
          <SectionHeader icon={<MdPerson />} title="Teacher Info" />
          <InfoRow
            label="Name"
            value={`${teacher.firstName} ${teacher.lastName}`}
          />
          <InfoRow label="Email" value={teacher.email} />
          <InfoRow label="Teacher Id" value={teacher.user_id} />
          <InfoRow
            label="Status"
            value={
              <span
                className={`font-medium px-2 py-1 rounded-full ${
                  teacher.status === "inactive"
                    ? " text-red-700"
                    : " text-green-700"
                }`}
              >
                {teacher.status === "inactive" ? "Inactive" : "Active"}
              </span>
            }
          />
        </div>

        {/* Batches */}
        <div>
          <SectionHeader icon={<MdGroup />} title="Assigned Batches" />
          {teacher.batches.length === 0 ? (
            <div className="flex flex-col items-center text-gray-400 gap-2">
              <img src={NoDataImg} alt="No Data" className="h-[10vh]" />
              <p>No assigned batches</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 tablet:grid-cols-2 laptop-sm:grid-cols-4 gap-4">
              {teacher.batches.map((batch: Batch, index) => (
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

export default TeacherDetail;
