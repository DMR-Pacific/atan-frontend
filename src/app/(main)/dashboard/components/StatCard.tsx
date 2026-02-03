import React from 'react'
import { BoxIcon, LucideIcon } from 'lucide-react'
interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  color?: string
}
export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = '#3b82f6',
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: `${color}15`,
          }}
        >
          <Icon
            className="w-6 h-6"
            style={{
              color,
            }}
          />
        </div>
      </div>
    </div>
  )
}
