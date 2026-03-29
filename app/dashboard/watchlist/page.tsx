"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatIndianCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import {
  Building2,
  MapPin,
  Bookmark,
  ExternalLink,
  Target,
  BookmarkPlus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

interface Startup {
  _id: string;
  name: string;
  sector: string;
  city: string;
  stage: string;
  status: string;
  createdAt: string;
  website?: string;
  funding?: number;
  employees?: number;
  shortDescription?: string;
}

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

export default function WatchlistPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [watchlistLoading, setWatchlistLoading] = useState<Set<string>>(new Set());
  const [startupToRemove, setStartupToRemove] = useState<string | null>(null);
  const [localWatchlist, setLocalWatchlist] = useState<string[]>(user?.watchlist || []);

  useEffect(() => {
    if (user?.watchlist) {
      setLocalWatchlist(user.watchlist);
    }
  }, [user?.watchlist]);

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/watchlist", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch watchlist");
      const data = await res.json();
      
      const loadedStartups = data.watchlist || [];
      setStartups(loadedStartups);
      
      // Auto-select everything loaded initially since it's the exact Watchlist
      setLocalWatchlist(prev => {
        const ids = new Set(prev);
        loadedStartups.forEach((s: any) => ids.add(s._id));
        return Array.from(ids);
      });
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadWatchlist();
    }
  }, [user]);

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
    setStartups(prev => prev.filter(s => s._id !== targetId));
    
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
        // Revert UI on failure
        setLocalWatchlist(prev => [...prev, targetId]);
        loadWatchlist(); // Reload from DB to fix array
      }
    } catch (error) {
      console.error("Failed to remove from watchlist", error);
      setLocalWatchlist(prev => [...prev, targetId]);
      loadWatchlist();
    } finally {
      setWatchlistLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(targetId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-2">
            My Watchlist
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            Keep track of startups you're interested in covering or investing in.
          </p>
        </div>
      </motion.div>

      {/* Startups Cards Grid */}
      {startups.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <BookmarkPlus className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">Your Watchlist is Empty</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            You haven't bookmarked any startups yet. Explore the directory and click the bookmark icon to save startups here for quick access later.
          </p>
          <Button asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-full px-8 py-6 shadow-lg shadow-primary/25 border-0 text-white font-semibold flex items-center gap-2">
            <Link href="/dashboard/startups">
              Explore Startups
            </Link>
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-[2000px]"
        >
          {startups.map((startup, index) => (
            <motion.div
              layout
              key={startup._id}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
              whileHover={{ 
                scale: 1.03, 
                y: -10, 
                rotateX: 2, 
                rotateY: -2,
                boxShadow: "0 30px 60px -15px rgba(0,0,0,0.3)" 
              }}
              className="apple-glass rounded-2xl p-6 shadow-xl border border-border/50 hover:border-primary/40 group relative overflow-hidden cursor-pointer"
              onClick={() => router.push(`/dashboard/startups/${startup._id}`)}
            >
              {/* Glass Glare Reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 rounded-2xl" />
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
              <div className="mb-6">
                <Badge
                  variant="outline"
                  className={`${getStageColor(startup.stage)} backdrop-blur-sm px-3 py-1 font-medium border rounded-full text-xs shadow-sm`}
                >
                  {startup.stage}
                </Badge>
              </div>

              {/* Description */}
              <div className="mb-6 h-12 overflow-hidden">
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {startup.shortDescription ||
                    "No short description available for this startup."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/40 rounded-xl p-3 border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1 font-medium">
                    Sector
                  </div>
                  <div className="font-semibold text-sm text-foreground truncate flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-primary" />
                    {startup.sector}
                  </div>
                </div>
                <div className="bg-background/40 rounded-xl p-3 border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1 font-medium">
                    Funding
                  </div>
                  <div className="font-semibold text-sm text-foreground truncate">
                    {startup.funding
                      ? formatIndianCurrency(startup.funding)
                      : "Undisclosed"}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 flex justify-end">
                <div className="flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                  View Profile <ExternalLink className="ml-2 w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

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
