import { Metadata } from "next";
import OfflineActions from "./OfflineActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WifiOff } from "lucide-react";

// Static generation for instant loading
export const revalidate = false; // Never revalidate - fully static
export const fetchCache = 'force-cache';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: "Offline - Jowin John Chemban",
  description: "You're currently offline. Please check your internet connection.",
  robots: {
    index: false,
    follow: false,
  },
};
export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4 p-3 bg-muted rounded-full w-fit">
            <WifiOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">You&#39;re Offline</CardTitle>
          <CardDescription>
            It looks like you&#39;ve lost your internet connection. Don&#39;t worry, you can still browse some content that was cached.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Try these options:</p>
            <ul className="text-left space-y-1">
              <li>• Check your internet connection</li>
              <li>• Try refreshing the page</li>
              <li>• Some pages may still work offline</li>
            </ul>
          </div>
          <OfflineActions />
        </CardContent>
      </Card>
    </div>
  );
}