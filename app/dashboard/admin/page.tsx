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
} from "lucide-react";

// Supabase client import from your utils/supabase/client.ts
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

// Data for system statistics cards
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

// Data for recent activities list
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

// Data for pending tasks list
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30">
        <p className="text-gray-700 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              {/* Conditional rendering for user photo or default icon */}
              {currentUser?.photoURL ? (
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-white">
                  <Image
                    src={currentUser.photoURL}
                    alt="User Avatar"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Admin Control Center
                </h1>
                <p className="text-gray-600 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>Welcome, {currentUser?.name || "Admin User"}!</span>
                </p>
                {currentUser?.email && (
                  <p className="text-sm text-gray-500 mt-1">
                    Email: {currentUser.email}
                  </p>
                )}
                {currentUser?.phone && (
                  <p className="text-sm text-gray-500 mt-1">
                    Phone: {currentUser.phone}
                  </p>
                )}
                {currentUser?.role && (
                  <p className="text-sm text-gray-500 mt-1">
                    Role: {currentUser.role}
                  </p>
                )}
                {currentUser?.gender && (
                  <p className="text-sm text-gray-500 mt-1">
                    Gender: {currentUser.gender}
                  </p>
                )}
                {currentUser?.dob && (
                  <p className="text-sm text-gray-500 mt-1">
                    DOB: {currentUser.dob}
                  </p>
                )}
                {currentUser?.location && (
                  <p className="text-sm text-gray-500 mt-1">
                    Location: {currentUser.location}
                  </p>
                )}
                {currentUser?.username && (
                  <p className="text-sm text-gray-500 mt-1">
                    Username: {currentUser.username}
                  </p>
                )}
                {currentUser?.website && (
                  <p className="text-sm text-gray-500 mt-1">
                    Website: {currentUser.website}
                  </p>
                )}
                {userId && (
                  <p className="text-xs text-gray-500 mt-1">
                    User ID: {userId}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Current Time</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentTime.toLocaleTimeString()}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
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
