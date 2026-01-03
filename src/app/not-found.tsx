import ErrorPageContent from "./error/ErrorPageContent";

export default function NotFound() {
  return (
    <ErrorPageContent
      title="404 - Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      showHomeButton={true}
    />
  );
}
