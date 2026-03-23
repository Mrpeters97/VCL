import React, { useState, useRef, useEffect } from 'react'
import { useProduct } from '../context/ProductContext2'
import { useScroll } from '../context/ScrollContext'
import { Combobox } from './ui/combobox'
import { Button } from './ui/button'

const VARIANT_OPTIONS = [
  { label: 'Monthly terminable - 1 GB', value: 'Monthly terminable - 1 GB' },
  { label: 'Monthly terminable - Unlimited', value: 'Monthly terminable - Unlimited' },
  { label: '1 year terminable - 1 GB', value: '1 year terminable - 1 GB' },
  { label: '1 year terminable - Unlimited', value: '1 year terminable - Unlimited' },
  { label: '2 years terminable - 1 GB', value: '2 years terminable - 1 GB' },
  { label: '2 years terminable - Unlimited', value: '2 years terminable - Unlimited' },
]

const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'English' },
  { label: 'Dutch', value: 'Dutch' },
]

// --- DESIGN SYSTEM DOCUMENTATION ---
// All section titles (h2):
// color: var(--base-foreground, #18181B);
// font-family: var(--typography-font-family-font-sans, Inter);
// font-weight: var(--font-weight-semibold, 600);
// line-height: var(--typography-base-sizes-large-line-height, 28px);
//
// Description text:
// color: var(--base-muted-foreground, #71717A);
// font-family: var(--typography-font-family-font-sans, Inter);
// font-weight: var(--font-weight-normal, 400);
// font-size: 14px;
// line-height: 20px;
//
// Labels (inputs/selects):
// color: var(--base-muted-foreground, #71717A);
// font-family: var(--typography-font-family-font-sans, Inter);
// font-weight: var(--font-weight-normal, 400);
// font-size: 14px;
// line-height: 20px;

export default function VariantSelector() {
  const { variant, handleVariantChange, language, handleLanguageChange } = useProduct()
  const { scrollY } = useScroll()
  const [selectorWidth, setSelectorWidth] = useState(null)
  const containerRef = useRef(null)
  const selectorRef = useRef(null)

  // Animation progress: 0 (no scroll) to 1 (>= 60px scroll)
  const progress = Math.min(scrollY / 60, 1)
  
  // When sticky, position is exactly where the PageHeader ends (71px)
  const stickyTop = 71
  
  // Selector becomes sticky when the header section would scroll past 71px mark
  // Header section height: ~110px (h2 + p + button with margins)
  // Initial position from top of page: 132px (marginTop in App.jsx)
  // So top of selector = 132 + 110 = 242px
  // Sticky triggers when scrollY reaches (242 - 71) = 171px, but earlier = 141px
  const isSticky = scrollY >= 141

  useEffect(() => {
    // Measure the actual width of the selector container
    const measureWidth = () => {
      if (selectorRef.current) {
        setSelectorWidth(selectorRef.current.offsetWidth)
      }
    }

    // Initial measurement
    measureWidth()

    // Measure on window resize
    window.addEventListener('resize', measureWidth)

    return () => {
      window.removeEventListener('resize', measureWidth)
    }
  }, [])

  return (
    <div className="w-full max-w-full">
      {/* Header section */}
      <div className="flex items-center justify-between" style={{ marginBottom: '24px', display: isSticky ? 'none' : 'flex' }}>
        <div>
          <h2
            style={{
              color: 'var(--base-foreground, #18181B)',
              fontFamily: 'var(--typography-font-family-font-sans, Inter)',
              fontSize: '18px',
              fontWeight: 'var(--font-weight-semibold, 600)',
              lineHeight: 'var(--typography-base-sizes-large-line-height, 28px)',
              margin: 0,
            }}
          >
            Select variant + language
          </h2>
          <p
            style={{
              color: 'var(--base-muted-foreground, #71717A)',
              fontFamily: 'var(--typography-font-family-font-sans, Inter)',
              fontSize: '14px',
              fontWeight: 'var(--font-weight-normal, 400)',
              lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
              margin: 0,
              marginTop: '4px',
            }}
          >
            Select the product variant + language combination to adjust the specific product information.
          </p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-9 px-4 border-gray-200"
          style={{
            color: 'var(--base-foreground, #18181B)',
            fontFamily: 'var(--typography-font-family-font-sans, Inter)',
            fontSize: '14px',
            fontWeight: 'var(--font-weight-normal, 400)',
            lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.33334 4.08333H11.6667V5.25H2.33334V4.08333ZM4.08334 6.41667H9.91668V7.58333H4.08334V6.41667ZM5.83334 8.75H8.16668V9.91667H5.83334V8.75Z" fill="black"/>
          </svg>
          Filter
        </Button>
      </div>

      {/* Selectors container */}
      <div
        ref={selectorRef}
        style={{
          display: 'flex',
          padding: 'var(--Gap-3, 12px) var(--Gap-6, 24px)',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: isSticky ? '0px 0px 6px 6px' : '6px',
          border: '1px solid var(--base-border, #E4E4E7)',
          borderTop: isSticky ? 'none' : '1px solid var(--base-border, #E4E4E7)',
          background: '#FFFFFF',
          gap: '24px',
          position: isSticky ? 'fixed' : 'relative',
          top: isSticky ? `${stickyTop}px` : 'auto',
          left: isSticky ? '288px' : 'auto',
          right: isSticky ? '0' : 'auto',
          width: isSticky && selectorWidth ? `${selectorWidth}px` : 'auto',
          marginRight: isSticky ? '32px' : 'auto',
          zIndex: isSticky ? 9997 : 1000,
          boxShadow: isSticky ? '0 4px 4px 0 rgba(0, 0, 0, 0.10)' : 'none',
          opacity: isSticky ? 1 : 1,
          transform: isSticky ? 'translateY(0)' : 'translateY(0)',
          transition: 'position 0.3s cubic-bezier(0.4, 0, 0.2, 1), top 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-top 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Variant Selector */}
        <div className="flex-1 flex flex-col gap-2">
          <label
            style={{
              overflow: 'hidden',
              color: 'var(--base-sidebar-foreground, #3F3F46)',
              textOverflow: 'ellipsis',
              fontFamily: 'var(--typography-font-family-font-sans, Inter)',
              fontSize: '14px',
              fontWeight: 'var(--font-weight-medium, 500)',
              lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
            }}
          >
            Variant
          </label>
          <Combobox
            options={VARIANT_OPTIONS}
            value={variant}
            onValueChange={handleVariantChange}
            placeholder="Monthly terminable - 1 GB"
            className="bg-white border-gray-200 h-10 shadow-none"
          />
        </div>

        {/* Divider */}
        <div
          style={{
            width: '1px',
            height: '65px',
            background: 'var(--base-border, #E4E4E7)',
          }}
        />

        {/* Language Selector */}
        <div className="flex-0 flex flex-col gap-2" style={{ minWidth: '180px' }}>
          <label
            style={{
              overflow: 'hidden',
              color: 'var(--base-sidebar-foreground, #3F3F46)',
              textOverflow: 'ellipsis',
              fontFamily: 'var(--typography-font-family-font-sans, Inter)',
              fontSize: '14px',
              fontWeight: 'var(--font-weight-medium, 500)',
              lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
            }}
          >
            Language
          </label>
          <Combobox
            options={LANGUAGE_OPTIONS}
            value={language}
            onValueChange={handleLanguageChange}
            placeholder="English"
            className="bg-white border-gray-200 h-10 shadow-none"
          />
        </div>
      </div>
    </div>
  )
}
