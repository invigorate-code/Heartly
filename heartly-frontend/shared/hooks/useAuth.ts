"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@/utils/supabase/client.ts";

const useAuth = () => {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router, supabase]);
};

export default useAuth;
