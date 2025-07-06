import React from "react";

interface AllergyTrackerCardProps {
  title?: string;
  allergies?: string[];
  moreCount?: number;
  linkText?: string;
  onLinkClick?: () => void;
  className?: string;
}

export const AllergyTrackerCard: React.FC<AllergyTrackerCardProps> = ({
  title = "Allergic to",
  allergies = ["Peanuts", "Lactose"],
  moreCount = 10,
  linkText = "See 10 More",
  onLinkClick,
  className = "",
}) => {
  const displayedAllergies = allergies.slice(0, 2);
  const actualMoreCount = Math.max(0, allergies.length - 2);
  const finalLinkText = linkText.includes("More")
    ? `See ${actualMoreCount || moreCount} More`
    : linkText;

  return (
    <div
      className={`w-[206px] h-[185px] bg-white rounded-xl p-6 relative ${className}`}
    >
      {/* Title */}
      <div className="mb-4">
        <h3
          className="text-sm font-medium text-gray-700 opacity-70"
          style={{
            fontFamily: "Avenir, -apple-system, Roboto, Helvetica, sans-serif",
            color: "#222",
            opacity: 0.7,
          }}
        >
          {title}
        </h3>
      </div>

      {/* Allergies List */}
      <div className="space-y-1 mb-8">
        {displayedAllergies.map((allergy, index) => (
          <div
            key={index}
            className="text-2xl font-normal"
            style={{
              fontFamily:
                "Avenir, -apple-system, Roboto, Helvetica, sans-serif",
              color: "#FF5757",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            {allergy}
          </div>
        ))}
      </div>

      {/* See More Link */}
      <div className="absolute bottom-6 left-6">
        <button
          onClick={onLinkClick}
          className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
        >
          <span
            className="text-base font-medium"
            style={{
              fontFamily:
                "Avenir, -apple-system, Roboto, Helvetica, sans-serif",
              color: "#1C376F",
              fontWeight: 500,
              lineHeight: "normal",
            }}
          >
            {finalLinkText}
          </span>
          <svg
            width="14"
            height="12"
            viewBox="0 0 14 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform group-hover:translate-x-1"
          >
            <g clipPath="url(#clip0_1_27079)">
              <path
                d="M9.5981 1.90815C9.42283 1.73895 9.13111 1.73895 8.94971 1.90815C8.77444 2.07163 8.77444 2.34371 8.94971 2.50681L12.2374 5.57331H1.38848C1.13558 5.57369 0.93457 5.76118 0.93457 5.99706C0.93457 6.23295 1.13558 6.42653 1.38848 6.42653H12.2374L8.94971 9.48732C8.77444 9.65651 8.77444 9.92898 8.94971 10.0921C9.13111 10.2613 9.42323 10.2613 9.5981 10.0921L13.6641 6.29964C13.8455 6.13616 13.8455 5.86407 13.6641 5.70097L9.5981 1.90815Z"
                fill="#1C376F"
              />
            </g>
            <defs>
              <clipPath id="clip0_1_27079">
                <rect
                  width="12.8656"
                  height="12"
                  fill="white"
                  transform="translate(0.93457)"
                />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
    </div>
  );
};
