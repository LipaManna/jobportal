import { BriefcaseBusiness } from "lucide-react"

export const Logo = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`flex items-center gap-2 font-bold text-2xl tracking-tight ${className}`}>
                <BriefcaseBusiness />
            <span className="text-slate-900 dark:text-white">
                Job<span className="text-primary">pilot</span>
            </span>
        </div>
    )
}
