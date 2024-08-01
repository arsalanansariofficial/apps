export type DoctorProps = { doctor: Doctor };

export type UserState = { user: User | null };

export type AptTime = Appointment & AppointmentTime;

export type Modal = { id: string; message: string };

export type Modal_Ref = { open: () => void; close: () => void };

export type State = { user: UserState; doctor: DoctorState };

export type DoctorState = { doctors: Doctor[] | []; doctor: Doctor | null };

export type TimeSlot = {
  doctorId: string;
  availableDate: string;
  timeSlot: string[];
};

export type Request = {
  path: string;
  method?: string;
  header?: { [key: string]: string };
  body?: { [key: string]: any };
};

export type AppointmentTime = {
  remainingTime?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

export type Appointment = {
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  userId: string;
  userName: string;
  userEmailId: string;
  timeSlot: string;
  appointmentDate: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  mobilePhoneNumber: string;
  lastLoginTime: string | null;
  accessToken: string;
  expirationDate?: string;
};

export type Doctor = {
  id: string;
  firstName: string;
  lastName: string;
  speciality: string;
  dob: string;
  address: {
    id: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postcode: string;
  };
  mobile: string;
  emailId: string;
  pan: string;
  highestQualification: string;
  college: string;
  totalYearsOfExp: number;
  rating: number;
};
