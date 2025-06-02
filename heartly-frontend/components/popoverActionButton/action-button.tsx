"use client";

import type React from "react";

import { Portal } from "@/components/Portal";
import { cn } from "@/shared/lib/utils";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@heroui/react";

interface ActionButtonProps {
  onPress?: () => void;
  className?: string;
  icon?: ReactNode;
  children?: ReactNode;
  as?: React.ElementType;
}

export function ActionButton({
  onPress,
  className,
  icon = <Plus className="h-5 w-5" />,
  children,
  as: Component = Button,
  ...props
}: ActionButtonProps & React.ComponentPropsWithoutRef<typeof Button>) {
  return (
    <Portal>
      <div className="fixed bottom-6 right-6 z-50">
        <Component
          onPress={onPress}
          size="lg"
          isIconOnly
          className={cn("h-14 w-14 rounded-full shadow-lg", className)}
          {...props}
        >
          {icon}
          {children && <span className="sr-only">{children}</span>}
        </Component>
      </div>
    </Portal>
  );
}
