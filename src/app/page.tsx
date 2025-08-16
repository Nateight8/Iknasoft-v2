import { DealsTable } from "@/components/deals-table";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Deals Dashboard
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1 sm:mt-2">
            Manage your sales pipeline with advanced filtering, sorting, and interactions
          </p>
        </div>
        <div className="overflow-x-auto">
          <DealsTable />
        </div>
      </div>
    </div>
  );
}
