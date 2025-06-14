import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { Teacher } from "../../utils/constants";

const TeacherData: React.FC<{
  teacher: any;
  onClick: (teacher: Teacher) => void;
  deleteClick: () => void;
}> = ({ teacher, onClick, deleteClick }) => {
  return (
    <div
      onClick={() => onClick(teacher)}
      className="px-2 py-4 rounded-lg laptop-sm:rounded-xl flex flex-col items-center border border-[var(--color-primary)] bg-[var(--color-secondary)]  shadow-md hover:cursor-pointer hover:scale-105 hover:bg-[var(--color-primaryHover)] gap-2 relative"
    >
      {/* Delete icon */}
      <div
        onClick={(e) => {
          e.stopPropagation(); // prevent card click
          deleteClick();
        }}
        title="Delete Room"
        className="absolute top-2 right-2 z-10"
      >
        <FaTrashAlt className="h-5 w-5 text-red-500" />
      </div>
      <div className="p-6 border-1 border-gray-300 rounded-full bg-white shadow-md">
        <GiTeacher className="h-10 w-10 tablet:h-12 tablet:w-12 text-black"/>
      </div>
      <div className="font-semibold">
        {teacher.firstName} {teacher.lastName}
      </div>
      <div>{teacher.email}</div>
      <div>
        <span className="font-semibold">Teacher ID: </span>
        {teacher.user_id}
      </div>
    </div>
  );
};

export default TeacherData;
