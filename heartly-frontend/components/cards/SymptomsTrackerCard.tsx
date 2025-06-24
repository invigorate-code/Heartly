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
    <Card
      className={`w-52 h-46 bg-white shadow-sm border-0 ${className}`}
      radius="lg"
    >
      <CardBody className="p-4 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="mb-4">
          <p
            className="text-sm font-medium opacity-70"
            style={{
              fontFamily:
                "Avenir, -apple-system, Roboto, Helvetica, sans-serif",
              color: "rgba(34,34,34,1)",
            }}
          >
            {title}
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center">
          <h3
            className="text-2xl font-extrabold leading-none"
            style={{
              fontFamily:
                "Avenir, -apple-system, Roboto, Helvetica, sans-serif",
              color: "rgba(111,127,210,1)",
              fontSize: "32px",
            }}
          >
            {mainText}
          </h3>
        </div>

        {/* Footer Link */}
        <div className="mt-4">
          <button
            onClick={onLinkClick}
            className="flex items-center gap-3 text-base font-medium hover:opacity-80 transition-opacity group"
            style={{
              fontFamily:
                "Avenir, -apple-system, Roboto, Helvetica, sans-serif",
              color: "rgba(28,55,111,1)",
            }}
          >
            <span>{linkText}</span>
            <ChevronRight
              size={12}
              className="group-hover:translate-x-1 transition-transform"
              style={{ color: "rgba(28,55,111,1)" }}
            />
          </button>
        </div>
      </CardBody>
    </Card>
  );
};

export default SymptomsTrackerCard;
