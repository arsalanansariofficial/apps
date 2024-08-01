import './alert-modal.scss';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Modal as modal } from 'bootstrap';
import { Modal } from '../../utility/types';

const Alert = forwardRef(function Modal({ id, message }: Modal, ref) {
  const alert = useRef<modal>();

  useEffect(function () {
    alert.current = new modal(`#${id}`);
  }, []);

  useImperativeHandle(ref, () => {
    return { open, close };
  });

  function open() {
    alert.current?.show();
  }

  function close() {
    alert.current?.hide();
  }

  return (
    <div id={id} className="modal fade" tabIndex={-1}>
      <div className="justify-content-center modal-dialog modal-dialog-centered">
        <div className="w-auto modal-content alert-modal-content">
          <div className="d-flex flex-column gap-2 modal-body alert-modal-body">
            <p className="m-0 p-0">{message}</p>
            <button
              className="align-self-end btn--primary"
              data-bs-dismiss="modal"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Alert;
