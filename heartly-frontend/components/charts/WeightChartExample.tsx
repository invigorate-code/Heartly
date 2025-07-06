"use client";

import React from "react";
import { WeightTrackingChart } from "./WeightTrackingChart";

// Example usage component to demonstrate the chart
export const WeightChartExample: React.FC = () => {
  // Example data that matches the design from the image
  const sampleData = [
    { month: "Jan", weight: 34 },
    { month: "Feb", weight: 41 },
    { month: "Mar", weight: 35 },
    { month: "Apr", weight: 68, isHighlight: true }, // Highlighted peak
    { month: "May", weight: 52 },
    { month: "Jun", weight: 40 },
    { month: "Jul", weight: 42 },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Weight Tracking Chart Examples
        </h2>
        <p className="text-gray-600 mb-6">
          Reusable weight tracking chart component with customizable data and
          styling.
        </p>
      </div>

      {/* Default chart */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Default Chart</h3>
        <WeightTrackingChart />
      </div>

      {/* Custom data chart */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Custom Data</h3>
        <WeightTrackingChart
          title="Patient Weight Monitoring"
          assignedDate="5 days ago"
          status="Active"
          baselineWeight={45}
          data={sampleData}
          emergencyNote="Contact physician if weight exceeds 65kg or drops below 30kg"
        />
      </div>

      {/* Completed status chart */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Completed Status</h3>
        <WeightTrackingChart
          title="Weight Assessment"
          assignedDate="1 month ago"
          status="Completed"
          baselineWeight={55}
          data={[
            { month: "Jan", weight: 52 },
            { month: "Feb", weight: 54 },
            { month: "Mar", weight: 53 },
            { month: "Apr", weight: 55 },
            { month: "May", weight: 56 },
            { month: "Jun", weight: 57 },
          ]}
          emergencyNote="Assessment completed successfully. Regular monitoring recommended."
        />
      </div>
    </div>
  );
};

export default WeightChartExample;
