import PostForm from '../post-form/post-form';
import './modal.scss';

export default function Modal() {
  return (
    <div id="new-post" className="modal fade ml-modal" tabIndex={-1}>
      <div className="justify-content-center modal-dialog modal-dialog-centered">
        <div className="modal-content ml-modal-content">
          <PostForm />
        </div>
      </div>
    </div>
  );
}
