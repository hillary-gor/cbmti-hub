import VisitorCheckinForm from "./components/VisitorCheckinForm";

export default function VisitorCheckinPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Visitor Check-in
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Effortlessly record new visitor entries.
        </p>
      </header>

      <div className="max-w-xl mx-auto bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700">
        <VisitorCheckinForm />
      </div>
    </div>
  );
}
