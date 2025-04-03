function ProfilePicture({ imageUrl }: { imageUrl: string | null | undefined }) {
  return (
    <div
      className="rounded-full h-11 w-11 mr-4 bg-cover bg-center"
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
      }}
    >
      {/* Fallback if no image URL */}
      {!imageUrl && (
        <div className="h-full w-full flex items-center justify-center text-xs font-bold">
          JD
        </div>
      )}
    </div>
  );
}

export default ProfilePicture;
