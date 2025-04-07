import az900 from "@/components/assets/badges/az-900.png";
import gcpcdl from "@/components/assets/badges/gcp-cdl.png";

  
export const assets = [
  {
    id: "az900",
    name: "Microsoft Azure Fundamentals (AZ-900)",
    image: az900,
    alt: "AZ-900 Certification",
  },
  {
    id: "gcpcdl",
    name: "Google Cloud Digital Leader (GCP CDL)",
    image: gcpcdl,
    alt: "GCP CDL Certification",
  },
  {
    id: "cert3",
    name: "Some Other Certification",
    image: "/cert3.png", // Keeping this as a direct path since it's not imported
    alt: "Cert 3",
  },
];