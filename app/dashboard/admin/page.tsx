// page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  BookOpen,
  FileText,
  Users,
  GraduationCap,
  UserCheck,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  Database,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Globe,
  Briefcase,
  UserCircle,
} from "lucide-react";

import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

const tiles = [
  {
    title: "Approve/Decline Payments",
    href: "/dashboard/admin/payments",
    icon: CreditCard,
    description: "Review and process payment approvals",
    color: "from-emerald-500 to-teal-500",
    bgColor: "from-emerald-50 to-teal-50",
    count: 12,
    urgent: true,
  },
  {
    title: "Manage Intakes",
    href: "/dashboard/admin/intakes",
    icon: BookOpen,
    description: "Create and manage course intakes",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
    count: 8,
    urgent: false,
  },
  {
    title: "Manage Applications",
    href: "/dashboard/admin/applications",
    icon: FileText,
    description: "Review student applications",
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50",
    count: 24,
    urgent: true,
  },
  {
    title: "Unassigned Students",
    href: "/dashboard/admin/assign-student-course/unassigned",
    icon: UserCheck,
    description: "Assign students to courses",
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-50 to-red-50",
    count: 15,
    urgent: true,
  },
  {
    title: "Legacy Students",
    href: "/dashboard/admin/legacy-students",
    icon: GraduationCap,
    description: "Manage old student records",
    color: "from-indigo-500 to-purple-500",
    bgColor: "from-indigo-50 to-purple-50",
    count: 156,
    urgent: false,
  },
  {
    title: "Staff Accounts",
    href: "/dashboard/admin/staff",
    icon: Users,
    description: "Manage staff and permissions",
    color: "from-gray-500 to-slate-500",
    bgColor: "from-gray-50 to-slate-50",
    count: 8,
    urgent: false,
  },
  {
    title: "System Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Configure system preferences",
    color: "from-violet-500 to-purple-500",
    bgColor: "from-violet-50 to-purple-50",
    count: null,
    urgent: false,
  },
];

const systemStats = [
  {
    title: "Total Students",
    value: "1,247",
    change: "+12%",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    trend: "up",
  },
  {
    title: "Active Intakes",
    value: "8",
    change: "+2",
    icon: BookOpen,
    color: "from-green-500 to-emerald-500",
    trend: "up",
  },
  {
    title: "Pending Reviews",
    value: "51",
    change: "-8%",
    icon: Clock,
    color: "from-yellow-500 to-orange-500",
    trend: "down",
  },
  {
    title: "Staff Members",
    value: "24",
    change: "+1",
    icon: Shield,
    color: "from-purple-500 to-pink-500",
    trend: "up",
  },
];

const recentActivities = [
  {
    title: "New application submitted",
    description: "John Mwangi applied for Healthcare Assistant",
    time: "2 minutes ago",
    type: "application",
    icon: FileText,
  },
  {
    title: "Payment approved",
    description: "KSh 45,000 payment approved for Sarah Kimani",
    time: "15 minutes ago",
    type: "payment",
    icon: CheckCircle,
  },
  {
    title: "New intake created",
    description: "JUL-2025 Healthcare Assistant intake opened",
    time: "1 hour ago",
    type: "intake",
    icon: BookOpen,
  },
  {
    title: "Staff account updated",
    description: "Dr. Michael Ochieng permissions modified",
    time: "2 hours ago",
    type: "staff",
    icon: Users,
  },
];

const pendingTasks = [
  {
    title: "Assign students to current intakes",
    priority: "high",
    count: 15,
    icon: UserCheck,
  },
  {
    title: "Review payment approvals",
    priority: "high",
    count: 12,
    icon: CreditCard,
  },
  {
    title: "Update staff account permissions",
    priority: "medium",
    count: 3,
    icon: Users,
  },
  {
    title: "Verify legacy student details",
    priority: "low",
    count: 8,
    icon: GraduationCap,
  },
];

