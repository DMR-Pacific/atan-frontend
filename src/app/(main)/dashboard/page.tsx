'use client'

import React, { useEffect, useState } from 'react'
import {
  Package,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { StatCard } from './components/StatCard'
import { getDashboardStats } from '@/services/OrderStatsService'
import { toast } from 'sonner'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { useReference } from '@/hooks/useReference'
import { Avatar } from '@/components/Avatar'
import { stringify } from 'querystring'
import { ApiRefType } from '@/types/api/ApiRefType'

interface GraphProps {
  name?: string
  value: number | string
  color?: string
  [key: string]: string | number | undefined

}


export default function Dashboard() {

  const {data: cateogries} = useReference('category')
  const {data: priorities} = useReference('priority')
  const {data: clientTypes} = useReference('clientType')
  const {data: statuses} = useReference('status')

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {payload[0].payload.name === 'Orders'
              ? `${payload[0].totalSales} orders`
              : `$${payload[0].totalSales?.toLocaleString()}`}
          </p>
        </div>
      )
    }
    return null
  }

  const { stats, loading: loadingStats } = useDashboardStats()
  
  const [statsState, setStatsState] = useState<{
    completedPercentage: number
    completedOrders: number
    inProgressPercentage: number
    inProgressOrders: number
    totalSales: number
    revenueByClient:  GraphProps[]

  }>({
    completedPercentage: 0,
    completedOrders: 0,
    inProgressPercentage: 0,
    inProgressOrders: 0,
    totalSales: 0,
    revenueByClient: []

  })

  const [pieChartType, setPieChartType] = useState<ApiRefType>('status')
  const [pieChartStats, setPieChartStats] = useState<GraphProps[]>([])
  useEffect(() => {
    if (!stats) return

    console.log("DASH STATS --------" , stats)
    console.log("highest actyive--------" , stats?.highestValueActiveOrders)
    console.log("sales by client--------" , stats?.salesByClientType)

    const completedPercentage = Math.floor(100* (stats?.categoryStats.find(catStats => catStats.id == 3)?.count ?? 0)/stats?.totalOrders)
    const completedOrders = stats?.categoryStats.find(catStats => catStats.id ==3)?.count ?? 0
    console.log("completed orders--------" , completedOrders)
    
    const inProgressPercentage = 
      Math.floor(100* (
        stats?.categoryStats.reduce((sum, catStats) => {
          if (catStats.id != 3) sum += catStats.count
          return sum
        }, 0))/stats?.totalOrders)

    const inProgressOrders = stats?.categoryStats.reduce((sum, catStats) => {
          if (catStats.id != 3) sum += catStats.count
          return sum
        }, 0)

    const totalSales = stats?.totalSales



    const revenueByClient = stats?.salesByClientType
      .map((client) => {

        const clientTypeRef = clientTypes.find(clientType => client.clientTypeId == clientType.id)
        return {
          name: clientTypeRef?.label ?? 'Undefined',
          value: client.totalSales,
          color: clientTypeRef?.color ?? '#8884d8',
        }
      })

      setStatsState({
        completedPercentage,
        completedOrders,
        inProgressPercentage,

        inProgressOrders,
        totalSales,

        // ordersByStatus,


        revenueByClient,
      })
  }, [stats])




  useEffect(() => {
    if (!stats) return
    const ordersByStatus= stats.statusStats.map((statusStats) => {
        const statusRef = statuses.find(statusRef => statusStats.id == statusRef.id)
        return {
          name: statusRef?.label,
          value: statusStats.count,
          color: statusRef?.color,
        }
      })

    const ordersByPriority = stats.priorityStats.map((priorityStats) => {
        const priorityRef = priorities.find(priorityRef => priorityStats.id == priorityRef.id)
        return {
          name: priorityRef?.label,
          value: priorityStats.count,
          color: priorityRef?.color,
        }
      })

    const ordersByCategory = stats.categoryStats.map((categoryStats) => {
      const categoryRef = cateogries.find(categoryRef => categoryStats.id == categoryRef.id)
      return {
        name: categoryRef?.label || '',
        value: categoryStats.count,
        color: categoryRef?.color || '',
      }
    })

    const ordersByClientType = stats.clientTypeStats.map((clientTypeStats) => {
      const clientTypeRef = clientTypes.find(clientTypeRef => clientTypeStats.id == clientTypeRef.id)
      return {
        name: clientTypeRef?.label,
        value: clientTypeStats.count,
        color: clientTypeRef?.color,
      }
    })

    if (pieChartType == 'status') setPieChartStats(ordersByStatus)
    else if (pieChartType == 'priority') setPieChartStats(ordersByPriority)
    else if (pieChartType == 'category') setPieChartStats(ordersByCategory)
    else if (pieChartType == 'clientType') setPieChartStats(ordersByClientType)


  }, [pieChartType, stats])


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">
          Overview of orders and revenue
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={Package}
          color="#3b82f6"
          // subtitle={'This year'}
          // trend={{
          //   value: '12%',
          //   isPositive: true,
          // }}
        />
        <StatCard
          title="Completed"
          value={`${statsState.completedPercentage}%`}
          subtitle={`${statsState.completedOrders} orders`}
          icon={CheckCircle}
          color="#22c55e"
        />
        <StatCard
          title="In Progress"
          value={`${statsState.inProgressPercentage}%`}
          subtitle={`${statsState.inProgressOrders} orders`}
          icon={Clock}
          color="#f97316"
        />
        <StatCard
          title="Total Revenue"
          value={`$${statsState.totalSales?.toLocaleString()}`}
          icon={DollarSign}
          color="#8b5cf6"

        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Orders by     
                <select onChange={(e) => setPieChartType(e.target.value as ApiRefType)}>
                  <option value='status'>Status</option>
                  <option value='priority'>Priority</option>
                  <option value='category'>Category</option>
                  <option value='clientType'>Client Type</option>
                </select>
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Distribution of orders
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent = 0}) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartStats?.map((entry, index) => {
                  return (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                )})}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Client Type */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue by Client Type
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Total revenue breakdown
              </p>
            </div>
            <Users className="w-5 h-5 text-gray-400" />
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsState.revenueByClient}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{
                  fill: '#6b7280',
                  fontSize: 12,
                }}
                axisLine={{
                  stroke: '#e5e7eb',
                }}
              />
              <YAxis
                tick={{
                  fill: '#6b7280',
                  fontSize: 12,
                }}
                axisLine={{
                  stroke: '#e5e7eb',
                }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0, ]}>
                {statsState.revenueByClient?.map((entry, index) => {
                    console.log("ENTRY" , entry)
                  return (
                  <Cell key={`cell-${index}`} fill={entry.color} />

                )})}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent High-Value Orders */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              High-Value Active Orders
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Top 5 orders by sale
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {stats?.highestValueActiveOrders
            .slice(0, 5)
            .map((order) => {
              const status = statuses.find((s) => s.id === order.statusId)
              const clientType = clientTypes.find(
                (c) => c.id === order.clientTypeId,
              )


              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div 
                        className='flex -space-x-2'
                    >

                        {order.assignedToList.length > 0 &&
                        order.assignedToList.map((assignedUser, i) => {
                            return (
                                <Avatar 
                                    key={i}
                                    initials={assignedUser?.firstName[0] + assignedUser?.lastName[0] }
                                    className=""
                                />
                            )
                        })}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.label}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${status?.color}15`,
                            color: status?.color,
                          }}
                        >
                          {status?.label}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">
                          {clientType?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ${order?.value?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(order.updatedAt.split('.')[0]).toLocaleDateString('en-US')}</p>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
