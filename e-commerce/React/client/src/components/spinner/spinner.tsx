export default function Spinner() {
  return (
    <div className="m-auto d-flex gap-3 justify-content-center spinner">
      <div className="spinner-grow spinner-grow-sm text-warning" role="status">
        <span className="visually-hidden"></span>
      </div>
      <div
        className="spinner-border spinner-border-sm text-success"
        role="status"
      >
        <span className="visually-hidden"></span>
      </div>
      <div className="spinner-grow spinner-grow-sm text-primary" role="status">
        <span className="visually-hidden"></span>
      </div>
    </div>
  );
}
