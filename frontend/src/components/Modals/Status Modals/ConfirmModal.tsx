import React from "react";

interface ConfirmModalProps {
  confirm: string;
  onClick: (response: "yes" | "no") => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ confirm, onClick }) => {
  return (
    <div className="fixed inset-0 bg-[var(--color-primaryHover)]/10 backdrop-blur-sm z-50 flex items-center justify-center">
      <div
        className="bg-[var(--color-primary)]/50 backdrop-blur-md border border-[var(--color-secondary)]/30 
        shadow-2xl drop-shadow-2xl rounded-xl laptop-l:rounded-3xl 
        max-h-[60vh] min-w-[90%] mobile-m:min-w-[75%] mobile-l:min-w-[65%] tablet:min-w-[55%] laptop-sm:min-w-[40%] laptop-l:min-w-[30%] 4k:min-w-[25%] 
        max-w-[90%] mobile-m:max-w-[75%] mobile-l:max-w-[65%] tablet:max-w-[55%] laptop-sm:max-w-[40%] laptop-l:max-w-[30%] 4k:max-w-[25%] 
        overflow-hidden p-4 flex flex-col items-center gap-[2.5vw] tablet:gap-[1.5vw] laptop-sm:gap-[1vw] laptop-l:gap-[0.8vw]"
      >
        <div className="break-words text-center text-[4vw] tablet:text-[3vw] laptop-sm:text-[2vw] laptop-l:text-[1.7vw]">
          {confirm}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-around mt-4">
          <button
            title="No, cancel"
            onClick={() => onClick("no")}
            className="cancel-button"
          >
            No
          </button>
          <button
            title="Yes, confirm"
            onClick={() => onClick("yes")}
            className="add-button"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
