import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Component Library - Heartly",
  description: "Reusable UI components for the Heartly healthcare platform",
};

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
