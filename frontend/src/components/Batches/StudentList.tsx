import React from "react";
import NoDataImg from "../../assets/images/nodata.svg";

interface StudentListProps {
  students: any[];
  selectedStudents: string[];
  onSelectStudent: (studentId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
}

const StudentList: React.FC<StudentListProps> = ({
  students,
  selectedStudents,
  onSelectStudent,
  onSelectAll,
}) => {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Select Students</h2>
      {students && (
        <div className="mb-2 float-right space-x-2">
          <span>Select all {students.length} students</span>
          <input
            type="checkbox"
            id={`check`}
            className="accent-[var(--color-secondary)] scale-125 cursor-pointer"
            checked={
              students.length > 0 && selectedStudents.length === students.length
            }
            onChange={(e) => onSelectAll(e.target.checked)} // <-- new
          />
        </div>
      )}
      {!students || students.length === 0 ? (
        <div className="w-full flex flex-col items-center text-center mt-4 gap-4">
          <img src={NoDataImg} alt="No Data" className="h-[5vh] w-auto" />
          <p className="text-gray-500">No students found.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto border border-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-md rounded-lg overflow-hidden text-sm laptop-sm:text-base">
            <thead className="bg-[var(--color-secondary)]/60">
              <tr>
                <th className="py-3 px-4 text-left">S.No</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Roll No</th>
                <th className="py-3 px-4 text-center">Select</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {students.map((student, idx) => {
                const id = student.user_id;
                const isChecked = selectedStudents.includes(id);

                return (
                  <tr
                    key={idx}
                    title={`Add ${student.firstName} to batch`}
                    className="even:bg-[var(--color-primaryHover)]/60 hover:bg-white/10 transition text-center"
                  >
                    <td className="py-3 px-4 text-left">{idx + 1}</td>
                    <td className="py-3 px-4 text-left">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="py-3 px-4 text-left">{student.user_id}</td>
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        id={`check-${idx}`}
                        checked={isChecked}
                        onChange={(e) => onSelectStudent(id, e.target.checked)}
                        className="accent-[var(--color-secondary)] scale-125 cursor-pointer"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
