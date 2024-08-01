import express from 'express';
import RatingModel from '../models/rating.js';
import DoctorModel from '../models/doctor.js';
import AppointmentModel from '../models/appointment.js';
import authentication from '../middlewares/authentication.js';
import {
  responseCodes,
  sendResponse,
  generateError,
  ratingsMethods,
  ratingsURL,
  updateDoctorRating,
  ratingsMessages
} from '../utils/utils.js';

const ratingRouter = new express.Router();

async function generateResponse(method, request, response) {
  let _rating, rating, appointmentId, appointment, doctorId, doctor, existing;
  switch (method) {
    case ratingsMethods.POST_RATING:
      try {
        _rating = request.body;
        doctorId = _rating.doctorId;
        appointmentId = _rating.appointmentId;
        existing = await RatingModel.findOne({ appointmentId, doctorId });
        appointment = await AppointmentModel.findOne({ _id: appointmentId });
        doctor = await DoctorModel.findOne({ _id: doctorId });
        if (existing) {
          existing.rating = _rating.rating;
          existing.comments = _rating.comments;
          await updateDoctorRating(doctor, _rating.rating);
          await existing.save();
          return sendResponse(responseCodes.OK, ratingsMessages.OK, response);
        }
        if (appointment && doctor) {
          rating = new RatingModel(_rating);
          await updateDoctorRating(doctor, _rating.rating);
          await rating.save();
          return sendResponse(responseCodes.OK, ratingsMessages.OK, response);
        }
        return sendResponse(
          responseCodes.BAD_REQUEST,
          generateError(
            responseCodes.BAD_REQUEST,
            'Invalid doctor or appointment Id'
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

ratingRouter.post(
  ratingsURL.POST_RATING,
  authentication,
  generateResponse.bind(this, ratingsMethods.POST_RATING)
);

export default ratingRouter;
