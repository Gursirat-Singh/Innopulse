import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { initiativesData, type Initiative } from '@/lib/initiatives-data'
import { InitiativeDetailsClient } from '../InitiativeDetailsClient'

// Server Component for metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const initiative = initiativesData.find(init => init.id === resolvedParams.id)

  if (!initiative) {
    return {
      title: 'Initiative Not Found | Innoscope'
    }
  }

  return {
    title: `${initiative.name} | Innoscope`,
    description: initiative.description
  }
}

// Server Component for static generation
export async function generateStaticParams() {
  return initiativesData.map((initiative) => ({
    id: initiative.id,
  }))
}

// Main Server Component
export default async function InitiativeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const initiative = initiativesData.find(init => init.id === resolvedParams.id)

  if (!initiative) {
    notFound()
  }

  return <InitiativeDetailsClient initiative={initiative} />
}
