interface Props {
  jobs: any[];
}

export default function DashboardHeader({ jobs }: Props) {
  const total = jobs.length;
  const applied = jobs.filter((j) => j.status === "applied").length;
  const interview = jobs.filter((j) => j.status === "interviewing").length;
  const rejected = jobs.filter((j) => j.status === "rejected").length;

  return (
    <div>
      <h1 className="text-2xl font-bold">Good morning, John 👋</h1>
      <p className="text-gray-600">Track your applications and land your dream job</p>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{applied}</p>
          <p className="text-sm text-gray-500">Applied</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{interview}</p>
          <p className="text-sm text-gray-500">Interviews</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{rejected}</p>
          <p className="text-sm text-gray-500">Rejected</p>
        </div>
      </div>
    </div>
  );
}
