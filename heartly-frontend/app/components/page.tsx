"use client";

import { WeightTrackingChart } from "@/components/charts/WeightTrackingChart";
import { SymptomsTrackerCard } from "@/components/cards/SymptomsTrackerCard";
import { RecentActivityCard } from "@/components/cards/RecentActivityCard";
import { AllergyTrackerCard } from "@/components/cards/AllergyTrackerCard";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Chip,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import {
  ArrowLeft,
  Github,
  Code,
  BarChart3,
  Heart,
  BookOpen,
  Activity,
  AlertTriangle,
} from "lucide-react";
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
        <Accordion
          variant="splitted"
          selectionMode="multiple"
          defaultExpandedKeys={[
            "weight-chart",
            "symptoms-card",
            "recent-activity",
            "allergy-tracker",
          ]}
          className="gap-4"
        >
          {/* Weight Tracking Chart Accordion */}
          <AccordionItem
            key="weight-chart"
            aria-label="Weight Tracking Chart"
            title={
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Weight Tracking Chart
                  </h2>
                  <p className="text-sm text-gray-600">
                    Interactive weight monitoring with baseline indicators
                  </p>
                </div>
              </div>
            }
            className="bg-white shadow-sm rounded-lg"
          >
            <div className="space-y-8 p-4">
              {/* Component Examples */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Examples
                </h3>
                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Default Configuration
                    </h4>
                    <WeightTrackingChart />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Active Status
                    </h4>
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

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Completed Status
                    </h4>
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

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Critical Weight Fluctuation
                    </h4>
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
              </div>

              {/* Usage Example */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Usage
                </h3>
                <Card>
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
  ]}
  emergencyNote="Custom instructions"
/>`}
                    </pre>
                  </CardBody>
                </Card>
              </div>

              {/* Props Documentation */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Props
                </h3>
                <Card>
                  <CardBody>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 font-semibold">
                              Prop
                            </th>
                            <th className="text-left py-2 font-semibold">
                              Type
                            </th>
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
                            <td className="py-2">
                              When the tracking was assigned
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-purple-600">
                              status
                            </td>
                            <td className="py-2">
                              "Waiting" | "Active" | "Completed"
                            </td>
                            <td className="py-2">"Waiting"</td>
                            <td className="py-2">
                              Current status of the tracking
                            </td>
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
                            <td className="py-2 font-mono text-purple-600">
                              data
                            </td>
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
              </div>
            </div>
          </AccordionItem>

          {/* Symptoms Tracker Card Accordion */}
          <AccordionItem
            key="symptoms-card"
            aria-label="Symptoms Tracker Card"
            title={
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Symptoms Tracker Card
                  </h2>
                  <p className="text-sm text-gray-600">
                    Clean cards for tracking emotional and physical symptoms
                  </p>
                </div>
              </div>
            }
            className="bg-white shadow-sm rounded-lg"
          >
            <div className="space-y-8 p-4">
              {/* Component Examples */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Examples
                </h3>
                <div className="grid gap-8 lg:grid-cols-3">
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Emotional Symptoms
                    </h4>
                    <SymptomsTrackerCard
                      onLinkClick={() => console.log("See History clicked")}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Physical Symptoms
                    </h4>
                    <SymptomsTrackerCard
                      title="Symptoms Tracker"
                      mainText="Physical"
                      linkText="View Details"
                      onLinkClick={() => console.log("View Details clicked")}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Behavioral Symptoms
                    </h4>
                    <SymptomsTrackerCard
                      title="Behavioral Tracker"
                      mainText="Behavioral"
                      linkText="Analyze Trends"
                      onLinkClick={() => console.log("Analyze Trends clicked")}
                    />
                  </div>
                </div>
              </div>

              {/* Usage Example */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Usage
                </h3>
                <Card>
                  <CardBody>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      {`import { SymptomsTrackerCard } from "@/components/cards/SymptomsTrackerCard";

// Basic usage
<SymptomsTrackerCard />

// Custom configuration
<SymptomsTrackerCard
  title="Behavioral Tracker"
  mainText="Physical"
  linkText="View Details"
  onLinkClick={() => console.log('Clicked')}
