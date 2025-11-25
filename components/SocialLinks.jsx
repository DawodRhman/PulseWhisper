"use client";

import { useEffect, useState } from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Dribbble,
  Link2,
  Globe,
} from "lucide-react";

const FALLBACK_LINKS = [
  {
    id: "facebook",
    title: "Facebook",
    platform: "facebook",
    url: "https://www.facebook.com/kwscofficial",
  },
  {
    id: "twitter",
    title: "Twitter",
    platform: "twitter",
    url: "https://twitter.com/kwscofficial",
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    platform: "linkedin",
    url: "https://www.linkedin.com/company/kwsc",
  },
  {
    id: "youtube",
    title: "YouTube",
    platform: "youtube",
    url: "https://www.youtube.com/@kwscofficial",
  },
];

const ICON_MAP = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  dribbble: Dribbble,
};

const COLOR_MAP = {
  facebook: "text-blue-700 hover:text-blue-500",
  twitter: "text-sky-600 hover:text-sky-400",
  linkedin: "text-blue-800 hover:text-blue-600",
  instagram: "text-pink-600 hover:text-pink-500",
  youtube: "text-red-700 hover:text-red-500",
  dribbble: "text-rose-500 hover:text-rose-400",
};

const skeletonItems = Array.from({ length: 4 }, (_, index) => index);

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function SocialLinks({ variant = "buttons", className = "" }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    async function fetchLinks() {
      try {
        const response = await fetch("/api/social-links", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load social links");
        }

        const payload = await response.json();
        const serverLinks = payload?.data?.links ?? [];

        if (!isMounted) return;

        if (serverLinks.length) {
          setLinks(serverLinks);
        } else {
          setLinks(FALLBACK_LINKS);
        }

        setError(null);
      } catch (err) {
        if (!isMounted || err?.name === "AbortError") return;
        console.error("SocialLinks: fetch failed", err);
        setLinks(FALLBACK_LINKS);
        setError("Unable to load live social links.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchLinks();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className={cn("flex flex-wrap gap-3", className)}>
        {skeletonItems.map((item) => (
          <span
            key={item}
            className={cn(
              variant === "icons"
                ? "w-12 h-12 rounded-full"
                : "h-12 px-6 rounded-lg",
              "bg-gray-200 animate-pulse"
            )}
          />
        ))}
      </div>
    );
  }

  const resolvedLinks = links.length ? links : FALLBACK_LINKS;

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {resolvedLinks.map((link) => {
        const platform = link.platform?.toLowerCase?.() || link.title?.toLowerCase?.();
        const Icon = ICON_MAP[platform] || Link2;
        const colorClass = COLOR_MAP[platform] || "text-gray-600 hover:text-gray-800";

        if (variant === "icons") {
          return (
            <a
              key={link.id || link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.title}
              className={cn(
                "p-3 rounded-full bg-white border border-gray-300 transition-all duration-300 hover:bg-gray-100",
                colorClass
              )}
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        }

        return (
          <a
            key={link.id || link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-300 px-4 py-3 min-h-[60px] flex items-center justify-center rounded-lg text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-cyan-500 hover:text-cyan-600"
          >
            <span className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {link.title}
            </span>
          </a>
        );
      })}

      {error && (
        <p className="text-xs text-red-600 w-full mt-2">{error}</p>
      )}
    </div>
  );
}

export const CopyRight = () => {
  return (
    <p className="text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} KW&amp;SC. All Rights Reserved.
    </p>
  );
};
