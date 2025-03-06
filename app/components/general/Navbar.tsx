"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, isLoading } = useKindeAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted and auth state is loaded
  if (!mounted || isLoading) {
    return (
      <nav className="py-4 px-6 bg-background border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">
                Bet You <span className="text-indigo-500">Can't</span>
              </h1>
            </Link>
            <div className="h-10 w-10" /> {/* Placeholder for auth buttons */}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="py-4 px-6 bg-background border-b">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {/* <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold">Your Logo</span> */}
            <h1 className="text-2xl font-bold" >Bet You <span className="text-indigo-500" >Can't</span></h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            )}
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <LoginLink>
                    <Button variant="ghost">Sign in</Button>
                  </LoginLink>
                  <RegisterLink>
                    <Button>Sign up</Button>
                  </RegisterLink>
                </>
              ) : (
                <>
                  <ThemeToggle />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          {user?.picture ? (
                            <AvatarImage 
                              src={user.picture} 
                              alt={user?.given_name || "User avatar"}
                              className="object-cover"
                            />
                          ) : (
                            <AvatarFallback className="bg-primary/10">
                              {(user?.given_name?.[0]?.toUpperCase() || "") + 
                               (user?.family_name?.[0]?.toUpperCase() || "") || 
                               user?.email?.[0]?.toUpperCase() || 
                               "U"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <LogoutLink>Logout</LogoutLink>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="mb-6">Menu</SheetTitle>
                <div className="flex flex-col space-y-4 mt-6">
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Home
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Profile
                      </Link>
                      <LogoutLink>
                        <Button variant="ghost" className="justify-start">
                          Logout
                        </Button>
                      </LogoutLink>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          {user?.picture ? (
                            <AvatarImage 
                              src={user.picture} 
                              alt={user?.given_name || "User avatar"}
                              className="object-cover"
                            />
                          ) : (
                            <AvatarFallback className="bg-primary/10">
                              {(user?.given_name?.[0]?.toUpperCase() || "") + 
                               (user?.family_name?.[0]?.toUpperCase() || "") || 
                               user?.email?.[0]?.toUpperCase() || 
                               "U"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-muted-foreground">
                          {user?.given_name} {user?.family_name}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <LoginLink>
                        <Button variant="ghost" className="justify-start">
                          Sign in
                        </Button>
                      </LoginLink>
                      <RegisterLink>
                        <Button className="justify-start">Sign up</Button>
                      </RegisterLink>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
