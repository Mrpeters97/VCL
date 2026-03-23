import { Info } from 'lucide-react'
import { Button } from './ui/button'
import { VerticalDotsIcon } from './ui/Icons'
import { useScroll } from '../context/ScrollContext'

export default function PageHeader() {
  const { scrollY } = useScroll()

  // Animation progress: 0 (no scroll) to 1 (>= 60px scroll)
  const progress = Math.min(scrollY / 60, 1)

  return (
    <div 
      className="fixed top-0 left-64 right-0 bg-white border-b border-gray-200 flex flex-col items-start z-30 self-stretch"
      style={{
        fontFamily: 'var(--typography-font-family-font-sans, Inter)',
        paddingRight: '24px',
        paddingLeft: '24px',
        paddingBottom: `${16 + 8 * (1 - progress)}px`, // 24px → 16px
        paddingTop: `${16 + 8 * (1 - progress)}px`, // 24px → 16px
        gap: '16px',
        transition: 'padding 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Breadcrumbs - Always in DOM, fully smooth fade/slide */}
      <div 
        className="flex items-center flex-wrap w-full"
        style={{
          display: 'flex',
          alignItems: 'center',
          alignContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          fontFamily: 'var(--typography-font-family-font-sans, Inter)',
          fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
          fontStyle: 'normal',
          fontWeight: 'var(--font-weight-normal, 400)',
          lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
          opacity: 1 - progress,
          transform: `translateY(-${12 * progress}px)`,
          pointerEvents: progress === 1 ? 'none' : 'auto',
          marginBottom: `${-10 * progress}px`,
          height: `${20 * (1 - progress)}px`,
          transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <span style={{ color: 'var(--base-muted-foreground, #71717A)' }}>Dashboard</span>
        <span className="text-gray-400">&rsaquo;</span>
        <span style={{ color: 'var(--base-muted-foreground, #71717A)' }}>All products</span>
        <span className="text-gray-400">&rsaquo;</span>
        <span style={{ color: 'var(--base-muted-foreground, #71717A)' }}>KPN Data Only</span>
        <span className="text-gray-400">&rsaquo;</span>
        <span style={{ color: 'var(--base-foreground, #18181B)' }}>Edit product</span>
      </div>

      {/* Main Header */}
      <div className="w-full flex items-center justify-between" style={{ height: '32px' }}>
        {/* Left side: Title, Badge, Divider, Completeness CTA */}
        <div 
          className="flex items-center"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--Gap-3, 12px)',
          }}
        >
          <h1 style={{
            color: 'var(--base-foreground, #18181B)',
            fontFamily: 'var(--typography-typography-components-h3-font-family, Inter)',
            fontSize: '20px',
            fontStyle: 'normal',
            fontWeight: 'var(--typography-typography-components-h3-font-weight, 600)',
            lineHeight: 'var(--typography-typography-components-h3-line-height, 32px)',
            letterSpacing: 'var(--typography-typography-components-h3-letter-spacing, -0.4px)',
            margin: 0,
          }}>
            KPN Data Only
          </h1>

          {/* Draft Badge */}
          <span style={{
            borderRadius: 'var(--border-radius-full, 9999px)',
            border: '1px solid var(--tailwind-colors-base-transparent, rgba(255, 255, 255, 0.00))',
            background: 'var(--base-secondary, #F4F4F5)',
            padding: '4px 8px',
            fontSize: '12px',
            fontWeight: '500',
            color: 'var(--base-sidebar-foreground, #3F3F46)',
          }}>
            Draft
          </span>

          {/* Divider */}
          <div style={{
            height: '32px',
            width: '1px',
            background: 'var(--base-border, #E4E4E7)',
          }} />

          {/* Completeness Score Button */}
          <Button variant="outline" size="sm" className="h-8 gap-2 rounded-full border-gray-200 px-3 text-xs font-medium text-gray-600 hover:bg-gray-50">
            <Info className="h-3.5 w-3.5" />
            Completeness score
          </Button>
        </div>

        {/* Right side: Autosaved, Publish CTA, Menu */}
        <div className="flex items-center gap-4">
          <span style={{
            color: 'var(--base-foreground, #18181B)',
            fontFamily: 'var(--typography-font-family-font-sans, Inter)',
            fontSize: 'var(--typography-base-sizes-extra-small-font-size, 12px)',
            fontStyle: 'normal',
            fontWeight: 'var(--font-weight-normal, 400)',
            lineHeight: 'var(--typography-base-sizes-extra-small-line-height, 16px)',
          }}>
            Autosaved: 28-01-2026 16:07
          </span>
          <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            Publish to catalog
            <span>+</span>
          </button>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <VerticalDotsIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
