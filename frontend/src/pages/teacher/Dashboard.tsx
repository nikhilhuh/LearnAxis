import React from "react";
import { useUser } from "../../context/UserContext";
import HandWaveImg from "../../assets/images/hand-wave.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Users, Book, Layers3, CalendarClock } from "lucide-react";
import Clockloader from "../../components/Loaders/Clockloader";
import ErrorModal from "../../components/Modals/Status Modals/ErrorModal";
import NoDataImg from "../../assets/images/nodata.svg";
import { getTeacherDashboard } from "../../services/api/apiCalls/teacher/getDashboard";

const TeacherDashboard: React.FC = () => {
  const { UserDetails } = useUser();
  const [error, setError] = React.useState<string>("");
  const [dashboardData, setDashboardData] = React.useState<any>(null);
  const [loadingData, setLoadingData] = React.useState(true);
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 500);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      if (!UserDetails?.email) return;
      setLoadingData(true);
      try {
        const response = await getTeacherDashboard(UserDetails.email);
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError(response.message || "Something went wrong");
        }
      } catch {
        setError("Something went wrong");
      } finally {
        setTimeout(() => setError(""), 2000);
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [UserDetails]);

  if (!UserDetails) return null;

  const {
    stats,
    createdAt,
    daywiseBatchData = [],
    recentStudents = [],
    studentCountPerBatch = [],
    upcomingBatches = [],
  } = dashboardData || {};

  const statsCards = [
    {
      label: "Your Batches",
      value: stats?.totalBatches || 0,
      icon: <Layers3 className="text-indigo-600" />,
    },
    {
      label: "Subjects you're teaching",
      value: stats?.totalSubjects || 0,
      icon: <Book className="text-yellow-600" />,
    },
    {
      label: "Students you're currently teaching",
      value: stats?.totalStudents || 0,
      icon: <Users className="text-green-600" />,
    },
    {
      label: "Teaching Since",
      value: new Date(createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      }),
      icon: <CalendarClock className="text-blue-600" />,
    },
  ];
  
  const currentDate = new Date();
  const today = currentDate.toLocaleDateString("en-IN", { weekday: "long" });
  const currentTime = currentDate.toTimeString().slice(0, 5); // "HH:MM"

  // Filter upcoming batches
  const filteredUpcomingBatches = upcomingBatches.filter((batch: any) => {
    return (
      batch.days.includes(today) && batch.time >= currentTime // both should be in "HH:MM" format
    );
  });

  return (
    <div className="flex-grow space-y-4">
      {error && <ErrorModal error={error} />}

      {/* Header */}
      <header className="flex items-center gap-2">
        <h1 className="text-lg tablet:text-xl laptop-lg:text-3xl font-bold">
          Welcome, {UserDetails.firstName}
        </h1>
        <img
          src={HandWaveImg}
          alt="Hello"
          className="h-[5vh] laptop-lg:h-[6vh] w-auto object-contain"
        />
      </header>
      {loadingData ? (
        <div className="h-[60vh] flex items-center justify-center">
          <Clockloader size={60} />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 mobile-l:grid-cols-2 tablet:grid-cols-3 laptop-lg:grid-cols-4 gap-2 laptop-sm:gap-4">
            {statsCards.map(({ label, value, icon }) => (
              <div
                key={label}
                className="p-2 tablet:p-4 bg-[var(--color-primaryHover)] border border-[var(--color-primaryHover)] rounded-2xl shadow flex flex-col justify-center items-center gap-4 text-center"
              >
                {icon}
                <div>
                  <h2 className="text-xl font-semibold">{value}</h2>
                  <p className="text-base text-gray-400">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts and Lists */}
          <div className="grid grid-cols-1 laptop-sm:grid-cols-2 gap-2 laptop-sm:gap-4">
            {/* Bar Chart for Days */}
            <div className="p-4 tablet:p-6 rounded-2xl shadow border">
              <h1 className="mb-2 font-semibold">Batches Per Day</h1>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={daywiseBatchData}>
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart for Students per Batch */}
            <div className="p-4 tablet:p-6 rounded-2xl shadow border">
              <h1 className="mb-2 font-semibold">Students Per Batch</h1>
              {studentCountPerBatch?.length === 0 ? (
                <div className="flex flex-col h-full justify-center items-center gap-2">
                  <img
                    src={NoDataImg}
                    alt="No Data"
                    className="h-[20vh] w-auto"
                  />
                  <p className="text-gray-400">No batches assigned yet.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={studentCountPerBatch}
                      dataKey="students"
                      nameKey="batch"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {studentCountPerBatch.map((_: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "#6366f1",
                              "#10b981",
                              "#f59e0b",
                              "#ef4444",
                              "#3b82f6",
                            ][index % 5]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      layout={isSmallScreen ? "horizontal" : "vertical"}
                      verticalAlign="bottom"
                      align="right"
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Upcoming Batches */}
          <div className="p-4 rounded-2xl shadow border">
            <h3 className="text-md font-medium mb-2 tablet:mb-4">
              Upcoming Batches
            </h3>
            {filteredUpcomingBatches.length === 0 ? (
              <div className="flex flex-col h-full justify-center items-center gap-2">
                <img
                  src={NoDataImg}
                  alt="No Data"
                  className="h-[20vh] w-auto"
                />
                <p className="text-gray-400">No upcoming batches found.</p>
              </div>
            ) : (
              <ul>
                {filteredUpcomingBatches.map((batch: any, index: number) => (
                  <li key={index} className="py-2">
                    <p className="font-semibold">{batch.name}</p>
                    <p className="text-sm text-gray-500">
                      Subject: {batch.subject} | Room: {batch.room}
                    </p>
                    <p className="text-sm text-gray-400">
                      {batch.days.join(", ")} at {batch.time}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Students */}
          <div className="p-4 rounded-2xl shadow border">
            <h3 className="text-md font-medium mb-2 tablet:mb-4">
              Recent Students
            </h3>
            {recentStudents.length === 0 ? (
              <div className="flex flex-col h-full justify-center items-center gap-2">
                <img
                  src={NoDataImg}
                  alt="No Data"
                  className="h-[20vh] w-auto"
                />
                <p className="text-gray-400">No students found.</p>
              </div>
            ) : (
              <ul>
                {recentStudents.map((student: any, index: number) => (
                  <li key={index} className="py-2">
                    <p className="font-semibold">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-gray-400">{student.email}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;
