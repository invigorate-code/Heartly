"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type DrawerContextType = {
  isOpen: boolean;
  content: ReactNode | null;
  title: string;
  actionCallback: (() => void) | null;
  openDrawer: (
    content: ReactNode,
    title?: string,
    actionCallback?: () => void
  ) => void;
  closeDrawer: () => void;
  handleAction: () => void;
};

const initialState = {
  isOpen: false,
  content: null,
  title: "Drawer",
  actionCallback: null,
  openDrawer: () => {},
  closeDrawer: () => {},
  handleAction: () => {},
};

const DrawerContext = createContext<DrawerContextType>(initialState);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    isOpen: false,
    content: null as ReactNode | null,
    title: "Drawer",
    actionCallback: null as (() => void) | null,
  });

  const openDrawer = (
    content: ReactNode,
    title = "Drawer",
    actionCallback: (() => void) | null = null
  ) => {
    setState({
      isOpen: true,
      content,
      title,
      actionCallback,
    });
  };

  const closeDrawer = () => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));

    // Clear content after animation completes
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        content: null,
        actionCallback: null,
      }));
    }, 300);
  };

  const handleAction = () => {
    if (state.actionCallback) {
      state.actionCallback();
    }
    closeDrawer();
  };

  const value = {
    ...state,
    openDrawer,
    closeDrawer,
    handleAction,
  };

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
}

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
}
