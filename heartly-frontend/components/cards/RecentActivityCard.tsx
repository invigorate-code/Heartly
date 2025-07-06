import React from "react";
import { Plus } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "intake-form" | "blood-report";
  title: string;
  description: string;
  status: "pending" | "completed";
  userName: string;
  timestamp: string;
}

interface RecentActivityCardProps {
  title?: string;
  seeAllText?: string;
  activities?: ActivityItem[];
  onSeeAllClick?: () => void;
  onAddClick?: () => void;
  className?: string;
}

const defaultActivities: ActivityItem[] = [
  {
    id: "1",
    type: "intake-form",
    title: "Intake Form",
    description:
      "Intake form for Taz Kingston is completed. Follow up required",
    status: "pending",
    userName: "Taz Kingston",
    timestamp: "12:23 AM 23 Aug",
  },
  {
    id: "2",
    type: "blood-report",
    title: "Blood Report",
    description:
      "Report for Blood test is added, please review the pending items",
    status: "completed",
    userName: "Taz Kingston",
    timestamp: "12:23 AM 23 Aug",
  },
  {
    id: "3",
    type: "intake-form",
    title: "Intake Form",
    description:
      "Intake form for Taz Kingston is completed. Follow up required",
    status: "pending",
    userName: "Taz Kingston",
    timestamp: "12:23 AM 23 Aug",
  },
  {
    id: "4",
    type: "blood-report",
    title: "Blood Report",
    description:
      "Report for Blood test is added, please review the pending items",
    status: "completed",
    userName: "Taz Kingston",
    timestamp: "12:23 AM 23 Aug",
  },
];

