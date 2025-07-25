// page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  UserCircle,
  Sparkles,
  Clock,
  DollarSign,
  GraduationCap,
  FileText,
  Tag,
  CalendarCheck,
  Eye,
  Settings,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Globe,
  Briefcase,
} from "lucide-react";

import NextImage from "next/image";

import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

const tiles = [
  {
    title: "My Profile",
    icon: UserCircle,
    href: "/dashboard/student/my-profile",
  },
  {
    title: "Transcript",
    icon: FileText,
    href: "/dashboard/student/transcript",
  },
  { title: "Fee Balance", icon: DollarSign, href: "/dashboard/student/fees" },
  {
    title: "Certificates",
    icon: GraduationCap,
    href: "/dashboard/student/certificates",
  },
  { title: "My Tag", icon: Tag, href: "/dashboard/student/tag" },
  {
    title: "Attendance",
    icon: CalendarCheck,
    href: "/dashboard/student/attendance",
  },
  { title: "Overview", icon: Eye, href: "/dashboard/student/overview" },
  {
    title: "Record Fees",
    icon: DollarSign,
    href: "/dashboard/student/record-fee-payment",
  },
  { title: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function StudentDashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentUser, setCurrentUser] = useState({
    name: "Student User",
    photoURL: "https://placehold.co/48x48/A78BFA/FFFFFF?text=SU",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    location: "",
    username: "",
    website: "",
    role: "",
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    const initSupabaseAndFetchUser = async () => {
      try {
        const supabaseClient = createClient();
        setSupabase(supabaseClient);

        const {
          data: { session },
          error: sessionError,
        } = await supabaseClient.auth.getSession();

        let currentUserId: string | null = null;
        let authUserEmail = "";
        let authUserPhotoURL = "";

        if (sessionError) {
          console.error("Error getting Supabase session:", sessionError);
        }

        if (session?.user) {
          currentUserId = session.user.id;
          authUserEmail = session.user.email || "";
          authUserPhotoURL =
            session.user.user_metadata?.avatar_url ||
            session.user.user_metadata?.picture ||
            "";
        } else {
          currentUserId = crypto.randomUUID();
          console.warn(
            "No active Supabase session found. Using a placeholder user and random ID."
          );
        }

        setUserId(currentUserId);

        if (currentUserId && supabaseClient) {
          const { data, error } = await supabaseClient
            .from("users")
            .select(
              "full_name, avatar_url, email, phone, gender, dob, location, username, website, role"
            )
            .eq("id", currentUserId)
            .single();

          if (error && error.code !== "PGRST116") {
            console.error(
              "Error fetching user from Supabase 'users' table:",
              error
            );
            setCurrentUser({
              name:
                session?.user?.user_metadata?.full_name ||
                session?.user?.email ||
                "Student User",
              photoURL:
                authUserPhotoURL ||
                "https://placehold.co/48x48/A78BFA/FFFFFF?text=SU",
              email: authUserEmail,
              phone: "",
              gender: "",
              dob: "",
              location: "",
              username: "",
              website: "",
              role: "",
            });
          } else if (data) {
            setCurrentUser({
              name:
                data.full_name ||
                session?.user?.user_metadata?.full_name ||
                session?.user?.email ||
                "Student User",
              photoURL:
                data.avatar_url ||
                authUserPhotoURL ||
                "https://placehold.co/48x48/A78BFA/FFFFFF?text=SU",
              email: data.email || authUserEmail || "",
              phone: data.phone || "",
              gender: data.gender || "",
              dob: data.dob || "",
              location: data.location || "",
              username: data.username || "",
              website: data.website || "",
              role: data.role || "",
            });
          } else {
            setCurrentUser({
              name:
                session?.user?.user_metadata?.full_name ||
                session?.user?.email ||
                "Student User",
              photoURL:
                authUserPhotoURL ||
                "https://placehold.co/48x48/A78BFA/FFFFFF?text=SU",
              email: authUserEmail,
              phone: "",
              gender: "",
              dob: "",
              location: "",
              username: "",
              website: "",
              role: "",
            });
          }
        } else {
          setCurrentUser({
            name: "Student User",
            photoURL: "https://placehold.co/48x48/A78BFA/FFFFFF?text=SU",
            email: "",
            phone: "",
            gender: "",
            dob: "",
            location: "",
            username: "",
            website: "",
            role: "",
          });
        }
        setIsAuthReady(true);
      } catch (error) {
        console.error("Error initializing Supabase or fetching user:", error);
        setIsAuthReady(true);
      }
    };

    initSupabaseAndFetchUser();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <Card className="flex-1 bg-gradient-to-br from-green-500/10 to-teal-500/10 backdrop-blur-md border border-green-400/20 shadow-xl rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 z-0 opacity-20">
              <div className="absolute top-0 left-0 w-24 h-24 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-0 left-1/2 w-24 h-24 bg-lime-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            <CardContent className="p-0 relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative flex-shrink-0">
                  {currentUser?.photoURL ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-2xl border-4 border-green-400/50 ring-4 ring-green-300/30 group-hover:ring-green-500/50 transition-all duration-300 ease-in-out">
                      <NextImage
                        src={currentUser.photoURL}
                        alt="User Avatar"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-teal-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-green-400/50 ring-4 ring-green-300/30 group-hover:ring-green-500/50 transition-all duration-300 ease-in-out">
                      <UserCircle className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 block w-5 h-5 bg-green-500 rounded-full ring-2 ring-white animate-pulse"></span>
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-green-700 to-teal-600 bg-clip-text text-transparent leading-tight">
                    Student Dashboard
                  </h1>
                  <p className="text-lg text-gray-700 dark:text-gray-200 flex items-center gap-2 mt-2">
                    <Sparkles className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">
                      Welcome, {currentUser?.name || "Student User"}!
                    </span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mt-4 text-gray-600 dark:text-gray-300 text-sm">
                    {currentUser?.email && (
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{currentUser.email}</span>
                      </p>
                    )}
                    {currentUser?.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{currentUser.phone}</span>
                      </p>
                    )}
                    {currentUser?.role && (
                      <p className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{currentUser.role}</span>
                      </p>
                    )}
                    {currentUser?.gender && (
                      <p className="flex items-center gap-2">
                        <User className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{currentUser.gender}</span>
                      </p>
                    )}
                    {currentUser?.dob && (
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{currentUser.dob}</span>
                      </p>
                    )}
                    {currentUser?.location && (
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{currentUser.location}</span>
                      </p>
                    )}
                    {currentUser?.username && (
                      <p className="flex items-center gap-2">
                        <User className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{currentUser.username}</span>
                      </p>
                    )}
                    {currentUser?.website && (
                      <p className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <a
                          href={currentUser.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-green-600"
                        >
                          {currentUser.website.replace(
                            /^(https?:\/\/)?(www\.)?/,
                            ""
                          )}
                        </a>
                      </p>
                    )}
                    {userId && (
                      <p className="flex items-center gap-2 col-span-full text-xs text-gray-500">
                        <span className="font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                          ID: {userId}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 lg:mt-0 lg:ml-8 flex-shrink-0">
            <Card className="bg-gradient-to-br from-white/80 to-gray-50/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 shadow-lg flex items-center justify-center h-full min-w-[180px]">
              <CardContent className="p-0 text-center">
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Current Time
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                      {currentTime.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiles.map((tile) => {
              const IconComponent = tile.icon;
              return (
                <Link
                  key={tile.href}
                  href={tile.href}
                  className="group block p-6 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-sm hover:shadow-md hover:border-green-500 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className="w-7 h-7 text-green-500 group-hover:text-green-600 transition-colors" />
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition" />
                  </div>
                  <h3 className="text-base font-medium text-gray-800 dark:text-white">
                    {tile.title}
                  </h3>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            📊 Academic Snapshot
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Current GPA", value: "-", color: "blue" },
              { label: "Completed Units", value: "12", color: "green" },
              { label: "Outstanding Fees", value: "-", color: "red" },
              { label: "Attendance", value: "94%", color: "gray" },
            ].map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg bg-${item.color}-100 dark:bg-${item.color}-900 text-${item.color}-800 dark:text-white`}
              >
                <p className="text-sm">{item.label}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
