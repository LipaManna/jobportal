import { getCurrentUser } from "@/features/auth/server/auth.queries"
import EmployerStats from "@/features/employers/components/EmployerStats"
import EmployerProfileCompletionStatus from "@/features/employers/components/EmployerProfileCompletionStatus"

const page = async () => {
  const user = await getCurrentUser()
  return (
    <>
      <h1 className="text-2xl font-medium text-foreground">
        Hello, <span className="capitalize">{user?.name}</span>
      </h1>
      <p className="text-muted-foreground mb-6">Here is your daily activities and applications</p>
      <EmployerStats />
      <EmployerProfileCompletionStatus />
    </>
  )
}

export default page