const ActivityIcon = ({ type, status }: { type: string; status: string }) => {
  if (type === "intake-form") {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 0C10.3452 0 8.99039 1.05121 8.56919 2.57161C7.48319 2.87281 6.46799 3.87961 6.20999 4.80121L4.8 4.8C2.1492 4.8 0 6.9492 0 9.6V19.2C0 21.8508 2.1492 24 4.8 24H19.2C21.8508 24 24 21.8508 24 19.2V9.6C24 6.9492 21.8508 4.8 19.2 4.8L17.8308 4.81201C17.3808 3.72961 16.5264 2.8512 15.4404 2.55C15.0192 1.0296 13.6548 0 12 0ZM12 2.4C12.6624 2.4 13.2 2.9376 13.2 3.6C13.2 4.2624 13.7376 4.8 14.4 4.8C15.0624 4.8 15.6 5.3376 15.6 6C15.6 6.6624 15.0624 7.2 14.4 7.2H9.6C8.9376 7.2 8.4 6.6624 8.4 6C8.4 5.3376 8.9376 4.8 9.6 4.8C10.2624 4.8 10.8 4.2624 10.8 3.6C10.8 2.9376 11.3376 2.4 12 2.4ZM4.8 7.2L6.20999 7.19161C6.70319 8.67121 8.0784 9.6 9.6 9.6H14.4C15.9216 9.6 17.2092 8.73602 17.8212 7.20242L19.2 7.2C20.526 7.2 21.6 8.274 21.6 9.6V19.2C21.6 20.526 20.526 21.6 19.2 21.6H4.8C3.474 21.6 2.4 20.526 2.4 19.2V9.6C2.4 8.274 3.474 7.2 4.8 7.2Z"
          fill="#C16236"
        />
      </svg>
    );
  }

  return (
    <svg
      width="23"
      height="24"
      viewBox="0 0 23 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.8947 2.67732e-08C8.88902 2.67732e-08 7.26328 1.60303 7.26316 3.58888V4.85993H6.05263C4.94561 4.81591 3.24651 5.53058 2.61026 7.28997L1.21053 7.25252C0.541953 7.25252 -0.000121032 7.7869 2.02706e-08 8.44881C2.02706e-08 9.11072 0.541953 9.6457 1.21053 9.6445H2.42105V10.8408H1.21053C0.541953 10.8408 -0.000121032 11.3755 2.02706e-08 12.0371C2.02706e-08 12.6998 0.541953 13.2334 1.21053 13.2334H2.42105V14.4297H1.21053C0.541953 14.4297 -0.000121032 14.9644 2.02706e-08 15.626C2.02706e-08 16.2887 0.541953 16.8234 1.21053 16.8223H2.42105V18.0185H1.21053C0.541953 18.0185 -0.000121032 18.5533 2.02706e-08 19.2148C2.02706e-08 19.8776 0.541953 20.4123 1.21053 20.4111H2.42105C2.42105 22.3934 4.04691 24.0012 6.05263 24H14.5263C16.532 24 18.1579 22.3934 18.1579 20.4111V19.2148L19.3684 19.1777C21.3741 19.1777 22.9999 17.5747 23 15.5889V3.58888C23 1.60315 21.374 -0.000239232 19.3684 2.67732e-08H10.8947ZM19.3684 2.39258C20.037 2.39258 20.5791 2.92697 20.5789 3.58888V15.5518C20.5789 16.2133 20.037 16.7481 19.3684 16.7481L18.1579 16.7852V8.44881C18.1579 6.46667 16.532 4.85993 14.5263 4.85993H9.68421V3.6262C9.68421 2.96441 10.2262 2.4299 10.8947 2.4299L19.3684 2.39258ZM6.05263 7.25252H14.5263C15.1949 7.25252 15.7368 7.7881 15.7368 8.44881V19.1777V20.4111C15.7368 21.0727 15.1949 21.6086 14.5263 21.6074H6.05263C5.38406 21.6074 4.84211 21.0727 4.84211 20.4111V19.1777V18.0185V8.44881C4.84211 8.11792 4.96352 7.80533 5.18263 7.58904C5.40161 7.37251 5.71841 7.25252 6.05263 7.25252Z"
        fill="#00C48C"
      />
    </svg>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "pending") {
    return (
      <div className="inline-flex items-center justify-center px-2 py-1 text-xs font-normal text-orange-700 bg-orange-50 rounded">
        Pending
      </div>
    );
  }

  return (
    <div className="inline-flex items-center justify-center px-2 py-1 text-xs font-normal text-green-700 bg-green-50 rounded">
      Completed
    </div>
  );
};

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  title = "Recent Activity",
  seeAllText = "See All",
  activities = defaultActivities,
  onSeeAllClick,
  onAddClick,
  className = "",
}) => {
  return (
    <div className={`w-full max-w-[552px] bg-transparent ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-xl font-normal text-gray-600"
          style={{
            fontFamily: "DM Sans, -apple-system, Roboto, Helvetica, sans-serif",
          }}
        >
          {title}
        </h2>
        <button
          onClick={onSeeAllClick}
          className="text-sm font-normal text-[#6F7FD2] hover:text-[#5a6ac2] transition-colors"
          style={{
            fontFamily: "Avenir, -apple-system, Roboto, Helvetica, sans-serif",
            fontWeight: 400,
            lineHeight: "16.625px",
          }}
        >
          {seeAllText}
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-4 relative">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
              {/* Icon */}
              <div className="absolute left-6 top-6">
                <ActivityIcon type={activity.type} status={activity.status} />
              </div>

              {/* Content */}
              <div className="ml-12 pr-20">
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className="text-base font-semibold text-gray-700"
                    style={{
                      fontFamily:
                        "DM Sans, -apple-system, Roboto, Helvetica, sans-serif",
                    }}
                  >
                    {activity.title}
                  </h3>
                </div>

                <p
                  className="text-sm text-gray-700 leading-relaxed mb-3"
                  style={{
                    fontFamily:
                      "DM Sans, -apple-system, Roboto, Helvetica, sans-serif",
                    lineHeight: "165%",
                  }}
                >
                  {activity.description.includes("Taz Kingston") ? (
                    <>
                      {activity.description.split("Taz Kingston")[0]}
                      <span className="text-[#6F7FD2] font-medium">
                        Taz Kingston
                      </span>
                      {activity.description.split("Taz Kingston")[1]}
                    </>
                  ) : (
                    activity.description
                  )}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span
                    style={{
                      fontFamily:
                        "DM Sans, -apple-system, Roboto, Helvetica, sans-serif",
                    }}
                  >
                    {activity.userName}
                  </span>
                  <span
                    style={{
                      fontFamily:
                        "DM Sans, -apple-system, Roboto, Helvetica, sans-serif",
                    }}
                  >
                    {activity.timestamp}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-6 right-6">
                <StatusBadge status={activity.status} />
              </div>
            </div>
          </div>
        ))}

        {/* Floating Action Button */}
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={onAddClick}
            className="w-10 h-10 bg-[#6F7FD2] rounded-full shadow-lg flex items-center justify-center hover:bg-[#5a6ac2] transition-colors"
            style={{
              boxShadow:
                "0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.30)",
            }}
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
