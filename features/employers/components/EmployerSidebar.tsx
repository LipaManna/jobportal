"use client"

import { logout } from "@/features/auth/server/auth.actions";
import { LayoutDashboard, User, Plus, Briefcase, Bookmark, CreditCard, Building, Settings, LogOut } from "lucide-react";
import Link from "next/link";
const base = "/employer-dashboard"

const navItems = [
    {
        name: "Overview",
        href: base + "/",
        icon: LayoutDashboard
    },
    {
        name: "Employers Profile",
        href: "",
        icon: User
    },
    {
        name: "Post a Job",
        href: "",
        icon: Plus
    },
    {
        name: "My Jobs",
        href: "",
        icon: Briefcase
    },
    {
        name: "Saved Candidates",
        href: "",
        icon: Bookmark
    },
    {
        name: "Plans & Billing",
        href: "",
        icon: CreditCard
    },
    {
        name: "All Companies",
        href: "",
        icon: Building
    },
    {
        name: "Settings",
        href: base + "/settings",
        icon: Settings
    }
]
const EmployerSidebar = () => {
    return (
        <div className="w-64 bg-card border-r border-border fixed bottom-0 top-0">
            <div className="p-6">
                <h2 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-widest">Employers Dashboard</h2>
            </div>
                <nav className="px-3 space-y-1">
                    <ul className="space-y-2">
                    {
                        navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <li key={item.name}>
                                    <Link href={item.href || "#"} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground">
                                    <Icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
                </nav>
                <div className="absolute bottom-6 left-3 right-3">
                    <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg  transition-colors w-full cursor-pointer">
                        <LogOut className="h-4 w-4" />
                        Logout  
                    </button>
                </div>
        </div>
    )
}

export default EmployerSidebar