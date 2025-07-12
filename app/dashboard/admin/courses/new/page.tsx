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
import { createCourse } from "../actions";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
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

function resetForm(formRef: React.RefObject<HTMLFormElement | null>) {
  if (formRef.current) {
    formRef.current.reset();
  }
}

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

export default function CreateCoursePage() {
  const courseFormRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const supabase = createClient();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadedImageUrl(null);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      toast.error("Please select an image file to upload.");
      return;
    }

    setImageUploadLoading(true);
    try {
      const fileExtension = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExtension}`;
      const filePath = `course_images/${fileName}`;

      const { error } = await supabase.storage
        .from("course-images")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from("course-images")
        .getPublicUrl(filePath);

      if (publicUrlData) {
        setUploadedImageUrl(publicUrlData.publicUrl);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Failed to get public URL for the uploaded image.");
      }
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred during image upload.";
      toast.error(`Image upload failed: ${errorMessage}`);
      setUploadedImageUrl(null);
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleCreateCourse = async (formData: FormData) => {
    setLoading(true);

    if (uploadedImageUrl) {
      formData.append("image_url", uploadedImageUrl);
    } else {
      formData.append("image_url", "");
    }

    formData.append("icon_name", selectedIcon);

    const result = await createCourse(formData);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      resetForm(courseFormRef);
      setSelectedFile(null);
      setUploadedImageUrl(null);
      setSelectedIcon("");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center text-gray-900">
          Create New Course
        </h1>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Course Details</CardTitle>
            <CardDescription>
              Fill in the details for the new medical training course.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              ref={courseFormRef}
              action={handleCreateCourse}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseTitle">Course Title</Label>
                  <Input id="courseTitle" name="title" required />
                </div>
                <div>
                  <Label htmlFor="courseDescription">Short Description</Label>
                  <Input id="courseDescription" name="description" required />
                </div>
              </div>
              <div>
                <Label htmlFor="courseLongDescription">Long Description</Label>
                <Textarea
                  id="courseLongDescription"
                  name="long_description"
                  rows={4}
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="durationWeeks">Duration (Weeks)</Label>
                  <Input
                    id="durationWeeks"
                    name="duration_weeks"
                    type="number"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="courseLevel">Level</Label>
                  <Select name="level" required>
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
                  <Label htmlFor="priceString">Price (e.g., 45000)</Label>
                  <Input
                    id="priceString"
                    name="price_string"
                    type="number"
                    placeholder="Enter price in KSh"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="courseCode">Course Code</Label>
                  <Input
                    id="courseCode"
                    name="code"
                    required
                    placeholder="e.g., HCA001"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="imageUpload">Course Image (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-grow"
                    disabled={imageUploadLoading}
                  />
                  <Button
                    type="button"
                    onClick={handleUploadImage}
                    disabled={!selectedFile || imageUploadLoading}
                    className="shrink-0"
                  >
                    {imageUploadLoading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
                {uploadedImageUrl && (
                  <p className="text-sm text-green-600 mt-2">
                    Image ready:{" "}
                    <a
                      href={uploadedImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline truncate"
                    >
                      {uploadedImageUrl}
                    </a>
                  </p>
                )}
                <input
                  type="hidden"
                  name="image_url"
                  value={uploadedImageUrl || ""}
                />
              </div>
              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  name="features"
                  placeholder="e.g., Patient Care, Medical Records"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="iconName">Icon Name (Lucide)</Label>
                  <Select
                    name="icon_name"
                    value={selectedIcon}
                    onValueChange={setSelectedIcon}
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
                />
                <Label htmlFor="isFeatured">Featured on Homepage</Label>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || imageUploadLoading}
              >
                {loading ? "Creating Course..." : "Create Course"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
