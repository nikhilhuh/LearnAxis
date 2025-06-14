import React from "react";
import { useUser } from "../../context/UserContext";
import HandWaveImg from "../../assets/images/hand-wave.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Book, Layers3, CalendarClock } from "lucide-react";
import Clockloader from "../../components/Loaders/Clockloader";
import ErrorModal from "../../components/Modals/Status Modals/ErrorModal";
import NoDataImg from "../../assets/images/nodata.svg";
import { getStudentDashboard } from "../../services/api/apiCalls/student/getDashboard";

const COLORS = ["#4f46e5", "#10b981"];

const StudentDashboard: React.FC = () => {
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
      if (!UserDetails) return;
      setLoadingData(true);
      try {
        const response = await getStudentDashboard(UserDetails.email);
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError(response.message || "Something went wrong");
          setTimeout(() => setError(""), 2000);
        }
      } catch (err: any) {
        setError("Something went wrong");
        setTimeout(() => setError(""), 2000);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [UserDetails]);

  if (!UserDetails) return null;

  const {
    subjectStats,
    batchesCount,
    daywiseBatchData,
    createdAt,
    uniqueTeachers = [],
    attendanceStats = {},
  } = dashboardData || {};

  const statsCards = [
    {
      label: "Total Subjects",
      value: subjectStats?.totalSubjects || 0,
      icon: <Book className="text-yellow-600" />,
    },
    {
      label: "Opted Subjects",
      value: subjectStats?.optedSubjects || 0,
      icon: <Book className="text-green-600" />,
    },
    {
      label: "Batches",
      value: batchesCount || 0,
      icon: <Layers3 className="text-indigo-600" />,
    },
    {
      label: "Student Since",
      value: new Date(createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      }),
      icon: <CalendarClock className="text-blue-600" />,
    },
  ];

  const pieData = [
    { name: "Opted Subjects", value: subjectStats?.optedSubjects || 0 },
    {
      name: "Available Subjects",
      value:
        (subjectStats?.totalSubjects || 0) - (subjectStats?.optedSubjects || 0),
    },
  ];

  return (
    <div className="flex-grow space-y-4">
      {error && <ErrorModal error={error} />}
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

          {/* Charts */}
          <div className="grid grid-cols-1 laptop-sm:grid-cols-2 gap-2 laptop-sm:gap-4">
            {/* Bar Chart */}
            <div className="p-4 tablet:p-6 rounded-2xl shadow border">
              <h1 className="mb-2 font-semibold">Batches Per Day</h1>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={daywiseBatchData}>
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="p-4 tablet:p-6 rounded-2xl shadow border">
              <h1 className="mb-2 font-semibold">Your Courses</h1>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout={isSmallScreen ? "horizontal" : "vertical"}
                    verticalAlign="bottom"
                    align="right"
                    wrapperStyle={{ paddingTop: isSmallScreen ? 20 : 0 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Pie Charts */}
          <div className="p-4 tablet:p-6 rounded-2xl shadow border">
            <h1 className="mb-4 font-semibold">Your Attendance</h1>
            {attendanceStats &&
            Object.keys(attendanceStats).length > 0 ? (
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
                {Object.entries(attendanceStats).map(
                  ([batchName, percentage], index) => {
                    const attendancePercentage = percentage as number;
                    const pieData = [
                      { name: "Present", value: attendancePercentage },
                      { name: "Remaining", value: 100 - attendancePercentage },
                    ];

                    return (
                      <div
                        key={`${batchName}-${index}`}
                        className="flex flex-col items-center"
                      >
                        <h2 className="mb-2 font-medium">{batchName}</h2>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              dataKey="value"
                              nameKey="name"
                              outerRadius={80}
                              label={({ name, percent }) =>
                                `${name} (${Math.round(percent * 100)}%)`
                              }
                            >
                              {pieData.map((_, idx) => (
                                <Cell
                                  key={`cell-${idx}`}
                                  fill={COLORS[idx % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number) => `${value}%`}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="flex flex-col h-full w-full justify-center items-center gap-2 text-center">
                <img
                  src={NoDataImg}
                  alt="No Data"
                  className="h-[20vh] w-auto"
                />
                <p className="text-gray-400">No active batches found.</p>
              </div>
            )}
          </div>

          {/* Teachers student got taught by */}
          <div className="p-4 tablet:p-4 rounded-2xl shadow border">
            <h3 className="text-md font-medium mb-2 tablet:mb-4">
              Teachers You've Been Taught By
            </h3>
            {uniqueTeachers.length === 0 ? (
              <div className="flex flex-col h-full w-full justify-center items-center gap-2 text-center">
                <img
                  src={NoDataImg}
                  alt="No Data"
                  className="h-[20vh] w-auto"
                />
                <p className="text-gray-400">No teachers found.</p>
              </div>
            ) : (
              <ul>
                {uniqueTeachers.map((teacher: any) => (
                  <li key={teacher.email} className="py-2">
                    <p className="font-semibold">{teacher.name}</p>
                    <p className="text-sm text-gray-400">{teacher.email}</p>
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

export default StudentDashboard;
