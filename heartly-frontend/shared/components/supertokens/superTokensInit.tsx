"use client";
import React, { FC, PropsWithChildren } from "react";
import SuperTokensReact from "supertokens-auth-react";
import { frontendConfig } from "@/app/supertokens/frontend";

if (typeof window !== "undefined") {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  SuperTokensReact.init(frontendConfig());
}

export const SuperTokensInit: FC<PropsWithChildren<{}>> = ({ children }) => {
  return <>{children}</>;
};
