
export default function StudentDashboardPage() {
  const user = { name: "Alice Johnson" };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">
        Welcome back, {user.name}!
      </h1>
      <p className="text-muted-foreground">
        Here is your academic overview.
      </p>
    </div>
  );
}
