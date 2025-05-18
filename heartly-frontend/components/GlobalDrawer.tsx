"use client";

import { useDrawer } from "@/shared/context/DrawerContext";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/react";
import { Button } from "@heroui/react";

export function GlobalDrawer() {
  const { isOpen, content, title, closeDrawer, handleAction } = useDrawer();

  if (!isOpen) return null;

  return (
    <Drawer
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onOpenChange={(open) => !open && closeDrawer()}
    >
      <DrawerContent>
        <DrawerHeader>
          <p>{title + 1}</p>
        </DrawerHeader>
        <DrawerBody>
          <div className="px-4 py-2">{content}</div>
        </DrawerBody>
        <DrawerFooter className="flex flex-row justify-between gap-2">
          <Button variant="flat" onPress={closeDrawer}>
            Close
          </Button>
          <Button variant="flat" onPress={handleAction}>
            Action
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
