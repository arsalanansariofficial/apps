import express from 'express';
import DoctorModel from '../models/doctor.js';
import {
  doctorKeys,
  doctorsMethods,
  doctorsURL,
  responseCodes,
  addDoctorId,
  sendResponse,
  generateError,
  doctorSpeciality,
  populateAppointments,
  timeSlots,
  doctorsExceptions
} from '../utils/utils.js';

const doctorRouter = new express.Router();

async function generateResponse(method, request, response) {
  let _id, _doctor, _doctors, doctor, doctors, appointmentDate, speciality;
  switch (method) {
    case doctorsMethods.GET_DOCTOR:
      try {
        _id = request.params.id;
        doctor = await DoctorModel.findOne({ _id });
        if (doctor) return sendResponse(responseCodes.OK, doctor, response);
        return sendResponse(
          responseCodes.BAD_REQUEST,
          generateError(
            responseCodes.BAD_REQUEST,
            `Doctor with id ${_id} not found`
          ),
          response
        );
      } catch (error) {
        return sendResponse(
          responseCodes.INTERNAL_SERVER_ERROR,
          generateError(responseCodes.INTERNAL_SERVER_ERROR, error.message),
          response
        );
      }
    case doctorsMethods.GET_DOCTORS:
      try {
        speciality =
          request.query.speciality || doctorSpeciality.GENERAL_PHYSICIAN;
        doctors = (await DoctorModel.find({}))
          .filter(doc => doc.speciality === speciality)
          .sort((docA, docB) => docB.rating - docA.rating);
        return sendResponse(responseCodes.OK, doctors, response);
      } catch (error) {
        return sendResponse(
          responseCodes.INTERNAL_SERVER_ERROR,
          generateError(responseCodes.INTERNAL_SERVER_ERROR, error.message),
          response
        );
      }
    case doctorsMethods.CREATE_DOCTOR:
      try {
        _doctor = request.body;
        addDoctorId(_doctor);
        doctor = new DoctorModel(_doctor);
        return sendResponse(
          responseCodes.CREATED,
          await doctor.save(),
          response
        );
      } catch (error) {
        return sendResponse(
          responseCodes.INTERNAL_SERVER_ERROR,
          generateError(responseCodes.INTERNAL_SERVER_ERROR, error.message),
          response
        );
      }
    case doctorsMethods.CREATE_DOCTORS:
      try {
        _doctors = request.body;
        _doctors.forEach(_doctor => addDoctorId(_doctor));
        doctors = _doctors.map(doctor => new DoctorModel(doctor));
        return sendResponse(
          responseCodes.CREATED,
          await DoctorModel.insertMany(doctors),
          response
        );
      } catch (error) {
        return sendResponse(
          responseCodes.INTERNAL_SERVER_ERROR,
          generateError(responseCodes.INTERNAL_SERVER_ERROR, error.message),
          response
        );
      }
    case doctorsMethods.UPDATE_DOCTOR:
      try {
        const keys = Object.keys(request.body);
        const isValidDoctor = keys.every(key => doctorKeys.includes(key));
        if (!isValidDoctor)
          return sendResponse(
            responseCodes.BAD_REQUEST,
            generateError(responseCodes.BAD_REQUEST, 'Invalid updates'),
            response
          );
        const _id = request.params.id;
        const doctor = await DoctorModel.findOne({ _id });
        if (!doctor)
          return sendResponse(
            responseCodes.BAD_REQUEST,
            generateError(
              responseCodes.BAD_REQUEST,
              `Doctor with id ${_id} not found`
            ),
            response
          );
        keys.forEach(key => (doctor[key] = request.body[key]));
        return sendResponse(
          responseCodes.CREATED,
          await doctor.save(),
          response
        );
      } catch (error) {
        return sendResponse(
          responseCodes.INTERNAL_SERVER_ERROR,
          generateError(responseCodes.INTERNAL_SERVER_ERROR, error.message),
          response
        );
      }
    case doctorsMethods.DELETE_DOCTOR:
      try {
        _id = request.params.id;
        doctor = await DoctorModel.findOneAndDelete({ _id });
        if (doctor)
          return sendResponse(responseCodes.CREATED, doctor, response);
        return sendResponse(
          responseCodes.BAD_REQUEST,
          generateError(
            responseCodes.BAD_REQUEST,
            `Doctor with id ${_id} not found`
          ),
          response
        );
      } catch (error) {
        return sendResponse(
          responseCodes.INTERNAL_SERVER_ERROR,
          generateError(responseCodes.INTERNAL_SERVER_ERROR, error.message),
          response
        );
      }
    case doctorsMethods.GET_DOCTORS_SPECIALITY:
      try {
        return sendResponse(responseCodes.OK, doctorSpeciality, response);
      } catch (error) {
        return sendResponse(
          responseCodes.INTERNAL_SERVER_ERROR,
          generateError(responseCodes.INTERNAL_SERVER_ERROR, error.message),
          response
        );
      }
    case doctorsMethods.GET_DOCTOR_TIME_SLOT:
      try {
        _id = request.params.id;
        appointmentDate = request.query.date;
        doctor = await DoctorModel.findOne({ _id });
        if (!doctor)
          return sendResponse(
            responseCodes.BAD_REQUEST,
            generateError(
              responseCodes.BAD_REQUEST,
              doctorsExceptions.INVALID_DOCTOR_ID
            ),
            response
          );
        const appointments = await populateAppointments(doctor, request);
        const bookedSlots = appointments
          .filter(
            appointment => appointmentDate === appointment.appointmentDate
          )
          .map(appointment => appointment.timeSlot);
        const availableSlots = timeSlots.filter(
          slot => bookedSlots.indexOf(slot) === -1
        );
        return sendResponse(
          responseCodes.OK,
          {
            doctorId: doctor._id,
            availableDate: appointmentDate,
            timeSlot: availableSlots
          },
          response
        );
      } catch (error) {
        return sendResponse(
          responseCodes.INTERNAL_SERVER_ERROR,
          generateError(responseCodes.INTERNAL_SERVER_ERROR, error.message),
          response
        );
      }
  }
}

doctorRouter.get(
  doctorsURL.GET_DOCTORS_SPECIALITY,
  generateResponse.bind(this, doctorsMethods.GET_DOCTORS_SPECIALITY)
);

doctorRouter.get(
  doctorsURL.GET_DOCTOR_TIME_SLOT,
  generateResponse.bind(this, doctorsMethods.GET_DOCTOR_TIME_SLOT)
);

doctorRouter.get(
  doctorsURL.GET_DOCTOR,
  generateResponse.bind(this, doctorsMethods.GET_DOCTOR)
);

doctorRouter.get(
  doctorsURL.GET_DOCTORS,
  generateResponse.bind(this, doctorsMethods.GET_DOCTORS)
);

doctorRouter.post(
  doctorsURL.CREATE_DOCTOR,
  generateResponse.bind(this, doctorsMethods.CREATE_DOCTOR)
);

doctorRouter.post(
  doctorsURL.CREATE_DOCTORS,
  generateResponse.bind(this, doctorsMethods.CREATE_DOCTORS)
);

doctorRouter.put(
  doctorsURL.UPDATE_DOCTOR,
  generateResponse.bind(this, doctorsMethods.UPDATE_DOCTOR)
);

doctorRouter.delete(
  doctorsURL.DELETE_DOCTOR,
  generateResponse.bind(this, doctorsMethods.DELETE_DOCTOR)
);

export default doctorRouter;
