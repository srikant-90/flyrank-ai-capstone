async function getHealthData() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/todos/1",
    {
      cache: "no-store",
    }
  );

  return response.json();
}

export default async function HealthPage() {
  const data = await getHealthData();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Health Check</h1>

      <div className="border rounded-lg p-4 shadow">
        <p><strong>ID:</strong> {data.id}</p>
        <p><strong>Title:</strong> {data.title}</p>
        <p>
          <strong>Status:</strong>{" "}
          {data.completed ? "Completed ✅" : "Pending ⏳"}
        </p>
      </div>
    </div>
  );
}