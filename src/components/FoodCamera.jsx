// Camera capture component for food recognition

import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * FoodCamera component - captures photos for food recognition
 * @param {Object} props
 * @param {Function} props.onCapture - Callback when photo is captured (receives blob and image element)
 * @param {Function} props.onClose - Callback to close camera
 */
export default function FoodCamera({ onCapture, onClose }) {
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [facingMode, setFacingMode] = useState('environment') // 'environment' for back camera
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      setError(null)
      
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Camera access error:', err)
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.')
      } else {
        setError('Failed to access camera: ' + err.message)
      }
    }
  }, [facingMode])

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }, [stream])

  // Start camera on mount
  useEffect(() => {
    startCamera()
    
    return () => {
      stopCamera()
    }
  }, [facingMode]) // Re-start when facing mode changes

  // Switch between front and back camera
  const toggleCamera = () => {
    stopCamera()
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')
  }

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size to video size
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        // Create image element for recognition
        const img = new Image()
        img.onload = () => {
          onCapture(blob, img)
        }
        img.src = URL.createObjectURL(blob)
      }
    }, 'image/jpeg', 0.9)
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-black">
      {/* Camera view */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-white p-4">
            <svg className="w-16 h-16 mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-center text-lg mb-4">{error}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-white text-black rounded-lg font-medium"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Camera overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Center guide */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-white/30 rounded-2xl" />
              </div>
              
              {/* Instructions */}
              <div className="absolute top-4 left-0 right-0 text-center">
                <p className="text-white/80 text-sm bg-black/30 inline-block px-3 py-1 rounded-full">
                  Position food in the frame
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Controls - Fixed at bottom with safe-area support */}
      <div className="flex-shrink-0 min-h-[88px] bg-black p-4 pb-[max(env(safe-area-inset-bottom),16px)] flex items-center justify-center gap-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Capture button */}
        <button
          onClick={capturePhoto}
          disabled={!stream || error}
          className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 transition-colors disabled:opacity-30 flex items-center justify-center"
        >
          <div className="w-12 h-12 rounded-full border-4 border-gray-800" />
        </button>
        
        {/* Switch camera button */}
        <button
          onClick={toggleCamera}
          disabled={!stream || error}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}