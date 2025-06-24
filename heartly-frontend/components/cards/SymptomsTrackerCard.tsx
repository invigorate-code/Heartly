"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import { ChevronRight } from "lucide-react";

interface SymptomsTrackerCardProps {
  title?: string;
  mainText?: string;
  linkText?: string;
  onLinkClick?: () => void;
  className?: string;
}

export const SymptomsTrackerCard: React.FC<SymptomsTrackerCardProps> = ({
  title = "Symptoms Tracker",
  mainText = "Emotional",
  linkText = "See History",
  onLinkClick,
  className = "",
}) => {
  return (
    <div
      className={`w-[204px] h-[185px] bg-white rounded-xl shadow-sm relative ${className}`}
    >
      {/* Header */}
      <div className="absolute left-4 top-6">
        <p
          className="text-sm font-medium"
          style={{
            fontFamily: "Avenir, -apple-system, Roboto, Helvetica, sans-serif",
            color: "rgba(34,34,34,0.7)",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {title}
        </p>
      </div>

      {/* Main Content */}
      <div className="absolute left-4 top-16">
        <h3
          className="font-extrabold leading-none"
          style={{
            fontFamily: "Avenir, -apple-system, Roboto, Helvetica, sans-serif",
            color: "rgba(111,127,210,1)",
            fontSize: "32px",
            fontWeight: "800",
          }}
        >
          {mainText}
        </h3>
      </div>

      {/* Footer Link */}
      <div className="absolute left-5 bottom-6">
        <button
          onClick={onLinkClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          style={{
            fontFamily: "Avenir, -apple-system, Roboto, Helvetica, sans-serif",
            color: "rgba(28,55,111,1)",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          <span>{linkText}</span>
          <svg
            className="group-hover:translate-x-1 transition-transform"
            width="13"
            height="12"
            viewBox="0 0 14 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_1_26979)">
              <path
                d="M9.48643 1.90815C9.31427 1.73895 9.02775 1.73895 8.84958 1.90815C8.67743 2.07163 8.67743 2.34371 8.84958 2.50681L12.0788 5.57331H1.42289C1.17449 5.57369 0.977051 5.76118 0.977051 5.99706C0.977051 6.23295 1.17449 6.42653 1.42289 6.42653H12.0788L8.84958 9.48732C8.67743 9.65651 8.67743 9.92898 8.84958 10.0921C9.02775 10.2613 9.31468 10.2613 9.48643 10.0921L13.4801 6.29964C13.6582 6.13616 13.6582 5.86407 13.4801 5.70097L9.48643 1.90815Z"
                fill="#1C376F"
              />
            </g>
            <defs>
              <clipPath id="clip0_1_26979">
                <rect
                  width="12.6367"
                  height="12"
                  fill="white"
                  transform="translate(0.977051)"
                />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SymptomsTrackerCard;
