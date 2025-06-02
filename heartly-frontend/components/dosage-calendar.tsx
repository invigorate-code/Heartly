import React from "react";
import { Card, CardBody, Link } from "@heroui/react";

type DosageStatus = "taken" | "missed" | "upcoming" | "empty";

interface DosageCalendarProps {
  upcomingDosages: number;
  dosageStatuses: DosageStatus[];
}

const statusColors: Record<DosageStatus, string> = {
  taken: "bg-blue-500",
  missed: "bg-red-500",
  upcoming: "bg-gray-300",
  empty: "bg-gray-100",
};

export default function DosageCalendar({
  upcomingDosages,
  dosageStatuses,
}: DosageCalendarProps) {
  return (
    <Card className="w-full max-w-md">
      <CardBody className="flex flex-row items-center p-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-1">Upcoming Dosages</h2>
          <span className="text-6xl font-bold text-blue-600">
            {upcomingDosages}
          </span>
          <Link href="#" color="primary" className="text-sm block">
            See More →
          </Link>
        </div>
        <div className="grid grid-cols-7 gap-1 flex-1">
          {dosageStatuses.map((status, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-sm ${statusColors[status]}`}
              aria-label={`Dosage ${index + 1}: ${status}`}
            />
          ))}
        </div>
      </CardBody>
      {/* <CardFooter className="justify-start px-4 py-2">
        <Link href="#" color="primary" className="text-sm">
          See More →
        </Link>
      </CardFooter> */}
    </Card>
  );
}
