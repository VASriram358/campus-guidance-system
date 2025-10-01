import CampusMap from "@/components/campus-map"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Rajalakshmi Engineering College Campus Map</h1>
          <p className="text-muted-foreground">Enable location services to see your current position on campus</p>
        </div>
        <CampusMap />
      </div>
    </main>
  )
}
