import './appointments.scss';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'bootstrap';
import Spinner from '../spinner/spinner';
import useHttp from '../../hooks/use-http';
import AlertModal from '../modal/alert-modal';
import { API_END_POINTS } from '../../utility/enums';
import ConfirmationModal from '../confirmation-modal/confirmation';
import {
  State,
  Request,
  Appointment,
  AptTime,
  Modal_Ref
} from '../../utility/types';
import {
  getAppointmentsRequest,
  getRemainingTime,
  getActiveState,
  getRequestPath
} from '../../utility/utility';

let interval: number | undefined;

export default function Appointments() {
  let remainingApts = 0;

  const [rhv, setRhv] = useState(-1);
  const [ratings, setRatings] = useState(-1);
  const [error, setError] = useState(String());
  const [response, setResponse] = useState<Appointment[]>([]);
  const [appointments, setAppointments] = useState<AptTime[]>([]);
  const [selectedApt, setSelectedApt] = useState<AptTime | null>(null);

  const alertModal = useRef<Modal_Ref>();
  const user = useSelector((state: State) => state.user.user);
  const { isLoading, sendRequest } = useHttp();

  if ((appointments.length && remainingApts === appointments.length) || !user)
    clearInterval(interval);

  appointments.forEach(function (appointment) {
    if (appointment.remainingTime! < 1) remainingApts++;
  });

  function aptSelectHandler(appointment: AptTime) {
    setSelectedApt(appointment);
  }

  function ratingHoverHandler(index: number) {
    setRhv(index + 1);
  }

  function ratingLeaveHandler() {
    setRhv(ratings);
  }

  function ratingClickHandler(index: number) {
    if (ratings === -1) {
      setRatings(index + 1);
      setRhv(index + 1);
    } else {
      if (ratings === index + 1) {
        setRatings(-1);
        setRhv(-1);
      } else {
        setRatings(index + 1);
        setRhv(index + 1);
      }
    }
  }

  async function ratingsHandler(event: any) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const comments = formData.get('comments');
    const request: Request = {
      path: getRequestPath(API_END_POINTS.RATINGS),
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user!.accessToken}`
      },
      body: {
        appointmentId: selectedApt!.appointmentId,
        doctorId: selectedApt!.doctorId,
        rating: ratings !== -1 ? ratings : 0,
        comments
      }
    };
    try {
      await sendRequest(request);
      new Modal('#confirmation-modal').show();
    } catch (error: any) {
      setError(error.message);
      new Modal('#alert-appointments').show();
    }
  }

  useEffect(function () {
    if (user) {
      const request = getAppointmentsRequest(user);
      sendRequest(request)
        .then(function (appointments: Appointment[]) {
          setResponse(appointments);
          setAppointments(appointments);
        })
        .catch(function (error) {
          setError(error.message);
          alertModal.current?.open();
        });
    }
    return function () {
      alertModal.current?.close();
    };
  }, []);

  useEffect(
    function () {
      function init() {
        setAppointments(function (appointments) {
          return appointments.map(function (appointment) {
            const aptTimeObject = getRemainingTime(
              appointment.appointmentDate,
              appointment.timeSlot
            );
            appointment.remainingTime = aptTimeObject.remainingTime;
            appointment.hours = aptTimeObject.hours;
            appointment.minutes = aptTimeObject.minutes;
            appointment.seconds = aptTimeObject.seconds;
            return appointment;
          });
        });
      }
      interval = setInterval(init, 1000);
      return function () {
        clearInterval(interval);
      };
    },
    [response]
  );

  if (!user)
    return (
      <ul className="my-0 mx-auto container-sm appointments">
        <li className="appointments__title">Your Appointments</li>
        <li>
          <h4 className="text-center">Login to view appointments!</h4>
        </li>
      </ul>
    );

  if (user && !isLoading && !appointments.length)
    return (
      <>
        <AlertModal id="alert-appointments" message={error} ref={alertModal} />
        <ul className="my-0 mx-auto container-sm appointments">
          <li className="appointments__title">Your Appointments</li>
          <li>
            <h4 className="text-center">No appointments here!</h4>
          </li>
        </ul>
      </>
    );

  return (
    <>
      <AlertModal id="alert-appointments" message={error} ref={alertModal} />
      <div id="rating-modal" className="modal fade" tabIndex={-1}>
        <div className="justify-content-center modal-dialog modal-dialog-centered">
          <div className="w-auto modal-content rating-modal-content">
            <form
              onSubmit={ratingsHandler}
              className="d-flex flex-column align-items-center gap-3 modal-body rating-modal-body"
            >
              <span className="d-flex gap-3">
                {[0, 1, 2, 3, 4].map(function (_item, index) {
                  return (
                    <i
                      key={index}
                      className={`fa fa-star star-icon ${
                        index < rhv && 'yellow'
                      }`}
                      onMouseEnter={ratingHoverHandler.bind(null, index)}
                      onMouseLeave={ratingLeaveHandler}
                      onClick={ratingClickHandler.bind(null, index)}
                    ></i>
                  );
                })}
              </span>
              <textarea
                name="comments"
                cols={30}
                rows={3}
                className="form-control comments-input"
                placeholder="Comments"
              ></textarea>
              <button className="btn--secondary" data-bs-dismiss="modal">
                Rate
              </button>
            </form>
          </div>
        </div>
      </div>
      <ConfirmationModal />
      <ul className="my-0 mx-auto container-sm appointments">
        <li className="appointments__title">Your Appointments</li>
        {appointments.map(function (appointment, index) {
          return (
            <li key={index} className="py-1 appointment">
              <div className="my-2 d-flex justify-content-between align-items-center appointment__head">
                <span className="btn--secondary appointment-id">
                  {appointment.appointmentId}
                </span>
                <span className="d-flex align-items-center gap-1 btn--secondary appointment-time">
                  <i className="fa fa-clock-o clock-icon"></i>
                  {appointment.hours}:{appointment.minutes}:
                  {appointment.seconds}
                </span>
              </div>
              <div className="appointment__body">
                <span className="d-block">{appointment.doctorName}</span>
                <span className="d-block">{appointment.appointmentDate}</span>
                <button
                  className="btn--secondary rating-button"
                  data-bs-toggle="modal"
                  data-bs-target="#rating-modal"
                  disabled={getActiveState(
                    appointment.appointmentDate,
                    appointment.timeSlot
                  )}
                  onClick={aptSelectHandler.bind(null, appointment)}
                >
                  Rate
                </button>
              </div>
            </li>
          );
        })}
        {isLoading && <Spinner />}
      </ul>
    </>
  );
}
