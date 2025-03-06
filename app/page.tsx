import Image from "next/image";
import { prisma } from "./lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Challenge, ChallengeStatus } from "@prisma/client";

type ChallengeWithUsers = Challenge & {
  challenger: { name: string | null; email: string };
  challenged: { name: string | null; email: string };
};

async function getData(): Promise<ChallengeWithUsers[]> {
  try {
    const challenges = await prisma.challenge.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        challenger: {
          select: {
            name: true,
            email: true,
          }
        },
        challenged: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      take: 6, // Limit to 6 latest challenges
    });
    
    return challenges as ChallengeWithUsers[];
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "pending" | "accepted" | "declined" | "archived";

function getStatusColor(status: ChallengeStatus): BadgeVariant {
  switch (status) {
    case "PENDING":
      return "pending";
    case "ACCEPTED":
      return "accepted";
    case "DECLINED":
      return "declined";
    case "ARCHIVED":
      return "archived";
    default:
      return "default";
  }
}

export default async function Home() {
  const data = await getData();
  return (
    <main className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Latest Challenges</h1>
          <p className="text-muted-foreground">
            Check out what people are challenging each other to do for charity
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((challenge, i) => (
            <Card key={i} className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant={getStatusColor(challenge.status as ChallengeStatus)} className="mb-2">
                    {challenge.status}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {format(new Date(challenge.deadline), "MMM d, yyyy")}
                  </div>
                </div>
                <CardTitle className="line-clamp-2">{challenge.description}</CardTitle>
                {challenge.charity && (
                  <CardDescription className="flex items-center gap-2">
                    <span className="text-primary">Charity:</span> {challenge.charity}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                      <Avatar className="border-2 border-background">
                        <AvatarFallback>
                          {challenge.challenger.name?.[0] || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <Avatar className="border-2 border-background">
                        <AvatarFallback>
                          {challenge.challenged.name?.[0] || "R"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        {challenge.challenger.name} challenged {challenge.challenged.name}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {data.length === 0 && (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No challenges yet</h3>
              <p className="text-muted-foreground">
                Be the first to create a challenge and make a difference!
              </p>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
