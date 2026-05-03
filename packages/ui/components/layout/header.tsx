'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Heart, FileText, LogOut, Menu, X, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useAuthStore } from '@/stores/auth';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/workers', label: 'Find Workers' },
];

const userNavItems = [
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/requests', label: 'My Requests', icon: FileText },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Logo size="md" />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Worker Dashboard Link */}
                  {user?.role === 'WORKER' && (
                    <Link href="/worker/dashboard">
                      <Button
                        variant={pathname.startsWith('/worker/dashboard') ? 'default' : 'outline'}
                        size="sm"
                        className="gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Button>
                    </Link>
                  )}

                  {/* User Nav Icons */}
                  <div className="flex items-center gap-1 border-l pl-3 ml-2">
                    {userNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'p-2 rounded-lg transition-colors',
                          pathname === item.href
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
                        )}
                        title={item.label}
                      >
                        <item.icon className="w-5 h-5" />
                      </Link>
                    ))}
                  </div>

                  {/* User Info & Logout */}
                  <div className="flex items-center gap-2 border-l pl-3 ml-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user?.firstName?.[0] || 'U'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 hidden lg:inline">
                        {user?.firstName}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => logout()}
                      className="text-gray-500 hover:text-gray-900"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth">
                    <Button variant="ghost" size="sm" className="font-medium">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button size="sm" className="font-medium">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-out md:hidden shadow-2xl',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Logo size="sm" />
            <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Main Navigation */}
            <nav className="space-y-1 mb-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all',
                    pathname === item.href
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {isAuthenticated ? (
              <>
                {/* Worker Dashboard */}
                {user?.role === 'WORKER' && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
                      Worker
                    </p>
                    <Link
                      href="/worker/dashboard"
                      onClick={closeMobileMenu}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all',
                        pathname.startsWith('/worker/dashboard')
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100',
                      )}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                  </div>
                )}

                {/* User Navigation */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
                    Account
                  </p>
                  <nav className="space-y-1">
                    {userNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all',
                          pathname === item.href
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100',
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* User Info */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-medium text-primary">
                        {user?.firstName?.[0] || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user?.phone}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    Log out
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3 pt-4 border-t">
                <Link href="/auth" onClick={closeMobileMenu}>
                  <Button variant="outline" className="w-full h-12 text-base">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth" onClick={closeMobileMenu}>
                  <Button className="w-full h-12 text-base">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
