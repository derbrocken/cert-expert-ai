import { Navbar } from "@/components/layout";
import { CertificationOsModuleOverview } from "@/modules/00-dashboard/CertificationOsModuleOverview";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <Navbar />
      <CertificationOsModuleOverview />
    </div>
  );
}
