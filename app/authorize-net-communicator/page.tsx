"use client"

import { useEffect } from "react"

/**
 * Authorize.net IFrame Communicator
 * 
 * This page is required by Authorize.net's Accept Hosted payment form.
 * It acts as a bridge for cross-domain communication between the payment form
 * and your application.
 * 
 * This page should be hosted at the URL specified in hostedPaymentIFrameCommunicatorUrl
 */
export default function AuthorizeNetCommunicator() {
  useEffect(() => {
    // Listen for messages from Authorize.net
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from Authorize.net domains
      if (!event.origin.includes("authorize.net")) {
        return
      }

      try {
        // Parse the message if it's a string
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data

        // Forward the message to the parent window
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(event.data, window.location.origin)
        }

        // Handle specific actions
        if (data.action === "successfulSave" || data.action === "transactResponse") {
          // Payment was successful
          console.log("[Authorize.net Communicator] Success:", data)
        } else if (data.action === "cancel") {
          // User cancelled
          console.log("[Authorize.net Communicator] Cancelled")
        } else if (data.action === "resizeWindow") {
          // Resize request - handled by parent
          console.log("[Authorize.net Communicator] Resize:", data)
        }
      } catch (e) {
        // Non-JSON message, forward as-is
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(event.data, window.location.origin)
        }
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // This page should be invisible - it's just for communication
  return (
    <html>
      <head>
        <title>Authorize.net Communicator</title>
      </head>
      <body style={{ margin: 0, padding: 0, background: "transparent" }}>
        {/* Invisible communication bridge */}
      </body>
    </html>
  )
}
