'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle, X, User } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel?: () => void;
  capturedImage?: string | null;
  className?: string;
}

export function CameraCapture({
  onCapture,
  onCancel,
  capturedImage: initialImage,
  className,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(initialImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user', // Front camera for selfie
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setStream(mediaStream);
      setCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setError(
        'Unable to access camera. Please ensure you have granted camera permissions.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas (mirror for selfie)
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0);

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    onCapture(imageData);

    // Stop camera after capture
    stopCamera();
  }, [onCapture, stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-[4/3] max-w-md mx-auto">
        {/* Face guide overlay */}
        {cameraActive && !capturedImage && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Oval face guide */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-64 border-4 border-dashed border-white/70 rounded-[50%] shadow-lg" />
            </div>
            {/* Instructions */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white text-sm bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
                Position your face within the oval
              </p>
            </div>
          </div>
        )}

        {/* Video stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            'w-full h-full object-cover scale-x-[-1]', // Mirror for selfie
            (!cameraActive || capturedImage) && 'hidden'
          )}
        />

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Captured image preview */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured selfie"
            className="w-full h-full object-cover"
          />
        )}

        {/* Placeholder when camera is off */}
        {!cameraActive && !capturedImage && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-sm text-center px-4">
              Take a live photo for identity verification
            </p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Captured badge */}
        {capturedImage && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Captured
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-center gap-3">
        {!cameraActive && !capturedImage && (
          <Button onClick={startCamera} disabled={isLoading}>
            <Camera className="w-4 h-4 mr-2" />
            Open Camera
          </Button>
        )}

        {cameraActive && !capturedImage && (
          <>
            <Button variant="outline" onClick={stopCamera}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={capturePhoto}>
              <Camera className="w-4 h-4 mr-2" />
              Capture Photo
            </Button>
          </>
        )}

        {capturedImage && (
          <>
            <Button variant="outline" onClick={retakePhoto}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake Photo
            </Button>
            {onCancel && (
              <Button variant="ghost" onClick={onCancel}>
                Continue
              </Button>
            )}
          </>
        )}
      </div>

      {/* Privacy notice */}
      <p className="text-xs text-center text-muted-foreground max-w-sm mx-auto">
        Your photo is used only for identity verification and will be securely stored.
        It helps build trust with customers.
      </p>
    </div>
  );
}
