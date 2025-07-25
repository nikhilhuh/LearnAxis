import React from "react";
import { useUser } from "../../context/UserContext";
import ErrorModal from "../../components/Modals/Status Modals/ErrorModal";
import NoDataImg from "../../assets/images/nodata.svg";
import StudentData from "../../components/Students/StudentData";
import SelectOptionDropdown from "../../components/Dropdown/SelectOptionDropdown";
import { Batch, Student } from "../../utils/constants";
import Clockloader from "../../components/Loaders/Clockloader";
import { useNavigate } from "react-router-dom";
import { getTeacherStudents } from "../../services/api/apiCalls/teacher/getStudents";
import { getTeacherBatches } from "../../services/api/apiCalls/teacher/getTeacherBatches";

const TeacherStudents: React.FC = () => {
  const { UserDetails } = useUser();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [students, setStudents] = React.useState<Student[]>([]);
  const [filterOptions, setFilterOptions] = React.useState<
    { label: string; value: string }[]
  >([{ label: "All Students", value: "All Students" }]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  React.useEffect(() => {
    const fetchStudents = async () => {
      if (!UserDetails?.email || UserDetails.role !== "teacher") return;

      setLoadingData(true);
      try {
        const result = await getTeacherStudents(UserDetails.email);
        if (result.success) {
          setStudents(result.data);
        } else {
          setError(result.message || "Something went wrong.");
          setTimeout(() => setError(""), 2000);
        }
      } catch (err: any) {
        setError("Something went wrong.");
        setTimeout(() => setError(""), 2000);
      } finally {
        setLoadingData(false);
      }
    };
    const fetchBatches = async () => {
      if (!UserDetails?.email || UserDetails.role !== "teacher") return;
      try {
        const result = await getTeacherBatches(UserDetails?.email);
        if (result.success) {
          const formattedBatchFilters = result.data.map((batch: Batch) => ({
            label: batch.name,
            value: batch.name,
          }));

          // Deduplicate based on batch name
          const uniqueFiltersMap = new Map();
          [...filterOptions, ...formattedBatchFilters].forEach((item) =>
            uniqueFiltersMap.set(item.value, item)
          );
          const uniqueFilters = Array.from(uniqueFiltersMap.values());

          setFilterOptions(uniqueFilters);
        } else {
          setError(result.message || "Something went wrong.");
          setTimeout(() => setError(""), 2000);
        }
      } catch (err: any) {
        setError("Something went wrong.");
        setTimeout(() => setError(""), 2000);
      }
    };

    fetchStudents();
    fetchBatches();
  }, [UserDetails]);

  const [filter, setFilter] = React.useState<string>("All Students");
  const [filteredStudents, setFilteredStudents] =
    React.useState<Student[]>(students);
  React.useEffect(() => {
    if (filter === "All Students") {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(
        students.filter((student) =>
          student.batches?.some((batch) => batch.name === filter)
        )
      );
    }
  }, [filter, students]);
  const handleSelect = (e: string) => {
    setFilter(e);
  };

  if (!UserDetails) return null;

  return (
    <div className="flex-grow">
      {error && <ErrorModal error={error} />}
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl laptop-sm:text-2xl laptop-lg:text-3xl font-bold">
          Students
        </h2>
        <SelectOptionDropdown
          options={filterOptions}
          placeholder="Filter by"
          onSelect={handleSelect}
          preSelectedValue={filter}
          className="bg-transparent outline-none focus:outline-none border-b-2 border-gray-400 px-2 py-1 w-max"
        />
      </div>
      {loadingData ? (
        <div className="h-[60vh] flex items-center justify-center">
          <Clockloader size={60} />
        </div>
      ) : (
        <>
          {filteredStudents.length === 0 ? (
            <div className="w-full flex flex-col items-center text-center translate-y-1/2 gap-4">
              <img src={NoDataImg} alt="No Data" className="h-[25vh] w-auto" />
              <p className="text-gray-400">No students found.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              {filteredStudents.map((student) => (
                <StudentData
                  key={student.user_id}
                  student={student}
                  onClick={() =>
                    navigate(
                      `/teacher/students/${encodeURIComponent(student.user_id)}`,
                      {
                        state: { student },
                      }
                    )
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherStudents;