export default function AdminDashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentUser, setCurrentUser] = useState({
    name: "Admin User",
    photoURL: "https://placehold.co/48x48/A78BFA/FFFFFF?text=AU",
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
            "No active Supabase session found. Using a placeholder user and random ID.",
          );
        }

        setUserId(currentUserId);

        if (currentUserId && supabaseClient) {
          const { data, error } = await supabaseClient
            .from("users")
            .select(
              "full_name, avatar_url, email, phone, gender, dob, location, username, website, role",
            )
            .eq("id", currentUserId)
            .single();

          if (error && error.code !== "PGRST116") {
            console.error(
              "Error fetching user from Supabase 'users' table:",
              error,
            );
            setCurrentUser({
              name:
                session?.user?.user_metadata?.full_name ||
                session?.user?.email ||
                "Admin User",
              photoURL:
                authUserPhotoURL ||
                "https://placehold.co/48x48/A78BFA/FFFFFF?text=AU",
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
                "Admin User",
              photoURL:
                data.avatar_url ||
                authUserPhotoURL ||
                "https://placehold.co/48x48/A78BFA/FFFFFF?text=AU",
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
                "Admin User",
              photoURL:
                authUserPhotoURL ||
                "https://placehold.co/48x48/A78BFA/FFFFFF?text=AU",
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
            name: "Admin User",
            photoURL: "https://placehold.co/48x48/A78BFA/FFFFFF?text=AU",
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
        {/* Header Section - Modern Futuristic UI/UX */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <Card className="flex-1 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-md border border-blue-400/20 shadow-xl rounded-2xl p-6 relative overflow-hidden group">
            {/* Background elements for futuristic feel */}
            <div className="absolute inset-0 z-0 opacity-20">
              <div className="absolute top-0 left-0 w-24 h-24 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-0 left-1/2 w-24 h-24 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            <CardContent className="p-0 relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar/Icon Section */}
                <div className="relative flex-shrink-0">
                  {currentUser?.photoURL ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-2xl border-4 border-blue-400/50 ring-4 ring-blue-300/30 group-hover:ring-blue-500/50 transition-all duration-300 ease-in-out">
                      <Image
                        src={currentUser.photoURL}
                        alt="User Avatar"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-blue-400/50 ring-4 ring-blue-300/30 group-hover:ring-blue-500/50 transition-all duration-300 ease-in-out">
                      <UserCircle className="w-10 h-10 text-white" />
                    </div>
                  )}
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 block w-5 h-5 bg-green-500 rounded-full ring-2 ring-white animate-pulse"></span>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent leading-tight">
                    Admin Control Center
                  </h1>
                  <p className="text-lg text-gray-700 dark:text-gray-200 flex items-center gap-2 mt-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold">
                      Welcome, {currentUser?.name || "Admin User"}!
                    </span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mt-4 text-gray-600 dark:text-gray-300 text-sm">
                    {currentUser?.email && (
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>{currentUser.email}</span>
                      </p>
                    )}
                    {currentUser?.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>{currentUser.phone}</span>
                      </p>
                    )}
                    {currentUser?.role && (
                      <p className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>{currentUser.role}</span>
                      </p>
                    )}
                    {currentUser?.gender && (
                      <p className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>{currentUser.gender}</span>
                      </p>
                    )}
                    {currentUser?.dob && (
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>{currentUser.dob}</span>
                      </p>
                    )}
                    {currentUser?.location && (
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>{currentUser.location}</span>
                      </p>
                    )}
                    {currentUser?.username && (
                      <p className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>{currentUser.username}</span>
                      </p>
                    )}
                    {currentUser?.website && (
                      <p className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <a
                          href={currentUser.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-blue-600"
                        >
                          {currentUser.website.replace(
                            /^(https?:\/\/)?(www\.)?/,
                            "",
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

          {/* Current Time Card - Moved to the right for desktop */}
          <div className="mt-6 lg:mt-0 lg:ml-8 flex-shrink-0">
            <Card className="bg-gradient-to-br from-white/80 to-gray-50/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 shadow-lg flex items-center justify-center h-full min-w-[180px]">
              <CardContent className="p-0 text-center">
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
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

        {/* System Statistics */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              System Overview
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemStats.map((stat, index) => {
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
                          <TrendingUp
                            className={`w-4 h-4 mr-1 ${
                              stat.trend === "up"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              stat.trend === "up"
                                ? "text-green-600"
                                : "text-red-600"
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

        {/* Quick Access Grid */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <Zap className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Quick Access</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiles.map((tile) => {
              const IconComponent = tile.icon;
              return (
                <Link key={tile.href} href={tile.href}>
                  <Card className="bg-white/80 backdrop-blur-xl border-2 border-gray-100/50 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tile.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center space-x-2">
                          {tile.count !== null && (
                            <Badge
                              variant={
                                tile.urgent ? "destructive" : "secondary"
                              }
                              className="text-xs"
                            >
                              {tile.count}
                            </Badge>
                          )}
                          {tile.urgent && (
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {tile.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {tile.description}
                      </p>
                      <div className="flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        <span>Access</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
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
                            activity.type === "application"
                              ? "bg-purple-100 text-purple-600"
                              : activity.type === "payment"
                                ? "bg-green-100 text-green-600"
                                : "bg-blue-100 text-blue-600"
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

          {/* Pending Tasks */}
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

        {/* System Health */}
        <section>
          <Card className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">System Status</h3>
                  <p className="text-blue-100">
                    All systems operational and running smoothly
                  </p>
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Database: Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">API: Healthy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Storage: 85% Available</span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Database className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
