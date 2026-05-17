'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, CreditCard, Mail, MapPin } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '@/components/ThemeContext'

const planDetails = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      '3 projects',
      'Basic AI analysis',
      '10 auto-fixes/day',
      'Community support',
      'VS Code extension',
    ],
  },
  pro: {
    name: 'Professional',
    monthlyPrice: 99,
    yearlyPrice: 69,
    features: [
      'Unlimited projects',
      'Advanced AI features',
      'Unlimited auto-fixes',
      'Priority support',
      'Team collaboration (5 seats)',
      'CI/CD integration',
      'Security scanner',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Everything in Pro',
      'Unlimited seats',
      'Dedicated AI model',
      'On-premise option',
      'Custom integrations',
      'SLA guarantee',
      '24/7 dedicated support',
    ],
  },
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { theme } = useTheme()
  
  const [mounted, setMounted] = useState(false)
  const [yearly, setYearly] = useState(false)
  const [processing, setProcessing] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  })
  
  const [errors, setErrors] = useState({})
  
  // Get and validate plan parameter
  const planParam = searchParams?.get('plan') || 'pro'
  const validPlans = ['free', 'pro', 'enterprise']
  const plan = validPlans.includes(planParam) ? planParam : 'pro'
  const currentPlan = planDetails[plan]
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return null
  }
  
  const colors = {
    dark: {
      background: '#0a0e27',
      cardBg: 'rgba(15,20,35,0.6)',
      text: '#e0e0e0',
      textSecondary: '#9ca3af',
      border: 'rgba(255,255,255,0.05)',
      inputBg: 'rgba(15,20,35,0.8)',
      inputBorder: 'rgba(255,255,255,0.1)',
    },
    light: {
      background: '#f8f9fa',
      cardBg: 'rgba(255,255,255,0.9)',
      text: '#1a1a1a',
      textSecondary: '#4b5563',
      border: 'rgba(0,0,0,0.08)',
      inputBg: '#ffffff',
      inputBorder: 'rgba(0,0,0,0.15)',
    }
  }
  
  const themeColors = colors[theme]
  
  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }
  
  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '')
    return /^\d{16}$/.test(cleaned)
  }
  
  const validateExpiration = (exp) => {
    if (!/^\d{2}\/\d{2}$/.test(exp)) return false
    const [month, year] = exp.split('/').map(Number)
    if (month < 1 || month > 12) return false
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false
    return true
  }
  
  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv)
  }
  
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }
  
  const handleBlur = (field) => {
    let error = ''
    
    if (field === 'email' && formData.email && !validateEmail(formData.email)) {
      error = 'Please enter a valid email address'
    } else if (field === 'cardNumber' && formData.cardNumber && !validateCardNumber(formData.cardNumber)) {
      error = 'Please enter a valid card number'
    } else if (field === 'expirationDate' && formData.expirationDate && !validateExpiration(formData.expirationDate)) {
      error = 'Please enter a valid expiration date (MM/YY)'
    } else if (field === 'cvv' && formData.cvv && !validateCVV(formData.cvv)) {
      error = 'Please enter a valid CVV code'
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address'
    
    if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required'
    else if (!validateCardNumber(formData.cardNumber)) newErrors.cardNumber = 'Please enter a valid card number'
    
    if (!formData.expirationDate) newErrors.expirationDate = 'Expiration date is required'
    else if (!validateExpiration(formData.expirationDate)) newErrors.expirationDate = 'Please enter a valid expiration date'
    
    if (!formData.cvv) newErrors.cvv = 'CVV is required'
    else if (!validateCVV(formData.cvv)) newErrors.cvv = 'Please enter a valid CVV code'
    
    if (!formData.billingAddress.street) newErrors['billingAddress.street'] = 'Street address is required'
    if (!formData.billingAddress.city) newErrors['billingAddress.city'] = 'City is required'
    if (!formData.billingAddress.state) newErrors['billingAddress.state'] = 'State is required'
    if (!formData.billingAddress.zipCode) newErrors['billingAddress.zipCode'] = 'ZIP code is required'
    if (!formData.billingAddress.country) newErrors['billingAddress.country'] = 'Country is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Simulate payment processing
    setProcessing(true)
    setTimeout(() => {
      router.push('/ide')
    }, 1500)
  }
  
  const isFormValid = () => {
    return (
      formData.email &&
      validateEmail(formData.email) &&
      formData.cardNumber &&
      validateCardNumber(formData.cardNumber) &&
      formData.expirationDate &&
      validateExpiration(formData.expirationDate) &&
      formData.cvv &&
      validateCVV(formData.cvv) &&
      formData.billingAddress.street &&
      formData.billingAddress.city &&
      formData.billingAddress.state &&
      formData.billingAddress.zipCode &&
      formData.billingAddress.country
    )
  }
  
  return (
    <div style={{
      background: themeColors.background,
      minHeight: '100vh',
      color: themeColors.text,
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: theme === 'dark' ? 'rgba(10,14,39,0.85)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${themeColors.border}`,
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: themeColors.text }}>
              <ArrowLeft size={20} />
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Back to Home</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: plan === 'free' ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Plan Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: themeColors.cardBg,
              borderRadius: '1.5rem',
              padding: '2rem',
              border: `1px solid ${themeColors.border}`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1rem' }}>
              {currentPlan.name} Plan
            </h2>
            
            {/* Price */}
            {plan === 'free' ? (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #00d9ff, #b026ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  $0
                </div>
                <p style={{ color: themeColors.textSecondary, marginTop: '0.5rem' }}>Forever free</p>
              </div>
            ) : plan === 'pro' ? (
              <div style={{ marginBottom: '2rem' }}>
                {/* Billing toggle */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <button
                    onClick={() => setYearly(false)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      background: !yearly ? 'linear-gradient(135deg, #00d9ff, #b026ff)' : 'transparent',
                      color: !yearly ? '#fff' : themeColors.textSecondary,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setYearly(true)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      background: yearly ? 'linear-gradient(135deg, #00d9ff, #b026ff)' : 'transparent',
                      color: yearly ? '#fff' : themeColors.textSecondary,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    Yearly (Save 30%)
                  </button>
                </div>
                
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #00d9ff, #b026ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  ${yearly ? currentPlan.yearlyPrice : currentPlan.monthlyPrice}
                </div>
                <p style={{ color: themeColors.textSecondary, marginTop: '0.5rem' }}>
                  per month{yearly && ', billed annually'}
                </p>
              </div>
            ) : (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{
                  fontSize: '2.25rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #00d9ff, #b026ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Custom Pricing
                </div>
                <p style={{ color: themeColors.textSecondary, marginTop: '0.5rem' }}>Contact sales for details</p>
              </div>
            )}
            
            {/* Features */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>What's included:</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentPlan.features.map((feature, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle size={18} style={{ color: '#22d3ee', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', color: themeColors.text }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* Payment Form or Free Plan CTA */}
          {plan === 'free' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: themeColors.cardBg,
                borderRadius: '1.5rem',
                padding: '2rem',
                border: `1px solid ${themeColors.border}`,
                backdropFilter: 'blur(12px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <div style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00d9ff, #b026ff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <CheckCircle size={32} color="#fff" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                No Payment Required
              </h3>
              <p style={{ color: themeColors.textSecondary, marginBottom: '2rem', maxWidth: '24rem' }}>
                Start using Optivix for free right away. No credit card needed.
              </p>
              <Link
                href="/ide"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.875rem 2rem',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, #00d9ff, #b026ff)',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(0,217,255,0.2)',
                }}
              >
                Get Started
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: themeColors.cardBg,
                borderRadius: '1.5rem',
                padding: '2rem',
                border: `1px solid ${themeColors.border}`,
                backdropFilter: 'blur(12px)',
              }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                Payment Information
              </h3>
              
              {/* Payment Method Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  Payment Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {['Card', 'PayPal', 'Crypto'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      style={{
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: `2px solid ${themeColors.inputBorder}`,
                        background: themeColors.inputBg,
                        color: themeColors.text,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#00d9ff'
                        e.target.style.background = 'rgba(0,217,255,0.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = themeColors.inputBorder
                        e.target.style.background = themeColors.inputBg
                      }}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Email */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    <Mail size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="you@example.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${errors.email ? '#ef4444' : themeColors.inputBorder}`,
                      background: themeColors.inputBg,
                      color: themeColors.text,
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                  {errors.email && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</p>
                  )}
                </div>
                
                {/* Card Number */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    <CreditCard size={16} />
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    onBlur={() => handleBlur('cardNumber')}
                    placeholder="1234 5678 9012 3456"
                    maxLength={16}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${errors.cardNumber ? '#ef4444' : themeColors.inputBorder}`,
                      background: themeColors.inputBg,
                      color: themeColors.text,
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                  {errors.cardNumber && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.cardNumber}</p>
                  )}
                </div>
                
                {/* Expiration and CVV */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      Expiration
                    </label>
                    <input
                      type="text"
                      value={formData.expirationDate}
                      onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                      onBlur={() => handleBlur('expirationDate')}
                      placeholder="MM/YY"
                      maxLength={5}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: `1px solid ${errors.expirationDate ? '#ef4444' : themeColors.inputBorder}`,
                        background: themeColors.inputBg,
                        color: themeColors.text,
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    />
                    {errors.expirationDate && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.expirationDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      CVV
                    </label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      onBlur={() => handleBlur('cvv')}
                      placeholder="123"
                      maxLength={4}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: `1px solid ${errors.cvv ? '#ef4444' : themeColors.inputBorder}`,
                        background: themeColors.inputBg,
                        color: themeColors.text,
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    />
                    {errors.cvv && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.cvv}</p>
                    )}
                  </div>
                </div>
                
                {/* Billing Address */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    <MapPin size={16} />
                    Billing Address
                  </label>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input
                      type="text"
                      value={formData.billingAddress.street}
                      onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                      placeholder="Street address"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: `1px solid ${errors['billingAddress.street'] ? '#ef4444' : themeColors.inputBorder}`,
                        background: themeColors.inputBg,
                        color: themeColors.text,
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <input
                        type="text"
                        value={formData.billingAddress.city}
                        onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                        placeholder="City"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: `1px solid ${errors['billingAddress.city'] ? '#ef4444' : themeColors.inputBorder}`,
                          background: themeColors.inputBg,
                          color: themeColors.text,
                          fontSize: '0.875rem',
                          outline: 'none',
                        }}
                      />
                      
                      <input
                        type="text"
                        value={formData.billingAddress.state}
                        onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                        placeholder="State"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: `1px solid ${errors['billingAddress.state'] ? '#ef4444' : themeColors.inputBorder}`,
                          background: themeColors.inputBg,
                          color: themeColors.text,
                          fontSize: '0.875rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <input
                        type="text"
                        value={formData.billingAddress.zipCode}
                        onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
                        placeholder="ZIP code"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: `1px solid ${errors['billingAddress.zipCode'] ? '#ef4444' : themeColors.inputBorder}`,
                          background: themeColors.inputBg,
                          color: themeColors.text,
                          fontSize: '0.875rem',
                          outline: 'none',
                        }}
                      />
                      
                      <input
                        type="text"
                        value={formData.billingAddress.country}
                        onChange={(e) => handleInputChange('billingAddress.country', e.target.value)}
                        placeholder="Country"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: `1px solid ${errors['billingAddress.country'] ? '#ef4444' : themeColors.inputBorder}`,
                          background: themeColors.inputBg,
                          color: themeColors.text,
                          fontSize: '0.875rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid() || processing}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    background: isFormValid() && !processing ? 'linear-gradient(135deg, #00d9ff, #b026ff)' : themeColors.border,
                    color: isFormValid() && !processing ? '#fff' : themeColors.textSecondary,
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: isFormValid() && !processing ? 'pointer' : 'not-allowed',
                    boxShadow: isFormValid() && !processing ? '0 8px 24px rgba(0,217,255,0.2)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {processing ? 'Processing...' : 'Complete Purchase'}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
