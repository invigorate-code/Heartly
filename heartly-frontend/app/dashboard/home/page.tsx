"use client";

import DosageCalendar from "@/components/dosage-calendar";
import { WeightTrackingChart } from "@/components/charts/WeightTrackingChart";

const DashboardHomePage = () => {
  return (
    <div className="space-y-6">
      {/* Weight Tracking Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Patient Monitoring
        </h2>
        <WeightTrackingChart />
      </div>

      {/* Dosage Calendar Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Medication Schedule
        </h2>
        <DosageCalendar
          upcomingDosages={3}
          dosageStatuses={[
            "upcoming",
            "missed",
            "upcoming",
            "upcoming",
            "taken",
            "upcoming",
            "upcoming",
            "taken",
            "missed",
            "upcoming",
            "upcoming",
            "upcoming",
            "upcoming",
            "upcoming",
            "taken",
            "missed",
            "upcoming",
            "upcoming",
            "upcoming",
            "upcoming",
            "upcoming",
            "taken",
            "missed",
            "upcoming",
            "upcoming",
            "upcoming",
            "upcoming",
            "upcoming",
            "taken",
            "missed",
            "upcoming",
          ]}
        />
      </div>
    </div>
  );
};

export default DashboardHomePage;
