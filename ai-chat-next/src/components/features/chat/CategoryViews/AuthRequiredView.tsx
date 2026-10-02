import Link from "next/link";
import DemoCategoriesView from "./DemoCategoriesView";
import { localizationService } from "@/services/localizationService";

interface AuthRequiredViewProps {
  onSelect: (id: string, name: string) => void;
}

export default function AuthRequiredView({ onSelect }: AuthRequiredViewProps) {
  return (
    <>
      <div className="mb-6 text-center text-sm text-mute">
        {localizationService.get("Please")}{" "}
        <Link href="/api/auth/signin" className="text-blue-600 hover:underline">
          {localizationService.get("LogIn,")}
        </Link>{" "}
        {localizationService.get("OrRegister")}
      </div>
      <DemoCategoriesView onSelect={onSelect} />
    </>
  );
}
