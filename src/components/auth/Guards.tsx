"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ROUTES } from "@/constants/routeConstants";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authState = useSelector((state: RootState) => state.AuthReducer);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const token = authState.userData?.token;

  useEffect(() => {
    if (!authState.status || !token) {
      router.push(ROUTES.LOGIN);
    } else {
      setIsAuthorized(true);
    }
  }, [authState.status, token, router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#030307] flex flex-col items-center justify-center text-[#f8fafc]">
        <Loader2 className="h-8 w-8 text-cyber-cyan animate-spin mb-2" />
        <p className="text-xs text-zinc-500">Securing session...</p>
      </div>
    );
  }

  return <>{children}</>;
}

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authState = useSelector((state: RootState) => state.AuthReducer);
  const [isGuest, setIsGuest] = useState(false);
  const token = authState.userData?.token;

  useEffect(() => {
    if (authState.status && token) {
      router.push(ROUTES.DASHBOARD);
    } else {
      setIsGuest(true);
    }
  }, [authState.status, token, router]);

  if (!isGuest) {
    return (
      <div className="min-h-screen bg-[#030307] flex flex-col items-center justify-center text-[#f8fafc]">
        <Loader2 className="h-8 w-8 text-cyber-cyan animate-spin mb-2" />
        <p className="text-xs text-zinc-500">Authorizing session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
