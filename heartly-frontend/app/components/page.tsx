import { WeightTrackingChart } from "@/components/charts/WeightTrackingChart";
import { SymptomsTrackerCard } from "@/components/cards/SymptomsTrackerCard";
import { Button, Card, CardHeader, CardBody, Chip } from "@heroui/react";
import { ArrowLeft, Github, Code } from "lucide-react";
import Link from "next/link";

export default function ComponentsShowcase() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  startContent={<ArrowLeft className="w-4 h-4" />}
                >
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Component Library
                </h1>
                <p className="text-sm text-gray-500">
                  Reusable UI components for Heartly
                </p>
              </div>
            </div>
            <Chip
              color="primary"
              variant="flat"
              startContent={<Code className="w-3 h-3" />}
            >
              UI Showcase
            </Chip>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12">
          {/* Weight Tracking Chart Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Weight Tracking Chart
              </h2>
              <p className="text-gray-600">
                Interactive weight monitoring chart with baseline indicators and
                emergency notifications.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Default Chart */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Default Configuration
                </h3>
                <WeightTrackingChart />
              </div>

              {/* Active Status Chart */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Active Status
                </h3>
                <WeightTrackingChart
                  title="Patient Weight Monitoring"
                  assignedDate="5 days ago"
                  status="Active"
                  baselineWeight={45}
                  data={[
                    { month: "Jan", weight: 40 },
                    { month: "Feb", weight: 42 },
                    { month: "Mar", weight: 38 },
                    { month: "Apr", weight: 65, isHighlight: true },
                    { month: "May", weight: 48 },
                    { month: "Jun", weight: 44 },
                    { month: "Jul", weight: 46 },
                  ]}
                  emergencyNote="Contact physician if weight exceeds 60kg or drops below 35kg"
                />
              </div>

              {/* Completed Status Chart */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Completed Status
                </h3>
                <WeightTrackingChart
                  title="Weight Assessment Complete"
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

              {/* Critical Alert Chart */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Critical Weight Fluctuation
                </h3>
                <WeightTrackingChart
                  title="Critical Monitoring"
                  assignedDate="2 days ago"
                  status="Waiting"
                  baselineWeight={50}
                  data={[
                    { month: "Jan", weight: 45 },
                    { month: "Feb", weight: 42 },
                    { month: "Mar", weight: 38 },
                    { month: "Apr", weight: 72, isHighlight: true },
                    { month: "May", weight: 68, isHighlight: true },
                    { month: "Jun", weight: 35 },
                    { month: "Jul", weight: 33 },
                  ]}
                  emergencyNote="⚠️ URGENT: Significant weight fluctuations detected. Immediate medical attention required."
                />
              </div>
            </div>
          </section>

          {/* Symptoms Tracker Card Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Symptoms Tracker Card
              </h2>
              <p className="text-gray-600">
                Clean, modern card component for tracking emotional and physical
                symptoms with actionable links.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Default Emotional Card */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Emotional Symptoms
                </h3>
                <SymptomsTrackerCard
                  onLinkClick={() => console.log("See History clicked")}
                />
              </div>

              {/* Physical Symptoms Card */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Physical Symptoms
                </h3>
                <SymptomsTrackerCard
                  title="Symptoms Tracker"
                  mainText="Physical"
                  linkText="View Details"
                  onLinkClick={() => console.log("View Details clicked")}
                />
              </div>

              {/* Behavioral Symptoms Card */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Behavioral Symptoms
                </h3>
                <SymptomsTrackerCard
                  title="Behavioral Tracker"
                  mainText="Behavioral"
                  linkText="Analyze Trends"
                  onLinkClick={() => console.log("Analyze Trends clicked")}
                />
              </div>
            </div>
          </section>

          {/* Component Usage Section */}
          <section className="border-t border-gray-200 pt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Usage Examples
              </h2>
              <p className="text-gray-600">
                Code examples for implementing these components in your
                application.
              </p>
            </div>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Basic Implementation</h3>
              </CardHeader>
              <CardBody>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {`import { WeightTrackingChart } from "@/components/charts/WeightTrackingChart";

// Basic usage
<WeightTrackingChart />

// With custom data
<WeightTrackingChart
  title="Patient Weight Monitoring"
  status="Active"
  baselineWeight={50}
  data={[
    { month: "Jan", weight: 45 },
    { month: "Feb", weight: 48 },
    { month: "Mar", weight: 52, isHighlight: true },
    // ... more data points
  ]}
  emergencyNote="Custom emergency instructions"
/>`}
                </pre>
              </CardBody>
            </Card>
          </section>

          {/* Props Documentation */}
          <section className="border-t border-gray-200 pt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Component Props
              </h2>
              <p className="text-gray-600">
                Available props and their descriptions for the
                WeightTrackingChart component.
              </p>
            </div>

            <Card>
              <CardBody>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-semibold">Prop</th>
                        <th className="text-left py-2 font-semibold">Type</th>
                        <th className="text-left py-2 font-semibold">
                          Default
                        </th>
                        <th className="text-left py-2 font-semibold">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-2 font-mono text-purple-600">
                          title
                        </td>
                        <td className="py-2">string</td>
                        <td className="py-2">"Weight"</td>
                        <td className="py-2">
                          Chart title displayed in header
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono text-purple-600">
                          assignedDate
                        </td>
                        <td className="py-2">string</td>
                        <td className="py-2">"12 days ago"</td>
                        <td className="py-2">When the tracking was assigned</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono text-purple-600">
                          status
                        </td>
                        <td className="py-2">
                          "Waiting" | "Active" | "Completed"
                        </td>
                        <td className="py-2">"Waiting"</td>
                        <td className="py-2">Current status of the tracking</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono text-purple-600">
                          baselineWeight
                        </td>
                        <td className="py-2">number</td>
                        <td className="py-2">50</td>
                        <td className="py-2">
                          Reference line for baseline weight
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono text-purple-600">data</td>
                        <td className="py-2">WeightDataPoint[]</td>
                        <td className="py-2">Default dataset</td>
                        <td className="py-2">
                          Array of weight measurements over time
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono text-purple-600">
                          emergencyNote
                        </td>
                        <td className="py-2">string</td>
                        <td className="py-2">Default note</td>
                        <td className="py-2">
                          Emergency or important information
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
