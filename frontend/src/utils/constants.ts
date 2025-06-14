export type User = {
  firstName: string;
  lastName: string;
  email: string;
  user_id: string;
  role: "student" | "teacher" | "admin";
  status: "active" | "inactive";
};

export type Teacher = User & {
  role: "teacher";
  batches: Batch[];
};

export type Student = User & {
  role: "student";
  enrolledSubjects: Subject[];
  batches: any[];
};

export type Admin = User & {
  role: "admin";
};

export type SignUpUser = {
  firstName: string;
  lastName: string;
  role: "student";
  rollNo: string;
  email: string;
  password: string;
};

export type SignInUser = {
  email: User["email"];
  role: User["role"];
  password: string;
};

export type Subject = {
  _id?: string;
  name: string;
  code: string;
};

export type Room = {
  _id?: string;
  name: string;
  capacity: number | null;
};

export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type Batch = {
  name: string;
  subject: Subject;
  teacher: {
    _id: string;
    firstName: Teacher["firstName"];
    lastName: Teacher["lastName"];
    email: Teacher["email"];
  };
  students: Student[];
  room: Room;
  schedule: {
    day: Weekday[];
    time: string;
  };
  days: number;
  completion: number;
  syllabus: [{ title: string; done: boolean }];
  startDate?: string; 
  endDate?: string;
};

export type addBatchType = {
  name: string;
  subject: string;
  teacher: string;
  room: string;
  schedule: {
    day: string[];
    time: string;
  };
  students: string[];
  days: number | null;
  startDate: string;
};

export type addTeacherType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
