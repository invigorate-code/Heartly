import React from "react";
import {
  Clock,
  Calendar,
  User,
  Briefcase,
  BarChart3,
  Droplet,
  Pill,
  Info,
} from "lucide-react";

interface ClientData {
  id: string;
  name: string;
  avatar: string;
  gender: string;
  age: string;
  birthDate: string;
  uciNumber: string;
  status: {
    type: "placement" | "physical-report" | "action-taken";
    text: string;
  };
  progressScore?: {
    current: number;
    total: number;
  };
  sections: {
    intake: {
      status: "not-started" | "completed";
      statusText: string;
    };
    reports: {
      status: "not-started" | "completed";
      statusText: string;
    };
    health: {
      status:
        | "not-started"
        | "completed"
        | "physical-report-due"
        | "placement-info";
      statusText: string;
      hasInfo?: boolean;
    };
    medication: {
      status: "not-started" | "completed";
      statusText: string;
    };
  };
}

interface ClientListProps {
  clients?: ClientData[];
  className?: string;
}

// Mock data based on the Figma design
const defaultClients: ClientData[] = [
  {
    id: "1",
    name: "Taz Kingston",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/ce12f9c8fe6f43c55ca60e6697d79868f29ef744?width=82",
    gender: "Male",
    age: "54 Years",
    birthDate: "Jan 15, 1965",
    uciNumber: "UCI 845345",
    status: {
      type: "placement",
      text: "Placement Information",
    },
    progressScore: {
      current: 5,
      total: 10,
    },
    sections: {
      intake: { status: "not-started", statusText: "Not started" },
      reports: { status: "completed", statusText: "Completed" },
      health: {
        status: "physical-report-due",
        statusText: "Physical report due",
      },
      medication: { status: "completed", statusText: "Completed" },
    },
  },
  {
    id: "2",
    name: "Taz Kingston",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/fa0490c7bbf939be01e7f1a6dfc6335fe0ba6f35?width=82",
    gender: "Male",
    age: "54 Years",
    birthDate: "Jan 15, 1965",
    uciNumber: "UCI 845345",
    status: {
      type: "physical-report",
      text: "Physical Report",
    },
    progressScore: {
      current: 1,
      total: 10,
    },
    sections: {
      intake: { status: "not-started", statusText: "Not started" },
      reports: { status: "completed", statusText: "Completed" },
      health: {
        status: "physical-report-due",
        statusText: "Physical report due",
      },
      medication: { status: "completed", statusText: "Completed" },
    },
  },
  {
    id: "3",
    name: "Taz Kingston",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/bbee406da1b0935981bae1437d573d8206bee10e?width=82",
    gender: "Male",
    age: "54 Years",
    birthDate: "Jan 15, 1965",
    uciNumber: "UCI 845345",
    status: {
      type: "action-taken",
      text: "Action Taken",
    },
    progressScore: {
      current: 9,
      total: 10,
    },
    sections: {
      intake: { status: "not-started", statusText: "Not started" },
      reports: { status: "completed", statusText: "Completed" },
      health: {
        status: "physical-report-due",
        statusText: "Physical report due",
      },
      medication: { status: "completed", statusText: "Completed" },
    },
  },
  {
    id: "4",
    name: "Taz Kingston",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/5f16480bb52e3a519be42eee8dfc6d234d3f0da1?width=82",
    gender: "Male",
    age: "54 Years",
    birthDate: "Jan 15, 1965",
    uciNumber: "UCI 845345",
    status: {
      type: "physical-report",
      text: "Physical Report",
    },
    sections: {
      intake: { status: "completed", statusText: "Intake" },
      reports: { status: "completed", statusText: "Reports" },
      health: { status: "not-started", statusText: "Health", hasInfo: true },
      medication: { status: "completed", statusText: "Medication" },
    },
  },
  {
    id: "5",
    name: "Taz Kingston",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/c7b2acc1e6c00857dbfe34643bc053d05307b1ae?width=82",
    gender: "Male",
    age: "54 Years",
    birthDate: "Jan 15, 1965",
    uciNumber: "UCI 845345",
    status: {
      type: "action-taken",
      text: "Action Taken",
    },
    progressScore: {
      current: 9,
      total: 10,
    },
    sections: {
      intake: { status: "not-started", statusText: "Not started" },
      reports: { status: "completed", statusText: "Completed" },
      health: {
        status: "placement-info",
        statusText: "Placement Information",
        hasInfo: true,
      },
      medication: { status: "completed", statusText: "Completed" },
    },
  },
];

