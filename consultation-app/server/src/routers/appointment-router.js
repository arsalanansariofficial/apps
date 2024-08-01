import express from 'express';
import DoctorModel from '../models/doctor.js';
import AppointmentModel from '../models/appointment.js';
import authentication from '../middlewares/authentication.js';
import {
  responseCodes,
  sendResponse,
  generateError,
  appointmentsMethods,
  appointmentsURL,
  doctorsExceptions,
  appointmentsExceptions
} from '../utils/utils.js';

const appointmentRouter = new express.Router();

async function generateResponse(method, request, response) {
  let user, _appointment, appointmentId, appointment, doctor;
  switch (method) {
    case appointmentsMethods.CREATE_APPOINTMENT:
      try {
        _appointment = request.body;
        appointment = new AppointmentModel(_appointment);
        doctor = await DoctorModel.findOne({ _id: appointment.doctorId });
        const appointmentDate = new Date(_appointment.appointmentDate);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        appointmentDate.setHours(0, 0, 0, 0);
        const existing = await AppointmentModel.findOne({
          appointmentDate: _appointment.appointmentDate,
          timeSlot: _appointment.timeSlot
        });
        if (!doctor)
          return sendResponse(
            responseCodes.BAD_REQUEST,
            generateError(
              responseCodes.BAD_REQUEST,
              doctorsExceptions.INVALID_DOCTOR_ID
            ),
            response
          );
        if (existing || appointmentDate < currentDate)
          return sendResponse(
            responseCodes.BAD_REQUEST,
            generateError(
              responseCodes.BAD_REQUEST,
              doctorsExceptions.SLOT_UNAVAILABLE
            ),
            response
          );
        return sendResponse(
          responseCodes.CREATED,
          (await appointment.save())._id.toString(),
          response
        );
      } catch (error) {
        return sendResponse(
          responseCodes.INTERNAL_SERVER_ERROR,
          generateError(responseCodes.INTERNAL_SERVER_ERROR, error.message),
          response
        );
      }
    case appointmentsMethods.GET_APPOINTMENT:
      try {
        appointmentId = request.params.id;
        appointment = await AppointmentModel.findById(appointmentId);
        if (appointment)
          return sendResponse(responseCodes.OK, appointment, response);
        return sendResponse(
          responseCodes.BAD_REQUEST,
          generateError(
            responseCodes.BAD_REQUEST,
            appointmentsExceptions.INVALID_APPOINTMENT_ID
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
  }
}

appointmentRouter.get(
  appointmentsURL.GET_APPOINTMENT,
  authentication,
  generateResponse.bind(this, appointmentsMethods.GET_APPOINTMENT)
);

appointmentRouter.post(
  appointmentsURL.CREATE_APPOINTMENT,
  authentication,
  generateResponse.bind(this, appointmentsMethods.CREATE_APPOINTMENT)
);

export default appointmentRouter;
