import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { BadgeCheckIcon, ChevronRightIcon, ShieldAlertIcon } from "lucide-react"
import Link from "next/link"
import { getCurrentEmployer } from "@/features/server/employers.queries"

const EmployerProfileCompletionStatus = async () => {
  const currentEmployer = await getCurrentEmployer();
  if(currentEmployer?.isProfileCompleted) return null;

    return (
        <div className="flex w-full flex-col gap-6 mt-6">
      <Item  className="bg-destructive text-white w-full p-6">
        <ItemMedia className="bg-destructive" variant="icon">
            <ShieldAlertIcon/>
          </ItemMedia>
        <ItemContent>
          <ItemTitle>Incomplete Profile</ItemTitle>
          <ItemDescription className="text-white">
            You haven't completed your employer profile yet. Please complete your profile to post jobs and access all features.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm" className="text-red-500">
            <Link href="/employer-dashboard/profile">Complete Profile</Link>
          </Button>
        </ItemActions>
      </Item>
      {/* <Item variant="outline" size="sm" asChild>
        <a href="#">
          <ItemMedia>
            <BadgeCheckIcon className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Your profile has been verified.</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </a>
      </Item> */}
    </div>
    )
}

export default EmployerProfileCompletionStatus