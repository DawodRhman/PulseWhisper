"use client";
import { useEffect } from "react";

const GoogleTranslate = () => {
    useEffect(() => {
        // Check if script is already added
        if (document.querySelector("#google-translate-script")) return;

        const addScript = document.createElement("script");
        addScript.id = "google-translate-script";
        addScript.src =
            "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        addScript.async = true;
        document.body.appendChild(addScript);

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "en,ur,sd", // Only English, Urdu, and Sindhi
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                },
                "google_translate_element"
            );
        };
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div id="google_translate_element" className="p-2 bg-white rounded-lg shadow-lg border border-gray-200"></div>
        </div>
    );
};

export default GoogleTranslate;
