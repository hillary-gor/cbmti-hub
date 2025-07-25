"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Users,
  Save,
  ArrowLeft,
  Sparkles,
  Zap,
  Palette,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Hospital,
  Book,
  GraduationCap,
  Heart,
  Pill,
} from "lucide-react";
import Link from "next/link";
import { createIntake, type IntakeFormData } from "../actions";
import { useRouter } from "next/navigation";

const MONTHS = [
  { value: "JAN", label: "January" },
  { value: "FEB", label: "February" },
  { value: "MAR", label: "March" },
  { value: "APR", label: "April" },
  { value: "MAY", label: "May" },
  { value: "JUN", label: "June" },
  { value: "JUL", label: "July" },
  { value: "AUG", label: "August" },
  { value: "SEP", label: "September" },
  { value: "OCT", label: "October" },
  { value: "NOV", label: "November" },
  { value: "DEC", label: "December" },
];

const YEARS = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear() + i;
  return { value: year.toString(), label: year.toString() };
});

const LOCATIONS = [
  "Nairobi CBD",
  "Westlands",
  "Karen",
  "Kiambu",
  "Thika",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Online",
];

const SCHEDULES = [
  "9 AM - 4 PM, Monday - Friday",
  "8 AM - 5 PM, Monday - Friday",
  "6 PM - 9 PM, Monday - Friday (Evening)",
  "9 AM - 1 PM, Saturday - Sunday (Weekend)",
  "Flexible Online Schedule",
  "2 PM - 6 PM, Monday - Friday (Afternoon)",
];

const ICONS = [
  { value: "stethoscope", label: "Stethoscope", icon: "🩺" },
  { value: "hospital", label: "Hospital", icon: "🏥" },
  { value: "book", label: "Book", icon: "📚" },
  { value: "graduation", label: "Graduation", icon: "🎓" },
  { value: "heart", label: "Heart", icon: "❤️" },
  { value: "pill", label: "Medicine", icon: "💊" },
];

const ICON_COMPONENTS: { [key: string]: React.ElementType } = {
  stethoscope: Stethoscope,
  hospital: Hospital,
  book: Book,
  graduation: GraduationCap,
  heart: Heart,
  pill: Pill,
};

const COLOR_GRADIENTS = [
  { from: "#3B82F6", to: "#06B6D4", name: "Blue to Cyan" },
  { from: "#10B981", to: "#34D399", name: "Green to Emerald" },
  { from: "#8B5CF6", to: "#A855F7", name: "Purple to Violet" },
  { from: "#F59E0B", to: "#EF4444", name: "Orange to Red" },
  { from: "#EC4899", to: "#F97316", name: "Pink to Orange" },
  { from: "#6366F1", to: "#8B5CF6", name: "Indigo to Purple" },
];

