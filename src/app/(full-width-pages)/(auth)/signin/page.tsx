'use client'

import { Metadata } from "next";
  import React from 'react'
import { motion } from 'framer-motion'
import { Compass, Map } from 'lucide-react'

import { LoginForm } from "./LoginForm";

// export const metadata: Metadata = {
//   title: "Next.js SignIn Page | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Signin Page TailAdmin Dashboard Template",
// };

export default function SignIn() {

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern - Topographic Lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none ">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="topography"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 100 C 20 0 50 0 100 100 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M0 50 C 20 0 50 0 100 50 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topography)" />
        </svg>
      </div>

      {/* Abstract Map Decorations */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.5,
          ease: 'easeOut',
        }}
        className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100  rounded-full blur-3xl opacity-50 pointer-events-none"
      />
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.5,
          delay: 0.2,
          ease: 'easeOut',
        }}
        className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-50 pointer-events-none"
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card Container */}
        <div className="bg-white/80 dark:bg-gray-900 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-slate-100/50 dark:border-gray-700">
            <motion.div
              initial={{
                scale: 0.5,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 200,
              }}
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white mb-4 shadow-lg shadow-slate-900/20"
            >
              <Compass className="w-6 h-6" />
            </motion.div>

            <motion.h1
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
              className="text-2xl dark:text-gray-200 font-serif font-bold text-slate-900 mb-2 tracking-tight"
            >
              Welcome to Atan
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.4,
              }}
              className="text-slate-500 text-sm"
            >
              Stay on top of every workflow.
            </motion.p>
          </div>

          {/* Form Section */}
          <div className="p-8 ">
            <LoginForm />
          </div>

          {/* Footer Section */}
          <div className="px-8 py-4 bg-slate-50 dark:bg-gray-900 border-t border-slate-100 dark:border-gray-700 text-center">
            {/* <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <a
                href="#"
                className="font-medium text-slate-900 hover:text-slate-700 hover:underline transition-colors"
              >
                Request access
              </a>
            </p> */}
          </div>
        </div>

        {/* Bottom Branding */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.8,
          }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-slate-400 dark:text-gray-200 font-medium tracking-widest uppercase">
            Designed by dmrpacific
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}