/>`}
                    </pre>
                  </CardBody>
                </Card>
              </div>

              {/* Props Documentation */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Props
                </h3>
                <Card>
                  <CardBody>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 font-semibold">
                              Prop
                            </th>
                            <th className="text-left py-2 font-semibold">
                              Type
                            </th>
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
                            <td className="py-2">"Symptoms Tracker"</td>
                            <td className="py-2">
                              Header text displayed at top of card
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-purple-600">
                              mainText
                            </td>
                            <td className="py-2">string</td>
                            <td className="py-2">"Emotional"</td>
                            <td className="py-2">
                              Large prominent text in the center
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-purple-600">
                              linkText
                            </td>
                            <td className="py-2">string</td>
                            <td className="py-2">"See History"</td>
                            <td className="py-2">Text for the action link</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-purple-600">
                              onLinkClick
                            </td>
                            <td className="py-2">{"() => void"}</td>
                            <td className="py-2">undefined</td>
                            <td className="py-2">
                              Callback when action link is clicked
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-purple-600">
                              className
                            </td>
                            <td className="py-2">string</td>
                            <td className="py-2">""</td>
                            <td className="py-2">
                              Additional CSS classes for styling
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </AccordionItem>

          {/* Recent Activity Card Accordion */}
          <AccordionItem
            key="recent-activity"
            aria-label="Recent Activity Card"
            title={
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Activity Card
                  </h2>
                  <p className="text-sm text-gray-600">
                    Activity feed with status indicators and user interactions
                  </p>
                </div>
              </div>
            }
            className="bg-white shadow-sm rounded-lg"
          >
            <div className="space-y-8 p-4">
              {/* Component Examples */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Examples
                </h3>
                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Default Activity Feed
                    </h4>
                    <RecentActivityCard
                      onSeeAllClick={() => console.log("See All clicked")}
                      onAddClick={() => console.log("Add clicked")}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Custom Activity Feed
                    </h4>
                    <RecentActivityCard
                      title="Patient Updates"
                      seeAllText="View All"
                      activities={[
                        {
                          id: "1",
                          type: "blood-report",
                          title: "Lab Results",
                          description:
                            "New blood work results available for Sarah Johnson",
                          status: "completed",
                          userName: "Sarah Johnson",
                          timestamp: "2:15 PM Today",
                        },
                        {
                          id: "2",
                          type: "intake-form",
                          title: "Assessment",
                          description:
                            "Initial health assessment form submitted by Michael Chen",
                          status: "pending",
                          userName: "Michael Chen",
                          timestamp: "11:30 AM Today",
                        },
                      ]}
                      onSeeAllClick={() => console.log("View All clicked")}
                      onAddClick={() => console.log("Add new activity")}
                    />
                  </div>
                </div>
              </div>

              {/* Usage Example */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Usage
                </h3>
                <Card>
                  <CardBody>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      {`import { RecentActivityCard } from "@/components/cards/RecentActivityCard";

// Basic usage
<RecentActivityCard />

// Custom configuration
<RecentActivityCard
  title="Patient Updates"
  seeAllText="View All"
  activities={[
    {
      id: '1',
      type: 'blood-report',
      title: 'Lab Results',
      description: 'New blood work results available',
      status: 'completed',
      userName: 'Sarah Johnson',
      timestamp: '2:15 PM Today'
    }
  ]}
  onSeeAllClick={() => navigate('/activities')}
  onAddClick={() => openCreateModal()}
/>`}
                    </pre>
                  </CardBody>
                </Card>
              </div>

              {/* Props Documentation */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Props
                </h3>
                <Card>
                  <CardBody>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 font-semibold">
                              Prop
                            </th>
                            <th className="text-left py-2 font-semibold">
                              Type
                            </th>
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
                            <td className="py-2">"Recent Activity"</td>
                            <td className="py-2">
                              Header title for the activity feed
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-purple-600">
                              seeAllText
                            </td>
                            <td className="py-2">string</td>
                            <td className="py-2">"See All"</td>
                            <td className="py-2">
                              Text for the header action link
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-purple-600">
                              activities
                            </td>
                            <td className="py-2">ActivityItem[]</td>
                            <td className="py-2">Default dataset</td>
                            <td className="py-2">
                              Array of activity items to display
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-purple-600">
                              onSeeAllClick
                            </td>
                            <td className="py-2">{"() => void"}</td>
                            <td className="py-2">undefined</td>
                            <td className="py-2">
                              Callback when "See All" link is clicked
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-purple-600">
                              onAddClick
                            </td>
                            <td className="py-2">{"() => void"}</td>
                            <td className="py-2">undefined</td>
                            <td className="py-2">
                              Callback when floating action button is clicked
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-purple-600">
                              className
                            </td>
                            <td className="py-2">string</td>
                            <td className="py-2">""</td>
                            <td className="py-2">
                              Additional CSS classes for styling
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Activity Item Interface */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  ActivityItem Interface
                </h3>
                <Card>
                  <CardBody>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      {`interface ActivityItem {
  id: string;
  type: 'intake-form' | 'blood-report';
  title: string;
  description: string;
  status: 'pending' | 'completed';
  userName: string;
  timestamp: string;
}`}
                    </pre>
                  </CardBody>
                </Card>
              </div>
            </div>
          </AccordionItem>

          {/* Allergy Tracker Card Accordion */}
          <AccordionItem
            key="allergy-tracker"
            aria-label="Allergy Tracker Card"
            title={
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Allergy Tracker Card
                  </h2>
                  <p className="text-sm text-gray-600">
                    Compact card for displaying patient allergies and
                    sensitivities
                  </p>
                </div>
              </div>
            }
            className="bg-white shadow-sm rounded-lg"
          >
            <div className="space-y-8 p-4">
              {/* Component Examples */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Examples
                </h3>
                <div className="grid gap-8 lg:grid-cols-3">
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Default Allergies
                    </h4>
                    <AllergyTrackerCard
                      onLinkClick={() => console.log("See More clicked")}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Food Allergies
                    </h4>
                    <AllergyTrackerCard
                      title="Food Allergies"
                      allergies={[
                        "Shellfish",
                        "Gluten",
                        "Dairy",
                        "Nuts",
                        "Eggs",
                      ]}
                      linkText="View All"
                      onLinkClick={() => console.log("View All food allergies")}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Medication Allergies
                    </h4>
                    <AllergyTrackerCard
                      title="Drug Allergies"
                      allergies={["Penicillin", "Aspirin", "Ibuprofen"]}
                      onLinkClick={() =>
                        console.log("See medication allergies")
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Usage Example */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Usage
                </h3>
                <Card>
                  <CardBody>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      {`import { AllergyTrackerCard } from "@/components/cards/AllergyTrackerCard";

