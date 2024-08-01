import './doctor-card.scss';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { DoctorProps } from '../../utility/types';
import { doctorActions } from '../../store/doctor-slice';

export default function DoctorCard({ doctor }: DoctorProps) {
  const dispatch = useDispatch();

  function changeDoctor() {
    dispatch(doctorActions.setDoctor(doctor));
  }

  return (
    <div className="mx-0 p-3 p-sm-0 my-3 my-sm-0 row gap-3 doctor-card">
      <div className="p-0 col align-self-stretch doctor-card__head">
        <img
          className="mw-100"
          src="/img/profile-picture.png"
          alt="profile-picture"
        />
      </div>
      <div className="p-0 p-sm-3 col align-self-center doctor-card__body">
        <div className="text-container">
          <span className="d-block">
            {doctor.firstName} {doctor.lastName}
          </span>
          <span className="d-block d-sm-flex justify-content-between">
            {doctor.speciality}
            <span className="d-flex align-items-center gap-1 rating-container">
              {Math.floor(doctor.rating)}
              <i className="fa fa-star"></i>
            </span>
          </span>
        </div>
        <div className="my-1 d-flex flex-column gap-2 button-container">
          <Link
            to={`/appointment/${doctor.id}`}
            className="text-center text-decoration-none btn--primary"
          >
            Get Appointment
          </Link>
          <button
            className="text-center text-decoration-none btn--secondary"
            data-bs-toggle="modal"
            data-bs-target="#details-modal"
            onClick={changeDoctor}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
