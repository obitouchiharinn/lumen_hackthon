import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
// import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/Store/useAuthStore"
import { PasswordInput } from "./password-input"
// import google from "@/assets/google.svg"
import { useNavigate, useSearchParams } from "react-router-dom"

// ✅ Zod schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(7, "Password must be at least 7 characters long"),
})

const Login = () => {
  const { toggleAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  // ✅ React Hook Form with Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)

    // Mock API call
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (data.email === "test@example.com" && data.password === "1234567") {
            resolve(`Welcome Back..! ${data.email} `)
          } else {
            reject("Invalid email or password") 
          }
        }, 1500)
      }),
      {
        loading: "Logging in...",
        success: (msg) => {
          setIsLoading(false)
          navigate(redirect, { replace: true })
          return msg
        },
        error: (msg) => {
          setIsLoading(false)
          return msg
        },
      }
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="flex w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <PasswordInput
                  placeholder="*********"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <Button variant="outline" className="w-full" type="button">
                  {/* <img src={google} alt="google" className="w-5 h-5" /> */}
                  Login with Google
                </Button>
              </div>
            </div>

            {/* Toggle Auth */}
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="underline underline-offset-4"
                onClick={toggleAuth}
              >
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login