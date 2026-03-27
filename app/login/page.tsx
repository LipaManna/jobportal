"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Logo } from "@/components/Logo"
import { login, validateSession } from "@/features/auth/server/auth.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema, loginSchema } from "@/features/auth/auth.schema"




const Login: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        }
    })

    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isCheckingSession, setIsCheckingSession] = useState(true)
    const router = useRouter()


    const onSubmit = async (data: LoginSchema) => {
        setIsLoading(true);
        try {
            const res = await login(data)
            if (res?.success) {
                sessionStorage.setItem("user", JSON.stringify(res.user))
                toast.success("Login successful")
                if (res.user.role === 'employer') {
                    router.push("/employer-dashboard");
                } else {
                    router.push("/dashboard");
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Login failed")
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    async function checkSession() {
        try {
            const user = await validateSession()
            if (user) {
                // const parsedUser = JSON.parse(user)
                if (user.role === 'employer') {
                    router.push("/employer-dashboard");
                } else {
                    router.push("/dashboard");
                }
            } else {
                setIsCheckingSession(false);
            }
        } catch (error) {
            setIsCheckingSession(false);
        }
    }

    useEffect(() => {
        checkSession()
    }, [])

    if (isCheckingSession) {
        return null; // Render nothing while checking session
    }

    return (
        <div className="min-h-screen flex bg-background text-foreground">
            {/* Left Side: Form Container */}
            <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-12">
                <div className="w-full max-w-md mx-auto">
                    <Logo />
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-left duration-700">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                            <p className="text-muted-foreground text-lg">Enter your credentials to access your Jobpilot account</p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                    <a href="#" className="text-sm text-primary hover:underline font-medium">Forgot password?</a>
                                </div>
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

                            <div className="flex items-center space-x-2 py-2">
                                <Controller
                                    name="rememberMe"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            id="rememberMe"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                                <label
                                    htmlFor="rememberMe"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 cursor-pointer"
                                >
                                    Remember me for 30 days
                                </label>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
                            >
                                {isLoading ? "Signing In..." : "Sign In"}
                            </Button>
                        </form>

                        <div className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <a href="/register" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">Register now</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Image with Overlay */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <Image
                    src="/images/windows-hNiNxhUfCfQ-unsplash.jpg"
                    alt="Login Workspace"
                    fill
                    className="object-cover transform transition-transform duration-10000 hover:scale-110"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/40 to-transparent flex items-end p-16">
                    <div className="text-white space-y-4 max-max-lg animate-in fade-in slide-in-from-bottom duration-1000">
                        <h2 className="text-5xl font-extrabold tracking-tight leading-tight max-w-lg">Welcome back to Jobpilot</h2>
                        <p className="text-xl text-slate-200/90 leading-relaxed font-light max-w-lg">Continue your journey and explore new opportunities waiting for you.</p>
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

export default Login
