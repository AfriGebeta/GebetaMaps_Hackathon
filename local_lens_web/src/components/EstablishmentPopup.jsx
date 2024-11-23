import { useState } from "react";
import app, { db, storage } from "../firebase-config";
import { collection, addDoc, setDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { init } from "@thetsf/geofirex";

const geo = init(app);

function EstablishmentPopup({ isOpen, onClose, target, user }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [imageFiles, setImagesFiles] = useState([]);
  //   const [imgUrl, setImgUrl] = useState([]);
  const [uploading, setUploading] = useState(false);

  function generateRandomId() {
    return "id-" + Math.random().toString(36).substr(2, 9);
  }

  const submitEstablishment = async (review) => {
    try {
      // const geohash = geofirex.geohashForLocation(new geofirex.GeoPoint(target.lat, target.lon));
      console.log("target", target);
      const geohash = geo.point(target.lat, target.lng);
      const docRef = await setDoc(doc(db, "locations", review.id), {
        geohash,
        id: review.id,
        latitude: target.lat,
        longitude: target.lng,
        name: review.name,
        type: review.type,
        reviews: 0,
        rating: 0.0,
      });
    } catch (error) {
      console.log(error);
    }
  };

  async function uploadImage(image) {
    if (image) {
      // Return a Promise to ensure async/await works correctly
      return new Promise((resolve, reject) => {
        const uploadTask = storage.ref(`review-post/${image.name}`).put(image);
        console.log("Uploading", image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Progress function (optional to show progress)
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            // You can use this to update a progress bar or show the upload status
          },
          (error) => {
            // Error function
            console.log(error);
            reject(error); // Reject the promise on error
          },
          () => {
            // Complete function
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then((url) => {
                console.log("File available at", url);
                resolve(url); // Resolve the promise with the URL
              })
              .catch((error) => {
                reject(error); // Reject if getDownloadURL fails
              });
          }
        );
      });
    }
  }

  const submitReview = async (review) => {
    try {
      // Log the image files to check they are being passed correctly
      console.log("Image files: ", imageFiles);

      // Create an array of promises for image uploads
      const uploadPromises = imageFiles.map(async (img) => {
        try {
          // Log the image being uploaded
          console.log("Uploading image: ", img);

          // Upload the image and get the URL
          const imgUrl = await uploadImage(img);

          // Log the URL returned by the upload
          console.log("Uploaded image URL: ", imgUrl);

          // Return the image URL to be collected in the Promise.all() array
          return imgUrl;
        } catch (err) {
          console.error("Error uploading image: ", err);
          throw new Error("Image upload failed");
        }
      });

      // Wait for all images to be uploaded and get the array of URLs
      const imgUrls = await Promise.all(uploadPromises);

      // Log the image URLs array
      console.log("All image URLs: ", imgUrls);

      // Proceed to add the review to the database
      const docRef = await addDoc(collection(db, "reviews"), {
        id: review.id,
        name: user.name,
        uid: user.uid,
        comment: review.comment,
        rating: review.rating,
        images: imgUrls, // Use the image URLs returned from uploads
      });

      const reviewDocRef = doc(db, "locations", review.id);
      const reviewDoc = await getDoc(reviewDocRef);

      if (reviewDoc.exists) {
        console.log("Review data:", reviewDoc.data());
      } else {
        console.log("No such document!");
      }

      await updateDoc(reviewDocRef, {
        reviews: reviewDoc.data().reviews + 1,
        rating:
          (reviewDoc.data().rating * reviewDoc.data().reviews + review.rating) /
          (reviewDoc.data().reviews + 1),
      });

      console.log("Review submitted with ID: ", docRef.id);
      setName("");
      setType("");
      setRating(0);
      setComment("");
      setImages([]);
      setImagesFiles([]);
      setUploading(false);
    } catch (error) {
      console.error("Error submitting review: ", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = generateRandomId();
    console.log("Submitted:", { name, type, rating, comment, images });
    submitEstablishment({ id, name, type, rating, comment, images });
    submitReview({ id, name, type, rating, comment, images });
    onClose();
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 6) {
      alert("You can only upload up to 6 images");
      return;
    }
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
    setImagesFiles([...imageFiles, ...files]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-h-screen overflow-y-auto relative">
        <h2 className="text-2xl font-bold mb-4">Add Establishment</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Establishment Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          >
            <option value="">Select Type</option>
            <option value="restaurant">Restaurant</option>
            <option value="cafe">Cafe</option>
            <option value="bar">Bar</option>
            <option value="shop">Shop</option>
            <option value="other">Other</option>
          </select>
          <div className="mb-4">
            <label className="block mb-2">Rating:</label>
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    rating >= star ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <textarea
            placeholder="Leave a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            rows="3"
          ></textarea>
          <div className="mb-4">
            <label className="block mb-2">Upload Images (max 6):</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded mb-4 flex justify-center items-center"
          >
            {uploading ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid"
                style={{
                  shapeRendering: "auto",
                  display: "block",
                  background: "transparent",
                }}
                width="40px"
                height="40px"
              >
                <g>
                  <circle
                    stroke-linecap="round"
                    fill="none"
                    stroke-dasharray="50.26548245743669 50.26548245743669"
                    stroke="#fff"
                    stroke-width="8"
                    r="32"
                    cy="50"
                    cx="50"
                  >
                    <animateTransform
                      values="0 50 50;360 50 50"
                      keyTimes="0;1"
                      dur="1s"
                      repeatCount="indefinite"
                      type="rotate"
                      attributeName="transform"
                    ></animateTransform>
                  </circle>
                  <g></g>
                </g>
              </svg>
            ) : (
              "Submit"
            )}
          </button>
        </form>
        <button
          onClick={onClose}
          className="aspect-square absolute right-2 top-2 shadow-2xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            fill="#101010"
            width="14px"
            height="14px"
          >
            <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default EstablishmentPopup;
