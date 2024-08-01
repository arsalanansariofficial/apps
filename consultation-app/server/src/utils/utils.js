import { ObjectId } from 'mongodb';

export const ratingsURL = {
  POST_RATING: '/ratings'
};

export const ratingsMethods = {
  POST_RATING: 'POST_RATING'
};

export const ratingsMessages = {
  OK: 'RATINGS_UPLOADED'
};

export const appointmentsURL = {
  GET_APPOINTMENT: '/appointments/:id',
  CREATE_APPOINTMENT: '/appointments'
};

export const appointmentsMethods = {
  GET_APPOINTMENT: 'GET_APPOINTMENT',
  CREATE_APPOINTMENT: 'CREATE_APPOINTMENT'
};

export const appointmentsExceptions = {
  INVALID_APPOINTMENT_ID: 'INVALID_APPOINTMENT_ID'
};

export const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

export const responseCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UN_AUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500
};

export const usersURL = {
  GET_USER: '/users/:id',
  LOGIN_USER: '/auth/login',
  CREATE_USER: '/users/register',
  LOGOUT_USER: '/auth/logout',
  GET_APPOINTMENTS: '/users/:id/appointments'
};

export const usersMethods = {
  GET_USER: 'GET_USER',
  LOGIN_USER: 'LOGIN_USER',
  CREATE_USER: 'CREATE_USER',
  LOGOUT_USER: 'LOGOUT_USER',
  GET_APPOINTMENTS: 'GET_APPOINTMENTS'
};

export const usersExceptions = {
  UN_AUTHORIZED: 'UN_AUTHORIZED',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD'
};

export const doctorsURL = {
  GET_DOCTOR: '/doctors/:id',
  GET_DOCTORS: '/doctors',
  CREATE_DOCTOR: '/doctors',
  UPDATE_DOCTOR: '/doctors/:id',
  DELETE_DOCTOR: '/doctors/:id',
  CREATE_DOCTORS: '/doctors-all',
  GET_DOCTOR_TIME_SLOT: '/doctors/:id/timeSlots',
  GET_DOCTORS_SPECIALITY: '/doctors/speciality'
};

export const doctorsMethods = {
  GET_DOCTOR: 'GET_DOCTOR',
  GET_DOCTORS: 'GET_DOCTORS',
  CREATE_DOCTOR: 'CREATE_DOCTOR',
  UPDATE_DOCTOR: 'UPDATE_DOCTOR',
  DELETE_DOCTOR: 'DELETE_DOCTOR',
  CREATE_DOCTORS: 'CREATE_DOCTORS',
  GET_DOCTOR_TIME_SLOT: 'GET_DOCTOR_TIME_SLOT',
  GET_DOCTORS_SPECIALITY: 'GET_DOCTORS_SPECIALITY'
};

export const doctorsExceptions = {
  INVALID_DOCTOR_ID: 'INVALID_DOCTOR_ID',
  SLOT_UNAVAILABLE: 'SLOT_UNAVAILABLE'
};

export const doctorSpeciality = {
  ENT: 'ENT',
  GASTRO: 'GASTRO',
  DENTIST: 'DENTIST',
  CARDIOLOGIST: 'CARDIOLOGIST',
  PULMONOLOGIST: 'PULMONOLOGIST',
  GENERAL_PHYSICIAN: 'GENERAL_PHYSICIAN'
};

export const timeSlots = [
  '10AM-11AM',
  '11AM-12PM',
  '12PM-01PM',
  '05PM-06PM',
  '06PM-07PM',
  '07PM-08PM',
  '08PM-09PM'
];

export const doctorKeys = [
  'firstName',
  'lastName',
  'speciality',
  'dob',
  'address',
  'mobile',
  'emailId',
  'pan',
  'highestQualification',
  'college',
  'totalYearsOfExp',
  'rating'
];

export function sendResponse(code, _response, response) {
  return response.status(code).send(_response);
}

export async function updateDoctorRating(doctor, rating) {
  doctor.rating = parseInt((doctor.rating + rating) / 2);
  return await doctor.save();
}

export function addDoctorId(doctor) {
  const _id = new ObjectId();
  doctor._id = _id;
  doctor.address._id = _id;
}

export async function populateAppointments(model, request) {
  const match = {};
  const sort = {};
  const { appointments } = await model
    .populate({
      path: 'appointments',
      match,
      options: {
        limit: parseInt(request.query.limit),
        skip: parseInt(request.query.skip),
        sort
      }
    })
    .execPopulate();
  return appointments;
}

export function get_user(_user, token) {
  return {
    id: _user._id,
    emailId: _user.emailId,
    firstName: _user.firstName,
    lastName: _user.lastName,
    mobile: _user.mobile,
    accessToken: token
  };
}

export function generateError(code, message) {
  const error = new Error();
  error.code = code;
  error.message = message;
  error.root_casue = error.stack;
  delete error.stack;
  return error;
}
