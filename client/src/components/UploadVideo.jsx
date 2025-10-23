import { useState } from "react";
import { Upload } from "lucide-react";
import axios from "axios";
import apiRoutes from "../utils/apiRoutes";
import { toast } from "react-toastify";

function UploadVideo() {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a video file");
      return;
    }

    setIsUploading(true);
    setError("");
    setUploadProgress(0);

    try {
      // Get presigned URL
      const { data } = await axios.post(apiRoutes.presignedURl, {
        fileName: file.name,
        fileType: file.type,
      });

      const { presignedURL } = data;

      // Upload file to S3
      await axios.put(presignedURL, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      // Reset form on success
      setFile(null);
      setUploadProgress(0);
      toast.success("Video uploaded successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload video");
      toast.error(err.response?.data?.message || "Failed to upload video");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center my-20">
      <form
        onSubmit={handleSubmit}
        className="text-white flex flex-col items-center gap-5 border-2 border-gray-300 px-8 py-6 rounded-lg  transition-colors"
      >
        <div className="flex items-center gap-4">
          <label
            htmlFor="videofile"
            className="cursor-pointer flex items-center gap-2 text-2xl"
          >
            <Upload size={32} />
            <span className="text-lg">{file ? file.name : "Choose Video"}</span>
          </label>
          <input
            className="hidden"
            type="file"
            name="videofile"
            id="videofile"
            accept="video/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>

        {uploadProgress > 0 && (
          <div className="w-full">
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-center">{uploadProgress}%</p>
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={!file || isUploading}
          className="px-6 py-2 bg-purple-600 rounded-lg text-lg font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

export default UploadVideo;
