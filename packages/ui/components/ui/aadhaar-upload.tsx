'use client';

import { useState, useRef } from 'react';
import {
  Upload,
  X,
  CheckCircle,
  FileText,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
} from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface AadhaarUploadProps {
  onUpload: (data: { frontImage: string; backImage?: string; aadhaarNumber?: string }) => void;
  frontImage?: string | null;
  backImage?: string | null;
  aadhaarNumber?: string;
  className?: string;
}

export function AadhaarUpload({
  onUpload,
  frontImage: initialFront,
  backImage: initialBack,
  aadhaarNumber: initialNumber,
  className,
}: AadhaarUploadProps) {
  const [frontImage, setFrontImage] = useState<string | null>(initialFront || null);
  const [backImage, setBackImage] = useState<string | null>(initialBack || null);
  const [aadhaarNumber, setAadhaarNumber] = useState(initialNumber || '');
  const [showNumber, setShowNumber] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeUpload, setActiveUpload] = useState<'front' | 'back' | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const validateAadhaar = (number: string): boolean => {
    // Remove spaces and check if it's 12 digits
    const cleaned = number.replace(/\s/g, '');
    return /^\d{12}$/.test(cleaned);
  };

  const formatAadhaar = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Format as XXXX XXXX XXXX
    const parts = [];
    for (let i = 0; i < digits.length && i < 12; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaar(e.target.value);
    setAadhaarNumber(formatted);
    setError(null);
  };

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    side: 'front' | 'back'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setActiveUpload(side);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        
        if (side === 'front') {
          setFrontImage(imageData);
          onUpload({
            frontImage: imageData,
            backImage: backImage || undefined,
            aadhaarNumber: aadhaarNumber || undefined,
          });
        } else {
          setBackImage(imageData);
          onUpload({
            frontImage: frontImage || '',
            backImage: imageData,
            aadhaarNumber: aadhaarNumber || undefined,
          });
        }
        setActiveUpload(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      setActiveUpload(null);
    }
  };

  const removeImage = (side: 'front' | 'back') => {
    if (side === 'front') {
      setFrontImage(null);
      if (frontInputRef.current) frontInputRef.current.value = '';
    } else {
      setBackImage(null);
      if (backInputRef.current) backInputRef.current.value = '';
    }
    
    onUpload({
      frontImage: side === 'front' ? '' : (frontImage || ''),
      backImage: side === 'back' ? undefined : (backImage || undefined),
      aadhaarNumber: aadhaarNumber || undefined,
    });
  };

  const handleSubmit = () => {
    if (!frontImage) {
      setError('Please upload the front side of your Aadhaar card');
      return;
    }

    if (aadhaarNumber && !validateAadhaar(aadhaarNumber)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    onUpload({
      frontImage,
      backImage: backImage || undefined,
      aadhaarNumber: aadhaarNumber.replace(/\s/g, '') || undefined,
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">Why we need your Aadhaar?</p>
          <p className="text-xs text-blue-700 mt-1">
            Aadhaar verification helps us verify your identity and build trust with customers.
            Your information is encrypted and securely stored.
          </p>
        </div>
      </div>

      {/* Front Side Upload */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Aadhaar Card - Front Side <span className="text-red-500">*</span>
        </label>
        
        {!frontImage ? (
          <div
            onClick={() => frontInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
              'hover:border-primary hover:bg-primary/5',
              activeUpload === 'front' && 'border-primary bg-primary/5'
            )}
          >
            <input
              ref={frontInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e, 'front')}
              className="hidden"
            />
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              Click to upload front side
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG up to 5MB
            </p>
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden border">
            <img
              src={frontImage}
              alt="Aadhaar front"
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                size="icon-sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white"
                onClick={() => removeImage('front')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Front uploaded
            </div>
          </div>
        )}
      </div>

      {/* Back Side Upload (Optional) */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Aadhaar Card - Back Side <span className="text-gray-400">(Optional)</span>
        </label>
        
        {!backImage ? (
          <div
            onClick={() => backInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
              'hover:border-primary hover:bg-primary/5',
              activeUpload === 'back' && 'border-primary bg-primary/5'
            )}
          >
            <input
              ref={backInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e, 'back')}
              className="hidden"
            />
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">
                  Upload back side
                </p>
                <p className="text-xs text-gray-500">
                  For complete verification
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden border">
            <img
              src={backImage}
              alt="Aadhaar back"
              className="w-full h-32 object-cover"
            />
            <div className="absolute top-2 right-2">
              <Button
                size="icon-sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white"
                onClick={() => removeImage('back')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Back uploaded
            </div>
          </div>
        )}
      </div>

      {/* Aadhaar Number Input (Optional) */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Aadhaar Number <span className="text-gray-400">(Optional)</span>
        </label>
        <div className="relative">
          <Input
            type={showNumber ? 'text' : 'password'}
            value={aadhaarNumber}
            onChange={handleAadhaarChange}
            placeholder="XXXX XXXX XXXX"
            maxLength={14} // 12 digits + 2 spaces
            className="pr-10 font-mono tracking-wider"
          />
          <button
            type="button"
            onClick={() => setShowNumber(!showNumber)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Enter for faster verification (optional)
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Status Summary */}
      {frontImage && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Documents uploaded successfully</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Your documents will be verified within 24-48 hours after registration.
          </p>
        </div>
      )}
    </div>
  );
}
