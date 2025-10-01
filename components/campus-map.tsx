"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Navigation, AlertCircle, Plus, Minus } from "lucide-react"

declare global {
  interface Window {
    google: {
      maps: {
        Map: any
        Marker: any
        Rectangle: any
        Size: any
        MapTypeId: {
          HYBRID: string
        }
      }
    }
    initGoogleMaps: () => void
  }
}

interface Position {
  lat: number
  lng: number
}

export default function CampusMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any | null>(null)
  const userMarkerRef = useRef<any | null>(null)
  const watchIdRef = useRef<number | null>(null)

  const [isLoaded, setIsLoaded] = useState(false)
  const [userPosition, setUserPosition] = useState<Position | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isTracking, setIsTracking] = useState(false)

  const campusCenter = { lat: 13.008963750996669, lng: 80.00365067320756 }

  const campusBounds = {
    north: 13.012,
    south: 13.006,
    east: 80.007,
    west: 80.0,
  }

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsLoaded(true)
        return
      }

      // Get API key from window object to avoid direct env var reference
      const getApiKey = () => {
        const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        return key
      }

      const apiKey = getApiKey()
      if (!apiKey) {
        setLocationError("Google Maps API key not found")
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`
      script.async = true
      script.defer = true
      script.onload = () => setIsLoaded(true)
      script.onerror = () => setLocationError("Failed to load Google Maps")
      document.head.appendChild(script)
    }

    loadGoogleMaps()
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: campusCenter,
      zoom: 16,
      mapTypeId: window.google.maps.MapTypeId.HYBRID,
      restriction: {
        latLngBounds: campusBounds,
        strictBounds: false,
      },
      styles: [
        {
          featureType: "poi.school",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
      ],
    })

    mapInstanceRef.current = map

    // Add campus boundary (optional)
    const campusRectangle = new window.google.maps.Rectangle({
      bounds: campusBounds,
      fillColor: "#4285f4",
      fillOpacity: 0.1,
      strokeColor: "#4285f4",
      strokeOpacity: 0.3,
      strokeWeight: 2,
      map: map,
    })

    const landmarks = [
      { position: { lat: 13.009652, lng: 80.004301 }, title: "Main Administrative Block(A)"},
      { position: { lat: 13.009463, lng: 80.003151 }, title: "Aircraft and Canteen" },
      { position: { lat: 13.008008936724767, lng: 80.00341333955035}, title: "Hut Cafe(enterance)" },
      { position: { lat: 13.007902905627468, lng: 80.00283538203252 }, title: "Aero. & Mech. Block" },
      { position: { lat: 13.009067, lng:  80.003302 }, title: "Electronics & Communication Block" },
      { position: { lat: 13.008021591268783, lng:  80.00312107937762 }, title: "Mechanical Workshop" },
      { position: { lat: 13.008377622618857, lng: 80.00563820570768 }, title: "Auditorium" },
      { position: { lat: 13.007976, lng:  80.004343 }, title: "Squach & Pickleball sports court" },
      { position: { lat: 13.007390682447499, lng:   80.00349520544162 }, title: "New boys hostel" },
      { position: { lat: 13.007486, lng:   80.005511}, title: "Old girls hostel" },
      { position: { lat: 13.007296630190817, lng:   80.00516885607544}, title: "Girls Hostel" },
      { position: { lat: 13.007327990835968, lng:   80.00440174430713}, title: "Old boys hostel" },
      { position: { lat: 13.008937, lng:   80.005640}, title: "Library block" },
      { position: { lat: 13.009570798956707, lng:   80.00509358162904}, title: "Techlounge Block" },
      { position: { lat: 13.009319406379863, lng:   80.00562972822823}, title: "REC transport office" },
      { position: { lat: 13.008482, lng:   80.002515}, title: "REC cafe canteen" },
      { position: { lat: 13.008650, lng:   80.001993}, title: "Idea factory block" },
      { position: { lat: 13.008474, lng:   80.002330}, title: "Courtyard canteen" },
      { position: { lat: 13.008156781431756, lng:   80.00239293912178}, title: "Academic block" },
      { position: { lat: 13.007739, lng:   80.002108}, title: "Hekaa canteen" },
      { position: { lat: 13.008019233850431, lng:   80.00124394383324}, title: "Civil labs & workshop " },
      { position: { lat: 13.008523286387378, lng:   80.00474627861848}, title: "Play ground(foot ball & cricket)" },
      { position: { lat: 13.00801031587465, lng:   80.001832776622}, title: "Aero.& Chem. labs & workshop " },
      { position: { lat: 13.007956, lng:   80.004118}, title: "Ball badmintion & Vollyball ground" },
      { position: { lat: 13.008957, lng:   80.004112}, title: "Through ball & Basket ball ground" },
      { position: { lat: 13.008495, lng:   80.004284}, title: "Hand ball ground" },
      { position: { lat: 13.009056, lng:   80.004352}, title: "Foot ball turf" },
      { position: { lat: 13.01074558428208, lng:   80.00232998951167}, title: "REC main enterance gate" },
      { position: { lat: 13.012314, lng:   80.000442}, title: "REC main road enterance & vechile parking" },
      { position: { lat: 13.007285483496112, lng:   80.0038105688513}, title: "Boys hostelar canteen" },
    ]

    landmarks.forEach((landmark) => {
      new window.google.maps.Marker({
        position: landmark.position,
        map: map,
        title: landmark.title,
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#dc2626"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24),
        },
      })
    })
  }, [isLoaded])

  // Update user marker position
  const updateUserMarker = (position: Position) => {
    if (!mapInstanceRef.current || !window.google) return

    if (userMarkerRef.current) {
      userMarkerRef.current.setPosition(position)
    } else {
      userMarkerRef.current = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: "Your Location",
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" fill="#4285f4" stroke="white" strokeWidth="2"/>
              <circle cx="10" cy="10" r="3" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(20, 20),
        },
        zIndex: 1000,
      })
    }

    // Center map on user location
    mapInstanceRef.current.panTo(position)
  }

  // Start location tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      return
    }

    setLocationError(null)
    setIsTracking(true)

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000,
    }

    const success = (position: GeolocationPosition) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }

      setUserPosition(pos)
      updateUserMarker(pos)

      // Check if user is within campus bounds
      const isOnCampus =
        pos.lat >= campusBounds.south &&
        pos.lat <= campusBounds.north &&
        pos.lng >= campusBounds.west &&
        pos.lng <= campusBounds.east

      if (!isOnCampus) {
        setLocationError("You appear to be outside the campus area")
      }
    }

    const error = (err: GeolocationPositionError) => {
      setIsTracking(false)
      switch (err.code) {
        case err.PERMISSION_DENIED:
          setLocationError("Location access denied. Please enable location services.")
          break
        case err.POSITION_UNAVAILABLE:
          setLocationError("Location information unavailable.")
          break
        case err.TIMEOUT:
          setLocationError("Location request timed out.")
          break
        default:
          setLocationError("An unknown error occurred.")
          break
      }
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(success, error, options)

    // Watch position changes
    watchIdRef.current = navigator.geolocation.watchPosition(success, error, options)
  }

  // Stop location tracking
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setIsTracking(false)
  }

  // Zoom control functions
  const zoomIn = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom()
      mapInstanceRef.current.setZoom(currentZoom + 1)
    }
  }

  const zoomOut = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom()
      mapInstanceRef.current.setZoom(currentZoom - 1)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
        <h3 className="text-lg font-semibold mb-2">Google Maps API Key Required</h3>
        <p className="text-muted-foreground">
          Please add your Google Maps API key to the environment variables as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">
            {userPosition && isTracking
              ? `GPS Coordinates: ${userPosition.lat.toFixed(8)}, ${userPosition.lng.toFixed(8)}`
              : userPosition
                ? `Last Known Location: ${userPosition.lat.toFixed(6)}, ${userPosition.lng.toFixed(6)}`
                : "Location not available"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom in/out buttons */}
          <Button onClick={zoomIn} variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
            <Plus className="h-4 w-4" />
            Zoom In
          </Button>

          <Button onClick={zoomOut} variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
            <Minus className="h-4 w-4" />
            Zoom Out
          </Button>

          <Button
            onClick={isTracking ? stopTracking : startTracking}
            variant={isTracking ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            <Navigation className="h-4 w-4" />
            {isTracking ? "Stop Tracking" : "Enable Location"}
          </Button>
        </div>
      </div>

      {isTracking && userPosition && (
        <Card className="p-4 border-green-500 bg-green-50 dark:bg-green-950/20">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Navigation className="h-4 w-4" />
            <div className="text-sm">
              <div className="font-semibold">Live GPS Tracking Active</div>
              <div className="font-mono text-xs mt-1">
                Latitude: {userPosition.lat.toFixed(8)}°<br />
                Longitude: {userPosition.lng.toFixed(8)}°
              </div>
            </div>
          </div>
        </Card>
      )}

      {locationError && (
        <Card className="p-4 border-destructive bg-destructive/5">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{locationError}</span>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div ref={mapRef} className="w-full h-[600px] bg-muted">
          {!isLoaded && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Click "Enable Location" to start GPS tracking</li>
          <li>• Allow location access when prompted by your browser</li>
          <li>• Your live location will appear as a blue dot on the map</li>
          <li>• Red markers show important campus buildings</li>
          <li>• Use "Zoom In" and "Zoom Out" buttons to adjust map detail level</li>
          <li>• Works best when you're physically on campus</li>
        </ul>
      </Card>
    </div>
  )
}