// Basic usage
<AllergyTrackerCard />

// Custom configuration
<AllergyTrackerCard
  title="Food Allergies"
  allergies={["Shellfish", "Gluten", "Dairy", "Nuts"]}
  linkText="View All"
  onLinkClick={() => navigate('/allergies')}
/>`}
                    </pre>
                  </CardBody>
                </Card>
              </div>

              {/* Props Documentation */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Props
                </h3>
                <Card>
                  <CardBody>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 font-semibold">
                              Prop
                            </th>
                            <th className="text-left py-2 font-semibold">
                              Type
                            </th>
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
                            <td className="py-2">"Allergic to"</td>
                            <td className="py-2">
                              Header text for the allergy section
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-purple-600">
                              allergies
                            </td>
                            <td className="py-2">string[]</td>
                            <td className="py-2">["Peanuts", "Lactose"]</td>
                            <td className="py-2">
                              Array of allergy names to display
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-purple-600">
                              moreCount
                            </td>
                            <td className="py-2">number</td>
                            <td className="py-2">10</td>
                            <td className="py-2">
                              Fallback number for "See X More" text
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-purple-600">
                              linkText
                            </td>
                            <td className="py-2">string</td>
                            <td className="py-2">"See 10 More"</td>
                            <td className="py-2">Text for the action link</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-purple-600">
                              onLinkClick
                            </td>
                            <td className="py-2">{"() => void"}</td>
                            <td className="py-2">undefined</td>
                            <td className="py-2">
                              Callback when action link is clicked
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-purple-600">
                              className
                            </td>
                            <td className="py-2">string</td>
                            <td className="py-2">""</td>
                            <td className="py-2">
                              Additional CSS classes for styling
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Design Notes */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Design Notes
                </h3>
                <Card>
                  <CardBody>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>
                        • Fixed dimensions (206x185px) to match design
                        specifications
                      </li>
                      <li>
                        • Displays maximum of 2 allergies in the main view
                      </li>
                      <li>
                        • Automatically calculates remaining count for "See X
                        More" link
                      </li>
                      <li>• Uses Avenir font family to match design system</li>
                      <li>
                        • Red color (#FF5757) for allergy text to indicate
                        urgency
                      </li>
                      <li>
                        • Blue action link (#1C376F) with hover animations
                      </li>
                    </ul>
                  </CardBody>
                </Card>
              </div>
            </div>
          </AccordionItem>

          {/* Getting Started Accordion */}
          <AccordionItem
            key="getting-started"
            aria-label="Getting Started"
            title={
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Getting Started
                  </h2>
                  <p className="text-sm text-gray-600">
                    Installation and setup guide for using these components
                  </p>
                </div>
              </div>
            }
            className="bg-white shadow-sm rounded-lg"
          >
            <div className="space-y-6 p-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Installation
                </h3>
                <Card>
                  <CardBody>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      {`# Install required dependencies
pnpm add recharts @heroui/react lucide-react

# For development
pnpm add -D @types/react @types/node`}
                    </pre>
                  </CardBody>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Project Structure
                </h3>
                <Card>
                  <CardBody>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      {`components/
├── charts/
│   ├── WeightTrackingChart.tsx
│   └── index.ts
├── cards/
│   ├── SymptomsTrackerCard.tsx
│   └── index.ts
└── ...`}
                    </pre>
                  </CardBody>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Basic Setup
                </h3>
                <Card>
                  <CardBody>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      {`// Import components in your app
import { WeightTrackingChart } from "@/components/charts";
import { SymptomsTrackerCard } from "@/components/cards";

// Use in your components
export function Dashboard() {
  return (
    <div className="grid gap-6">
      <WeightTrackingChart />
      <SymptomsTrackerCard />
    </div>
  );
}`}
                    </pre>
                  </CardBody>
                </Card>
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
