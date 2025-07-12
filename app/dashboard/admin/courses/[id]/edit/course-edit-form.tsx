"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateCourse } from "../../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  UserCheck,
  Activity,
  Utensils,
  Building2,
  Stethoscope,
  Heart,
  Brain,
  Microscope,
  Syringe,
  Ambulance,
  FlaskConical,
  Dna,
  Pill,
  Hospital,
  Shield,
  ClipboardCheck,
  TestTube,
  Thermometer,
  Bone,
  Eye,
  Ear,
  Hand,
  PlusCircle,
  Award,
} from "lucide-react";

import type { CourseData } from "../../actions";

const medicalIcons = [
  { name: "UserCheck", component: UserCheck, label: "Patient Care" },
  { name: "Activity", component: Activity, label: "Activity / Vital Signs" },
  { name: "Utensils", component: Utensils, label: "Nutrition" },
  { name: "Building2", component: Building2, label: "Community Health" },
  { name: "Stethoscope", component: Stethoscope, label: "Medical Diagnosis" },
  { name: "Heart", component: Heart, label: "Cardiology" },
  { name: "Brain", component: Brain, label: "Neurology" },
  { name: "Microscope", component: Microscope, label: "Lab / Research" },
  { name: "Syringe", component: Syringe, label: "Injections / Vaccines" },
  { name: "Ambulance", component: Ambulance, label: "Emergency" },
  {
    name: "FlaskConical",
    component: FlaskConical,
    label: "Chemistry / Pharma",
  },
  { name: "Dna", component: Dna, label: "Genetics" },
  { name: "Pill", component: Pill, label: "Pharmacy" },
  { name: "Hospital", component: Hospital, label: "Hospital / Clinic" },
  { name: "Shield", component: Shield, label: "Protection / Immunity" },
  {
    name: "ClipboardCheck",
    component: ClipboardCheck,
    label: "Records / Checklists",
  },
  { name: "TestTube", component: TestTube, label: "Testing" },
  { name: "Thermometer", component: Thermometer, label: "Temperature" },
  { name: "Bone", component: Bone, label: "Orthopedics" },
  { name: "Eye", component: Eye, label: "Ophthalmology" },
  { name: "Ear", component: Ear, label: "Audiology" },
  { name: "Hand", component: Hand, label: "Therapy / Dexterity" },
  { name: "PlusCircle", component: PlusCircle, label: "First Aid / General" },
  { name: "Award", component: Award, label: "Achievement" },
];

interface CourseEditFormProps {
  initialData: CourseData;
}

export default function CourseEditForm({ initialData }: CourseEditFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState<CourseData>(initialData);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setCourseData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateCourse = async (formData: FormData) => {
    setLoading(true);
    formData.append("id", courseData.id as string);

    const result = await updateCourse(formData);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      router.push("/dashboard/admin/courses");
    } else {
      toast.error(result.message);
    }
  };

  const getFeaturesString = (
    features: string[] | string | null | undefined
  ): string => {
    if (Array.isArray(features)) {
      return features.join(", ");
    }
    if (
      typeof features === "string" &&
      features.startsWith("{") &&
      features.endsWith("}")
    ) {
      return features
        .substring(1, features.length - 1)
        .split(",")
        .map((f) => f.trim())
        .join(", ");
    }
    return features || "";
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Edit Course Details
        </CardTitle>
        <CardDescription>
          Modify the details for the course: {initialData.title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleUpdateCourse} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="courseTitle">Course Title</Label>
              <Input
                id="courseTitle"
                name="title"
                value={courseData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="courseDescription">Short Description</Label>
              <Input
                id="courseDescription"
                name="description"
                value={courseData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="courseLongDescription">Long Description</Label>
            <Textarea
              id="courseLongDescription"
              name="long_description"
              rows={4}
              className="min-h-[80px]"
              value={courseData.long_description || ""}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="durationWeeks">Duration (Weeks)</Label>
              <Input
                id="durationWeeks"
                name="duration_weeks"
                type="number"
                value={courseData.duration_weeks}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="courseLevel">Level</Label>
              <Select
                name="level"
                value={courseData.level}
                onValueChange={(value) => handleSelectChange(value, "level")}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                  <SelectItem value="Degree">Degree</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priceString">Price (e.g., KSh 45,000)</Label>
              <Input
                id="priceString"
                name="price_string"
                value={courseData.price_string || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="courseCode">Course Code</Label>
              <Input
                id="courseCode"
                name="code"
                value={courseData.code || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="image_url"
              type="url"
              value={courseData.image_url || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Input
              id="features"
              name="features"
              placeholder="e.g., Patient Care, Medical Records"
              value={getFeaturesString(courseData.features)}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="iconName">Icon Name (Lucide)</Label>
              <Select
                name="icon_name"
                value={courseData.icon_name || ""}
                onValueChange={(value) =>
                  handleSelectChange(value, "icon_name")
                }
              >
                <SelectTrigger id="iconName">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {medicalIcons.map((icon) => {
                    const IconComponent = icon.component;
                    return (
                      <SelectItem key={icon.name} value={icon.name}>
                        <div className="flex items-center">
                          <IconComponent className="h-4 w-4 mr-2" />
                          <span>
                            {icon.label} ({icon.name})
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              id="isFeatured"
              name="is_featured"
              type="checkbox"
              className="w-4 h-4"
              checked={courseData.is_featured}
              onChange={handleChange}
            />
            <Label htmlFor="isFeatured">Featured on Homepage</Label>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating Course..." : "Update Course"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
