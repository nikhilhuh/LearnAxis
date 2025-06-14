import React from "react";
import { useUser } from "../../context/UserContext";
import HandWaveImg from "../../assets/images/hand-wave.png";
import { getAdminDashboard } from "../../services/api/apiCalls/admin/get/getDashboard";
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
import { Users, Book, Building2, Layers3, GraduationCap } from "lucide-react";
import Clockloader from "../../components/Loaders/Clockloader";
import ErrorModal from "../../components/Modals/Status Modals/ErrorModal";
import NoDataImg from "../../assets/images/nodata.svg";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ec4899", "#6366f1"];

const AdminDashboard: React.FC = () => {
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
        const response = await getAdminDashboard(UserDetails.email);
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

  const stats = dashboardData?.stats || {};
  const recentStudents = dashboardData?.recentStudents || [];

  const chartData = [
    { name: "Students", value: stats.studentCount },
    { name: "Teachers", value: stats.teacherCount },
    { name: "Subjects", value: stats.subjectCount },
    { name: "Rooms", value: stats.roomCount },
    { name: "Batches", value: stats.batchCount },
  ];

  const IconMap: any = {
    Students: <GraduationCap className="text-blue-600" />,
    Teachers: <Users className="text-green-600" />,
    Subjects: <Book className="text-yellow-600" />,
    Rooms: <Building2 className="text-pink-600" />,
    Batches: <Layers3 className="text-indigo-600" />,
  };

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
          <div className="grid grid-cols-1 mobile-l:grid-cols-2 tablet:grid-cols-3 laptop-lg:grid-cols-5 gap-2 laptop-sm:gap-4">
            {chartData.map(({ name, value }) => (
              <div
                key={name}
                className="p-2 tablet:p-4 bg-[var(--color-primaryHover)] border border-[var(--color-primaryHover)] rounded-2xl shadow flex flex-col justify-center items-center gap-4 text-center"
              >
                {IconMap[name]}
                <div>
                  <h2 className="text-xl font-semibold">{value}</h2>
                  <p className="text-base text-gray-400">{name}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 laptop-sm:grid-cols-2 gap-2 laptop-sm:gap-4">
            <div className="p-4 tablet:p-6 rounded-2xl shadow border place-content-center">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 tablet:p-6 rounded-2xl shadow border">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {chartData.map((_, index) => (
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
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Students */}
          <div className="p-4 rounded-2xl shadow border">
            <h3 className="text-md font-medium mb-2 tablet:mb-4">
              Recently Added Students
            </h3>
            <div>
              {!recentStudents || recentStudents.length === 0 ? (
                <div className="flex flex-col h-full w-full justify-center items-center gap-2 text-center">
                  <img
                    src={NoDataImg}
                    alt="No Data"
                    className="h-[20vh] w-auto"
                  />
                  <p className="text-gray-400">No Recent Students.</p>
                </div>
              ) : (
                <>
                  {recentStudents.map((student: any, index:number) => (
                    <div key={index} className="py-2">
                      <p className="font-semibold">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-gray-400">{student.email}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
