import { useRef, useState } from "react";
import React from "react";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import socket from "../socket";

interface props {
  chatId: string | null;
  otherUserId: string | null;
  clearInput: () => void;
}

export default function VoiceRecorder({
  otherUserId,
  chatId,
  clearInput,
}: props) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(); // MediaRecorder instance
  const audioChunksRef = useRef<Blob[]>([]); // Store audio chunks

  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data); // Collect data chunks
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioFile = new File([audioBlob], "voiceMessage.webm", {
          type: "audio/webm",
        });

        // Proceed with uploading to S3 and emitting socket event
        const formData = new FormData();
        formData.append("file", audioFile);
        formData.append("senderId", loggedInUserId!);
        formData.append("recieverId", otherUserId!);
        formData.append("chatId", chatId!);

        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/messages/upload/audio`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          if (response.ok) {
            const newMessage = await response.json();
            socket.emit("new_message", newMessage);
            clearInput();
          } else {
            console.error("Image upload failed:", response.status);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }

        audioChunksRef.current = []; // Reset chunks for next recording
        stream.getTracks().forEach((track) => track.stop()); // Stop all tracks
      };

      recorder.onerror = (error) => {
        console.error("Recording error:", error);
        stream.getTracks().forEach((track) => track.stop()); // Stop on error
        setIsRecording(false);
      };

      recorder.start(); // Start recording
      setIsRecording(true); // Update recording state
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop(); // Stop the recorder
      setIsRecording(false); // Update state to reflect that recording has stopped
    }
  };

  return (
    <button
      onMouseDown={handleStartRecording}
      onMouseUp={handleStopRecording}
      onMouseLeave={handleStopRecording} // safety in case mouse moves away while holding
      className={`flex rounded-md items-center gap-2 px-4 py-2  shadow-md text-white transition min-w-31
        ${isRecording ? "bg-red-500" : "bg-blue-500 hover:bg-blue-600"}`}
    >
      {isRecording ? (
        <IoMdMic className="w-5 h-5" />
      ) : (
        <IoMdMicOff className="w-5 h-5" />
      )}
      {isRecording ? "Recording" : "Voice"}
    </button>
  );
}
