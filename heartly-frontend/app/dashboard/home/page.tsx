"use client";

import DosageCalendar from "@/components/dosage-calendar";

const DashboardHomePage = () => {
  return (
    <>
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
    </>
  );
};

export default DashboardHomePage;
