import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      required: true,
      ref: 'Doctor'
    },
    doctorName: {
      type: String,
      trim: true,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      required: true,
      ref: 'User'
    },
    userName: {
      type: String,
      trim: true,
      required: true
    },
    userEmailId: {
      type: String,
      trim: true,
      required: true,
      ref: 'User'
    },
    timeSlot: {
      type: String,
      trim: true,
      required: true
    },
    appointmentDate: {
      type: String,
      trim: true,
      required: true
    },
    symptoms: {
      type: String,
      trim: true
    },
    priorMedicalHistory: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

appointmentSchema.methods.toJSON = function () {
  const appointment = this.toObject();
  appointment.appointmentId = appointment._id;
  delete appointment._id;
  return appointment;
};

const AppointmentModel = mongoose.model('Appointment', appointmentSchema);

export default AppointmentModel;
