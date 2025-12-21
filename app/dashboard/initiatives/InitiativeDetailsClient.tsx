'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Building2,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  Globe,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { type Initiative } from '@/lib/initiatives-data'

interface InitiativeDetailsClientProps {
  initiative: Initiative
}

export function InitiativeDetailsClient({ initiative }: InitiativeDetailsClientProps) {
  const router = useRouter()

  // Helper functions for styling
  const getOwnerColor = (owner: Initiative['owner']) => {
    switch (owner) {
      case 'Government': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
      case 'State': return 'bg-green-500/20 text-green-700 border-green-500/30'
      case 'Private': return 'bg-purple-500/20 text-purple-700 border-purple-500/30'
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    }
  }

  const getTypeColor = (type: Initiative['type']) => {
    switch (type) {
      case 'Policy': return 'bg-orange-500/20 text-orange-700 border-orange-500/30'
      case 'Funding': return 'bg-green-500/20 text-green-700 border-green-500/30'
      case 'Incubation': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
      case 'Infrastructure': return 'bg-purple-500/20 text-purple-700 border-purple-500/30'
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    }
  }

  const getStatusColor = (status: Initiative['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-700 border-green-500/30'
      case 'Inactive': return 'bg-red-500/20 text-red-700 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30'
    }
  }

  const getOwnerIcon = (owner: Initiative['owner']) => {
    switch (owner) {
      case 'Government': return <Building2 className="w-5 h-5" />
      case 'State': return <Target className="w-5 h-5" />
      case 'Private': return <Users className="w-5 h-5" />
      default: return <Building2 className="w-5 h-5" />
    }
  }

  const getStatusIcon = (status: Initiative['status']) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-5 h-5" />
      case 'Inactive': return <Clock className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="glass border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/60 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Initiatives
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {initiative.name}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Launched in {initiative.launchYear}
            </p>
          </div>
        </div>

        {initiative.officialWebsite && (
          <Button
            asChild
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <a
              href={initiative.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Official Website
            </a>
          </Button>
        )}
      </motion.div>

      {/* Key Information Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="apple-glass border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                {getOwnerIcon(initiative.owner)}
              </div>
              <div>
                <CardTitle className="text-lg">Owner</CardTitle>
                <CardDescription>Organization type</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Badge className={`${getOwnerColor(initiative.owner)} border text-base px-3 py-1`}>
              {initiative.owner}
            </Badge>
          </CardContent>
        </Card>

        <Card className="apple-glass border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Type</CardTitle>
                <CardDescription>Program category</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Badge className={`${getTypeColor(initiative.type)} border text-base px-3 py-1`}>
              {initiative.type}
            </Badge>
          </CardContent>
        </Card>

        <Card className="apple-glass border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                {getStatusIcon(initiative.status)}
              </div>
              <div>
                <CardTitle className="text-lg">Status</CardTitle>
                <CardDescription>Current state</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Badge className={`${getStatusColor(initiative.status)} border text-base px-3 py-1`}>
              {initiative.status}
            </Badge>
          </CardContent>
        </Card>

        <Card className="apple-glass border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Launch Year</CardTitle>
                <CardDescription>When it started</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{initiative.launchYear}</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Overview */}
          <Card className="apple-glass border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed text-lg">
                {initiative.description}
              </p>

              {/* Focus Areas */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Key Focus Areas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {initiative.focusAreas.map((area, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-card/30 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground font-medium">{area}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Sectors */}
          <Card className="apple-glass border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Target Sectors</CardTitle>
              <CardDescription>Sectors this initiative supports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {initiative.targetSectors.map((sector, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30 px-4 py-2 text-sm font-medium"
                    >
                      {sector}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Links */}
          {initiative.additionalLinks && initiative.additionalLinks.length > 0 && (
            <Card className="apple-glass border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Additional Resources</CardTitle>
                <CardDescription>Related links and documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {initiative.additionalLinks.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-3 p-4 bg-card/30 rounded-lg hover:bg-card/50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                        <ExternalLink className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground font-medium">{link.name}</p>
                        <p className="text-sm text-muted-foreground">External resource</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Right Column - Summary & Links */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Quick Summary */}
          <Card className="apple-glass border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Quick Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Owner:</span>
                <Badge className={`${getOwnerColor(initiative.owner)} border`}>
                  {initiative.owner}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Type:</span>
                <Badge className={`${getTypeColor(initiative.type)} border`}>
                  {initiative.type}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <Badge className={`${getStatusColor(initiative.status)} border`}>
                  {initiative.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Launched:</span>
                <span className="font-medium">{initiative.launchYear}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sectors:</span>
                <span className="font-medium">{initiative.targetSectors.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Official Links */}
          <Card className="apple-glass border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Official Links</CardTitle>
            </CardHeader>
            <CardContent>
              {initiative.officialWebsite ? (
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <a
                    href={initiative.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Official Website
                  </a>
                </Button>
              ) : (
                <div className="text-center py-4">
                  <Globe className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No official website available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Initiatives */}
          <Card className="apple-glass border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Similar Initiatives</CardTitle>
              <CardDescription>Other programs you might be interested in</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Explore other {initiative.owner.toLowerCase()} {initiative.type.toLowerCase()} initiatives in the main directory.
              </p>
              <Button
                variant="outline"
                className="w-full mt-4 glass border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/60 transition-all duration-300"
                onClick={() => router.push('/dashboard/initiatives')}
              >
                Browse All Initiatives
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
