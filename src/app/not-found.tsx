import { ErrorPageContent } from "@/components/ErrorPageContent";

export default function NotFound() {
  return <ErrorPageContent statusCode={404} />;
}
