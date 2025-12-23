"use client";
import { useEffect } from "react";

const ReCaptchaLoader = () => {
  useEffect(() => {
    // Check if script is already added
    if (document.querySelector("#google-recaptcha-script")) return;

    const addScript = document.createElement("script");
    addScript.id = "google-recaptcha-script";
    addScript.src = "https://www.google.com/recaptcha/api.js?render=explicit&onload=onRecaptchaLoad";
    addScript.async = true;
    addScript.defer = true;
    
    // Set up global callback for when reCAPTCHA loads
    window.onRecaptchaLoad = () => {
      // Dispatch custom event to notify components that reCAPTCHA is ready
      window.dispatchEvent(new Event("recaptcha-loaded"));
    };
    
    document.body.appendChild(addScript);
  }, []);

  return null;
};

export default ReCaptchaLoader;

