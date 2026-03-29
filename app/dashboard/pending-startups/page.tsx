"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Search,
  Plus,
  Download,
  Upload,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckSquare,
  Square,
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  UserCheck,
  UserX,
  Clock,
  Filter,
  Target,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getPendingStartups, approveStartup, rejectStartup, deleteStartup } from "@/lib/services/startup.services";
import { useAuth } from "@/lib/auth-context";
import { Dialog } from "@/components/ui/dialog";

// Strict schema adherence - using only defined fields
interface Startup {
  _id: string;
  name: string;
  sector: string;
  city: string;
  stage: "Ideation" | "Seed" | "Series A" | "Series B" | "Growth";
  funding: number;
  employees: number;
  revenueRange: string;
  website?: string;
  email?: string;
  phone?: string;
  status: "pending" | "approved" | "rejected";
  createdBy: string | { _id: string; email: string; name?: string };
  approvedBy?: string | { _id: string; email: string; name?: string };
  createdAt: string;
  updatedAt: string;
}

type SortField = "name" | "funding" | "employees" | "createdAt";
type SortDirection = "asc" | "desc";

export default function PendingStartupsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Redirect non-admin users
  if (!isLoading && !isAdmin) {
    router.push('/dashboard');
    return null;
  }

  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<{ type: 'individual' | 'bulk', id?: string } | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const loadStartups = async () => {
      try {
        setLoading(true);
        const data = await getPendingStartups();
        setStartups(data);
      } catch (error) {
        console.error("Failed to load pending startups:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStartups();
  }, []);

  // Filter options computed from data
  const sectors = useMemo(() => {
    const uniqueSectors = Array.from(new Set(startups.map((s) => s.sector)));
    return ["All", ...uniqueSectors.sort()];
  }, [startups]);

  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(startups.map((s) => s.city)));
    return ["All", ...uniqueCities.sort()];
  }, [startups]);

  const stages: (Startup["stage"] | "All")[] = [
    "All",
    "Ideation",
    "Seed",
    "Series A",
    "Series B",
    "Growth",
  ];

  // Filtered and sorted data
  const filteredAndSortedStartups = useMemo(() => {
    let filtered = startups.filter((startup) => {
      const matchesSearch =
        searchQuery === "" ||
        startup.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector =
        sectorFilter === "All" || startup.sector === sectorFilter;
      const matchesCity = cityFilter === "All" || startup.city === cityFilter;
      const matchesStage =
        stageFilter === "All" || startup.stage === stageFilter;

      return (
        matchesSearch &&
        matchesSector &&
        matchesCity &&
        matchesStage
      );
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "funding":
          aValue = a.funding;
          bValue = b.funding;
          break;
        case "employees":
          aValue = a.employees;
          bValue = b.employees;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [
    startups,
    searchQuery,
    sectorFilter,
    cityFilter,
    stageFilter,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedStartups.length / itemsPerPage);
  const paginatedStartups = filteredAndSortedStartups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Summary stats computed from filtered data
  const summaryStats = useMemo(() => {
    const totalPending = filteredAndSortedStartups.length;
    const totalFunding = filteredAndSortedStartups.reduce(
      (sum, s) => sum + s.funding,
      0
    );

    const sectorCounts = filteredAndSortedStartups.reduce((acc, s) => {
      acc[s.sector] = (acc[s.sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostCommonSector =
      Object.entries(sectorCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "N/A";

    return {
      totalPending,
      totalFunding,
      mostCommonSector,
    };
  }, [filteredAndSortedStartups]);

  // Bulk operations
  const handleSelectAll = () => {
    if (selectedRows.size === paginatedStartups.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedStartups.map((s) => s._id)));
    }
  };

  const handleBulkStatusUpdate = async (newStatus: Startup["status"]) => {
    try {
      if (newStatus === "approved") {
        const promises = Array.from(selectedRows).map(async (startupId) => {
          return approveStartup(startupId);
        });
        await Promise.all(promises);
        // Remove approved startups from the list
        setStartups((prev) =>
          prev.filter((s) => !selectedRows.has(s._id))
        );
        setSelectedRows(new Set());
      } else if (newStatus === "rejected") {
        // Show confirmation dialog for bulk rejection
        setRejectTarget({ type: 'bulk' });
        setShowRejectDialog(true);
      }
    } catch (error) {
      console.error("Failed to update startup statuses:", error);
    }
  };

  const handleIndividualStatusUpdate = async (startupId: string, newStatus: Startup["status"]) => {
    try {
      if (newStatus === "approved") {
        await approveStartup(startupId);
        // Remove the startup from the pending list
        setStartups((prev) =>
          prev.filter((s) => s._id !== startupId)
        );
      } else if (newStatus === "rejected") {
        // Show confirmation dialog for rejection
        setRejectTarget({ type: 'individual', id: startupId });
        setShowRejectDialog(true);
      }
    } catch (error) {
      console.error("Failed to update startup status:", error);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;

    try {
      if (rejectTarget.type === 'individual' && rejectTarget.id) {
        await deleteStartup(rejectTarget.id);
        // Remove the startup from the pending list
        setStartups((prev) =>
          prev.filter((s) => s._id !== rejectTarget.id)
        );
      } else if (rejectTarget.type === 'bulk') {
        const promises = Array.from(selectedRows).map(async (startupId) => {
          return deleteStartup(startupId);
        });
        await Promise.all(promises);
        // Remove rejected startups from the list
        setStartups((prev) =>
          prev.filter((s) => !selectedRows.has(s._id))
        );
        setSelectedRows(new Set());
      }
    } catch (error) {
      console.error("Failed to delete startup:", error);
    } finally {
      setShowRejectDialog(false);
      setRejectTarget(null);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-96 bg-muted animate-pulse rounded"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6">
              <div className="space-y-3">
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-muted animate-pulse rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="h-6 w-20 bg-muted animate-pulse rounded-full"></div>
                <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Pending Startups
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Review and approve startup applications
          </p>
        </div>
      </motion.div>

      {/* Summary Insight Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="glass shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Pending Startups</CardTitle>
                <CardDescription>Awaiting approval</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {summaryStats.totalPending}
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Total Funding</CardTitle>
                <CardDescription>Combined requested</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(summaryStats.totalFunding)}
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Most Common Sector</CardTitle>
                <CardDescription>Highest frequency</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {summaryStats.mostCommonSector}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 shadow-lg border border-border/50"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by startup name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="px-4 py-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 min-w-[140px]"
            >
              <option value="All">All Sectors</option>
              {sectors.slice(1).map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-4 py-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 min-w-[140px]"
            >
              <option value="All">All Cities</option>
              {cities.slice(1).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-4 py-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 min-w-[140px]"
            >
              <option value="All">All Stages</option>
              {stages.slice(1).map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSectorFilter("All");
                setCityFilter("All");
                setStageFilter("All");
                setCurrentPage(1);
              }}
              className="px-6 py-3 glass border-border/50 hover:bg-primary/10 hover:border-primary/60 hover:text-foreground transition-all duration-300"
            >
              <Filter className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Bulk Actions */}
      {selectedRows.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/30 rounded-xl"
        >
          <span className="text-sm font-medium text-foreground">
            {selectedRows.size} startup{selectedRows.size > 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleBulkStatusUpdate("approved")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Approve Selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusUpdate("rejected")}
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              <UserX className="w-4 h-4 mr-2" />
              Reject Selected
            </Button>
          </div>
        </motion.div>
      )}

      {/* Startups Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        {paginatedStartups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-16 text-center shadow-lg border border-border/50"
          >
            <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              No pending startups
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto text-lg">
              All startup applications have been reviewed.
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Showing {paginatedStartups.length} of {filteredAndSortedStartups.length} pending startups
                </span>
                <select
                  value={`${sortField}-${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split("-") as [SortField, SortDirection];
                    setSortField(field);
                    setSortDirection(direction);
                  }}
                  className="px-3 py-2 bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-sm"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="funding-desc">Highest Funding</option>
                  <option value="funding-asc">Lowest Funding</option>
                  <option value="employees-desc">Most Employees</option>
                  <option value="employees-asc">Fewest Employees</option>
                </select>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 perspective-[2000px]"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
            >
              {paginatedStartups.map((startup, index) => (
                <motion.div
                  key={startup._id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05, type: "spring", stiffness: 100 }}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -10, 
                    rotateX: 2, 
                    rotateY: -2,
                    boxShadow: "0 30px 60px -15px rgba(0,0,0,0.3)" 
                  }}
                  className="apple-glass rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-primary/40 transition-all duration-300 group cursor-pointer min-h-[300px] relative overflow-hidden"
                >
                  {/* Glass Glare Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 rounded-2xl" />
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center group-hover:from-orange-30 group-hover:to-orange-30 transition-all duration-300 shadow-lg">
                      <Clock className="w-7 h-7 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-foreground text-xl truncate group-hover:text-orange-600 transition-colors duration-300 mb-1">
                        {startup.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{startup.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Badge className="bg-orange-500/20 text-orange-700 border-orange-500/30">
                      {startup.stage}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-card/30 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-muted-foreground">Funding</span>
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(startup.funding)}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-card/30 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-muted-foreground">Employees</span>
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {startup.employees}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Sector:</span>
                      <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground border-secondary/30">
                        {startup.sector}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Revenue:</span>
                      <span className="text-sm font-medium text-foreground">
                        {startup.revenueRange}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4 text-xs">
                    {startup.website && (
                      <a
                        href={startup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                      >
                        <Globe className="w-3 h-3" />
                        Website
                      </a>
                    )}
                    {startup.email && (
                      <a
                        href={`mailto:${startup.email}`}
                        className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                      >
                        <Mail className="w-3 h-3" />
                        Email
                      </a>
                    )}
                    {startup.phone && (
                      <a
                        href={`tel:${startup.phone}`}
                        className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </a>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(startup.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleIndividualStatusUpdate(startup._id, "approved")}
                        className="bg-green-600 hover:bg-green-700 text-white px-3"
                      >
                        <UserCheck className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleIndividualStatusUpdate(startup._id, "rejected")}
                        className="border-red-500 text-red-600 hover:bg-red-50 px-3"
                      >
                        <UserX className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-center gap-2 pt-6"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="glass border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/60 transition-all duration-300"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNumber > totalPages) return null;
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className={
                          currentPage === pageNumber
                            ? ""
                            : "glass border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/60 transition-all duration-300"
                        }
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="glass border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/60 transition-all duration-300"
                >
                  Next
                </Button>
              </motion.div>
            )}
          </>
        )}
      </motion.div>

      {/* Rejection Confirmation Dialog */}
      <Dialog
        isOpen={showRejectDialog}
        onClose={() => {
          setShowRejectDialog(false);
          setRejectTarget(null);
        }}
        title="Confirm Rejection"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {rejectTarget?.type === 'individual'
              ? "Are you sure you want to reject this startup? This action will permanently delete the startup from the database."
              : `Are you sure you want to reject ${selectedRows.size} selected startup${selectedRows.size > 1 ? 's' : ''}? This action will permanently delete them from the database.`
            }
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectTarget(null);
              }}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectConfirm}
              className="bg-red-600 hover:bg-red-700 text-white px-6"
            >
              Yes, Reject
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
