"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  FileText,
  Heart,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageSquare,
} from "lucide-react";
import { type Application, updateApplicationStatus } from "./actions";

interface ApplicationCardProps {
  application: Application;
  onStatusUpdateAction: () => void;
}

export function ApplicationCard({
  application,
  onStatusUpdateAction,
}: ApplicationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const [actionType, setActionType] = useState<string>("");

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "APPROVED":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      case "REJECTED":
        return "bg-gradient-to-r from-red-500 to-rose-500 text-white";
      case "UNDER_REVIEW":
        return "bg-gradient-to-r from-yellow-500 to-amber-500 text-white";
      default:
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-4 h-4" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4" />;
      case "UNDER_REVIEW":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleAction = (action: string) => {
    setActionType(action);
    if (action === "approve" || action === "reject") {
      setShowNotes(true);
    } else {
      performAction(action);
    }
  };

  const performAction = (action: string) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("applicationId", application.id);
      formData.append("action", action);
      formData.append("notes", notes);

      const result = await updateApplicationStatus(formData);

      if (result.success) {
        setShowNotes(false);
        setNotes("");
        onStatusUpdateAction();
      }
    });
  };

  return (
    <Card className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 bg-white/80 backdrop-blur-xl border-2 border-blue-100/50 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border-b border-blue-100/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {application.first_name[0]}
              {application.last_name[0]}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {application.first_name} {application.last_name}
              </h3>
              <p className="text-sm text-gray-600 flex items-center space-x-1">
                <GraduationCap className="w-4 h-4" />
                <span>{application.intake_title}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              className={`${getStatusColor(
                application.application_status
              )} px-3 py-1 rounded-full flex items-center space-x-1`}
            >
              {getStatusIcon(application.application_status)}
              <span>
                {(application.application_status ?? "UNKNOWN").replace(
                  "_",
                  " "
                )}
              </span>
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:bg-blue-50 rounded-xl"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-blue-500" />
            <span>{application.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-green-500" />
            <span>{application.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>
              {new Date(application.submitted_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-6 border-t border-gray-100 pt-6">
            {/* Personal Information */}
            <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-500" />
                <span>Personal Information</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Date of Birth:</strong> {application.date_of_birth}
                </div>
                <div>
                  <strong>Gender:</strong> {application.gender}
                </div>
                <div>
                  <strong>Nationality:</strong> {application.nationality}
                </div>
                <div>
                  <strong>ID Number:</strong> {application.id_number}
                </div>
                <div className="md:col-span-2">
                  <strong>Address:</strong> {application.address},{" "}
                  {application.city}, {application.postal_code}
                </div>
              </div>
            </div>

            {/* Educational Background */}
            <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-purple-500" />
                <span>Educational Background</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>High School:</strong>{" "}
                  {application.high_school_attended}
                </div>
                <div>
                  <strong>Year of Exam:</strong>{" "}
                  {application.year_of_final_exam}
                </div>
                <div>
                  <strong>Grade:</strong> {application.qualifying_grade}
                </div>
                <div>
                  <strong>Additional Qualifications:</strong>{" "}
                  {application.additional_qualifications || "None"}
                </div>
              </div>
            </div>

            {/* Disability Information */}
            {application.has_disability && (
              <div className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Disability Information</span>
                </h4>
                <div className="text-sm space-y-2">
                  <div>
                    <strong>Type:</strong> {application.disability_type}
                  </div>
                  <div>
                    <strong>Details:</strong> {application.disability_details}
                  </div>
                </div>
              </div>
            )}

            {/* Review Notes */}
            {application.notes && (
              <div className="bg-gradient-to-r from-gray-50/50 to-slate-50/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span>Review Notes</span>
                </h4>
                <p className="text-sm text-gray-700">{application.notes}</p>
                {application.reviewed_by && (
                  <p className="text-xs text-gray-500 mt-2">
                    Reviewed by {application.reviewed_by} on{" "}
                    {new Date(application.reviewed_at!).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {application.application_status === "PENDING" && (
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
            {/* Action buttons for pending applications */}
            <Button
              onClick={() => handleAction("approve")}
              disabled={isPending}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl px-6 py-2 flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve</span>
            </Button>
            <Button
              onClick={() => handleAction("reject")}
              disabled={isPending}
              className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl px-6 py-2 flex items-center space-x-2"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </Button>
            <Button
              onClick={() => handleAction("review")}
              disabled={isPending}
              variant="outline"
              className="border-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50 rounded-xl px-6 py-2 flex items-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>Mark for Review</span>
            </Button>
          </div>
        )}

        {/* Notes Input */}
        {showNotes && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Notes (Optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this decision..."
              className="mb-3 rounded-xl"
              rows={3}
            />
            <div className="flex space-x-3">
              <Button
                onClick={() => performAction(actionType)}
                disabled={isPending}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl px-6 py-2"
              >
                {isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <MessageSquare className="w-4 h-4 mr-2" />
                )}
                Confirm {actionType}
              </Button>
              <Button
                onClick={() => setShowNotes(false)}
                variant="outline"
                className="rounded-xl px-6 py-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
