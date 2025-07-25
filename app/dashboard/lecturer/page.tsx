// page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  UserCircle,
  Sparkles,
  Clock,
  BookOpen,
  FileCheck,
  ClipboardList,
  Megaphone,
  Settings,
  Users,
  CalendarCheck,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Globe,
  Briefcase,
  BarChart3,
  Activity,
  AlertCircle,
} from "lucide-react";

import NextImage from "next/image";

import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

const tiles = [
  { title: "My Courses", icon: BookOpen, href: "/dashboard/lecturer/courses" },
  {
    title: "Manage Assessments",
    icon: FileCheck,
    href: "/dashboard/lecturer/assessments",
  },
  {
    title: "View Grades",
    icon: ClipboardList,
    href: "/dashboard/lecturer/grades",
  },
  {
    title: "Take Attendance",
    icon: CalendarCheck,
    href: "/dashboard/lecturer/attendance",
  },
  {
    title: "Send Announcements",
    icon: Megaphone,
    href: "/dashboard/lecturer/announcements",
  },
  { title: "Settings", icon: Settings, href: "/dashboard/lecturer/settings" },
];

const courseStats = [
  {
    title: "Total Courses",
    value: "5",
    change: "+1",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    trend: "up",
  },
  {
    title: "Active Students",
    value: "180",
    change: "+15",
    icon: Users,
    color: "from-green-500 to-emerald-500",
    trend: "up",
  },
  {
    title: "Pending Grades",
    value: "25",
    change: "-5",
    icon: ClipboardList,
    color: "from-yellow-500 to-orange-500",
    trend: "down",
  },
  {
    title: "Upcoming Assessments",
    value: "3",
    change: "new",
    icon: FileCheck,
    color: "from-purple-500 to-pink-500",
    trend: "up",
  },
];

const recentActivities = [
  {
    title: "Grade posted for Calculus I",
    description: "Grades for Mid-term Exam updated",
    time: "5 minutes ago",
    type: "grade",
    icon: ClipboardList,
  },
  {
    title: "New student enrolled in Biology II",
    description: "Sarah Johnson joined your Biology II class",
    time: "30 minutes ago",
    type: "enrollment",
    icon: Users,
  },
  {
    title: "Announcement sent",
    description: "Reminder about upcoming assignment for Physics I",
    time: "1 hour ago",
    type: "announcement",
    icon: Megaphone,
  },
  {
    title: "Attendance marked for Chemistry Lab",
    description: "Attendance for Monday's lab session finalized",
    time: "3 hours ago",
    type: "attendance",
    icon: CalendarCheck,
  },
];

const pendingTasks = [
  {
    title: "Grade outstanding assignments",
    priority: "high",
    count: 25,
    icon: ClipboardList,
  },
  {
    title: "Review student performance reports",
    priority: "medium",
    count: 5,
    icon: BarChart3,
  },
  {
    title: "Prepare next week's lecture materials",
    priority: "low",
    count: 3,
    icon: BookOpen,
  },
];

export default function LecturerDashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentUser, setCurrentUser] = useState({
    name: "Lecturer User",
    photoURL: "https://placehold.co/48x48/A78BFA/FFFFFF?text=LU",
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
                "Lecturer User",
              photoURL:
                authUserPhotoURL ||
                "https://placehold.co/48x48/A78BFA/FFFFFF?text=LU",
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
                "Lecturer User",
              photoURL:
                data.avatar_url ||
                authUserPhotoURL ||
                "https://placehold.co/48x48/A78BFA/FFFFFF?text=LU",
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
                "Lecturer User",
              photoURL:
                authUserPhotoURL ||
                "https://placehold.co/48x48/A78BFA/FFFFFF?text=LU",
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
            name: "Lecturer User",
            photoURL: "https://placehold.co/48x48/A78BFA/FFFFFF?text=LU",
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
          <Card className="flex-1 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md border border-purple-400/20 shadow-xl rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 z-0 opacity-20">
              <div className="absolute top-0 left-0 w-24 h-24 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-0 left-1/2 w-24 h-24 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            <CardContent className="p-0 relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative flex-shrink-0">
                  {currentUser?.photoURL ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-2xl border-4 border-purple-400/50 ring-4 ring-purple-300/30 group-hover:ring-purple-500/50 transition-all duration-300 ease-in-out">
                      <NextImage
                        src={currentUser.photoURL}
                        alt="User Avatar"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-purple-400/50 ring-4 ring-purple-300/30 group-hover:ring-purple-500/50 transition-all duration-300 ease-in-out">
                      <UserCircle className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 block w-5 h-5 bg-green-500 rounded-full ring-2 ring-white animate-pulse"></span>
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent leading-tight">
                    Lecturer Dashboard
                  </h1>
                  <p className="text-lg text-gray-700 dark:text-gray-200 flex items-center gap-2 mt-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span className="font-semibold">
                      Welcome, {currentUser?.name || "Lecturer User"}!
                    </span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mt-4 text-gray-600 dark:text-gray-300 text-sm">
                    {currentUser?.email && (
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span>{currentUser.email}</span>
                      </p>
                    )}
                    {currentUser?.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span>{currentUser.phone}</span>
                      </p>
                    )}
                    {currentUser?.role && (
                      <p className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span>{currentUser.role}</span>
                      </p>
                    )}
                    {currentUser?.gender && (
                      <p className="flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span>{currentUser.gender}</span>
                      </p>
                    )}
                    {currentUser?.dob && (
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span>{currentUser.dob}</span>
                      </p>
                    )}
                    {currentUser?.location && (
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span>{currentUser.location}</span>
                      </p>
                    )}
                    {currentUser?.username && (
                      <p className="flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span>{currentUser.username}</span>
                      </p>
                    )}
                    {currentUser?.website && (
                      <p className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <a
                          href={currentUser.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-purple-600"
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
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
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
                  className="group block p-6 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-sm hover:shadow-md hover:border-purple-500 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className="w-7 h-7 text-purple-500 group-hover:text-purple-600 transition-colors" />
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition" />
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
            📊 Course Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-xl border-2 border-gray-100/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                          {stat.value}
                        </p>
                        <div className="flex items-center mt-2">
                          {stat.trend && (
                            <ArrowRight
                              className={`w-4 h-4 mr-1 transform ${
                                stat.trend === "up"
                                  ? "rotate-[-45deg] text-green-500"
                                  : stat.trend === "down"
                                  ? "rotate-[45deg] text-red-500"
                                  : "text-gray-500"
                              }`}
                            />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              stat.trend === "up"
                                ? "text-green-600"
                                : stat.trend === "down"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-xl border-2 border-gray-100/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>Recent Activities</span>
                  <Badge variant="secondary" className="ml-auto">
                    Live
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            activity.type === "grade"
                              ? "bg-purple-100 text-purple-600"
                              : activity.type === "enrollment"
                              ? "bg-green-100 text-green-600"
                              : activity.type === "announcement"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-orange-100 text-orange-600"
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-white/80 backdrop-blur-xl border-2 border-gray-100/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span>Pending Tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingTasks.map((task, index) => {
                    const IconComponent = task.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors cursor-pointer"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-600"
                              : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {task.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              variant={
                                task.priority === "high"
                                  ? "destructive"
                                  : task.priority === "medium"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {task.count} items
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
