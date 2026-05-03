'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Shield,
  Star,
  Clock,
  ArrowRight,
  CheckCircle,
  Users,
  Briefcase,
  Phone,
  Zap,
  Award,
  TrendingUp,
  Download,
  Apple,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, TestimonialCarousel } from '@/components/ui/carousel';
import {
  HeroIllustration,
  BookingIllustration,
  GrowthIllustration,
  MobileAppIllustration,
} from '@/components/ui/illustrations';

const heroSlides = [
  {
    title: 'Find Trusted Local Workers',
    subtitle: 'Near You',
    description:
      'Connect with verified plumbers, electricians, maids, and other service professionals in your neighborhood.',
    illustration: HeroIllustration,
    gradient: 'from-indigo-400 via-indigo-500 to-purple-500',
  },
  {
    title: 'Book Services',
    subtitle: 'Instantly',
    description:
      'Compare ratings, read reviews, and book the best professionals with just a few taps.',
    illustration: BookingIllustration,
    gradient: 'from-purple-400 via-pink-400 to-rose-400',
  },
  {
    title: 'Grow Your Business',
    subtitle: 'As a Worker',
    description:
      'Join thousands of professionals earning on LocalConnect. Set your rates, manage bookings, get paid.',
    illustration: GrowthIllustration,
    gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
  },
];

const popularServices = [
  { slug: 'plumber', name: 'Plumber', icon: '🔧', color: 'bg-blue-100 hover:bg-blue-200', count: '500+' },
  { slug: 'electrician', name: 'Electrician', icon: '⚡', color: 'bg-yellow-100 hover:bg-yellow-200', count: '450+' },
  { slug: 'carpenter', name: 'Carpenter', icon: '🪚', color: 'bg-amber-100 hover:bg-amber-200', count: '320+' },
  { slug: 'maid', name: 'Maid', icon: '🧹', color: 'bg-green-100 hover:bg-green-200', count: '680+' },
  { slug: 'mechanic', name: 'Mechanic', icon: '🔩', color: 'bg-slate-100 hover:bg-slate-200', count: '290+' },
  { slug: 'painter', name: 'Painter', icon: '🎨', color: 'bg-purple-100 hover:bg-purple-200', count: '210+' },
  { slug: 'ac-technician', name: 'AC Technician', icon: '❄️', color: 'bg-cyan-100 hover:bg-cyan-200', count: '180+' },
  { slug: 'cook', name: 'Cook', icon: '👨‍🍳', color: 'bg-orange-100 hover:bg-orange-200', count: '150+' },
];

const testimonials = [
  {
    id: '1',
    name: 'Priya Sharma',
    role: 'Homeowner',
    rating: 5,
    comment:
      'Found an amazing electrician within minutes. He was professional, on time, and fixed my issue quickly. The trust score feature really helped me choose the right person!',
    location: 'Mumbai',
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    role: 'Business Owner',
    rating: 5,
    comment:
      'I use LocalConnect for all my office maintenance needs. The workers are verified, and I love that I can see their reviews before booking. Highly recommended!',
    location: 'Delhi',
  },
  {
    id: '3',
    name: 'Anita Patel',
    role: 'Working Professional',
    rating: 5,
    comment:
      "As a busy professional, I don't have time to search for reliable help. LocalConnect made it super easy to find a trusted maid who now works with us regularly.",
    location: 'Bangalore',
  },
  {
    id: '4',
    name: 'Suresh Reddy',
    role: 'Plumber on LocalConnect',
    rating: 5,
    comment:
      'Joining LocalConnect as a worker was the best decision. I get regular jobs, manage my schedule, and have built a great reputation with 200+ completed jobs!',
    location: 'Hyderabad',
  },
];

const stats = [
  { value: '50K+', label: 'Active Users', icon: Users },
  { value: '10K+', label: 'Verified Workers', icon: Briefcase },
  { value: '100K+', label: 'Jobs Completed', icon: CheckCircle },
  { value: '4.8', label: 'Average Rating', icon: Star },
];

