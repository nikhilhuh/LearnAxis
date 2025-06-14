import React from "react";
import { MdLibraryBooks } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { Batch } from "../../utils/constants";

const BatchData: React.FC<{
  batch: Batch;
  onClick: (batch: Batch) => void;
  deleteClick?: () => void;
}> = ({ batch, onClick, deleteClick }) => {
  return (
    <div
      onClick={() => onClick(batch)}
      title={batch.completion === 100 ? "Batch Completed" : "View More Details"}
      className={`px-2 py-4 rounded-lg laptop-sm:rounded-xl flex flex-col items-center border ${
        batch.completion === 100
          ? "border-green-600"
          : "border-[var(--color-primary)]"
      } border-[var(--color-primary)] bg-[var(--color-secondary)] shadow-md hover:cursor-pointer hover:scale-105 hover:bg-[var(--color-primaryHover)] gap-2 relative`}
    >
      {/* Delete icon only for admin*/}
      {deleteClick && (
        <div
          onClick={(e) => {
            e.stopPropagation(); // prevent card click
            deleteClick();
          }}
          title="Delete Batch"
          className="absolute top-2 right-2 z-10"
        >
          <FaTrashAlt className="h-5 w-5 text-red-500" />
        </div>
      )}

      {/* Completion text if batch is completed */}
      {batch.completion === 100 && (
        <div className="absolute top-0 left-0 z-10 text-xs p-2 bg-green-600 rounded-tl-lg text-white font-semibold">
          Completed
        </div>
      ) }

      {/* Content */}
      <div className="border-b w-full border-gray-600">
        <div className="flex flex-col items-center justify-center mb-2 gap-2">
          <MdLibraryBooks className="h-10 w-10 tablet:h-12 tablet:w-12 text-black" />
          <div className="font-semibold">{batch.name}</div>
        </div>
      </div>

      <div className="space-y-1 text-center">
        <div className="font-semibold">
          {batch.subject.name} - {batch.subject.code}
        </div>
        <div className="flex flex-wrap justify-center items-center gap-2">
          {batch.schedule.day.map((day: string, idx: number) => (
            <span key={idx}>{day}</span>
          ))}
        </div>
        <div>{batch.schedule.time}</div>
        <div>Students - {batch.students.length}</div>
      </div>
    </div>
  );
};

export default BatchData;
