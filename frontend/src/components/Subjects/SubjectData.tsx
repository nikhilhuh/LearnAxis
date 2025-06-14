import React from "react";
import { MdOutlineMenuBook } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { Subject } from "../../utils/constants";
import TickImg from "../../assets/images/tick.svg";

interface SubjectDataProps {
  subject: Subject;
  deleteClick?: () => void;
  toggle?: (code: Subject["code"]) => void;
  isSelected?: boolean;
}

const SubjectData: React.FC<SubjectDataProps> = ({
  subject,
  deleteClick,
  toggle,
  isSelected = false,
}) => {
  return (
    <div
      onClick={() => toggle?.(subject.code)}
      className={`px-2 py-4 rounded-lg laptop-sm:rounded-xl flex flex-col items-center border bg-[var(--color-secondary)] shadow-md hover:cursor-pointer hover:scale-105 hover:bg-[var(--color-primaryHover)] gap-2 relative text-center ${isSelected? "border-green-600 border-2" : "border-[var(--color-primary)]"}`}
    >
      {/* Delete icon  for admin only*/}
      {deleteClick && (
        <div
          onClick={(e) => {
            e.stopPropagation(); // prevent card click
            deleteClick();
          }}
          title="Delete Subject"
          className="absolute top-2 right-2 z-10"
        >
          <FaTrashAlt className="h-5 w-5 text-red-500" />
        </div>
      )}
      {/* Selected icon for student only */}
      {isSelected && (
        <div
          title="Subject Selected"
          className="absolute top-2 right-2 z-10"
        >
          <img src={TickImg} alt="Selected" className="h-8 w-auto object-contain" />
        </div>
      )}
      <div className="p-6 border-1 border-gray-300 rounded-full bg-white shadow-md">
        <MdOutlineMenuBook className="h-10 w-10 tablet:h-12 tablet:w-12 text-black" />
      </div>
      <div className="font-semibold">{subject.name}</div>
      <div>{subject.code}</div>
    </div>
  );
};

export default SubjectData;
