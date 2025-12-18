"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import { MoveRight } from "lucide-react";

export default function ChatBot() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setMessages([
            { from: "bot", text: t("services.assistantGreeting") }
        ]);

        // Warm up backend
        fetch('/api/chat').catch(() => { });
    }, [t]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMsg = inputText.trim();
        setMessages(prev => [...prev, { from: "user", text: userMsg }]);
        setInputText("");
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });

            const data = await res.json();

            if (res.ok) {
                setMessages(prev => [
                    ...prev,
                    {
                        from: "bot",
                        text: data.response,
                        page_route: data.page_route,
                        cta_label: data.cta_label,
                        faq_answers: data.faq_answers
                    },
                ]);
            } else {
                setMessages(prev => [
                    ...prev,
                    { from: "bot", text: "Currently I am unable to process your request. Please try again later." },
                ]);
            }
        } catch (err) {
            console.error(err);
            setMessages(prev => [
                ...prev,
                { from: "bot", text: "Something went wrong. Please check your internet connection." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-3 sm:bottom-5 right-3 sm:right-5 z-[60] flex flex-col items-center">
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] hover:scale-110"
                title={t("services.kwscAssistant")}
            >
                <img
                    src="/Ai_Bot.png"
                    alt="AI Assistant"
                    className="w-full h-full object-cover"
                />
            </button>

            {isOpen && (
                <div className="mt-2 sm:mt-3 w-72 sm:w-80 md:w-96 bg-gray-100 rounded-2xl border border-gray-300 shadow-2xl flex flex-col overflow-hidden slide-in max-h-[70vh] sm:max-h-[80vh]">
                    {/* Header */}
                    <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 text-gray-800 font-semibold flex justify-between items-center border-b border-gray-300">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                                <img src="/Ai_Bot.png" alt="Assistant" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-sm sm:text-base truncate">{t("services.kwscAssistant")}</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-600 font-normal text-3xl leading-none flex-shrink-0 ml-2">&times;</button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-gray-50 min-h-[300px]">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.from === "bot" ? "items-start" : "items-end"}`}>
                                <div
                                    className={`px-3 sm:px-4 py-2 rounded-2xl max-w-[85%] break-words text-sm ${msg.from === "bot"
                                        ? "bg-gray-300 text-gray-900 rounded-bl-sm"
                                        : "bg-cyan-500 text-white rounded-br-sm"
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>

                                {/* CTA Button if present */}
                                {msg.from === 'bot' && msg.page_route && msg.cta_label && (
                                    <div className="mt-2 pl-1">
                                        <Link
                                            href={msg.page_route}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs sm:text-sm rounded-lg transition-colors shadow-sm"
                                        >
                                            {msg.cta_label}
                                            <MoveRight size={14} />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-500 text-sm italic">
                                    typing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-300 flex items-center gap-1.5 sm:gap-2 bg-gray-200">
                        <input
                            type="text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                            placeholder="Type message..."
                            className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputText.trim()}
                            className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white font-semibold transition-all duration-200 text-xs sm:text-sm flex-shrink-0"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
