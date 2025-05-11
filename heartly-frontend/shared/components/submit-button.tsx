"use client";

import { Button } from "@heroui/react";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" color="primary" className="text-white" aria-disabled={pending} {...props}>
      {pending ? pendingText : children}
    </Button>
  );
}
