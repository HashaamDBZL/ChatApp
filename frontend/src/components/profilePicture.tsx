import React from "react";

function ProfilePicture({ imageUrl }: { imageUrl: string | null | undefined }) {
  return (
    <div
      className="rounded-full h-11 w-11 mr-4 bg-cover bg-center flex shrink-0"
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
      }}
    ></div>
  );
}

export default ProfilePicture;
