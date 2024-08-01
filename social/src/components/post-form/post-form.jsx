'use client';
import uploadPost from '@/utility/actions/actions';
import './post-form.scss';
import { useState } from 'react';

export default function PostForm() {
  const [previeImage, setPreviewImage] = useState(null);

  function previewImageHandler(event) {
    const file = event.target.files[0];
    if (!file) return setPreviewImage(null);
    const fileReader = new FileReader();
    fileReader.onload = function () {
      setPreviewImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }

  function uploadHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const post = {
      image: formData.get('post-picture'),
      userName: formData.get('post-username'),
      caption: formData.get('post-caption')
    };
    console.log(post);
  }

  return (
    <div className="pf-post">
      <div className="pf-post__head">
        <img
          className="mw-100"
          src={previeImage ? previeImage : '/img/profile-picture.png'}
          alt="profile-picture"
        />
      </div>
      <form action={uploadPost}>
        <div className="px-2 pt-2 d-flex justify-content-between pf-post-header">
          <label htmlFor="post-picture" className="btn--primary">
            Add Picture
          </label>
          <input
            type="file"
            name="post-picture"
            id="post-picture"
            className="d-none"
            onChange={previewImageHandler}
          />
          <input
            type="text"
            placeholder="@username"
            name="post-username"
            className="w-25 form-control btn--secondary"
          />
        </div>
        <div className="p-2 d-flex flex-column gap-2 pf-post-body">
          <textarea
            name="post-caption"
            id="post-caption"
            cols="30"
            rows="5"
            placeholder="Some description about the post..."
            className="d-block form-control btn--secondary"
          ></textarea>
          <button className="align-self-end btn--primary">Upload</button>
        </div>
      </form>
    </div>
  );
}
