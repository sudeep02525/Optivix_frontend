'use client'
import { useState, useEffect } from 'react'
import { Clock, Zap, Crown, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ACCENT = '#5b9cf5'
const SURFACE = '#161616'
const BORDER = 'rgba(255,255,255,0.08)'

export default function FreePeriodBanner() {
  const [userStatus, setUserStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUserStatus()
    const interval = setInterval(fetchUserStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchUserStatus() {
    try {
      const token = localStorage.getItem('nexus_token') || localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await fetch(`${base}/api/user/status`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setUserStatus(data.user)
      }
    } catch (error) {
      console.error('Failed to fetch user status:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleUpgrade() {
    router.push('/payment?plan=pro')
  }

  if (loading || !userStatus) return null

  const bannerStyle = {
    background: SURFACE,
    borderBottom: `1px solid ${BORDER}`,
    color: '#fafafa',
    padding: '10px 16px',
    textAlign: 'center',
  }

  const pillStyle = {
    fontSize: 12,
    background: 'rgba(91,156,245,0.1)',
    border: '1px solid rgba(91,156,245,0.25)',
    color: ACCENT,
    padding: '2px 10px',
    borderRadius: 9999,
  }

  const btnStyle = {
    marginLeft: 12,
    background: ACCENT,
    color: '#0c0c0c',
    padding: '4px 14px',
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
  }

  if (userStatus.freePeriodActive && userStatus.plan === 'free_period') {
    const daysLeft = userStatus.daysRemaining || 0
    const isExpiringSoon = daysLeft <= 7

    return (
      <div style={bannerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Zap style={{ width: 16, height: 16, color: ACCENT }} />
          <span style={{ fontWeight: 700, fontSize: 14 }}>
            {isExpiringSoon ? 'Free Period Ending Soon' : 'Free Period Active'}
          </span>
          <span style={{ color: '#6b7280' }}>·</span>
          <span style={{ fontWeight: 600, fontSize: 13 }}>
            {daysLeft} {daysLeft === 1 ? 'day' : 'days'} remaining
          </span>
          <span style={pillStyle}>Unlimited AI Access</span>
          {isExpiringSoon && (
            <button onClick={handleUpgrade} style={btnStyle}>
              Upgrade Now
            </button>
          )}
        </div>
      </div>
    )
  }

  if (userStatus.plan === 'free' && userStatus.usage) {
    const remaining = userStatus.limits.aiAnalysesPerDay - userStatus.usage.today
    const percentage = (remaining / userStatus.limits.aiAnalysesPerDay) * 100
    const isLow = remaining <= 3
    const isEmpty = remaining === 0

    return (
      <div style={bannerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Clock style={{ width: 16, height: 16, color: isEmpty ? '#f87171' : ACCENT }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>
              {remaining}/{userStatus.limits.aiAnalysesPerDay}
            </span>
            <span style={{ fontSize: 13, color: '#9ca3af' }}>AI analyses remaining today</span>
          </div>
          
          <div style={{ width: 120, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 9999, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: isEmpty ? '#f87171' : ACCENT,
                width: `${percentage}%`,
                transition: 'width 0.5s ease',
              }}
            />
          </div>

          {isEmpty ? (
            <>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>
                Resets in {userStatus.usage.resetIn}h
              </span>
              <button onClick={handleUpgrade} style={btnStyle}>
                Get Unlimited
              </button>
            </>
          ) : isLow ? (
            <button
              onClick={handleUpgrade}
              style={{ ...btnStyle, marginLeft: 0, background: 'rgba(91,156,245,0.1)', color: ACCENT, border: '1px solid rgba(91,156,245,0.25)' }}
            >
              Upgrade to Pro
            </button>
          ) : null}
        </div>
      </div>
    )
  }

  if (userStatus.plan === 'pro') {
    return (
      <div style={bannerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Crown style={{ width: 16, height: 16, color: ACCENT }} />
          <span style={{ fontWeight: 700, fontSize: 14 }}>PRO PLAN</span>
          <span style={pillStyle}>Unlimited AI Access</span>
        </div>
      </div>
    )
  }

  if (userStatus.plan === 'enterprise') {
    return (
      <div style={bannerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <TrendingUp style={{ width: 16, height: 16, color: ACCENT }} />
          <span style={{ fontWeight: 700, fontSize: 14 }}>ENTERPRISE PLAN</span>
          <span style={pillStyle}>Priority AI Access</span>
        </div>
      </div>
    )
  }

  return null
}
