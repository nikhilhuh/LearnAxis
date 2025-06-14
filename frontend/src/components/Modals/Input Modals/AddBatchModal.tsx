import React from "react";
import { IoMdClose } from "react-icons/io";
import { FaPlusCircle } from "react-icons/fa";
import { useUser } from "../../../context/UserContext";
import SelectOptionDropdown from "../../Dropdown/SelectOptionDropdown";
import { getSubjects } from "../../../services/api/apiCalls/common/getSubjects";
import { getRooms } from "../../../services/api/apiCalls/common/getRooms";
import { getTeachersName } from "../../../services/api/apiCalls/admin/get/getTeachersName";
import { addBatchType, Room, Subject, Teacher } from "../../../utils/constants";
import { getSubjectStudents } from "../../../services/api/apiCalls/admin/get/getSubjectStudents";
import ErrorModal from "../Status Modals/ErrorModal";
import StudentList from "../../Batches/StudentList";

interface AddBatchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleAddBatches: (batches: addBatchType[]) => void;
}

const AddBatchModal: React.FC<AddBatchesModalProps> = ({
  isOpen,
  onClose,
  handleAddBatches,
}) => {
  const { UserDetails } = useUser();
  const [error, setError] = React.useState<string>("");
  const [subjectOptions, setSubjectOptions] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [roomOptions, setRoomOptions] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [teacherOptions, setTeacherOptions] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [isFormValid, setIsFormValid] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      // Reset form to initial empty batch when modal closes
      setBatches([
        {
          name: "",
          subject: "",
          teacher: "",
          room: "",
          schedule: { day: [], time: "" },
          students: [],
          days: null,
          startDate: "",
        },
      ]);
      setAddStudentList({});
    }
  }, [isOpen]);

  //   calling getteachers and getrooms and getsubjects and saving them in respective variables
  React.useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDropdownData = async () => {
      if (!UserDetails?.email) return;
      try {
        const [subjectsRes, roomsRes, teachersRes] = await Promise.all([
          getSubjects(UserDetails.email),
          getRooms(UserDetails.email),
          getTeachersName(UserDetails.email),
        ]);
        const formattedSubjects = subjectsRes.data.map((sub: Subject) => ({
          label: `${sub.name}- ${sub.code}`,
          value: sub.code,
        }));
        const formattedRooms = roomsRes.data.map((room: Room) => ({
          label: `${room.name} - ${
            room.capacity !== null && room.capacity !== undefined
              ? room.capacity
              : "N/A"
          }`,
          value: room.name,
        }));

        const formattedTeachers = teachersRes.data.map((teacher: Teacher) => ({
          label: `${teacher.firstName} ${teacher.lastName}- ${teacher.user_id}`,
          value: teacher.user_id,
        }));
        setSubjectOptions(formattedSubjects);
        setRoomOptions(formattedRooms);
        setTeacherOptions(formattedTeachers);
      } catch (err) {
        console.error("Failed fetching subjects or rooms or teachers:", err);
      }
    };
    fetchDropdownData();
  }, []);

  if (!UserDetails) return null;

  const [batches, setBatches] = React.useState<addBatchType[]>([
    {
      name: "",
      subject: "",
      teacher: "",
      room: "",
      schedule: { day: [], time: "" },
      students: [],
      days: null,
      startDate: "",
    },
  ]);
  const [addStudentList, setAddStudentList] = React.useState<{
    [index: number]: any[];
  }>({});

  React.useEffect(() => {
    const isValid = batches.every(
      (batch) =>
        batch.name.trim() &&
        batch.subject &&
        batch.teacher &&
        batch.room &&
        batch.schedule.day.length > 0 &&
        batch.schedule.time.trim() &&
        batch.days &&
        Array.isArray(batch.students) &&
        batch.students.length > 0
    );
    setIsFormValid(isValid);
    batches.forEach((batch, index) => {
      if (batch.subject && batch.room) {
        // Only fetch if not already fetched to avoid re-fetching repeatedly
        if (!addStudentList[index]) {
          fetchStudentsForSubjectandRoom(batch.subject, batch.room, index);
        }
      }
    });
  }, [batches]);

  const fetchStudentsForSubjectandRoom = async (
    subjectCode: string,
    roomName: string,
    index: number
  ) => {
    try {
      const res = await getSubjectStudents(
        UserDetails.email,
        subjectCode,
        roomName
      );
      if (res.success) {
        setAddStudentList((prev) => ({ ...prev, [index]: res.data }));
      } else {
        setError(res.message || `Failed to fetch students for the subject`);
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    } catch (err) {
      setError(`Failed to fetch students for the subject`);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  const handleInputChange = (
    index: number,
    field: keyof addBatchType,
    value: any
  ) => {
    const updated = [...batches];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setBatches(updated);

    // 👉 Trigger student fetch when subject or room is updated
    if (
      (field === "subject" || field === "room") &&
      updated[index].subject &&
      updated[index].room
    ) {
      fetchStudentsForSubjectandRoom(
        updated[index].subject,
        updated[index].room,
        index
      );
    }
  };

  const handleScheduleChange = (
    index: number,
    field: keyof addBatchType["schedule"],
    value: any
  ) => {
    const updated = [...batches];
    const schedule = { ...updated[index].schedule };

    if (field === "day") {
      schedule.day = value;
    } else {
      schedule[field] = value;
    }

    updated[index] = {
      ...updated[index],
      schedule,
    };

    setBatches(updated);
  };

  const handleSelectAll = (batchIndex: number, isSelected: boolean) => {
    const studentIds =
      addStudentList[batchIndex]?.map((student) => student.user_id) || [];

    const updatedBatches = [...batches];
    updatedBatches[batchIndex].students = isSelected ? studentIds : [];
    setBatches(updatedBatches);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAddBatches(batches);
    onClose();
  };

  return (
    <div
      className={`${
        isOpen ? "flex" : "hidden"
      } fixed inset-0 bg-[var(--color-primaryHover)]/20 backdrop-blur-sm z-40 flex items-center justify-center`}
    >
      {error && <ErrorModal error={error} />}
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        bg-[var(--color-primary)]/80 backdrop-blur-md border border-[var(--color-secondary)]/80 
        shadow-2xl drop-shadow-2xl rounded-xl laptop-lg:rounded-3xl w-[90vw] tablet:w-[70vw] laptop-sm:w-[60vw] z-40`}
      >
        <div className="bg-[var(--color-secondary)] px-4 py-2 rounded-tr-xl laptop-lg:rounded-tr-3xl rounded-tl-xl laptop-lg:rounded-tl-3xl flex justify-between items-center">
          <div className="font-semibold">Add Batch</div>
          <IoMdClose
            title="Close"
            className="text-red-700 text-2xl cursor-pointer hover:scale-105"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="text-sm tablet:text-base p-4 h-[60vh] max-h-[60vh] overflow-y-auto flex flex-col justify-between"
        >
          {batches.map((batch, index) => (
            <div
              key={index}
              className="border p-4 my-2 rounded-md space-y-3 bg-white/10"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Batch {index + 1}</h3>
                {index > 0 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setBatches((prev) => prev.filter((_, i) => i !== index));
                    }}
                    className="text-red-600 font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Batch Name */}
              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <label htmlFor={`batchName${index}`} className="font-semibold">
                  Batch Name
                </label>
                <input
                  type="text"
                  id={`batchName${index}`}
                  className="modal-input-field"
                  value={batch.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                  placeholder="batch name"
                  required
                />
              </div>
              {/* Subject */}
              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <div className="font-semibold">Subject</div>
                <SelectOptionDropdown
                  options={subjectOptions}
                  onSelect={(value) =>
                    handleInputChange(index, "subject", value)
                  }
                  preSelectedValue={batch.subject}
                  className="modal-input-field"
                />
              </div>
              {/* Teacher */}
              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <div className="font-semibold">Teacher</div>
                <SelectOptionDropdown
                  options={teacherOptions}
                  onSelect={(value) =>
                    handleInputChange(index, "teacher", value)
                  }
                  preSelectedValue={batch.teacher}
                  className="modal-input-field"
                />
              </div>
              {/* Room */}
              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <div className="font-semibold">Room</div>
                <SelectOptionDropdown
                  options={roomOptions}
                  onSelect={(value) => handleInputChange(index, "room", value)}
                  preSelectedValue={batch.room}
                  className="modal-input-field"
                />
              </div>
              {/* Schedule Days */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="font-semibold">Days</div>
                <div className="grid grid-cols-2 tablet:grid-cols-3 laptop-lg:grid-cols-4 gap-2">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <label
                      key={`${index}-${day}`}
                      htmlFor={`day-${index}-${day}`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={`day-${index}-${day}`}
                        checked={batch.schedule.day.includes(day)}
                        onChange={(e) => {
                          const selectedDay = day;
                          const updatedDays = e.target.checked
                            ? [...batch.schedule.day, selectedDay]
                            : batch.schedule.day.filter(
                                (d) => d !== selectedDay
                              );
                          handleScheduleChange(index, "day", updatedDays);
                        }}
                        className="accent-[var(--color-secondary)]"
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              {/* Schedule Time */}
              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <label htmlFor={`time${index}`} className="font-semibold">
                  Time
                </label>
                <input
                  type="text"
                  id={`time${index}`}
                  placeholder="e.g. 10:00 AM to 1:00 PM"
                  value={batch.schedule.time}
                  onChange={(e) =>
                    handleScheduleChange(index, "time", e.target.value)
                  }
                  className="modal-input-field"
                  required
                />
              </div>
              {/* Days Count */}
              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <label htmlFor={`days${index}`} className="font-semibold">
                  Days
                </label>
                <input
                  type="number"
                  id={`days${index}`}
                  placeholder="Total Days"
                  min="1"
                  value={batch.days ?? ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value > 0) {
                      handleInputChange(index, "days", value);
                    } else {
                      handleInputChange(index, "days", null); // or keep previous if preferred
                    }
                  }}
                  className="modal-input-field"
                />
              </div>
              {/* Start Date */}
              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <label htmlFor={`startDate${index}`} className="font-semibold">
                  Start Date
                </label>
                <input
                  type="date"
                  id={`startDate${index}`}
                  value={batch.startDate || ""}
                  onChange={(e) =>
                    handleInputChange(index, "startDate", e.target.value)
                  }
                  className="modal-input-field"
                />
              </div>

              <StudentList
                students={addStudentList[index]}
                selectedStudents={batch.students}
                onSelectStudent={(studentId, isSelected) => {
                  const currentStudents = batches[index].students;
                  const updatedStudents = isSelected
                    ? [...currentStudents, studentId]
                    : currentStudents.filter((id) => id !== studentId);
                  handleInputChange(index, "students", updatedStudents);
                }}
                onSelectAll={(isSelected) => handleSelectAll(index, isSelected)}
              />
            </div>
          ))}

          {/* Add another batch */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setBatches((prev) => [
                ...prev,
                {
                  name: "",
                  subject: "",
                  teacher: "",
                  room: "",
                  schedule: { day: [], time: "" },
                  students: [],
                  days: null,
                  startDate: "",
                },
              ]);
            }}
            className="add-another-button"
          >
            <FaPlusCircle />
            Add another Batch
          </button>

          {/* Submit Buttons */}
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
              title={
                isFormValid
                  ? "Add Data to database"
                  : "Fill in all the fields first"
              }
              type="submit"
              className={`add-button ${
                !isFormValid
                  ? "opacity-50 cursor-not-allowed! hover:bg-current!"
                  : ""
              }`}
              disabled={!isFormValid}
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBatchModal;
