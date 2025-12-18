'use client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || t("subscribe.failed"));

      setMessage(data.message || t("subscribe.success"));
      setEmail("");
    } catch (error) {
      console.error(error);
      setMessage(error.message || t("subscribe.error"));
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <section className="relative bg-blue-900 overflow-hidden max-w-[85%] mx-auto py-14 my-10 rounded-xl">
        {/* ... (svgs) ... */}
        <div className="absolute top-8 left-10 pointer-events-none">
          <svg
            width="149"
            height="150"
            viewBox="0 0 149 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.23">
              <path
                d="M54.7532 1.2627C47.1932 42.3276 41.0646 48.4558 0 56.0158C41.065 63.5757 47.1932 69.7039 54.7532 110.769C62.3131 69.7039 68.4414 63.5757 109.506 56.0158C68.4414 48.4558 62.3128 42.3276 54.7532 1.2627Z"
                fill="white"
              />
              <path
                d="M114.179 78.2979C109.372 104.413 105.474 108.311 79.3584 113.119C105.474 117.926 109.372 121.824 114.179 147.939C118.987 121.824 122.885 117.926 149 113.119C122.884 108.311 118.987 104.413 114.179 78.2979Z"
                fill="white"
              />
            </g>
          </svg>
        </div>


        <div className="absolute bottom-10 right-10 pointer-events-none">
          <svg
            width="149"
            height="150"
            viewBox="0 0 149 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.23">
              <path
                d="M54.7532 1.2627C47.1932 42.3276 41.0646 48.4558 0 56.0158C41.065 63.5757 47.1932 69.7039 54.7532 110.769C62.3131 69.7039 68.4414 63.5757 109.506 56.0158C68.4414 48.4558 62.3128 42.3276 54.7532 1.2627Z"
                fill="white"
              />
              <path
                d="M114.179 78.2979C109.372 104.413 105.474 108.311 79.3584 113.119C105.474 117.926 109.372 121.824 114.179 147.939C118.987 121.824 122.885 117.926 149 113.119C122.884 108.311 118.987 104.413 114.179 78.2979Z"
                fill="white"
              />
            </g>
          </svg>
        </div>

        {/* Top Spacer */}
        <div className="h-[150px] lg:h-[60px]"></div>

        <div className="mx-auto px-6 lg:px-20 relative">
          {/* Section Heading */}
          <div className="text-center">
            <div className="mb-4">
              <h2 className="text-5xl font-black text-white animate-textUpAndDowns">
                {t("subscribe.title") || "Stay Connected With KW&SC Water & Sewerage Services"}
              </h2>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="mt-8">
            <form onSubmit={handleSubmit} className="relative max-w-[645px] w-full mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("subscribe.placeholder") || "Enter Your Email"}
                className=" placeholder:text-white w-full h-[80px] px-[30px] text-[18px] border border-white bg-transparent outline-none text-white focus:border-blue-400"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute top-0 right-0 w-[75px] h-[80px] bg-transparent border-0 cursor-pointer transition-all duration-400 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  <svg
                    width="30"
                    height="26"
                    viewBox="0 0 30 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M29.6063 0.212923C29.3188 0.00917327 28.9413 -0.0183267 28.6288 0.145423L0.503806 14.8329C0.171306 15.0067 -0.0249444 15.3617 0.0025556 15.7354C0.0313056 16.1104 0.280056 16.4304 0.633806 16.5517L8.45256 19.2242L25.1038 4.98667L12.2188 20.5104L25.3226 24.9892C25.4201 25.0217 25.5226 25.0392 25.6251 25.0392C25.7951 25.0392 25.9638 24.9929 26.1126 24.9029C26.3501 24.7579 26.5113 24.5142 26.5526 24.2404L29.9901 1.11542C30.0413 0.765423 29.8938 0.417923 29.6063 0.212923Z"
                      fill="white"
                      className='hover:fill-blue-400'
                    />
                  </svg>
                )}
              </button>
            </form>
            {message && (
              <p className="text-center text-white mt-4">{message}</p>
            )}
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-[150px] lg:h-[60px]"></div>
      </section>
    </>
  )
}

export default Subscribe
