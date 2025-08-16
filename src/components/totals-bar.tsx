"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, DollarSign, Users, Calendar, Target } from "lucide-react"

interface Deal {
  id: string
  deal: string
  stage: string
  dealValue: number
  contacts: string
  owner: string
  expectedClose: string
  forecastValue: number
}

interface TotalsBarProps {
  data: Deal[]
  selectedData?: Deal[]
  className?: string
}

export function TotalsBar({ data, selectedData, className }: TotalsBarProps) {
  const totals = useMemo(() => {
    const safeData = data || []
    const safeSelectedData = selectedData || []
    const activeData = safeSelectedData.length > 0 ? safeSelectedData : safeData

    if (!activeData || activeData.length === 0) {
      return {
        totalValue: 0,
        totalForecast: 0,
        totalDeals: 0,
        totalContacts: 0,
        avgDealValue: 0,
        conversionRate: 0,
        closingSoon: 0,
        stageBreakdown: {},
      }
    }

    const totalValue = activeData.reduce((sum, deal) => sum + deal.dealValue, 0)
    const totalForecast = activeData.reduce((sum, deal) => sum + deal.forecastValue, 0)
    const totalDeals = activeData.length
    const totalContacts = activeData.reduce((sum, deal) => sum + deal.contacts.split(", ").length, 0)

    const stageBreakdown = activeData.reduce(
      (acc, deal) => {
        acc[deal.stage] = (acc[deal.stage] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const avgDealValue = totalDeals > 0 ? totalValue / totalDeals : 0
    const conversionRate = totalDeals > 0 ? ((stageBreakdown["Closed Won"] || 0) / totalDeals) * 100 : 0

    const closingSoon = activeData.filter((deal) => {
      const closeDate = new Date(deal.expectedClose)
      const today = new Date()
      const daysUntilClose = Math.ceil((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilClose <= 30 && daysUntilClose >= 0
    }).length

    return {
      totalValue,
      totalForecast,
      totalDeals,
      totalContacts,
      avgDealValue,
      conversionRate,
      closingSoon,
      stageBreakdown,
    }
  }, [data, selectedData])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className={`sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-2 sm:p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 sm:flex-wrap">
          {/* Total Value */}
          <div className="flex items-center gap-1 sm:gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Total Value</span>
              <span className="font-semibold text-sm">{formatCurrency(totals.totalValue)}</span>
            </div>
          </div>

          <Separator orientation="vertical" className="h-8 hidden sm:block" />

          {/* Forecast Value */}
          <div className="flex items-center gap-1 sm:gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Forecast</span>
              <span className="font-semibold text-sm text-green-600">{formatCurrency(totals.totalForecast)}</span>
            </div>
          </div>

          <Separator orientation="vertical" className="h-8 hidden sm:block" />

          {/* Deal Count */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Deals</span>
              <span className="font-semibold text-sm">{totals.totalDeals}</span>
            </div>
          </div>

          <Separator orientation="vertical" className="h-8 hidden sm:block" />

          {/* Average Deal Value */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Avg Deal</span>
              <span className="font-semibold text-sm">{formatCurrency(totals.avgDealValue)}</span>
            </div>
          </div>

          <Separator orientation="vertical" className="h-8 hidden sm:block" />

          {/* Conversion Rate */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Win Rate</span>
              <span className="font-semibold text-sm">{formatPercentage(totals.conversionRate)}</span>
            </div>
          </div>

          <Separator orientation="vertical" className="h-8 hidden sm:block" />

          {/* Closing Soon */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Calendar className="h-4 w-4 text-orange-500" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Closing Soon</span>
              <span className="font-semibold text-sm text-orange-500">{totals.closingSoon}</span>
            </div>
          </div>
        </div>

        {/* Stage Breakdown */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 pt-2 sm:pt-0 border-t border-border sm:border-0 mt-2 sm:mt-0">
          <span className="text-xs text-muted-foreground mr-1 sm:mr-2">Stages:</span>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {Object.entries(totals.stageBreakdown).map(([stage, count]) => (
              <Badge key={stage} variant="secondary" className="text-[10px] sm:text-xs">
                {stage}: {count}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {selectedData && selectedData.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border">
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            <Users className="h-3 w-3 text-blue-500" />
            <span className="text-xs text-blue-500 font-medium">
              Showing totals for {selectedData.length} selected row{selectedData.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
