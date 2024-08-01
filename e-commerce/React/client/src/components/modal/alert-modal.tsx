import './alert-modal.scss';
import { Modal as modal } from 'bootstrap';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface Modal {
  id: string;
  message: string;
}

const Alert = forwardRef(function Modal({ id, message }: Modal, ref) {
  const alert = useRef<modal>();

  useEffect(function () {
    if (!alert.current) alert.current = new modal(`#${id}`);
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
              data-bs-dismiss="modal"
              className="align-self-end btn--primary"
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
