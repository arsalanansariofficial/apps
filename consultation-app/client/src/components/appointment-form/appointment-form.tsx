import './appointment-form.scss';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Modal } from 'bootstrap';
import useHttp from '../../hooks/use-http';
import AlertModal from '../modal/alert-modal';
import { API_END_POINTS } from '../../utility/enums';
import { getRequestPath } from '../../utility/utility';
import ConfirmationModal from '../confirmation-modal/confirmation';
import {
  State,
  Doctor,
  Request,
  TimeSlot,
  Modal_Ref
} from '../../utility/types';

export default function AppointmentForm() {
  const doctorId = useParams().doctorId;

  const { sendRequest } = useHttp();
  const user = useSelector((state: State) => state.user.user);
  const alertModal = useRef<Modal_Ref>();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState<string>(String());
  const [timeSlot, setTimeSlots] = useState<string[] | []>([]);

  const [aptDate, setAptDate] = useState(
    String(new Date().toISOString().split('T')[0])
  );

  function changeDate(event: ChangeEvent<HTMLInputElement>) {
    setAptDate(event.target.value);
  }

  async function getAppointment(event: any) {
    event.preventDefault();
    if (event.target.checkValidity()) {
      event.stopPropagation();
      const formData = new FormData(event.target);
      const time = formData.get('time');
      const symptoms = formData.get('symptoms');
      const priorMedicalHistory = formData.get('medical-history');
      if (user) {
        const request: Request = {
          path: getRequestPath(API_END_POINTS.CREATE_APPOINTMENT),
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user!.accessToken}`
          },
          body: {
            doctorId: doctorId,
            doctorName: `${doctor!.firstName} ${doctor!.lastName}`,
            userId: user!.id,
            userName: `${user!.firstName} ${user!.lastName}`,
            userEmailId: user!.emailAddress,
            timeSlot: time,
            appointmentDate: aptDate,
            symptoms,
            priorMedicalHistory
          }
        };
        try {
          await sendRequest(request);
          return new Modal('#confirmation-modal').show();
        } catch (error: any) {
          setError(error.message);
          return new Modal('#alert-appointment').show();
        }
      }
      new Modal('#alert-appointment').show();
      return setError('Login to get an appointment!');
    }
    event.target.classList.add('was-validated');
  }

  useEffect(
    function () {
      const request: Request = {
        path: getRequestPath(API_END_POINTS.GET_DOCTOR, { doctorId })
      };
      sendRequest(request)
        .then(function (response: Doctor) {
          setDoctor(response);
          const request: Request = {
            path: getRequestPath(API_END_POINTS.GET_TIME_SLOTS, {
              doctorId,
              aptDate
            })
          };
          return sendRequest(request);
        })
        .then(function (response: TimeSlot) {
          setTimeSlots(response.timeSlot);
        })
        .catch(function (error) {
          setError(error.message);
          alertModal.current?.open();
        });
      return function () {
        alertModal.current?.close();
      };
    },
    [aptDate]
  );

  return (
    <>
      <AlertModal id="alert-appointment" message={error} ref={alertModal} />
      <ConfirmationModal />
      <div className="m-auto pb-3 d-flex flex-column align-items-center container-sm gap-2 form-container">
        <span>Get appointment</span>
        <form
          className="p-3 w-75 d-flex flex-column align-items-center needs-validation appointment-form"
          onSubmit={getAppointment}
          noValidate
        >
          <div className="mb-3 align-self-stretch">
            <input
              type="text"
              className="form-control"
              placeholder="Doctor Name"
              value={`${doctor?.firstName} ${doctor?.lastName}`}
              disabled
            />
          </div>
          <div className="mb-3 align-self-stretch date-container">
            <input
              name="date"
              type="date"
              className="form-control"
              defaultValue={aptDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={changeDate}
            />
          </div>
          <div className="mb-3 align-self-stretch">
            <select
              className="w-100 btn--secondary"
              name="time"
              defaultValue=""
              disabled={!timeSlot.length}
              required
            >
              {!timeSlot.length && <option value="">No slots available</option>}
              {timeSlot.length && <option value="">Select time slot</option>}
              {timeSlot &&
                timeSlot.map(function (time, index) {
                  return (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  );
                })}
            </select>
            <span className="ms-1 invalid-feedback">Select a time slot</span>
          </div>
          <div className="mb-3 align-self-stretch">
            <textarea
              name="symptoms"
              rows={3}
              className="form-control"
              placeholder="Symptoms"
            ></textarea>
          </div>
          <div className="mb-3 align-self-stretch">
            <textarea
              name="medical-history"
              rows={3}
              className="form-control"
              placeholder="Medical history"
            ></textarea>
          </div>
          <button
            type="submit"
            className="btn--primary"
            disabled={!timeSlot.length}
          >
            Confirm
          </button>
        </form>
      </div>
    </>
  );
}
