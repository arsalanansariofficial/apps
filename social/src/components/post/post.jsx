'use client';
import './post.scss';
import { likePost } from '@/utility/actions/actions';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const socket = io('/');

export default function Post({ post }) {
  const [isLiked, setIsLiked] = useState(false);

  const router = useRouter();

  useEffect(function () {
    socket.on('notify', function (msg) {
      console.log(`Received message from server: ${msg}`);
      router.refresh();
    });
  }, []);

  async function sendMessage() {
    socket.emit('broadcast', 'Hello, server');
    await likePost(post.id, !isLiked);
    setIsLiked(function (isLiked) {
      return !isLiked;
    });
  }

  return (
    <li className="m-0 row pt-post">
      <div className="p-0 col pt-post__head">
        <img className="mw-100" src={post.image} alt="profile-picture" />
      </div>
      <div className="p-0 col">
        <div className="p-2">
          <div className="d-flex gap-3 pt-icons">
            <div className="d-flex align-items-center gap-1 pt-icons_likes">
              <span className="fa fa-heart-o" onClick={sendMessage}></span>
              <span>{post.likes.length}</span>
            </div>
            <div className="d-flex align-items-center gap-1 pt-icons_comments">
              <Link href={`/${post.id}`} className="fa fa-comment-o"></Link>
              <span>{post.comments.length}</span>
            </div>
          </div>
          <span className="d-block">@{post.username}</span>
          <p className="m-0 p-0 post-caption">{post.caption}</p>
        </div>
      </div>
    </li>
  );
}
