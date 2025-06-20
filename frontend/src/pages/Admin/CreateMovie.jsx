import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateMovieMutation,
  useUploadImageMutation,
} from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import { toast } from "react-toastify";

const CreateMovie = () => {
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    year: 0,
    detail: "",
    cast: [],
    rating: 0,
    image: null,
    genre: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const [
    createMovie,
    { isLoading: isCreatingMovie }, // error: createMovieErrorDetail },
  ] = useCreateMovieMutation();

  const [
    uploadImage,
    { isLoading: isUploadingImage }, // error: uploadImageErrorDetails },
  ] = useUploadImageMutation();

  const { data: genres, isLoading: isLoadingGenres } = useFetchGenresQuery();

  useEffect(() => {
    if (genres) {
      setMovieData((prevData) => ({
        ...prevData,
        genre: genres[0]?._id || "",
      }));
    }
  }, [genres]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "genre") {
      const selectedGenre = genres.find((genre) => genre._id === value);

      setMovieData((prevData) => ({
        ...prevData,
        genre: selectedGenre ? selectedGenre._id : "",
      }));
    } else {
      setMovieData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  // const handleCreateMovie = async () => {
  //   try {
  //     if (
  //       !movieData.name ||
  //       !movieData.year ||
  //       !movieData.detail ||
  //       !movieData.cast ||
  //       !selectedImage
  //     ) {
  //       toast.error("Please fill all required fields");
  //       return;
  //     }

  //     let uploadedImagePath = null;

  //     if (selectedImage) {
  //       console.log("Starting image upload...");
  //       const formData = new FormData();
  //       formData.append("image", selectedImage);

  //       try {
  //         const uploadImageResponse = await uploadImage(formData).unwrap();
  //         console.log("Upload response:", uploadImageResponse);

  //         // Fix: Access the image path correctly based on your backend response
  //         // Your backend returns: { message: "...", image: "/uploads/...", filename: "...", size: ... }
  //         if (uploadImageResponse.image) {
  //           uploadedImagePath = uploadImageResponse.image;
  //           console.log("Image uploaded successfully:", uploadedImagePath);
  //         } else {
  //           throw new Error("No image path returned from server");
  //         }
  //       } catch (uploadError) {
  //         console.error("Image upload failed:", uploadError);
  //         const errorMessage =
  //           uploadError?.data?.message ||
  //           uploadError?.message ||
  //           "Failed to upload image";
  //         toast.error(`Image upload failed: ${errorMessage}`);
  //         return;
  //       }

  //       // Create movie only after successful image upload
  //       console.log("Creating movie with data:", {
  //         ...movieData,
  //         image: uploadedImagePath,
  //       });

  //       try {
  //         await createMovie({
  //           ...movieData,
  //           image: uploadedImagePath,
  //         }).unwrap();

  //         // Success - navigate and reset form
  //         navigate("/admin/movies-list");
  //         setMovieData({
  //           name: "",
  //           year: 0,
  //           detail: "",
  //           cast: [],
  //           rating: 0,
  //           image: null,
  //           genre: "",
  //         });
  //         setSelectedImage(null);
  //         toast.success("Movie Added To Database");

  //         console.log("User Info:", movieData); // just in case
  //         console.log(
  //           "Token:",
  //           JSON.parse(localStorage.getItem("userInfo"))?.token
  //         );
  //       } catch (createError) {
  //         console.error("Movie creation failed:", createError);
  //         const errorMessage =
  //           createError?.data?.message ||
  //           createError?.message ||
  //           "Failed to create movie";
  //         toast.error(`Failed to create movie: ${errorMessage}`);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Unexpected error in handleCreateMovie:", error);
  //     toast.error(
  //       `An unexpected error occurred: ${error?.message || "Unknown error"}`
  //     );
  //   }
  // };

  const handleCreateMovie = async () => {
    try {
      if (
        !movieData.name ||
        !movieData.year ||
        !movieData.detail ||
        !movieData.cast ||
        !selectedImage
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      // Upload the image first
      let uploadedImagePath = null;

      console.log("Starting image upload...");
      const formData = new FormData();
      formData.append("image", selectedImage);

      try {
        const uploadImageResponse = await uploadImage(formData).unwrap();
        console.log("Upload response:", uploadImageResponse);

        if (uploadImageResponse.image) {
          uploadedImagePath = uploadImageResponse.image;
          console.log("Image uploaded successfully:", uploadedImagePath);
        } else {
          throw new Error("No image path returned from server");
        }
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        const errorMessage =
          uploadError?.data?.message ||
          uploadError?.message ||
          "Failed to upload image";
        toast.error(`Image upload failed: ${errorMessage}`);
        return;
      }

      // Prepare final movie data
      const finalMovieData = {
        ...movieData,
        image: uploadedImagePath,
      };

      console.log("Creating movie with data:", finalMovieData);

      // ✅ Check if token exists
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      console.log("Token from localStorage:", token);

      try {
        await createMovie(finalMovieData).unwrap();

        // Reset form on success
        navigate("/admin/movies-list");
        setMovieData({
          name: "",
          year: 0,
          detail: "",
          cast: [],
          rating: 0,
          image: null,
          genre: "",
        });
        setSelectedImage(null);
        toast.success("Movie Added To Database");
      } catch (createError) {
        console.error("Movie creation failed:", createError);
        const errorMessage =
          createError?.data?.message ||
          createError?.message ||
          "Failed to create movie";
        toast.error(`Failed to create movie: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Unexpected error in handleCreateMovie:", error);
      toast.error(
        `An unexpected error occurred: ${error?.message || "Unknown error"}`
      );
    }
  };

  return (
    <div className="container flex justify-center items-center mt-4">
      <form>
        <p className="text-green-200 w-[50rem] text-2xl mb-4">Create Movie</p>
        <div className="mb-4">
          <label className="block">
            Name:
            <input
              type="text"
              name="name"
              value={movieData.name}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block">
            Year:
            <input
              type="number"
              name="year"
              value={movieData.year}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block">
            Detail:
            <textarea
              name="detail"
              value={movieData.detail}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            ></textarea>
          </label>
        </div>
        <div className="mb-4">
          <label className="block">
            Cast (comma-separated):
            <input
              type="text"
              name="cast"
              value={movieData.cast.join(", ")}
              onChange={(e) =>
                setMovieData({ ...movieData, cast: e.target.value.split(", ") })
              }
              className="border px-2 py-1 w-full"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block">
            Genre:
            <select
              name="genre"
              value={movieData.genre}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            >
              {isLoadingGenres ? (
                <option>Loading genres...</option>
              ) : genres && genres.length > 0 ? (
                genres.map((genre) => (
                  <option key={genre._id} value={genre._id}>
                    {genre.name}
                  </option>
                ))
              ) : (
                <option>No genres available</option>
              )}
            </select>
          </label>
        </div>

        <div className="mb-4">
          <label
            style={
              !selectedImage
                ? {
                    border: "1px solid #888",
                    borderRadius: "5px",
                    padding: "8px",
                    cursor: "pointer",
                  }
                : {
                    border: "0",
                    borderRadius: "0",
                    padding: "0",
                  }
            }
          >
            {!selectedImage && "Upload Image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: !selectedImage ? "none" : "block" }}
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleCreateMovie}
          className="bg-teal-500 text-white px-4 py-2 rounded"
          disabled={isCreatingMovie || isUploadingImage}
        >
          {isCreatingMovie || isUploadingImage ? "Creating..." : "Create Movie"}
        </button>
      </form>
    </div>
  );
};

export default CreateMovie;