const howItWorks = [
  {
    step: 1,
    title: 'Search',
    description: 'Find workers by profession or service type in your area',
    icon: Search,
    color: 'from-blue-400 to-indigo-400',
  },
  {
    step: 2,
    title: 'Compare',
    description: 'View ratings, reviews, pricing and trust scores',
    icon: TrendingUp,
    color: 'from-purple-400 to-pink-400',
  },
  {
    step: 3,
    title: 'Book',
    description: 'Send a request and get instant confirmation',
    icon: Phone,
    color: 'from-orange-400 to-rose-400',
  },
  {
    step: 4,
    title: 'Done',
    description: 'Get the job done and leave a review',
    icon: CheckCircle,
    color: 'from-emerald-400 to-teal-400',
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  return (
    <div className="flex flex-col">
      {/* Hero Carousel Section */}
      <Carousel autoPlay interval={6000} showDots showArrows>
        {heroSlides.map((slide, index) => (
          <section
            key={index}
            className={`bg-gradient-to-br ${slide.gradient} py-16 lg:py-24 relative overflow-hidden`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-hero-pattern opacity-10" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

            <div className="container relative z-10">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="text-white order-2 lg:order-1">
                  <Badge className="bg-white/20 text-white hover:bg-white/30 mb-4 backdrop-blur-sm">
                    #1 Service Marketplace in India
                  </Badge>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-2">
                    {slide.title}
                  </h1>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white/90 mb-6">
                    {slide.subtitle}
                  </h2>
                  <p className="text-base sm:text-lg text-white/80 mb-8 max-w-lg">
                    {slide.description}
                  </p>

                  {/* Search Box */}
                  <div className="bg-white rounded-2xl p-2 shadow-2xl max-w-xl">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="What service do you need?"
                          className="pl-10 h-12 border-0 focus-visible:ring-0 text-gray-900"
                        />
                      </div>
                      <div className="relative sm:w-40">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Location"
                          className="pl-10 h-12 border-0 focus-visible:ring-0 text-gray-900"
                        />
                      </div>
                      <Link href={`/workers?search=${searchQuery}&city=${location}`}>
                        <Button size="lg" className="h-12 px-6 w-full sm:w-auto shadow-lg">
                          Search
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap items-center gap-4 mt-6">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Shield className="w-4 h-4" />
                      <span>Verified Professionals</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>4.8/5 Average Rating</span>
                    </div>
                  </div>
                </div>

                {/* Illustration */}
                <div className="order-1 lg:order-2 flex justify-center">
                  <div className="w-full max-w-md lg:max-w-lg animate-float">
                    <slide.illustration className="drop-shadow-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </Carousel>

      {/* Stats Section */}
      <section className="py-6 sm:py-8 bg-slate-800 text-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <span className="text-2xl sm:text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <Badge variant="purple" className="mb-2">Popular</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold">Browse Services</h2>
              <p className="text-muted-foreground mt-1">
                Choose from our wide range of professional services
              </p>
            </div>
            <Link href="/workers">
              <Button variant="outline" size="lg" className="group w-full sm:w-auto">
                View All Services
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {popularServices.map((service) => (
              <Link key={service.slug} href={`/workers?profession=${service.slug}`}>
                <Card className="card-interactive h-full group border-0 shadow-sm hover:shadow-xl">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl transition-all group-hover:scale-110 group-hover:rotate-3`}
                    >
                      {service.icon}
                    </div>
                    <p className="font-semibold text-sm mb-1">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.count} pros</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-50/50 to-transparent rounded-full blur-3xl" />
        
        <div className="container relative">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              Simple 4-Step Process
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">
              Get any task done in minutes with our streamlined booking process
            </p>
          </div>

          {/* Steps Container */}
          <div className="relative">
            {/* Connection Line - Desktop */}
            <div className="hidden lg:block absolute top-[72px] left-[12%] right-[12%] h-[2px]">
              <div className="w-full h-full bg-gradient-to-r from-indigo-200 via-purple-200 via-pink-200 to-emerald-200 rounded-full" />
              <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-indigo-300 to-transparent rounded-full animate-pulse" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {howItWorks.map((item, index) => (
                <div key={item.step} className="relative group">
                  {/* Card */}
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 h-full">
                    {/* Step Number & Icon Row */}
                    <div className="flex items-center justify-between mb-6">
                      {/* Icon */}
                      <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      {/* Step Number */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 border-2 border-gray-100 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                        <span className="text-lg font-bold text-gray-400 group-hover:text-indigo-500 transition-colors">
                          {item.step}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>

                    {/* Hover Arrow */}
                    <div className="mt-4 flex items-center text-indigo-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {index < howItWorks.length - 1 ? (
                        <>
                          Next Step
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </>
                      ) : (
                        <>
                          All Done!
                          <CheckCircle className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Mobile Connection Arrow */}
                  {index < howItWorks.length - 1 && (
                    <div className="sm:hidden flex justify-center my-4">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-gray-400 rotate-90" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-gray-50 to-indigo-50/50 rounded-2xl p-6 sm:p-8 border border-gray-100">
              <div className="text-center sm:text-left">
                <p className="font-semibold text-gray-900">Ready to get started?</p>
                <p className="text-sm text-gray-500">Find the perfect professional for your needs</p>
              </div>
              <Link href="/workers">
                <Button size="lg" className="shadow-md">
                  Browse Services
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Badge variant="success" className="mb-3">Why Choose Us</Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
                Features That Make Us <span className="text-gradient">Stand Out</span>
              </h2>
              <div className="space-y-5">
                {[
                  {
                    icon: Shield,
                    title: 'Verified & Trusted Workers',
                    description:
                      'All workers undergo thorough background checks and verification process.',
                    color: 'from-emerald-400 to-teal-400',
                  },
                  {
                    icon: Zap,
                    title: 'Instant Booking',
                    description:
                      'Book services instantly with real-time availability and confirmation.',
                    color: 'from-amber-400 to-orange-400',
                  },
                  {
                    icon: Award,
                    title: 'Trust Score Algorithm',
                    description:
                      'Our unique algorithm rates workers based on reviews, completion rate, and more.',
                    color: 'from-purple-400 to-pink-400',
                  },
                  {
                    icon: Clock,
                    title: '24/7 Emergency Services',
                    description:
                      'Some workers are available round the clock for urgent requirements.',
                    color: 'from-blue-400 to-indigo-400',
                  },
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-4 group">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 rounded-3xl p-6 sm:p-8">
                <HeroIllustration />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-lg animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">100%</p>
                    <p className="text-xs text-gray-500">Verified</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">&lt;30min</p>
                    <p className="text-xs text-gray-500">Response</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
        <div className="container">
          <div className="text-center mb-10 sm:mb-12">
            <Badge variant="gradient" className="mb-3">Testimonials</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Loved by Thousands</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers and service providers
            </p>
          </div>

          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Become a Worker CTA */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container">
          <Card className="bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 text-white overflow-hidden border-0 shadow-xl">
            <CardContent className="p-6 sm:p-8 lg:p-12 relative">
              {/* Background decorations */}
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute left-20 bottom-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2" />
              <div className="absolute right-1/4 bottom-1/4 w-20 h-20 bg-white/5 rounded-full" />

              <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
                <div>
                  <Badge className="bg-white/20 text-white border-0 mb-4">
                    For Service Providers
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                    Ready to Grow Your Business?
                  </h2>
                  <p className="text-white/90 mb-6 text-base sm:text-lg">
                    Join thousands of professionals earning on LocalConnect. Set your rates, manage bookings, 
                    build your reputation, and get paid on time.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/worker/register">
                      <Button 
                        size="lg" 
                        className="w-full sm:w-auto bg-white text-teal-600 hover:bg-gray-50 shadow-lg font-semibold"
                      >
                        <Briefcase className="w-5 h-5 mr-2" />
                        Start Earning Today
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/workers">
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="w-full sm:w-auto border-2 border-white/60 text-white hover:bg-white/10 hover:border-white"
                      >
                        Learn More
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex flex-wrap gap-6 mt-8">
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold">₹50K+</p>
                      <p className="text-white/70 text-sm">Avg. Monthly Earnings</p>
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold">0%</p>
                      <p className="text-white/70 text-sm">Commission (First 3 months)</p>
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold">10K+</p>
                      <p className="text-white/70 text-sm">Active Workers</p>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex justify-center">
                  <GrowthIllustration className="w-full max-w-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-800 text-white overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <Badge className="bg-primary/20 text-primary border-0 mb-4">Coming Soon</Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                LocalConnect Mobile App
              </h2>
              <p className="text-gray-400 mb-6 text-base sm:text-lg">
                Get notified when we launch our mobile app for iOS and Android. 
                Book services on the go, track workers in real-time, and manage everything from your pocket.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Book services with one tap',
                  'Real-time worker tracking',
                  'In-app chat & calling',
                  'Secure payments',
                  'Push notifications',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg" 
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                  disabled
                >
                  <Apple className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <span className="text-xs block opacity-70">Download on</span>
                    <span className="text-sm font-semibold">App Store</span>
                  </div>
                </Button>
                <Button 
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                  disabled
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  <div className="text-left">
                    <span className="text-xs block opacity-70">Get it on</span>
                    <span className="text-sm font-semibold">Google Play</span>
                  </div>
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                * App launching Q2 2026. Sign up for early access.
              </p>
            </div>

            <div className="relative flex justify-center">
              <div className="relative">
                <MobileAppIllustration className="w-64 sm:w-72 lg:w-80 drop-shadow-2xl" />
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent rounded-3xl blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 text-white">
        <div className="container text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto text-base sm:text-lg">
            Join LocalConnect today and experience the easiest way to find trusted local services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/workers">
              <Button 
                size="xl" 
                className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-gray-50 shadow-lg font-semibold"
              >
                <Search className="w-5 h-5 mr-2" />
                Find Workers Now
              </Button>
            </Link>
            <Link href="/auth">
              <Button 
                size="xl" 
                variant="outline" 
                className="w-full sm:w-auto border-2 border-white/80 text-white hover:bg-white/10 font-semibold"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
