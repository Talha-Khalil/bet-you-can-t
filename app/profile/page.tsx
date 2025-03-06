"use client";

import { useEffect } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useRouter } from "next/navigation";

function getInitials(user: any): string {
  if (user?.given_name && user?.family_name) {
    return `${user.given_name[0]}${user.family_name[0]}`.toUpperCase();
  }
  if (user?.given_name) {
    return user.given_name[0].toUpperCase();
  }
  if (user?.email) {
    return user.email[0].toUpperCase();
  }
  return "U";
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useKindeAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const initials = getInitials(user);

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage 
                src={user?.picture || ""} 
                alt={user?.given_name || "User avatar"}
                className="object-cover"
              />
              <AvatarFallback 
                className="text-2xl bg-primary/10 flex items-center justify-center font-semibold"
                delayMs={0}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {user?.given_name} {user?.family_name || ""}
              </CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div>
              <h3 className="font-medium mb-2">Profile Information</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Email: {user?.email}</p>
                <p>Name: {user?.given_name} {user?.family_name || ""}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Account Actions</h3>
              <div className="space-x-4">
                <LogoutLink>
                  <Button variant="outline">Logout</Button>
                </LogoutLink>
                <Button onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 