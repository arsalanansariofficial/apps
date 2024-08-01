import { API_END_POINTS } from './enums';
import { Doctor, Request, User } from './types';

export function getRequestPath(identifier: string, request?: any) {
  switch (identifier) {
    case API_END_POINTS.LOGIN:
      return '/auth/login';

    case API_END_POINTS.SIGN_UP:
      return '/users/register';

    case API_END_POINTS.RATINGS:
      return '/ratings';

    case API_END_POINTS.LOGOUT:
      return '/auth/logout';

    case API_END_POINTS.CREATE_APPOINTMENT:
      return '/appointments';

    case API_END_POINTS.GET_DOCTOR:
      return `/doctors/${request.doctorId}`;

    case API_END_POINTS.GET_APPOINTMENTS:
      return `/users/${request.user.id}/appointments`;

    case API_END_POINTS.GET_DOCTORS:
      return `/doctors?speciality=${request.category}`;

    case API_END_POINTS.GET_TIME_SLOTS:
      return `/doctors/${request.doctorId}/timeSlots?date=${request.aptDate}`;

    default:
      return '/doctors';
  }
}

export function getActiveState(date: string, timeSlot: string) {
  const genericDate = getGenericDate(date, timeSlot);
  return !(new Date().getTime() > genericDate.getTime() + 3600 * 1000);
}

export function setExpirationDate() {
  return new Date(
    new Date().getTime() + import.meta.env.VITE_SESSION_TIMOUT * 1000
  ).toISOString();
}

export function getAppointmentsRequest(user: User) {
  const request: Request = {
    path: getRequestPath(API_END_POINTS.GET_APPOINTMENTS, { user }),
    header: { Authorization: `Bearer ${user.accessToken}` }
  };
  return request;
}

export function calculateExpirationTime(expirationDate: string) {
  const currentTime = new Date().getTime();
  const expirationTime = new Date(expirationDate).getTime();
  return expirationTime - currentTime;
}

export function getRequestObject(request: Request) {
  return {
    method: request.method ? request.method : 'GET',
    headers: request.header ? request.header : {},
    body: request.body ? JSON.stringify(request.body) : null
  };
}

export function filterDoctors(doctors: Doctor[], filter: string | null) {
  return doctors.filter(function (doctor) {
    let flag = true;
    if (
      filter &&
      !`${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(filter)
    )
      flag = false;
    return flag;
  });
}

export function getRemainingTime(date: string, timeSlot: string) {
  const dateGeneric = getGenericDate(date, timeSlot);
  const appointmentDate = new Date(dateGeneric);
  let remainingTime = appointmentDate.getTime() - new Date().getTime();
  if (remainingTime >= 0) {
    const totalSeconds = Math.floor(remainingTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { remainingTime, hours, minutes, seconds };
  }
  return { remainingTime: 0, hours: 0, minutes: 0, seconds: 0 };
}

export function getGenericDate(date: string, timeSlot: string) {
  let timeGeneric = timeSlot.split('-')[0];
  const hour = `${timeGeneric[0]}${timeGeneric[1]}`;
  const format = `${timeGeneric[timeGeneric.length - 2]}${
    timeGeneric[timeGeneric.length - 1]
  }`;
  const time = new Date(`${date} ${hour}:00 ${format}`)
    .toLocaleTimeString('en-US', { hour12: false })
    .split(':')[0];
  const dateGeneric = new Date(date);
  dateGeneric.setHours(Number(time));
  dateGeneric.setMinutes(0);
  return dateGeneric;
}

export function getLoginRequest(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const request: Request = {
    path: getRequestPath(API_END_POINTS.LOGIN),
    method: 'POST',
    header: { Authorization: `Basic ${window.btoa(`${email}:${password}`)}` }
  };
  return request;
}

export function getSignupRequest(formData: FormData) {
  const firstName = formData.get('first-name')! as string;
  const lastName = formData.get('last-name')! as string;
  const emailId = formData.get('email')! as string;
  const password = formData.get('password')! as string;
  const mobile = formData.get('mobile-number')! as string;
  const request: Request = {
    path: getRequestPath(API_END_POINTS.SIGN_UP),
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: { firstName, lastName, emailId, password, mobile }
  };
  return request;
}
