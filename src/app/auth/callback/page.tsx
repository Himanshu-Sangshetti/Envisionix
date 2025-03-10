"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast"; 

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
      }else if (data?.session) {
        toast.success("Successfully signed in! 🎉"); // ✅ Add success toast here
      }
      router.push("/"); // Redirect to homepage or dashboard
    };

    handleOAuthCallback();
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center text-white">
      Authenticating...
    </div>
  );
}
