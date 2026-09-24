import type { Metadata } from "next";
import { migrationChecklist } from "@/lib/checklist";
import ChecklistTool from "@/components/ChecklistTool";

export const metadata: Metadata = {
  title: "Migration checklist — Classical Crypto Today",
  description: "A practical PQC-migration inventory checklist for GRC and architecture teams.",
};

export default function MigrationChecklistPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">Migration checklist</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        A practical PQC-migration inventory
      </h1>
      <p className="mt-4 text-muted">
        Not a compliance audit — a starting checklist for the discovery-and-planning work every
        organization eventually has to do. Your progress is saved locally in this browser only;
        nothing here is sent anywhere.
      </p>
      <ChecklistTool categories={migrationChecklist} />
    </div>
  );
}
