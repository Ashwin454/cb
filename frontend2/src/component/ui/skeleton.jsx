import React from "react";
import { cn } from "../../lib/utils"; // ✅ adjust relative path as per your folder structure

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export default Skeleton ;
