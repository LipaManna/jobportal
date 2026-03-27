import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { redirect } from "next/navigation";
import EmployerSidebar from "@/features/employers/components/EmployerSidebar";



export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    if (user?.role !== 'employer') {
        redirect("/dashboard");
    }

    return (
       <div className="flex min-h-screen bg-background">
        <EmployerSidebar />
        <main className="container mx-auto mt-5 ml-70 mr-5">
            {children}
        </main>
       </div>
    );
}
