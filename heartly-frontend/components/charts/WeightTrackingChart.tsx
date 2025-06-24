"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Dot,
} from "recharts";
import { Card, CardHeader, CardBody, Chip } from "@heroui/react";
import { Calendar, TrendingUp } from "lucide-react";

interface WeightDataPoint {
  month: string;
  weight: number;
  isHighlight?: boolean;
}

interface WeightTrackingChartProps {
  title?: string;
  assignedDate?: string;
  status?: "Waiting" | "Active" | "Completed";
  baselineWeight?: number;
  data?: WeightDataPoint[];
  emergencyNote?: string;
  className?: string;
}

const defaultData: WeightDataPoint[] = [
  { month: "Jan", weight: 34 },
  { month: "Feb", weight: 41 },
  { month: "Mar", weight: 35 },
  { month: "Apr", weight: 68, isHighlight: true },
  { month: "May", weight: 52 },
  { month: "Jun", weight: 40 },
  { month: "Jul", weight: 42 },
];

const statusColors = {
  Waiting: "warning",
  Active: "primary",
  Completed: "success",
} as const;

// Custom dot component to highlight specific points
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (payload.isHighlight) {
    return (
      <Dot cx={cx} cy={cy} r={6} fill="#ff6b35" stroke="#fff" strokeWidth={2} />
    );
  }
  return null;
};

export const WeightTrackingChart: React.FC<WeightTrackingChartProps> = ({
  title = "Weight",
  assignedDate = "12 days ago",
  status = "Waiting",
  baselineWeight = 50,
  data = defaultData,
  emergencyNote = "Please note the for emergency needs take a new measurements",
  className = "",
}) => {
  const maxWeight = Math.max(...data.map((d) => d.weight));
  const yAxisMax = Math.ceil(maxWeight / 10) * 10;

  return (
    <Card className={`w-full max-w-2xl ${className}`} shadow="sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Assigned {assignedDate}</span>
            </div>
          </div>
          <Chip
            color={statusColors[status]}
            variant="flat"
            size="sm"
            className="font-medium"
          >
            {status}
          </Chip>
        </div>
      </CardHeader>

      <CardBody className="pt-2">
        <div className="h-80 w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />

              <YAxis
                domain={[0, yAxisMax]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                ticks={[0, 10, 20, 30, 40, 50, 60, 70]}
              />

              {/* Baseline weight reference line */}
              <ReferenceLine
                y={baselineWeight}
                stroke="#9ca3af"
                strokeDasharray="4 4"
                label={{
                  value: "Baseline weight",
                  position: "insideTopLeft",
                  style: { fontSize: "12px", fill: "#6b7280" },
                }}
              />

              {/* Main weight tracking line */}
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#ff6b35"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 6,
                  stroke: "#ff6b35",
                  strokeWidth: 2,
                  fill: "#fff",
                }}
                fill="url(#gradient)"
              />

              {/* Custom dots for highlighted points */}
              <Line
                type="monotone"
                dataKey="weight"
                stroke="transparent"
                dot={<CustomDot />}
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff6b35" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#ff6b35" stopOpacity={0} />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {emergencyNote && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">{emergencyNote}</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default WeightTrackingChart;
