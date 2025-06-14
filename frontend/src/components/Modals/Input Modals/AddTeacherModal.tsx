import React from "react";
import { IoMdClose } from "react-icons/io";
import { FaPlusCircle } from "react-icons/fa";
import { addTeacherType } from "../../../utils/constants";

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleAddTeachers: (teachers: addTeacherType[]) => void;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  isOpen,
  onClose,
  handleAddTeachers,
}) => {
  if (!isOpen) return null;

  const [teachers, setTeachers] = React.useState<addTeacherType[]>([
    { firstName: "", lastName: "", email: "", password: "" },
  ]);
  const handleInputChange = (
    index: number,
    field: keyof addTeacherType,
    value: string
  ) => {
    const updated = [...teachers];
    updated[index][field] = value;
    setTeachers(updated);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAddTeachers(teachers);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-primaryHover)]/20 backdrop-blur-sm z-40 flex items-center justify-center">
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        bg-[var(--color-primary)]/80 backdrop-blur-md border border-[var(--color-secondary)]/80 
        shadow-2xl drop-shadow-2xl rounded-xl laptop-lg:rounded-3xl w-[90vw] tablet:w-[70vw] laptop-sm:w-[60vw] z-40`}
      >
        <div className="bg-[var(--color-secondary)] px-4 py-2 rounded-tr-xl laptop-lg:rounded-tr-3xl rounded-tl-xl laptop-lg:rounded-tl-3xl flex justify-between items-center">
          <div className="font-semibold">Add Teacher(s)</div>
          <IoMdClose
            title="Close"
            className="text-red-700 text-2xl cursor-pointer hover:scale-105"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          />
        </div>

        <form onSubmit={handleSubmit} className="text-sm tablet:text-base p-4 h-[60vh] max-h-[60vh] overflow-y-auto flex flex-col justify-between">
          <p className="mb-4">
            * means required
          </p>
          {teachers.map((teacher, index) => (
            <div
              key={index}
              className="border p-4 my-2 rounded-md space-y-3 bg-white/10"
            >
              <div className="flex justify-between items-center">
                <h3 className=" font-semibold">Teacher {index + 1}</h3>
                {index > 0 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setTeachers((prev) => prev.filter((_, i) => i !== index));
                    }}
                    className="text-red-600 font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              {/* first name input */}
              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <label htmlFor={`firstName${index}`} className="font-semibold">
                  First Name *
                </label>
                <input
                  type="text"
                  id={`firstName${index}`}
                  className="modal-input-field"
                  value={teacher.firstName}
                  onChange={(e) =>
                    handleInputChange(index, "firstName", e.target.value)
                  }
                  placeholder="first name"
                  required
                />
              </div>
              {/* last name input */}
              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <label htmlFor={`lastName${index}`} className=" font-semibold">
                  Last Name
                </label>
                <input
                  type="text"
                  id={`lastName${index}`}
                  className="modal-input-field"
                  value={teacher.lastName}
                  onChange={(e) =>
                    handleInputChange(index, "lastName", e.target.value)
                  }
                  placeholder="last name"
                />
              </div>
              {/* email input */}
              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <label
                  htmlFor={`inputemail${index}`}
                  className=" font-semibold"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id={`inputemail${index}`}
                  className="modal-input-field"
                  value={teacher.email}
                  onChange={(e) =>
                    handleInputChange(index, "email", e.target.value)
                  }
                  placeholder="email"
                  required
                />
              </div>
              {/* password input */}
              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <label
                  htmlFor={`inputpassword${index}`}
                  className=" font-semibold"
                >
                  Password *
                </label>
                <input
                  type="password"
                  id={`inputpassword${index}`}
                  className="modal-input-field"
                  value={teacher.password}
                  onChange={(e) =>
                    handleInputChange(index, "password", e.target.value)
                  }
                  placeholder="******"
                  required
                />
              </div>
            </div>
          ))}

          {/* add another teacher button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setTeachers((prev) => [
                ...prev,
                { firstName: "", lastName: "", email: "", password: "" },
              ]);
            }}
            className="add-another-button"
          >
            <FaPlusCircle />
            Add another Teacher
          </button>

          {/* Buttons */}
          <div className="flex gap-4 justify-around mt-4">
            <button
              title="Cancel addition"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              title="Add Data to database"
              type="submit"
              className="add-button"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacherModal;
