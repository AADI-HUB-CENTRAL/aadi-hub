import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandSymbol } from './Logo.jsx'
import { getIdentity } from '../utils/identity.js'
import { WELCOME_STEPS } from '../data/dashboardData.js'

const STEP_DURATION = 700
const LOAD_DURATION = 2000

export default function Welcome() {
  const navigate = useNavigate()
  const identity = getIdentity()
  const [activeStep, setActiveStep] = useState(0)
  const [allDone, setAllDone] = useState(false)

  useEffect(() => {
    if (!identity) {
      navigate('/register', { replace: true })
    }
  }, [identity, navigate])

  useEffect(() => {
    if (!identity) return

    const stepTimer = setTimeout(() => {
      setActiveStep((prev) => {
        if (prev < WELCOME_STEPS.length - 1) return prev + 1
        return prev
      })
    }, STEP_DURATION)

    return () => clearTimeout(stepTimer)
  }, [activeStep, identity])

  useEffect(() => {
    if (activeStep >= WELCOME_STEPS.length - 1 && identity) {
      const loadTimer = setTimeout(() => {
        setAllDone(true)
        const navTimer = setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 400)
        return () => clearTimeout(navTimer)
      }, LOAD_DURATION)
      return () => clearTimeout(loadTimer)
    }
  }, [activeStep, identity, navigate])

  if (!identity) return null

  const firstName = identity.fullName?.split(' ')[0] || 'there'

  return (
    <div className="welcome">
      <div className="welcome__content">
        <div className="welcome__brand">
          <BrandSymbol size={36} />
          <span className="welcome__brand-text">AADI HUB</span>
        </div>

        <h1 className="welcome__heading">
          Welcome to AADI HUB
        </h1>

        <p className="welcome__sub">
          Your identity is ready. Your workspace is being prepared.
        </p>

        <div className="welcome__user">
          <span className="welcome__user-name">Welcome, {firstName}</span>
          {identity.aadiId && (
            <span className="welcome__user-id">{identity.aadiId}</span>
          )}
        </div>

        <div className="welcome__steps">
          {WELCOME_STEPS.map((step, i) => {
            const isDone = i < activeStep || allDone
            const isActive = i === activeStep && !allDone
            return (
              <div
                key={step.id}
                className={`welcome__step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
              >
                <span className="welcome__step-num">
                  {isDone ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11.5 3.5L5.5 10.5L2.5 7.5" />
                    </svg>
                  ) : isActive ? (
                    <span className="welcome__step-dot" />
                  ) : (
                    `0${step.id}`
                  )}
                </span>
                <span className="welcome__step-label">{step.label}</span>
                <span className="welcome__step-status">
                  {isDone ? 'Ready' : isActive ? (step.id === 4 ? 'Loading' : 'Done') : 'Pending'}
                </span>
              </div>
            )
          })}
        </div>

        {allDone && (
          <p className="welcome__loading-text">
            Your workspace is loading...
          </p>
        )}
      </div>

      <div className="welcome__footer">
        <BrandSymbol size={16} />
        <span>AADI HUB — Where builders meet.</span>
      </div>
    </div>
  )
}
