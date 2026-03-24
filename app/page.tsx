import CampusMap from "@/components/campus-map"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative">
      <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
        <Button variant="ghost" asChild>
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Sign up</Link>
        </Button>
      </div>
      <div className="container mx-auto p-4 pt-16">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Rajalakshmi Engineering College Campus Map</h1>
          <p className="text-muted-foreground">Enable location services to see your current position on campus</p>
        </div>
        <CampusMap />
      </div>
    </main>
  )
}
