"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { WeatherReportData, initialWeatherData } from "@/lib/types";
import WeatherForm from "@/components/WeatherForm";
import A4Preview from "@/components/A4Preview";
import ExportActions from "@/components/ExportActions";
import { CloudRain, LogOut, FolderOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [data, setData] = useState<WeatherReportData>(initialWeatherData);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isPending) return;
    
    if (!session?.user) {
      router.push("/login");
    } else {
      const userData = { email: session.user.email, name: session.user.name || "Observer" };
      setUser(userData);
      
      const savedDraft = localStorage.getItem("qam_draft");
      if (savedDraft) {
        try {
          const draftData = JSON.parse(savedDraft);
          setData({ ...draftData, observerName: userData.name });
        } catch (e) {
          setData(prev => ({...prev, observerName: userData.name}));
        }
      } else {
        setData(prev => ({...prev, observerName: userData.name}));
      }
      setIsLoaded(true);
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("qam_draft", JSON.stringify(data));
    }
  }, [data, isLoaded]);

  if (!isMounted || !user) return null; // Avoid hydration mismatch

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-14 border-b bg-background flex items-center justify-between px-4 lg:px-6 shrink-0 relative z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-primary" />
          <h1 className="font-semibold text-lg tracking-tight">QAM Generator</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {session?.user?.role === "admin" && (
            <Button variant="secondary" size="sm" onClick={() => router.push('/users')} className="hidden sm:flex gap-2 text-sm font-bold bg-indigo-900/10 text-indigo-700 hover:bg-indigo-900/20 dark:bg-indigo-400/10 dark:text-indigo-400 dark:hover:bg-indigo-400/20">
              <Users className="w-4 h-4" />
              Kelola Pengguna
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => router.push('/arsip')} className="hidden sm:flex gap-2 text-sm font-bold bg-green-900/10 text-green-700 hover:bg-green-900/20 dark:bg-green-400/10 dark:text-green-400 dark:hover:bg-green-400/20">
            <FolderOpen className="w-4 h-4" />
            Data Arsip
          </Button>
          <ExportActions data={data} printRef={printRef} />
          <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
          <div className="text-sm font-medium hidden sm:block">
            {user.name}
          </div>
          <Button variant="ghost" size="icon" onClick={async () => {
            await authClient.signOut();
            router.push("/login");
          }} title="Logout">
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-muted/30">
        {/* Left Side - Form */}
        <div className="w-full lg:w-[50%] xl:w-[45%] 2xl:w-[40%] flex flex-col border-r bg-background overflow-hidden relative shadow-md z-10">
          <WeatherForm data={data} onChange={setData} />
        </div>

        {/* Right Side - Preview */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto flex justify-center items-start bg-slate-200/50 dark:bg-slate-900/50 perspective-1000">
          <div className="shadow-2xl ring-1 ring-black/5 rounded-sm bg-white print-container transition-transform duration-300">
             <A4Preview data={data} ref={printRef} />
          </div>
        </div>
      </main>
    </div>
  );
}
