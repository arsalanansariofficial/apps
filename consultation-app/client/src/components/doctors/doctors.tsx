import './doctors.scss';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../spinner/spinner.tsx';
import useHttp from '../../hooks/use-http.tsx';
import AlertModal from '../modal/alert-modal.tsx';
import DoctorCard from '../doctor-card/doctor-card.tsx';
import { doctorActions } from '../../store/doctor-slice.tsx';
import { API_END_POINTS, CATEGORY } from '../../utility/enums.tsx';
import { filterDoctors, getRequestPath } from '../../utility/utility.tsx';
import { State, Doctor, Request, Modal_Ref } from '../../utility/types.tsx';

export default function Doctors() {
  const [error, setError] = useState(String());
  const [filter, setFilter] = useState<string | null>(null);
  const [category, setCategory] = useState(CATEGORY.GENERAL_PHYSICIAN);

  const doctors = useSelector((state: State) => state.doctor.doctors);
  const doctor = useSelector((state: State) => state.doctor.doctor);
  const filteredDoctors = filterDoctors(doctors, filter);
  const dispatch = useDispatch();

  const alertModal = useRef<Modal_Ref>();
  const { isLoading, sendRequest } = useHttp();

  function changeFilter(event: ChangeEvent<HTMLInputElement>) {
    setFilter(event.target!.value);
  }

  function changeCategory(event: ChangeEvent<HTMLSelectElement>) {
    setCategory(event.target!.value);
  }

  useEffect(
    function () {
      const request: Request = {
        path: getRequestPath(API_END_POINTS.GET_DOCTORS, { category })
      };
      sendRequest(request)
        .then(function (response: Doctor[]) {
          dispatch(doctorActions.setDoctors(response));
        })
        .catch(function (error: any) {
          setError(error.message);
          alertModal.current?.open();
        });
      return function () {
        alertModal.current?.close();
      };
    },
    [category]
  );

  return (
    <>
      <AlertModal id="alert-doctors" message={error} ref={alertModal} />
      <div id="details-modal" className="modal fade" tabIndex={-1}>
        <div className="justify-content-center modal-dialog modal-dialog-centered">
          <div className="w-auto modal-content details-modal-content">
            <div className="p-0 modal-body details-modal-body">
              <div className="profile-container">
                <div className="profile-cover">
                  <img
                    className="mx-auto mw-100 d-block"
                    src="/img/profile-picture.png"
                    alt="Profile Picture"
                  />
                </div>
              </div>
              <div className="p-2 d-flex flex-wrap flex-column align-items-center details-container">
                <span className="title">
                  {doctor?.firstName} {doctor?.lastName}
                </span>
                <span className="text-center email">{doctor?.emailId}</span>
                <span className="my-1 d-flex gap-1 rating">
                  {[1, 2, 3, 4, 5].map(function (_item, index) {
                    if (index < Math.floor(doctor?.rating!))
                      return <i key={index} className="fa fa-star"></i>;
                  })}
                </span>
                <div className="mt-2 d-flex flex-wrap justify-content-center gap-1 tags">
                  <span className="experience">
                    {doctor?.totalYearsOfExp} @ Experience.
                  </span>
                  <span className="speciality">{doctor?.speciality}.</span>
                  <span className="dob">{doctor?.dob}.</span>
                  <span className="city">{doctor?.address.city}.</span>
                  <span className="mobile">{doctor?.mobile}.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ul className="my-1 mx-auto container-sm doctors">
        <li className="doctors__title">Doctors</li>
        <li className="my-1 d-flex justify-content-between doctors__filter">
          <input
            type="search"
            className="w-25 form-control btn--secondary"
            placeholder="Search"
            onChange={changeFilter}
          />
          <select
            name="category-filter"
            id="category-filter"
            className="py-2 btn--secondary"
            title="category-filter"
            defaultValue={category}
            onChange={changeCategory}
          >
            <option value={CATEGORY.ENT}>{CATEGORY.ENT}</option>
            <option value={CATEGORY.GASTRO}>{CATEGORY.GASTRO}</option>
            <option value={CATEGORY.DENTIST}>{CATEGORY.DENTIST}</option>
            <option value={CATEGORY.CARDIOLOGIST}>
              {CATEGORY.CARDIOLOGIST}
            </option>
            <option value={CATEGORY.PULMONOLOGIST}>
              {CATEGORY.PULMONOLOGIST}
            </option>
            <option value={CATEGORY.GENERAL_PHYSICIAN}>
              {CATEGORY.GENERAL_PHYSICIAN}
            </option>
          </select>
        </li>
        <li className="my-3 d-sm-grid gap-sm-3 doctors-list">
          {filteredDoctors.map(function (doctor, index) {
            return <DoctorCard doctor={doctor} key={index} />;
          })}
          {!isLoading && !filteredDoctors.length && (
            <h3 className="m-auto">No doctors here!</h3>
          )}
          {isLoading && <Spinner />}
        </li>
      </ul>
    </>
  );
}
