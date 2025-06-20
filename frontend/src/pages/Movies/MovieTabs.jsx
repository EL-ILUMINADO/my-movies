import React from "react";
import { Link } from "react-router-dom";

const MovieTabs = ({ userInfo, submitHandler, comment, setComment, movie }) => {
  return (
    <div>
      <section>
        {userInfo ? (
          <form onSubmit={submitHandler}>
            <div className="my-2">
              <label htmlFor="comment" className="block text-xl mb-2">
                Write your review
              </label>

              <textarea
                id="comment"
                rows="3"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border p-2 rounded-lg xl:w-[40rem] text-black"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-teal-600 text-white py-2 px-4 rounded-lg"
            >
              Submit
            </button>
          </form>
        ) : (
          <p>
            Please <Link to="/login">Sign in</Link> to write a review
          </p>
        )}
      </section>

      <section className="mt-[3rem]">
        <div>
          {movie?.reviews.length === 0 && (
            <p>No reviews available for this movie</p>
          )}
        </div>
        <div>
          {movie?.reviews.map((review) => (
            <div
              key={review._id}
              className="bg-[#1a1a1a] p-4 rounded-lg w-[50%] mt-[2rem]"
            >
              <div className="flex justify-between">
                <strong className="text-[#b0b0b0]">{review.name}</strong>
                <p className="text-[#b0b0b0]">
                  {review.createdAt.substring(0, 10)}
                </p>
              </div>

              <p className="my-4">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieTabs;
