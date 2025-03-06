import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMyChallenges } from "../actions/challenges";
import { format } from "date-fns";

export default async function DashboardRoute() {
  const { challenges, error } = await getMyChallenges();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Challenges</h1>
        <Link href="/dashboard/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Challenge
          </Button>
        </Link>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive rounded-lg border border-destructive p-4">
          {error}
        </div>
      ) : challenges?.length === 0 ? (
        <div className="bg-card rounded-lg border p-6">
          <p className="text-muted-foreground text-center">
            No challenges yet. Create your first challenge!
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {challenges?.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-card rounded-lg border p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">
                    Challenge to {challenge.challenged.name || challenge.challenged.email}
                  </h2>
                  <p className="text-muted-foreground">
                    Created {format(new Date(challenge.createdAt), 'PPP')}
                  </p>
                </div>
                <Badge variant={getStatusVariant(challenge.status)}>
                  {challenge.status}
                </Badge>
              </div>
              
              <p className="text-lg">{challenge.description}</p>
              
              {challenge.charity && (
                <div className="text-muted-foreground">
                  Charity: {challenge.charity}
                </div>
              )}
              
              <div className="text-muted-foreground">
                Deadline: {format(new Date(challenge.deadline), 'PPP')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'secondary';
    case 'accepted':
      return 'default';
    case 'rejected':
      return 'destructive';
    default:
      return 'outline';
  }
}
