import React from "react";
import { Student } from "../../utils/constants";

const StudentData: React.FC<{
  student: Student;
  onClick: (student: Student) => void;
}> = ({ student, onClick }) => {
  return (
    <div
      onClick={() => onClick(student)}
      title={`View ${student.firstName}'s details`}
      className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-primary)]/25 hover:bg-[var(--color-primary)]/50 backdrop-blur-md border border-white/10 transition cursor-pointer"
    >
      <div className="w-full flex flex-col tablet:flex-row tablet:items-center gap-4">
        <div className="flex items-center gap-3">
          {/* Initial circle */}
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] font-bold flex items-center justify-center">
            {student.firstName[0]}
          </div>
          {/* Name + Email */}
          <div className="flex flex-col">
            <span className="font-medium">
              {student.firstName} {student.lastName}
            </span>
            <span className="text-gray-400 text-sm">{student.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-[15%] tablet:ml-auto">
          {/* Roll No */}
          <span className="text-gray-400 text-sm">{student.user_id}</span>

          {/* Status badge */}
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              student.status === "active"
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {student.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentData;
