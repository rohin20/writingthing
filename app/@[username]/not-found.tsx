import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfileNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Profile Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            The user profile you're looking for doesn't exist or may have been deleted.
          </p>
          <div className="flex gap-2 justify-center">
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 