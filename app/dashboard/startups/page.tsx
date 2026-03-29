"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { formatIndianCurrency } from "@/lib/utils";
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
  Bookmark,
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
import { Dialog } from "@/components/ui/dialog";
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
import { getApprovedStartups } from "@/lib/services/startup.services";
import { useAuth } from "@/lib/auth-context";

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadgeVariant = (status: Startup["status"]) => {
  switch (status) {
    case "approved":
      return "default";
    case "pending":
      return "secondary";
    case "rejected":
      return "destructive";
    default:
      return "secondary";
  }
};

const getStatusIcon = (status: Startup["status"]) => {
  switch (status) {
    case "approved":
      return <UserCheck className="w-3 h-3" />;
    case "pending":
      return <Clock className="w-3 h-3" />;
    case "rejected":
      return <UserX className="w-3 h-3" />;
    default:
      return <Clock className="w-3 h-3" />;
  }
};

const getStageColor = (stage: Startup["stage"]) => {
  switch (stage) {
    case "Ideation":
      return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    case "Seed":
      return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    case "Series A":
      return "bg-green-500/20 text-green-700 border-green-500/30";
    case "Series B":
      return "bg-purple-500/20 text-purple-700 border-purple-500/30";
    case "Growth":
      return "bg-orange-500/20 text-orange-700 border-orange-500/30";
    default:
      return "bg-gray-500/20 text-gray-700 border-gray-500/30";
  }
};

