// page.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Download,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  type Application,
  fetchApplications,
  bulkUpdateApplications,
} from "./actions";
import { ApplicationCard } from "./application-card";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW"
  >("ALL");
  const [selectedApplications, setSelectedApplications] = useState<string[]>(
    []
  );
  const [isPending, startTransition] = useTransition();

  const loadApplications = async () => {
    setLoading(true);
    const result = await fetchApplications();
    if (result.success && result.data) {
      setApplications(result.data);
      setFilteredApplications(result.data);
    } else {
      console.error("Failed to load applications:", result.message);
      setApplications([]);
      setFilteredApplications([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    let filtered = applications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.phone.includes(searchTerm) ||
          app.id_number.includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (app) => app.application_status === statusFilter
      );
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  const getStatusCounts = () => {
    return {
      total: applications.length,
      pending: applications.filter(
        (app) => app.application_status === "PENDING"
      ).length,
      approved: applications.filter(
        (app) => app.application_status === "APPROVED"
      ).length,
      rejected: applications.filter(
        (app) => app.application_status === "REJECTED"
      ).length,
      underReview: applications.filter(
        (app) => app.application_status === "UNDER_REVIEW"
      ).length,
    };
  };

  const handleBulkAction = (action: string) => {
    if (selectedApplications.length === 0) return;

    startTransition(async () => {
      const formData = new FormData();
      selectedApplications.forEach((id) =>
        formData.append("applicationIds", id)
      );
      formData.append("action", action);

      const result = await bulkUpdateApplications(formData);
      if (result.success) {
        setSelectedApplications([]);
        loadApplications();
      } else {
        console.error("Bulk action failed:", result.message);
      }
    });
  };

  const toggleApplicationSelection = (id: string) => {
    setSelectedApplications((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

  const selectAllApplications = () => {
    if (
      selectedApplications.length === filteredApplications.length &&
      filteredApplications.length > 0
    ) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map((app) => app.id));
    }
  };

  const counts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative"> 
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Application Management
              </h1>
              <p className="text-gray-600 mt-2">
                Review and manage student applications
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={loadApplications}
                variant="outline"
                className="rounded-xl border-2 border-blue-200 hover:bg-blue-50 bg-transparent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-white/80 backdrop-blur-xl border-2 border-blue-100/50 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {counts.total}
                    </p>
                    <p className="text-sm text-gray-600">Total Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-xl border-2 border-yellow-100/50 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {counts.pending}
                    </p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-xl border-2 border-green-100/50 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {counts.approved}
                    </p>
                    <p className="text-sm text-gray-600">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-xl border-2 border-red-100/50 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {counts.rejected}
                    </p>
                    <p className="text-sm text-gray-600">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-xl border-2 border-purple-100/50 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {counts.underReview}
                    </p>
                    <p className="text-sm text-gray-600">Under Review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="bg-white/80 backdrop-blur-xl border-2 border-blue-100/50 rounded-2xl mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search by name, email, phone, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as
                          | "ALL"
                          | "PENDING"
                          | "APPROVED"
                          | "REJECTED"
                          | "UNDER_REVIEW"
                      )
                    }
                    className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-white"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                  </select>
                </div>

                {/* Bulk Actions */}
                {selectedApplications.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {selectedApplications.length} selected
                    </Badge>
                    <Button
                      onClick={() => handleBulkAction("approve")}
                      disabled={isPending}
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve All
                    </Button>
                    <Button
                      onClick={() => handleBulkAction("reject")}
                      disabled={isPending}
                      size="sm"
                      className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject All
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-xl border-2 border-gray-100/50 rounded-2xl">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Applications Found
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== "ALL"
                    ? "Try adjusting your search or filter criteria."
                    : "No applications have been submitted yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Select All Checkbox */}
              <div className="flex items-center space-x-3 px-2">
                <input
                  type="checkbox"
                  checked={
                    selectedApplications.length ===
                      filteredApplications.length &&
                    filteredApplications.length > 0
                  }
                  onChange={selectAllApplications}
                  className="w-5 h-5 text-blue-600 rounded border-2 border-gray-300"
                />
                <label className="text-sm font-medium text-gray-700">
                  Select All ({selectedApplications.length} /{" "}
                  {filteredApplications.length} applications)
                </label>
              </div>

              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-start space-x-4"
                >
                  <input
                    type="checkbox"
                    checked={selectedApplications.includes(application.id)}
                    onChange={() => toggleApplicationSelection(application.id)}
                    className="w-5 h-5 text-blue-600 rounded border-2 border-gray-300 mt-6"
                  />
                  <div className="flex-1">
                    <ApplicationCard
                      application={application}
                      onStatusUpdateAction={loadApplications}
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}