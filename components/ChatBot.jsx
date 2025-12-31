"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import { MoveRight, MessageSquare, X, Send } from "lucide-react";

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
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                    title={t("services.kwscAssistant")}
                >
                    <MessageSquare size={18} className="flex-shrink-0" />
                    <span className="text-sm font-medium">Need help? Chat with us</span>
                </button>
            ) : (

                
                <div className="mt-2 sm:mt-3 w-72 sm:w-80 md:w-96 bg-gray-100 rounded-2xl border border-gray-300 shadow-2xl flex flex-col overflow-hidden slide-in max-h-[70vh] sm:max-h-[80vh]">
                    <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
                        <span className="font-medium">{t("services.kwscAssistant")}</span>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-full hover:bg-blue-700 transition-colors"
                            aria-label="Close chat"
                        >
                            <X size={20} />
                        </button>
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
                    <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                            placeholder="Type message..."
                            className="flex-1 px-4 py-2 rounded-full border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputText.trim()}
                            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
