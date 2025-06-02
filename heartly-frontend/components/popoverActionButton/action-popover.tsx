"use client";

import type React from "react";

import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, PopoverContent, PopoverTrigger } from "@heroui/react";
import { Popover } from "@heroui/react";
import { useDrawer } from "@/shared/context/DrawerContext";
import { ActionButton } from "@/components/popoverActionButton/action-button.tsx";
interface PopoverContent {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface ActionPopoverProps {
  icon?: React.ReactNode;
  buttonClassName?: string;
  placement?:
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "right-start"
    | "right-end"
    | "left-start"
    | "left-end";
  backdrop?: "opaque" | "blur" | "transparent";
  isControlled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  popoverContent?: PopoverContent[];
}

export function ActionPopover({
  buttonClassName,
  placement = "top",
  backdrop = "opaque",
  isControlled = false,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
  popoverContent,
}: ActionPopoverProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const { isOpen: isDrawerOpen } = useDrawer();

  useEffect(() => {
    if (isDrawerOpen) {
      setInternalIsOpen(false);
    }
  }, [isDrawerOpen]);

  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const onOpenChange = isControlled
    ? controlledOnOpenChange
    : setInternalIsOpen;

  return (
    <Popover
      placement={placement}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop={backdrop}
      classNames={{
        content: "bg-transparent shadow-none",
      }}
    >
      <PopoverTrigger>
        <ActionButton
          icon={
            isOpen ? (
              <X strokeWidth={3.5} size={35} className="text-white" />
            ) : (
              <Plus strokeWidth={3.5} size={35} className="text-white" />
            )
          }
          className={`${buttonClassName} ${isOpen ? "bg-red-500 hover:bg-red-600" : "bg-[#6F7FD2]"}`}
          as={Button}
        />
      </PopoverTrigger>

      <PopoverContent>
        <div className="flex flex-col items-center gap-1 py-2">
          {popoverContent &&
            popoverContent.map((content) => (
              <Button
                radius="full"
                color="secondary"
                variant="bordered"
                className="bg-white w-full justify-between"
                onPress={content.onClick}
                key={content.title}
              >
                <p className="text-small font-bold">{content.title}</p>
                {content.icon}
              </Button>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
