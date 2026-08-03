export default async function TaskDetailsPage({ params }) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        Task {params.id}
      </h1>

      <p className="mt-3 text-gray-600">
        Individual task details will appear here.
      </p>
    </div>
  );
}