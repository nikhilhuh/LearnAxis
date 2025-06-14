export type User = {
  firstName: string;
  lastName: string;
  email: string;
  user_id: string;
  role: "student" | "teacher" | "admin";
  status: "active" | "inactive";
};