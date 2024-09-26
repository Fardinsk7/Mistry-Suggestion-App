'use client'

import { useEffect, useState } from 'react'
import { Toaster } from "@/components/ui/toaster"

export default function ClientSideToaster() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Return a hidden div when not mounted to maintain layout consistency
  if (!isMounted) {
    // Create a new Date object for the current date and time
const now = new Date();

// Get the current hour, minute, and second
const hours = now.getHours(); // Returns the hour (0-23)
const minutes = now.getMinutes(); // Returns the minute (0-59)
const seconds = now.getSeconds(); // Returns the second (0-59)

// Log the hour, minute, and second to the console
console.log(`Current Time: ${hours}:${minutes}:${seconds}`);
    console.log("Not Mounted Sorry")
    return null
  }

  return <Toaster />
}