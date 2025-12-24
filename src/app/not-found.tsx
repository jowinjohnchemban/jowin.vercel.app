import ErrorPageContent from "./error/ErrorPageContent";

export default function NotFound() {
  return <ErrorPageContent statusCode={404} />;
}
