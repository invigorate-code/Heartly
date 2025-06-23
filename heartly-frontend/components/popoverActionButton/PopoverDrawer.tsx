"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useDrawer } from "@/shared/context/DrawerContext"; // Assuming you have this component
import { ActionPopover } from "@/components/popoverActionButton/action-popover";

const PopoverDrawer: React.FC = () => {
  const { openDrawer } = useDrawer();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const popoverContent = [
    {
      title: "Upload Documents",
      icon: <Plus className="h-5 w-5" />,
      onClick: () => handleOpenDrawer(),
    },
    {
      title: "Intake Files",
      icon: <Plus className="h-5 w-5" />,
      onClick: () => handleOpenDrawer(),
    },
    {
      title: "Health Documents",
      icon: <Plus className="h-5 w-5" />,
      onClick: () => handleOpenDrawer(),
    },
    {
      title: "Reports Related",
      icon: <Plus className="h-5 w-5" />,
      onClick: () => handleOpenDrawer(),
    },
  ];

  const handleOpenDrawer = () => {
    setIsPopoverOpen(false);
    openDrawer(
      <div className="space-y-4">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet
          hendrerit risus, sed porttitor quam.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet
          hendrerit risus, sed porttitor quam.
        </p>
        <p>
          Magna exercitation reprehenderit magna aute tempor cupidatat consequat
          elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum
          quis. Velit duis sit officia eiusmod Lorem aliqua enim laboris do
          dolor eiusmod. Et mollit incididunt nisi consectetur esse laborum
          eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad
          veniam.
        </p>
      </div>,
      "Example Drawer",
      () => console.log("Action button clicked!"),
    );
  };

  return (
    <ActionPopover
      placement="top-end"
      backdrop="blur"
      isControlled
      isOpen={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
      popoverContent={popoverContent}
    />
  );
};

export default PopoverDrawer;
