"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  ToggleLeft,
  ToggleRight,
  Filter,
  ArrowRight,
  Loader2,
  AlertCircle,
  BarChart,
  Target,
  Clock,
  MapPin,
  Stethoscope,
  Hospital,
  Book,
  GraduationCap,
  Heart,
  Pill,
} from "lucide-react"
import Link from "next/link"
import {
  getIntakes,
  deleteIntake,
  toggleIntakeStatus,
  duplicateIntake,
  type IntakeFormData,
} from "./actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mapping for icons used in the preview
const ICON_COMPONENTS: { [key: string]: React.ElementType } = {
  stethoscope: Stethoscope,
  hospital: Hospital,
  book: Book,
  graduation: GraduationCap,
  heart: Heart,
  pill: Pill,
}

export default function IntakesPage() {
  const [intakes, setIntakes] = useState<IntakeFormData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed">("all")
  const [levelFilter, setLevelFilter] = useState<"all" | "Certificate" | "Diploma">("all")
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  useEffect(() => {
    loadIntakes()
  }, [])

  const loadIntakes = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getIntakes()
      setIntakes(data)
    } catch (err) {
      setError("Failed to load intakes.")
      console.error("Failed to load intakes:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setActionLoadingId(id)
    try {
      await deleteIntake(id)
      loadIntakes()
    } catch (err) {
      console.error("Failed to delete intake:", err)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleToggleStatus = async (id: string) => {
    setActionLoadingId(id)
    try {
      await toggleIntakeStatus(id)
      loadIntakes()
    } catch (err) {
      console.error("Failed to toggle status:", err)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDuplicate = async (id: string) => {
    setActionLoadingId(id)
    try {
      await duplicateIntake(id)
      loadIntakes()
    } catch (err) {
      console.error("Failed to duplicate intake:", err)
    } finally {
      setActionLoadingId(null)
    }
  }

  const filteredIntakes = intakes.filter((intake) => {
    const matchesSearch =
      intake.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intake.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intake.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || intake.status === statusFilter
    const matchesLevel = levelFilter === "all" || intake.level === levelFilter

    return matchesSearch && matchesStatus && matchesLevel
  })

  const totalIntakes = intakes.length
  const activeIntakes = intakes.filter((i) => i.status === "active").length
  const closedIntakes = intakes.filter((i) => i.status === "closed").length
  const totalEnrolled = intakes.reduce((sum, i) => sum + i.enrolled_students, 0)
  const totalSpots = intakes.reduce((sum, i) => sum + i.total_spots, 0)

  // Function to render icon based on icon_name
  const renderIcon = (iconName: string | null | undefined) => {
    const IconComponent = iconName ? ICON_COMPONENTS[iconName] : null
    return IconComponent ? (
      <IconComponent className="w-8 h-8 text-white" />
    ) : (
      <GraduationCap className="w-8 h-8 text-white" />
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <header className="relative z-50 bg-gradient-to-r from-blue-600/10 to-cyan-400/10 backdrop-blur-md border-b border-blue-200/30">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/dashboard/admin/intakes" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Intake Manager
                </h1>
                <p className="text-sm text-blue-600 font-medium">Manage all course enrollments</p>
              </div>
            </Link>
            <Link href="/dashboard/admin/intakes/create">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Create Intake
              </Button>
            </Link>
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
          <div className="text-center space-y-6 mb-12">
            <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200/50 px-6 py-3 text-sm font-semibold backdrop-blur-sm shadow-lg">
              <BarChart className="w-4 h-4 mr-2" />
              Overview Dashboard
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
              Comprehensive
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent block animate-gradient">
                Intake Management
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Effortlessly track, organize, and update all your course enrollment periods.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <Card className="bg-white/80 backdrop-blur-xl border-2 border-blue-100/50 shadow-xl rounded-3xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <Target className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <CardTitle className="text-3xl font-bold text-gray-900">{totalIntakes}</CardTitle>
              <CardDescription className="text-gray-600">Total Intakes</CardDescription>
            </Card>
            <Card className="bg-white/80 backdrop-blur-xl border-2 border-green-100/50 shadow-xl rounded-3xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <Clock className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <CardTitle className="text-3xl font-bold text-gray-900">{activeIntakes}</CardTitle>
              <CardDescription className="text-gray-600">Active Intakes</CardDescription>
            </Card>
            <Card className="bg-white/80 backdrop-blur-xl border-2 border-red-100/50 shadow-xl rounded-3xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <Calendar className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <CardTitle className="text-3xl font-bold text-gray-900">{closedIntakes}</CardTitle>
              <CardDescription className="text-gray-600">Closed Intakes</CardDescription>
            </Card>
            <Card className="bg-white/80 backdrop-blur-xl border-2 border-purple-100/50 shadow-xl rounded-3xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <Users className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <CardTitle className="text-3xl font-bold text-gray-900">{totalEnrolled}</CardTitle>
              <CardDescription className="text-gray-600">Enrolled Students</CardDescription>
            </Card>
            <Card className="bg-white/80 backdrop-blur-xl border-2 border-orange-100/50 shadow-xl rounded-3xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <Target className="w-12 h-12 text-orange-500 mx-auto mb-3" />
              <CardTitle className="text-3xl font-bold text-gray-900">{totalSpots}</CardTitle>
              <CardDescription className="text-gray-600">Total Spots Available</CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by course title, label, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "closed")}
                  className="appearance-none pr-10 pl-10 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
                <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value as "all" | "Certificate" | "Diploma")}
                  className="appearance-none pr-10 pl-10 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Levels</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Diploma">Diploma</option>
                </select>
                <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
              </div>
            </div>
            <Button
              onClick={loadIntakes}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent shadow-sm rounded-xl"
            >
              Refresh
            </Button>
          </div>
        </div>
      </section>

      {/* Intakes Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-xl border-2 border-gray-100/50 shadow-xl rounded-3xl overflow-hidden animate-pulse"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                        <div className="space-y-2">
                          <div className="w-24 h-6 bg-gray-200 rounded"></div>
                          <div className="w-20 h-5 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
                      </div>
                    </div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
                  </div>
                  <div className="px-6 pb-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-10 w-full bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={loadIntakes}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              >
                Retry
              </Button>
            </div>
          ) : filteredIntakes.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Intakes Found</h2>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all" || levelFilter !== "all"
                  ? "Your search or filter criteria did not match any intakes."
                  : "Start by creating a new intake to see it here!"}
              </p>
            <Link href="/dashboard/admin/intakes/create">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Intake
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredIntakes.map((intake) => (
                <Card
                  key={intake.id}
                  className="bg-white/80 backdrop-blur-xl border-2 border-gray-100/50 shadow-xl rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${intake.color_gradient_from || '#A0A0A0'}, ${intake.color_gradient_to || '#D0D0D0'})`,
                          }}
                        >
                          {renderIcon(intake.icon_name)}
                        </div>
                        <div className="space-y-1">
                          <CardDescription className="text-sm font-medium text-gray-500">
                            {intake.label}
                          </CardDescription>
                          <CardTitle className="text-xl font-bold text-gray-900">
                            {intake.course_title}
                          </CardTitle>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                              disabled={actionLoadingId === intake.id}
                            >
                              {actionLoadingId === intake.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                <span className="font-bold text-gray-900 mx-1">{intake.label}</span> intake and
                                remove its data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(intake.id!)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => handleToggleStatus(intake.id!)}
                          disabled={actionLoadingId === intake.id}
                        >
                          {actionLoadingId === intake.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : intake.status === "active" ? (
                            <ToggleRight className="w-5 h-5" />
                          ) : (
                            <ToggleLeft className="w-5 h-5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-purple-600 hover:bg-purple-50"
                          onClick={() => handleDuplicate(intake.id!)}
                          disabled={actionLoadingId === intake.id}
                        >
                          {actionLoadingId === intake.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Link href={`/dashboard/admin/intakes/${intake.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-green-600 hover:bg-green-50"
                            disabled={actionLoadingId === intake.id}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <p className="text-gray-700 text-lg font-semibold mb-2">{intake.price_string}</p>
                    <Badge
                      className={`text-sm px-3 py-1 rounded-full ${
                        intake.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {intake.status}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 ml-2">
                      {intake.level}
                    </Badge>
                  </CardContent>
                  <CardContent className="px-6 pb-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Opens: {new Date(intake.opens_on).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Starts: {new Date(intake.start_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{intake.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>
                          {intake.enrolled_students}/{intake.total_spots} Enrolled
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Enrollment Progress</span>
                        <span className="font-semibold">
                          {Math.round((intake.enrolled_students / intake.total_spots) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(intake.enrolled_students / intake.total_spots) * 100}%`,
                            background: `linear-gradient(135deg, ${intake.color_gradient_from || '#A0A0A0'}, ${intake.color_gradient_to || '#D0D0D0'})`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <Link href={`/dashboard/admin/intakes/${intake.id}/edit`}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg py-3 text-base font-semibold rounded-xl">
                        View Details <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
