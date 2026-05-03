'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Shield,
  Camera,
  FileText,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CameraCapture } from '@/components/ui/camera-capture';
import { AadhaarUpload } from '@/components/ui/aadhaar-upload';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

interface Profession {
  id: string;
  name: string;
  slug: string;
  categoryGroup: string;
}

const workerSchema = z.object({
  bio: z.string().min(20, 'Bio must be at least 20 characters').max(500),
  experience: z.number().min(0).max(50),
  serviceRadius: z.number().min(1).max(100),
  hourlyRate: z.number().min(0),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  address: z.string().min(5, 'Address is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  emergencyAvailable: z.boolean().default(false),
});

type WorkerFormData = z.infer<typeof workerSchema>;

const TOTAL_STEPS = 4;

const stepInfo = [
  { number: 1, title: 'Services', icon: Briefcase, description: 'Select professions' },
  { number: 2, title: 'Profile', icon: User, description: 'Your details' },
  { number: 3, title: 'Location', icon: MapPin, description: 'Service area' },
  { number: 4, title: 'Verify', icon: Shield, description: 'Identity proof' },
];

export default function WorkerRegisterPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [primaryProfession, setPrimaryProfession] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Verification data
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [aadhaarData, setAadhaarData] = useState<{
    frontImage: string;
    backImage?: string;
    aadhaarNumber?: string;
  } | null>(null);

  const form = useForm<WorkerFormData>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      bio: '',
      experience: 0,
      serviceRadius: 10,
      hourlyRate: 0,
      city: '',
      state: '',
      address: '',
      emergencyAvailable: false,
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth?return=/worker/register');
      return;
    }

    if (isAuthenticated && user?.role === 'WORKER') {
      router.push('/worker/dashboard');
      return;
    }

    fetchProfessions();
  }, [isAuthenticated, authLoading, user, router]);

  const fetchProfessions = async () => {
    try {
      const response = await api.get<Profession[]>('/api/v1/professions');
      if (response.success && response.data) {
        setProfessions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch professions:', error);
    }
  };

  const toggleProfession = (id: string) => {
    setSelectedProfessions((prev) => {
      if (prev.includes(id)) {
        if (primaryProfession === id) {
          setPrimaryProfession('');
        }
        return prev.filter((p) => p !== id);
      }
      if (prev.length === 0) {
        setPrimaryProfession(id);
      }
      return [...prev, id];
    });
  };

  const handleSubmit = async (data: WorkerFormData) => {
    if (selectedProfessions.length === 0) {
      setError('Please select at least one profession');
      return;
    }

    if (!primaryProfession) {
      setError('Please select a primary profession');
      return;
    }

    if (!selfieImage) {
      setError('Please capture your selfie for verification');
      setStep(4);
      return;
    }

    if (!aadhaarData?.frontImage) {
      setError('Please upload your Aadhaar card for verification');
      setStep(4);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = {
        ...data,
        professionIds: selectedProfessions,
        primaryProfessionId: primaryProfession,
        location: {
          city: data.city,
          state: data.state,
          address: data.address,
          latitude: data.latitude || 28.6139,
          longitude: data.longitude || 77.2090,
        },
        verification: {
          selfieImage,
          aadhaarFrontImage: aadhaarData.frontImage,
          aadhaarBackImage: aadhaarData.backImage,
          aadhaarNumber: aadhaarData.aadhaarNumber,
        },
      };

      const response = await api.post('/api/v1/auth/register/worker', payload);
      if (response.success) {
        router.push('/worker/dashboard?registered=true');
      }
    } catch (err: any) {
      setError(err.error?.message || 'Failed to register as worker');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = () => {
    form.handleSubmit(handleSubmit)();
  };

  // Group professions by category
  const groupedProfessions = professions.reduce((acc, prof) => {
    const group = prof.categoryGroup || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(prof);
    return acc;
  }, {} as Record<string, Profession[]>);

  const canProceedToNext = () => {
    switch (step) {
      case 1:
        return selectedProfessions.length > 0;
      case 2:
        return true; // Form validation will handle this
      case 3:
        return true; // Form validation will handle this
      case 4:
        return selfieImage && aadhaarData?.frontImage;
      default:
        return true;
    }
  };

  if (authLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl">
      <Card className="border-0 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl">Become a Service Provider</CardTitle>
          <CardDescription className="text-base">
            Register as a worker and start earning by providing services
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Progress Steps */}
          <div className="mb-8">
            {/* Desktop Progress */}
            <div className="hidden sm:flex items-center justify-between">
              {stepInfo.map((s, index) => (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                        step >= s.number
                          ? 'bg-gradient-to-br from-indigo-400 to-purple-400 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {step > s.number ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <s.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-xs font-medium mt-2 ${step >= s.number ? 'text-gray-900' : 'text-gray-400'}`}>
                      {s.title}
                    </span>
                  </div>
                  {index < stepInfo.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-3 rounded ${
                        step > s.number ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gray-100'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Progress */}
            <div className="sm:hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Step {step} of {TOTAL_STEPS}
                </span>
                <span className="text-sm font-medium text-primary">
                  {stepInfo[step - 1]?.title}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-300"
                  style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Step 1: Select Professions */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Select Your Professions</h3>
                <p className="text-sm text-muted-foreground">
                  Choose the services you can provide. You can select multiple.
                </p>
              </div>

              {Object.entries(groupedProfessions).map(([group, profs]) => (
                <div key={group}>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {group}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profs.map((prof) => (
                      <Badge
                        key={prof.id}
                        variant={
                          selectedProfessions.includes(prof.id)
                            ? 'default'
                            : 'outline'
                        }
                        className="cursor-pointer py-2 px-3 text-sm"
                        onClick={() => toggleProfession(prof.id)}
                      >
                        {prof.name}
                        {primaryProfession === prof.id && ' ★'}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}

              {selectedProfessions.length > 1 && (
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">Select Primary Profession</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfessions.map((id) => {
                      const prof = professions.find((p) => p.id === id);
                      return (
                        <Badge
                          key={id}
                          variant={primaryProfession === id ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => setPrimaryProfession(id)}
                        >
                          {prof?.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              <Button
                className="w-full h-12"
                onClick={() => setStep(2)}
                disabled={selectedProfessions.length === 0}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Profile Details */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-lg mb-2">Your Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Tell customers about your experience and skills
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Bio / Description *</label>
                <textarea
                  {...form.register('bio')}
                  className="w-full mt-1.5 p-3 border rounded-xl min-h-[120px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Describe your experience, skills, and what makes you stand out..."
                />
                {form.formState.errors.bio && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.bio.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Experience (years)
                  </label>
                  <Input
                    type="number"
                    {...form.register('experience', { valueAsNumber: true })}
                    min={0}
                    max={50}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    Hourly Rate (₹)
                  </label>
                  <Input
                    type="number"
                    {...form.register('hourlyRate', { valueAsNumber: true })}
                    min={0}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Service Radius (km)
                </label>
                <Input
                  type="number"
                  {...form.register('serviceRadius', { valueAsNumber: true })}
                  min={1}
                  max={100}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How far are you willing to travel for jobs?
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <input
                  type="checkbox"
                  {...form.register('emergencyAvailable')}
                  id="emergency"
                  className="w-5 h-5 rounded"
                />
                <div>
                  <label htmlFor="emergency" className="text-sm font-medium">
                    Available for emergency services
                  </label>
                  <p className="text-xs text-muted-foreground">
                    You may receive urgent requests 24/7
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="h-12">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button className="flex-1 h-12" onClick={() => setStep(3)}>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-lg mb-2">Your Location</h3>
                <p className="text-sm text-muted-foreground">
                  This helps customers find you based on their location
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Address *</label>
                <Input
                  {...form.register('address')}
                  placeholder="Street address or area"
                  className="mt-1.5"
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">City *</label>
                  <Input
                    {...form.register('city')}
                    placeholder="City"
                    className="mt-1.5"
                  />
                  {form.formState.errors.city && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">State *</label>
                  <Input
                    {...form.register('state')}
                    placeholder="State"
                    className="mt-1.5"
                  />
                  {form.formState.errors.state && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="h-12">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button className="flex-1 h-12" onClick={() => setStep(4)}>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Identity Verification */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Identity Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Verify your identity to build trust with customers
                </p>
              </div>

              {/* Verification Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-4 rounded-xl border-2 ${selfieImage ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <Camera className={`w-5 h-5 ${selfieImage ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${selfieImage ? 'text-green-700' : 'text-gray-600'}`}>
                      Live Photo
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selfieImage ? 'Captured ✓' : 'Required'}
                  </p>
                </div>
                <div className={`p-4 rounded-xl border-2 ${aadhaarData?.frontImage ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <FileText className={`w-5 h-5 ${aadhaarData?.frontImage ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${aadhaarData?.frontImage ? 'text-green-700' : 'text-gray-600'}`}>
                      Aadhaar Card
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {aadhaarData?.frontImage ? 'Uploaded ✓' : 'Required'}
                  </p>
                </div>
              </div>

              {/* Live Selfie Capture */}
              <div className="border rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Camera className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Live Photo Capture</h4>
                    <p className="text-xs text-muted-foreground">Take a real-time selfie for verification</p>
                  </div>
                </div>
                
                <CameraCapture
                  onCapture={(image) => setSelfieImage(image)}
                  capturedImage={selfieImage}
                />
              </div>

              {/* Aadhaar Upload */}
              <div className="border rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Aadhaar Card Upload</h4>
                    <p className="text-xs text-muted-foreground">Upload your Aadhaar for identity proof</p>
                  </div>
                </div>

                <AadhaarUpload
                  onUpload={(data) => setAadhaarData(data)}
                  frontImage={aadhaarData?.frontImage}
                  backImage={aadhaarData?.backImage}
                  aadhaarNumber={aadhaarData?.aadhaarNumber}
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(3)} className="h-12">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  className="flex-1 h-12"
                  onClick={handleFinalSubmit}
                  disabled={isLoading || !selfieImage || !aadhaarData?.frontImage}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Registration
                    </>
                  )}
                </Button>
              </div>

              {/* Trust Banner */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-indigo-900">Your data is secure</p>
                  <p className="text-xs text-indigo-700 mt-0.5">
                    All documents are encrypted and stored securely. We never share your personal information.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
