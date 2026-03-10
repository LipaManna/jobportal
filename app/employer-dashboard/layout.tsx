import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { redirect } from "next/navigation";



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
        <>
            {children}
        </>
    );
}