export default function StartupsPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const isAdmin = user?.role === "admin";
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [watchlistLoading, setWatchlistLoading] = useState<Set<string>>(new Set());
  const [startupToRemove, setStartupToRemove] = useState<string | null>(null);
  const [localWatchlist, setLocalWatchlist] = useState<string[]>([]);

  useEffect(() => {
    if (user?.watchlist) {
      setLocalWatchlist(user.watchlist);
    }
  }, [user?.watchlist]);

  const itemsPerPage = 9;

  const handleToggleWatchlist = async (e: React.MouseEvent, startupId: string) => {
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }

    const isBookmarked = localWatchlist.includes(startupId);

    if (isBookmarked) {
      setStartupToRemove(startupId);
      return;
    }

    // Add to watchlist optimistically
    try {
      setWatchlistLoading(prev => new Set(prev).add(startupId));
      setLocalWatchlist(prev => [...prev, startupId]);
      
      const token = localStorage.getItem("token");
      
      const res = await fetch(`/api/watchlist/${startupId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await refreshUser();
      } else {
        // Revert on error
        setLocalWatchlist(prev => prev.filter(id => id !== startupId));
      }
    } catch (error) {
      console.error("Failed to update watchlist", error);
      setLocalWatchlist(prev => prev.filter(id => id !== startupId));
    } finally {
      setWatchlistLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(startupId);
        return newSet;
      });
    }
  };

  const confirmRemoveWatchlist = async () => {
    if (!startupToRemove) return;
    
    const targetId = startupToRemove;
    setStartupToRemove(null);
    
    // Optimistically remove
    setLocalWatchlist(prev => prev.filter(id => id !== targetId));
    
    try {
      setWatchlistLoading(prev => new Set(prev).add(targetId));
      const token = localStorage.getItem("token");
      
      const res = await fetch(`/api/watchlist/${targetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        await refreshUser();
      } else {
        // Revert on error
        setLocalWatchlist(prev => [...prev, targetId]);
      }
    } catch (error) {
      console.error("Failed to remove from watchlist", error);
      setLocalWatchlist(prev => [...prev, targetId]);
    } finally {
      setWatchlistLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(targetId);
        return newSet;
      });
    }
  };

  const loadStartups = async () => {
    try {
      setLoading(true);
      // Only approved startups should be shown to all users
      const data = await getApprovedStartups();
      setStartups(data);
    } catch (error) {
      console.error("Failed to load startups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStartups();
  }, [isAdmin]);


  // Initialize sector filter from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sectorParam = urlParams.get("sector");
    if (sectorParam) {
      setSectorFilter(sectorParam);
    }
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
  const statuses: (Startup["status"] | "All")[] = [
    "All",
    "pending",
    "approved",
    "rejected",
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

      return matchesSearch && matchesSector && matchesCity && matchesStage;
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
    const totalStartups = filteredAndSortedStartups.length;
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

    const stageCounts = filteredAndSortedStartups.reduce((acc, s) => {
      acc[s.stage] = (acc[s.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostCommonStage =
      Object.entries(stageCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "N/A";

    return {
      totalStartups,
      totalFunding,
      mostCommonSector,
      mostCommonStage,
    };
  }, [filteredAndSortedStartups]);

  const handleExportCSV = () => {
    const csvData = filteredAndSortedStartups.map((s) => ({
      Name: s.name,
      Sector: s.sector,
      City: s.city,
      Stage: s.stage,
      Funding: formatIndianCurrency(s.funding),
      Employees: s.employees,
      "Revenue Range": s.revenueRange,
      Website: s.website || "",
      Email: s.email || "",
      Phone: s.phone || "",
      Status: s.status,
      "Created At": formatDate(s.createdAt),
      "Created By": s.createdBy,
      "Approved By": s.approvedBy || "",
    }));

    // Simple CSV export (in real app, use a proper CSV library)
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        headers
          .map((header) => `"${row[header as keyof typeof row]}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `startups-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-96 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-muted animate-pulse rounded"></div>
            <div className="h-10 w-24 bg-muted animate-pulse rounded"></div>
            <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
          </div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6">
              <div className="space-y-3">
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Table skeleton */}
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
            Startups
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Browse registered startups across sectors, cities, and stages
          </p>
        </div>

        {/* Add Startup button and Refresh button for admins */}
        <div className="flex gap-3">
          <Button
            onClick={() => router.push("/dashboard/add-startup")}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Startup
          </Button>
          {isAdmin && (
            <Button
              onClick={loadStartups}
              variant="outline"
              className="glass border-border/50 hover:bg-primary/10 hover:border-primary/60 hover:text-foreground transition-all duration-300"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </Button>
          )}
        </div>
      </motion.div>

      {/* Summary Insight Cards - Computed from filtered data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="glass shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Total Startups</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {summaryStats.totalStartups}
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
                <CardDescription>Combined raised</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatIndianCurrency(summaryStats.totalFunding)}
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

        <Card className="glass shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Most Common Stage</CardTitle>
                <CardDescription>Highest frequency</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {summaryStats.mostCommonStage}
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
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by startup name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
            />
          </div>

          {/* Filter dropdowns */}
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
          </div>
        </div>
      </motion.div>

      {/* Startups Grid - Card Based Layout */}
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
              No startups found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto text-lg">
              {startups.length === 0
                ? "No startups have been added to the platform yet."
                : "Try adjusting your search or filter criteria to find what you're looking for."}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Sort Controls */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Showing {paginatedStartups.length} of{" "}
                  {filteredAndSortedStartups.length} startups
                </span>
                <select
                  value={`${sortField}-${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split("-") as [
                      SortField,
                      SortDirection
                    ];
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

            {/* Startups Cards Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 perspective-[2000px]"
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
                  onClick={() =>
                    router.push(`/dashboard/startups/${startup._id}`)
                  }
                >
                  {/* Glass Glare Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 rounded-2xl" />

                  {/* Header Section */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 shadow-lg">
                      <Building2 className="w-7 h-7 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-foreground text-xl truncate group-hover:text-primary transition-colors duration-300 mb-1">
                        {startup.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{startup.city}</span>
                      </div>
                    </div>
                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => handleToggleWatchlist(e, startup._id)}
                      disabled={watchlistLoading.has(startup._id)}
                      className={`relative z-10 p-2.5 rounded-full transition-all duration-300 shadow-sm disabled:opacity-50 ${
                        localWatchlist.includes(startup._id) 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110 border border-primary scale-105" 
                          : "bg-background/80 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-110 border border-border/50"
                      }`}
                      aria-label={localWatchlist.includes(startup._id) ? "Remove Bookmark" : "Add Bookmark"}
                    >
                      <Bookmark className={`w-4 h-4 transition-all duration-300 ${localWatchlist.includes(startup._id) ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Stage Badge */}
                  <div className="mb-4">
                    <Badge className={`${getStageColor(startup.stage)} border`}>
                      {startup.stage}
                    </Badge>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-card/30 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-muted-foreground">
                          Funding
                        </span>
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {formatIndianCurrency(startup.funding)}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-card/30 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-muted-foreground">
                          Employees
                        </span>
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {startup.employees}
                      </div>
                    </div>
                  </div>

                  {/* Sector and Revenue */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Sector:
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-secondary/20 text-secondary-foreground border-secondary/30 dark:bg-white/10 dark:text-white dark:border-white/20"
                      >
                        {startup.sector}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Revenue:
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {startup.revenueRange}
                      </span>
                    </div>
                  </div>

                  {/* Contact Links */}
                  <div className="flex items-center gap-3 mb-4 text-xs">
                    {startup.website && (
                      <a
                        href={startup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe className="w-3 h-3" />
                        Website
                      </a>
                    )}
                    {startup.email && (
                      <a
                        href={`mailto:${startup.email}`}
                        className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="w-3 h-3" />
                        Email
                      </a>
                    )}
                    {startup.phone && (
                      <a
                        href={`tel:${startup.phone}`}
                        className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </a>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(startup.createdAt)}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="glass border-border/50"
                      >
                        <DropdownMenuItem
                          className="hover:bg-card/50 cursor-pointer"
                          onClick={() =>
                            router.push(`/dashboard/startups/${startup._id}`)
                          }
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
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
                    const pageNumber =
                      Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                      i;
                    if (pageNumber > totalPages) return null;
                    return (
                      <Button
                        key={pageNumber}
                        variant={
                          currentPage === pageNumber ? "default" : "outline"
                        }
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
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
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

      {/* Confirmation Dialog for Watchlist Removal */}
      <Dialog
        isOpen={!!startupToRemove}
        onClose={() => setStartupToRemove(null)}
        title="Remove from Watchlist"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to remove this startup from your watchlist?
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setStartupToRemove(null)}
              disabled={watchlistLoading.size > 0}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRemoveWatchlist}
              disabled={watchlistLoading.size > 0}
            >
              Remove
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
