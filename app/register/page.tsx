"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { User, Mail, Lock, UserCircle, Briefcase, KeyRound, Eye, EyeOff } from "lucide-react"
import { Logo } from "@/components/Logo"
import { registration } from "@/features/auth/server/auth.actions"
import { toast } from "sonner"
import { useForm, Controller } from "react-hook-form"
import { registerWithConfirmSchema, type RegisterWithConfirmSchema } from "@/features/auth/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"


const Registration: React.FC = () => {
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        resolver: zodResolver(registerWithConfirmSchema),
        defaultValues: {
            role: 'applicant'
        }
    })

    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const onSubmit = async (data: RegisterWithConfirmSchema) => {
        setIsLoading(true);
        setError(null);

        try {

            const result = await registration(data);
            if (result.success) {
                toast.success("Registration successful!");
                router.push("/login?registered=true");
            }
        } catch (err: any) {
            toast.error(err.message || "Registration failed");
            setError(err.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
            {/* Left Side: Form Container */}
            <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-12">
                <div className="w-full max-w-md mx-auto">
                    <Logo />
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-left duration-700">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create an account</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">Enter your details to register for Jobpilot</p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md animate-in fade-in duration-300">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                    <Input
                                        type="text"
                                        id="name"
                                        placeholder="John Doe"
                                        {...register("name")}
                                        className="pl-10 h-11 border-slate-200 focus:ring-primary/20"
                                    />
                                </div>
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}

                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                                <div className="relative group">
                                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                    <Input
                                        type="text"
                                        id="username"
                                        placeholder="johndoe123"
                                        {...register("username")}
                                        className="pl-10 h-11 border-slate-200 focus:ring-primary/20"
                                    />
                                </div>
                                {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                    <Input
                                        type="email"
                                        id="email"
                                        placeholder="name@example.com"
                                        {...register("email")}
                                        className="pl-10 h-11 border-slate-200 focus:ring-primary/20"
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            placeholder="••••••••"
                                            {...register("password")}
                                            className="pl-10 h-11 border-slate-200 focus:ring-primary/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm</Label>
                                    <div className="relative group">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            placeholder="••••••••"
                                            {...register("confirmPassword")}
                                            className="pl-10 h-11 border-slate-200 focus:ring-primary/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-sm font-medium">Account Type</Label>
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="h-11 w-full relative pl-10 border-slate-200">
                                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="applicant">Applicant</SelectItem>
                                                <SelectItem value="employer">Employer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
                            >
                                {isLoading ? "Creating Account..." : "Register Account"}
                            </Button>
                        </form>

                        <div className="text-center text-sm text-slate-500">
                            Already have an account?{" "}
                            <a href="/login" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">Login</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Image with Overlay */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <Image
                    src="/images/windows-hNiNxhUfCfQ-unsplash.jpg"
                    alt="Register Workspace"
                    fill
                    className="object-cover transform transition-transform duration-10000 hover:scale-110"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/40 to-transparent flex items-end p-16">
                    <div className="text-white space-y-4 max-max-lg animate-in fade-in slide-in-from-bottom duration-1000">
                        <h2 className="text-5xl font-extrabold tracking-tight leading-tight max-w-lg">Empowering your career journey</h2>
                        <p className="text-xl text-slate-200/90 leading-relaxed font-light max-w-lg">Join the most trusted platform connecting talented professionals with top-tier employers.</p>
                        <div className="flex gap-4 pt-4">
                            <div className="h-1 w-12 bg-primary rounded-full" />
                            <div className="h-1 w-12 bg-slate-400/30 rounded-full" />
                            <div className="h-1 w-12 bg-slate-400/30 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Registration

