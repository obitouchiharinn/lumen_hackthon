import React, { useRef, useEffect } from "react";
import LoadingBar from "react-top-loading-bar";
import { useLocation } from "react-router-dom";

export default function LoadingLayout({ children }) {
  const loadingBarRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    loadingBarRef.current?.continuousStart();
    const timer = setTimeout(() => {
      loadingBarRef.current?.complete();
    }, 500); // Adjust duration as needed
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <LoadingBar height={2.5} color="#8555F9" ref={loadingBarRef} />
      {children}
    </>
  );
}