const CircularProgress: React.FC<{
  current: number;
  total: number;
  color: string;
}> = ({ current, total, color }) => {
  const percentage = (current / total) * 100;
  const strokeDasharray = 2 * Math.PI * 18; // radius = 18
  const strokeDashoffset =
    strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="relative w-11 h-11">
      <svg className="w-11 h-11 transform -rotate-90" viewBox="0 0 40 40">
        {/* Background circle */}
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="#F2C2C2"
          strokeWidth="3"
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke={color}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-gray-700">{current}</span>
        <span className="text-xs text-gray-500 -mt-1">of {total}</span>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ type: string; text: string }> = ({
  type,
  text,
}) => {
  const getStatusStyles = () => {
    switch (type) {
      case "placement":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "physical-report":
        return "bg-red-50 text-red-700 border-red-200";
      case "action-taken":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "placement":
        return <Info className="w-3.5 h-3.5" />;
      case "physical-report":
        return <Clock className="w-3.5 h-3.5" />;
      case "action-taken":
        return <User className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${getStatusStyles()}`}
    >
      {getIcon()}
      {text}
    </div>
  );
};

const ClientCard: React.FC<{ client: ClientData }> = ({ client }) => {
  const getProgressColor = () => {
    if (!client.progressScore) return "#6F7FD2";
    const percentage =
      (client.progressScore.current / client.progressScore.total) * 100;
    if (percentage >= 80) return "#92D39E"; // Green
    if (percentage >= 50) return "#6F7FD2"; // Blue
    return "#E85B5B"; // Red
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <img
          src={client.avatar}
          alt={client.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header with name and status */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-medium text-gray-900 text-base">
                {client.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {client.gender}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {client.age}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {client.birthDate}
                </span>
                <span className="text-gray-400">{client.uciNumber}</span>
              </div>
            </div>

            {/* Progress Score */}
            {client.progressScore && (
              <CircularProgress
                current={client.progressScore.current}
                total={client.progressScore.total}
                color={getProgressColor()}
              />
            )}
          </div>

          {/* Status Badge */}
          <div className="mb-3">
            <StatusBadge type={client.status.type} text={client.status.text} />
          </div>

          {/* Action Icons Grid */}
          <div className="grid grid-cols-4 gap-4">
            {/* Intake */}
            <div className="text-center">
              <div className="flex justify-center mb-1">
                <Briefcase className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-xs font-medium text-gray-700">Intake</div>
              <div className="text-xs text-gray-400">
                {client.sections.intake.statusText}
              </div>
            </div>

            {/* Reports */}
            <div className="text-center">
              <div className="flex justify-center mb-1">
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-xs font-medium text-gray-700">Reports</div>
              <div className="text-xs text-gray-400">
                {client.sections.reports.statusText}
              </div>
            </div>

            {/* Health */}
            <div className="text-center">
              <div className="flex justify-center mb-1 relative">
                <Droplet className="w-6 h-6 text-red-500" />
                {client.sections.health.hasInfo && (
                  <Info className="w-3 h-3 text-gray-600 absolute -top-1 -right-1" />
                )}
              </div>
              <div className="text-xs font-medium text-gray-700">Health</div>
              <div className="text-xs text-gray-400">
                {client.sections.health.statusText}
              </div>
            </div>

            {/* Medication */}
            <div className="text-center">
              <div className="flex justify-center mb-1">
                <Pill className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-xs font-medium text-gray-700">
                Medication
              </div>
              <div className="text-xs text-gray-400">
                {client.sections.medication.statusText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ClientList: React.FC<ClientListProps> = ({
  clients = defaultClients,
  className = "",
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
};

export default ClientList;