export default function CreateIntakePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<IntakeFormData>>({
    year: YEARS[0].value,
    month: "",
    label: "",
    status: "active",
    opens_on: "",
    closes_on: "",
    course_title: "",
    start_date: "",
    end_date: "",
    total_spots: 25,
    enrolled_students: 0,
    location: "",
    schedule: "",
    price_string: "",
    level: "Certificate",
    icon_name: "graduation",
    color_gradient_from: COLOR_GRADIENTS[0].from,
    color_gradient_to: COLOR_GRADIENTS[0].to,
    requirements: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (
    field: keyof IntakeFormData,
    value: string | number,
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "total_spots") {
        const parsedValue = Number(value);
        updated.total_spots = isNaN(parsedValue) ? 0 : parsedValue;
      }

      if (field === "year" || field === "month") {
        if (updated.year && updated.month) {
          updated.label = `${updated.month}-${updated.year}`;
        } else {
          updated.label = "";
        }
      }

      return updated;
    });
  };

  const handleColorGradientChange = (gradient: {
    from: string;
    to: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      color_gradient_from: gradient.from,
      color_gradient_to: gradient.to,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Basic validation
    if (
      !formData.year ||
      !formData.month ||
      !formData.course_title ||
      !formData.opens_on ||
      !formData.closes_on ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.location ||
      !formData.schedule ||
      !formData.price_string ||
      formData.total_spots === undefined ||
      formData.total_spots <= 0
    ) {
      setSubmitStatus("error");
      setSubmitMessage(
        "Please fill in all required fields and ensure total spots is positive.",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await createIntake(formData as IntakeFormData);

      if (result.success) {
        setSubmitStatus("success");
        setSubmitMessage(result.message);
        setTimeout(() => {
          router.push("/dashboard/admin/intakes");
        }, 2000);
      } else {
        setSubmitStatus("error");
        setSubmitMessage(result.message);
      }
    } catch (error) {
      console.error("Error creating intake:", error);
      setSubmitStatus("error");
      setSubmitMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  const renderIcon = (iconName: string | null | undefined) => {
    const IconComponent = iconName ? ICON_COMPONENTS[iconName] : null;
    return IconComponent ? (
      <IconComponent className="w-8 h-8 text-white" />
    ) : (
      <GraduationCap className="w-8 h-8 text-white" />
    );
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <header className="relative z-50 bg-gradient-to-r from-blue-600/10 to-cyan-400/10 backdrop-blur-md border-b border-blue-200/30">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link
              href="/dashboard/admin/intakes"
              className="flex items-center space-x-3"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Create New Intake
                </h1>
                <p className="text-sm text-blue-600 font-medium">
                  Define a new course enrollment period
                </p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/admin/intakes">
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Intakes
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6">
            <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200/50 px-6 py-3 text-sm font-semibold backdrop-blur-sm shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              New Intake
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
              Launch Your Next
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent block animate-gradient">
                Course Enrollment
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Fill in the details to create a new intake for your courses.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Information */}
                <Card className="bg-white/80 backdrop-blur-xl border-2 border-blue-100/50 shadow-xl rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <Zap className="w-6 h-6 mr-3 text-blue-500" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      Enter the fundamental details for the new intake
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Year
                        </label>
                        <select
                          value={formData.year}
                          onChange={(e) =>
                            handleInputChange("year", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          {YEARS.map((year) => (
                            <option key={year.value} value={year.value}>
                              {year.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Month
                        </label>
                        <select
                          value={formData.month}
                          onChange={(e) =>
                            handleInputChange("month", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select Month</option>
                          {MONTHS.map((month) => (
                            <option key={month.value} value={month.value}>
                              {month.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            handleInputChange(
                              "status",
                              e.target.value as "active" | "closed",
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Course Title
                      </label>
                      <Input
                        value={formData.course_title}
                        onChange={(e) =>
                          handleInputChange("course_title", e.target.value)
                        }
                        placeholder="e.g., Healthcare Assistant (HCA)"
                        className="border-gray-200 focus:border-blue-500 rounded-2xl py-3"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Level
                        </label>
                        <select
                          value={formData.level}
                          onChange={(e) =>
                            handleInputChange(
                              "level",
                              e.target.value as "Certificate" | "Diploma",
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Certificate">Certificate</option>
                          <option value="Diploma">Diploma</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <Input
                          value={formData.price_string}
                          onChange={(e) =>
                            handleInputChange("price_string", e.target.value)
                          }
                          placeholder="e.g., KSh 45,000"
                          className="border-gray-200 focus:border-blue-500 rounded-2xl py-3"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule & Dates */}
                <Card className="bg-white/80 backdrop-blur-xl border-2 border-green-100/50 shadow-xl rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <Calendar className="w-6 h-6 mr-3 text-green-500" />
                      Schedule & Dates
                    </CardTitle>
                    <CardDescription>
                      Set the intake timeline and course schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Intake Opens On
                        </label>
                        <Input
                          type="date"
                          value={formData.opens_on}
                          onChange={(e) =>
                            handleInputChange("opens_on", e.target.value)
                          }
                          className="border-gray-200 focus:border-green-500 rounded-2xl py-3"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Intake Closes On
                        </label>
                        <Input
                          type="date"
                          value={formData.closes_on}
                          onChange={(e) =>
                            handleInputChange("closes_on", e.target.value)
                          }
                          className="border-gray-200 focus:border-green-500 rounded-2xl py-3"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Course Start Date
                        </label>
                        <Input
                          type="date"
                          value={formData.start_date}
                          onChange={(e) =>
                            handleInputChange("start_date", e.target.value)
                          }
                          className="border-gray-200 focus:border-green-500 rounded-2xl py-3"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Course End Date
                        </label>
                        <Input
                          type="date"
                          value={formData.end_date}
                          onChange={(e) =>
                            handleInputChange("end_date", e.target.value)
                          }
                          className="border-gray-200 focus:border-green-500 rounded-2xl py-3"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Class Schedule
                      </label>
                      <select
                        value={formData.schedule}
                        onChange={(e) =>
                          handleInputChange("schedule", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      >
                        <option value="">Select Schedule</option>
                        {SCHEDULES.map((schedule) => (
                          <option key={schedule} value={schedule}>
                            {schedule}
                          </option>
                        ))}
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Location & Capacity */}
                <Card className="bg-white/80 backdrop-blur-xl border-2 border-purple-100/50 shadow-xl rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <Users className="w-6 h-6 mr-3 text-purple-500" />
                      Location & Capacity
                    </CardTitle>
                    <CardDescription>
                      Define the physical location and enrollment limits
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <select
                          value={formData.location}
                          onChange={(e) =>
                            handleInputChange("location", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        >
                          <option value="">Select Location</option>
                          {LOCATIONS.map((location) => (
                            <option key={location} value={location}>
                              {location}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Total Spots
                        </label>
                        <Input
                          type="number"
                          value={formData.total_spots}
                          onChange={(e) =>
                            handleInputChange("total_spots", e.target.value)
                          }
                          min="1"
                          max="100"
                          className="border-gray-200 focus:border-purple-500 rounded-2xl py-3"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Visual & Additional Info */}
                <Card className="bg-white/80 backdrop-blur-xl border-2 border-orange-100/50 shadow-xl rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <Palette className="w-6 h-6 mr-3 text-orange-500" />
                      Visual & Additional Info
                    </CardTitle>
                    <CardDescription>
                      Customize appearance and add extra details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Icon
                        </label>
                        <select
                          value={formData.icon_name ?? ""}
                          onChange={(e) =>
                            handleInputChange("icon_name", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option value="">No Icon</option>
                          {ICONS.map((icon) => (
                            <option key={icon.value} value={icon.value}>
                              {icon.icon} {icon.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Color Gradient
                        </label>
                        <select
                          value={`${formData.color_gradient_from ?? ""}-${
                            formData.color_gradient_to ?? ""
                          }`}
                          onChange={(e) => {
                            const [from, to] = e.target.value.split("-");
                            handleColorGradientChange({ from, to });
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option value="">No Gradient</option>
                          {COLOR_GRADIENTS.map((gradient) => (
                            <option
                              key={`${gradient.from}-${gradient.to}`}
                              value={`${gradient.from}-${gradient.to}`}
                            >
                              {gradient.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Requirements (Optional)
                      </label>
                      <Textarea
                        value={formData.requirements || ""}
                        onChange={(e) =>
                          handleInputChange("requirements", e.target.value)
                        }
                        placeholder="List the entry requirements for this intake..."
                        className="border-gray-200 focus:border-orange-500 min-h-[100px] rounded-2xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Description (Optional)
                      </label>
                      <Textarea
                        value={formData.description || ""}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Provide a detailed description of this intake..."
                        className="border-gray-200 focus:border-orange-500 min-h-[120px] rounded-2xl"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Preview Card */}
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-xl rounded-3xl sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Intake Preview
                    </CardTitle>
                    <CardDescription>
                      How your new intake will appear to students
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
                        style={{
                          background: `linear-gradient(135deg, ${
                            formData.color_gradient_from || "#A0A0A0"
                          }, ${formData.color_gradient_to || "#D0D0D0"})`,
                        }}
                      >
                        {renderIcon(formData.icon_name)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {formData.course_title || "Course Title"}
                        </h3>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          {formData.level || "Level"}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Label:</span>
                        <span className="font-medium">
                          {formData.label || "Not set"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Opens:</span>
                        <span className="font-medium">
                          {formData.opens_on
                            ? new Date(formData.opens_on).toLocaleDateString()
                            : "Not set"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Starts:</span>
                        <span className="font-medium">
                          {formData.start_date
                            ? new Date(formData.start_date).toLocaleDateString()
                            : "Not set"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-600">Enrollment:</span>
                        <span className="font-medium">
                          {formData.enrolled_students}/
                          {formData.total_spots || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium">
                          {formData.price_string || "Not set"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">
                          {formData.location || "Not set"}
                        </span>
                      </div>
                    </div>

                    <Badge
                      className={`w-full justify-center ${
                        formData.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {formData.status}
                    </Badge>

                    {/* Enrollment Progress - for preview, assuming 0 enrolled for new intake */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Progress:</span>
                        <span className="font-medium">
                          {Math.round(
                            ((formData.enrolled_students || 0) /
                              (formData.total_spots || 1)) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              ((formData.enrolled_students || 0) /
                                (formData.total_spots || 1)) *
                              100
                            }%`,
                            background: `linear-gradient(135deg, ${
                              formData.color_gradient_from || "#A0A0A0"
                            }, ${formData.color_gradient_to || "#D0D0D0"})`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {formData.color_gradient_from &&
                      formData.color_gradient_to && (
                        <div className="space-y-2">
                          <span className="text-sm text-gray-600">
                            Color Preview:
                          </span>
                          <div
                            className="w-full h-8 rounded-xl"
                            style={{
                              background: `linear-gradient(135deg, ${
                                formData.color_gradient_from || "#A0A0A0"
                              }, ${formData.color_gradient_to || "#D0D0D0"})`,
                            }}
                          ></div>
                        </div>
                      )}
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Card className="bg-white/80 backdrop-blur-xl border-2 border-gray-100/50 shadow-xl rounded-3xl">
                  <CardContent className="p-6">
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !formData.course_title ||
                        !formData.month ||
                        !formData.total_spots ||
                        formData.total_spots <= 0
                      }
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 py-6 text-lg font-semibold rounded-2xl"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Creating Intake...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Create Intake
                        </>
                      )}
                    </Button>

                    {submitStatus === "success" && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center text-green-700">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          <span className="text-sm font-medium">
                            {submitMessage}
                          </span>
                        </div>
                      </div>
                    )}

                    {submitStatus === "error" && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center text-red-700">
                          <AlertCircle className="w-5 h-5 mr-2" />
                          <span className="text-sm font-medium">
                            {submitMessage}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
