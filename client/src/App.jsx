import React from "react";
import Player from "./components/Player";
import UploadVideo from "./components/UploadVideo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <UploadVideo />
      <Player />
      <ToastContainer />
    </div>
  );
}

export default App;
