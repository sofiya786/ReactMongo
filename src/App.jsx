import axios from "axios";
import { useEffect, useState } from "react";

const App = () => {
  const API_URL = "https://mongo-git-virid.vercel.app/api/posts";

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editPostId, setEditPostId] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

  const createPost = async () => {
    if (!newPost || !newDescription) return;

    try {
      const response = await axios.post(API_URL, {
        course: newPost,
        description: newDescription,
      });
      setPosts([...posts, response.data]);
      setNewPost("");
      setNewDescription("");
    } catch (error) {
      console.log("Error creating post", error);
    }
  };

  const updatePost = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        course: newPost,
        description: newDescription,
      });
      setPosts(posts.map((post) => (post._id === id ? response.data : post)));
      setNewPost("");
      setNewDescription("");
      setEditPostId(null);
    } catch (error) {
      console.error("Error editing post", error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-blue-100 to-indigo-200 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center text-primary mb-8 drop-shadow-lg">Posts</h1>

      <div className="card w-full md:w-2/3 lg:w-1/2 bg-white shadow-xl p-6 rounded-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="form-control">
          <input
            type="text"
            placeholder="Enter course"
            className="input input-bordered mb-4 w-full focus:outline-none focus:ring-2 focus:ring-primary transition duration-200"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter description"
            className="input input-bordered mb-4 w-full focus:outline-none focus:ring-2 focus:ring-primary transition duration-200"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <button
            className={`btn w-full text-lg ${
              editPostId ? "btn-warning" : "btn-primary"
            }`}
            onClick={editPostId ? () => updatePost(editPostId) : createPost}
          >
            {editPostId ? "Update Post" : "Create Post"}
          </button>
        </div>
      </div>

      <div className="w-full md:w-2/3 lg:w-1/2 mt-6">
        <ol className="space-y-4">
          {posts.map((post) => (
            <li
              key={post._id}
              className="card bg-white shadow-md p-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-primary text-xl">{post.course}</h2>
                  <p className="text-gray-600 mt-1">{post.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-outline btn-warning btn-sm hover:bg-warning hover:text-white transition-colors duration-200"
                    onClick={() => {
                      setEditPostId(post._id);
                      setNewPost(post.course);
                      setNewDescription(post.description);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline btn-error btn-sm hover:bg-error hover:text-white transition-colors duration-200"
                    onClick={() => deletePost(post._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default App;
