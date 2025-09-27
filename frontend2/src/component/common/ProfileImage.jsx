import { useState, useEffect } from "react";

export default function ProfileImage({
  src,
  alt,
  showStatus = true,
  size = "w-10 h-10",
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(null);

  // Update whenever src becomes available
  useEffect(() => {
    if (src) {
      setImgSrc(src);
    }
  }, [src]);

  if (!imgSrc) {
    return (
      <div
        className={`${size} bg-gray-200 rounded-full animate-pulse relative`}
      >
        {showStatus && (
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900" />
        )}
      </div>
    );
  }

  return (
    <div
      className={`${size} relative rounded-full overflow-hidden border border-gray-300/50 dark:border-white/10`}
    >
      <img
        src={imgSrc}
        alt={alt}
        onError={() => setImgSrc("/placeholder-user.jpg")}
        className="w-full h-full object-cover"
        {...props}
      />
      {showStatus && (
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900" />
      )}
    </div>
  );
}
