import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PostStats from "@/components/shared/PostStats";
import GridPostList from "@/components/shared/GridPostList";
import { useUserContext } from "@/context/authcontext";
import getTimeAgo from "@/lib/utils";
import {
  useDeletePost,
  useGetPostById,
  useGetUserPosts,
} from "@/lib/react-query/queries";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();

  const { data: post } = useGetPostById(id);
  const { data: userPosts } = useGetUserPosts(post?.creator.$id);
  const { mutate: deletePost } = useDeletePost();

  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id
  );

  const handleDeletePost = () => {
    deletePost({ postId: id, imageId: post?.imageId });
    navigate(-1);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="flex items-center space-x-2"
        >
          <img src={"/icons/back.png"} alt="back" className="w-5 h-5" />
          <p className="text-sm font-medium">Back</p>
        </Button>
      </div>

      {post && (
        <div className="border border-gray-300 rounded-lg mt-4">
          <img
            src={post.imageUrl}
            alt="creator"
            className="w-full rounded-t-lg"
          />

          <div className="p-4">
            <div className="flex justify-between items-center">
              <Link
                to={`/profile/${post.creator.$id}`}
                className="flex items-center space-x-3"
              >
                <img
                  src={post.creator.imageUrl || "/icons/profile.png"}
                  alt="creator"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-sm">{post.creator.name}</p>
                  <p className="text-xs text-gray-500">
                    {getTimeAgo(post.$createdAt)}
                  </p>
                </div>
              </Link>

              {user.id === post.creator.$id && (
                <div className="space-x-2 flex items-center">
                  <Link to={`/update-post/${post.$id}`}>
                    <img
                      src={"/icons/edit.png"}
                      alt="edit"
                      className="w-5 h-5"
                    />
                  </Link>
                  <Button onClick={handleDeletePost} variant="ghost">
                    <img
                      src={"/icons/delete.png"}
                      alt="delete"
                      className="w-5 h-5"
                    />
                  </Button>
                </div>
              )}
            </div>

            <hr className="my-4 border-gray-300" />

            <div>
              <p className="text-sm">{post.caption}</p>
              <ul className="flex flex-wrap gap-1 mt-2">
                {post.tags.map((tag, index) => (
                  <li key={index} className="text-gray-500 text-xs">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">More Related Posts</h3>
        <GridPostList posts={relatedPosts} />
      </div>
    </div>
  );
};

export default PostDetails;
