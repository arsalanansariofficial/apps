import { commentPost, getPost } from '@/utility/actions/actions';
import './post-page.scss';
import Header from '@/components/header/header';

export default async function PostPage({ params }) {
  const post = await getPost(params.postId);
  return (
    <>
      <Header />
      <main className="pb-3 d-flex align-items-center container">
        <div className="pp-post">
          <div className="pp-post__head">
            <img
              className="mw-100"
              src={`${post.image}`}
              alt="profile-picture"
            />
          </div>
          <form action={commentPost.bind(null, post.id)}>
            <div className="px-2 pt-2 d-flex justify-content-between pp-post-header">
              <input
                type="text"
                placeholder="@username"
                name="post-username"
                className="w-25 form-control btn--secondary"
              />
            </div>
            <div className="p-2 d-flex flex-column gap-2 pp-post-body">
              <textarea
                name="post-comment"
                id="post-caption"
                cols="30"
                rows="3"
                placeholder="Some description about the post..."
                className="form-control btn--secondary"
              ></textarea>
              <button className="align-self-end btn--primary">Upload</button>
            </div>
          </form>
          <ul className="mb-2 p-2 pb-0">
            {post.comments.map(function (comment) {
              return (
                <li key={comment.username} className="my-1 btn--secondary">
                  <span>{comment.username}</span>
                  <p className="m-0">{comment.comment}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </>
  );
}
