import './posts.scss';
import Post from '../post/post';
import Each from '@/utility/components/each';
import { getPosts } from '@/utility/actions/actions';

export default async function Posts() {
  const posts = await getPosts();

  function renderPost(post, key) {
    return <Post key={key} post={post} />;
  }

  return (
    <div className="container ps-posts">
      <div className="my-1 d-flex justify-content-between ps-posts__filter">
        <button
          className="btn--primary"
          data-bs-toggle="modal"
          data-bs-target="#new-post"
        >
          Add Post
        </button>
        <input
          type="search"
          className="w-25 form-control btn--secondary"
          placeholder="Search"
        />
      </div>
      <ul className="my-3 p-0 d-grid gap-3 ps-posts">
        <Each of={posts} render={renderPost} />
      </ul>
    </div>
  );
}
