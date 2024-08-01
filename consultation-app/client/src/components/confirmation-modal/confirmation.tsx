import './confirmation-modal.scss';

export default function ConfirmationModal() {
  return (
    <div id="confirmation-modal" className="modal fade" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content cofirmation-modal-content">
          <div
            className="d-flex flex-column align-items-center gap-3 modal-body confirmation-modal-body"
            data-bs-dismiss="modal"
          >
            <i className="fa fa-check-circle confirmation-icon"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
