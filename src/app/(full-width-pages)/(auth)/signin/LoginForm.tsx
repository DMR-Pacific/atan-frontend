'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import axios from "axios"
import { SubmitHandler, useForm, FormProvider} from 'react-hook-form'
import AuthService from '@/services/AuthService'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

  const mapResponseDataToJWTAuthResponse = (data: any): JWTAuthResponse => {
    return {
      accessToken: data.accessToken,
      tokenType: data.tokenType,
      refreshToken: data.refreshToken,
      username: data.username,
      email: data.email,
      isVerifiedEmail: data.email,
      roles: data.roles,
      expiration: data.expiration,
    }
  }

export function LoginForm() {

    const methods = useForm<LoginDto>({
        defaultValues: {
            usernameOrEmail: 'testuser01',
            password: 'g00d.Helf'
        }
    })
    const router = useRouter()
    const {login} = useAuth()

    const { register, watch, formState: { errors }, handleSubmit} = methods
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: 'tet',
        password: '',
    })


    const submitHandler: SubmitHandler<LoginDto> = async (data) => {
        const loginUrl = process.env.NEXT_PUBLIC_DMRPACIFIC_API_URL || ""

        try {
            const response = await AuthService.signin(data) 

            login(mapResponseDataToJWTAuthResponse(response.data))

            console.log(response)
            router.push("/orders")
            

        } catch (err) {
            console.log(err)
        }


    }


    return (
        <FormProvider {...methods} >

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                <div className="space-y-4">
                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -10,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            delay: 0.1,
                        }}
                    >
                        {/* <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="explorer@atlas.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            icon={<Mail className="h-4 w-4" />}
                            autoComplete="email"
                        /> */}
                        <input 
                            {...register("usernameOrEmail")}
                            placeholder='Username or email'
                        />
                    </motion.div>

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -10,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            delay: 0.2,
                        }}
                    >
                        {/* <Input
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            icon={<Lock className="h-4 w-4" />}
                            autoComplete="current-password"
                            rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                                ) : (
                                <Eye className="h-4 w-4" />
                                )}
                            </button>
                            }
                        /> */}
                        <input 
                            {...register("password")}
                            placeholder='Password'
                        />
                    </motion.div>
                </div>

                <motion.div
                    initial={{
                    opacity: 0,
                    y: 10,
                    }}
                    animate={{
                    opacity: 1,
                    y: 0,
                    }}
                    transition={{
                    delay: 0.3,
                    }}
                    className="flex items-center justify-between text-sm"
                >
                    <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                        type="checkbox"
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                    />
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">
                        Remember me
                    </span>
                    </label>
                    <a
                    href="#"
                    className="font-medium text-slate-900 hover:text-slate-700 hover:underline"
                    >
                    Forgot password?
                    </a>
                </motion.div>

                <motion.div
                    initial={{
                    opacity: 0,
                    y: 10,
                    }}
                    animate={{
                    opacity: 1,
                    y: 0,
                    }}
                    transition={{
                    delay: 0.4,
                    }}
                >
                    <Button
                    type="submit"
                    fullWidth
                    isLoading={isLoading}
                    className="group relative overflow-hidden"
                    >
                    <span className="relative z-10 flex items-center">
                        Sign In to Atlas
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    </Button>
                </motion.div>
            </form>
        </FormProvider>

    )
}
