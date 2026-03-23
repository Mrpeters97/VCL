import { useState, useEffect, useRef } from 'react'
import { useProduct } from '../../context/ProductContext'
import { Button } from './button'
import { Input } from './input'
import { Combobox } from './combobox'
import { TooltipProvider } from '.'
import Toast from './Toast'
import Skeleton from './Skeleton'
import FormRow from './FormRow'
import CopyAction from './CopyAction'
import AttributeBadge from './AttributeBadge'

const DIFF_LABELS = {
  'variant-channel-language': 'This attributes differs on variant, channel, and language',
  'variant-channel': 'This attribute differs on variant and channel',
  'variant-language': 'This attribute differs on variant and language',
  'variant': 'This attribute differs on variant',
  'channel': 'This attribute differs on channel',
  'channel-local': 'This attribute differs on channel and is local',
}

const BRAND_OPTIONS = [
  { value: 'samsung', label: 'Samsung' },
  { value: 'apple', label: 'Apple' },
  { value: 'google', label: 'Google Pixel' },
  { value: 'oneplus', label: 'OnePlus' },
  { value: 'motorola', label: 'Motorola' },
  { value: 'xiaomi', label: 'Xiaomi' },
  { value: 'oppo', label: 'OPPO' },
  { value: 'vivo', label: 'Vivo' },
  { value: 'realme', label: 'Realme' },
  { value: 'huawei', label: 'Huawei' },
  { value: 'nothing', label: 'Nothing' },
  { value: 'fairphone', label: 'Fairphone' },
  { value: 'sony', label: 'Sony' },
  { value: 'nokia', label: 'Nokia' },
  { value: 'honor', label: 'Honor' },
]

const PROVIDER_OPTIONS = [
  { value: 'vodafone', label: 'Vodafone' },
  { value: 'kpn', label: 'KPN' },
  { value: 'tmobile', label: 'T-Mobile' },
  { value: 'other', label: 'Other' },
]

export default function ProductInformation() {
  const { productData, updateProductField, getProductFieldValue, markFieldAsCopied, variant, channel, language } = useProduct()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('Values successfully copied')
  const [isLoading, setIsLoading] = useState(false)
  const [showSystemNotification, setShowSystemNotification] = useState(false)
  const [systemNotificationMessage, setSystemNotificationMessage] = useState('')
  const prevValuesRef = useRef({ variant, channel, language })

  // Helper function to generate name value
  const getGeneratedName = () => {
    if (!variant) return ''
    
    // Remove hyphens from variant name
    const cleanVariant = variant.replace(/ - /g, ' ')
    
    // Translate to Dutch if needed
    if (language === 'Dutch') {
      const variantMap = {
        'Monthly terminable 1 GB': 'Maandelijks opzegbaar 1 GB',
        'Monthly terminable 5 GB': 'Maandelijks opzegbaar 5 GB',
        'Monthly terminable 10 GB': 'Maandelijks opzegbaar 10 GB',
        '2 year terminable 1 GB': '2 jaar opzegbaar 1 GB',
        '2 year terminable 5 GB': '2 jaar opzegbaar 5 GB',
        '2 year terminable 10 GB': '2 jaar opzegbaar 10 GB',
      }
      return `KPN ${variantMap[cleanVariant] || cleanVariant}`
    }
    
    // English
    return `KPN ${cleanVariant}`
  }

  // Auto-fill name when variant or language changes and name is empty
  useEffect(() => {
    if (variant && language && !getProductFieldValue('name')) {
      updateProductField('name', getGeneratedName())
    }
  }, [variant, language])

  // Auto-fill default values when variant or channel changes
  useEffect(() => {
    // Generate Product Identifier based on variant
    if (variant && !getProductFieldValue('productIdentifier')) {
      const variantMap = {
        'Monthly terminable - 1 GB': '123456ABCD',
        'Monthly terminable - 5 GB': '123456ABCE',
        'Monthly terminable - 10 GB': '123456ABCF',
        '2 year terminable - 1 GB': '123456ABCG',
        '2 year terminable - 5 GB': '123456ABCH',
        '2 year terminable - 10 GB': '123456ABCI',
      }
      updateProductField('productIdentifier', variantMap[variant] || '')
    }

    // Set Provider to KPN if empty
    if (!getProductFieldValue('provider')) {
      updateProductField('provider', 'kpn')
    }

    // Set Valid Period dates if empty
    if (!getProductFieldValue('validFrom')) {
      updateProductField('validFrom', '2026-01-01')
    }
    if (!getProductFieldValue('validUntil')) {
      updateProductField('validUntil', '2026-03-31')
    }

    // Set Customer Segment to Consumer if empty
    if (!getProductFieldValue('customerSegment')) {
      updateProductField('customerSegment', 'consumer')
    }

    // Set Activation Type to "New number" if empty
    if (!getProductFieldValue('activationType')) {
      updateProductField('activationType', 'new-number')
    }

    // Set SIM Type to "Physical SIM" if empty
    if (!getProductFieldValue('simType')) {
      updateProductField('simType', 'physical-sim')
    }

    // Set Bundle Type to "SIM only" if empty
    if (!getProductFieldValue('bundleType')) {
      updateProductField('bundleType', 'sim-only')
    }
  }, [variant, channel])

  // Detect changes in variant, channel, or language
  useEffect(() => {
    const prev = prevValuesRef.current
    let changeMessage = ''

    if (prev.variant !== variant) {
      changeMessage = `You are now editing ${variant}`
    } else if (prev.channel !== channel) {
      changeMessage = `You are now editing on ${channel}`
    } else if (prev.language !== language) {
      changeMessage = `You are now editing in ${language}`
    }

    if (changeMessage) {
      // Show loading skeleton
      setIsLoading(true)
      setSystemNotificationMessage(changeMessage)

      // After 1.5 seconds, hide skeleton and show notification
      const timer = setTimeout(() => {
        setIsLoading(false)
        setShowSystemNotification(true)
      }, 1500)

      // Auto-hide notification after 4 seconds
      const hideTimer = setTimeout(() => {
        setShowSystemNotification(false)
      }, 5500)

      // Update prev values
      prevValuesRef.current = { variant, channel, language }

      return () => {
        clearTimeout(timer)
        clearTimeout(hideTimer)
      }
    }
  }, [variant, channel, language])

  const handleFieldChange = (field, value) => {
    updateProductField(field, value)
  }

  const handleEanChange = (index, value) => {
    const newEans = [...getProductFieldValue('ean')]
    newEans[index] = value
    handleFieldChange('ean', newEans)
  }

  const handleAddEan = () => {
    const newEans = [...getProductFieldValue('ean'), '']
    handleFieldChange('ean', newEans)
  }

  const getCopyModeMessage = (mode) => {
    const messages = {
      'variants': 'Values successfully copied to all variants in this channel',
      'channels': 'Values successfully copied to all channels for this variant',
      'all': 'Values successfully copied to all variants and channels'
    }
    return messages[mode] || 'Values successfully copied'
  }

  const handleCopyConfirm = (field, copyMode) => {
    // Copy field value propagating based on copy mode
    markFieldAsCopied(field, copyMode)
    const message = getCopyModeMessage(copyMode)
    setToastMessage(message)
    console.log(`Copying ${field} value with mode: ${copyMode}`)
    setTimeout(() => {
      setShowToast(true)
    }, 300)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex justify-center w-full">
        {/* Toast Notification */}
        {showToast && (
          <Toast
            message={toastMessage}
            onClose={() => setShowToast(false)}
            variant="success"
          />
        )}

        {/* System Notification Toast */}
        {showSystemNotification && (
          <Toast
            message={systemNotificationMessage}
            onClose={() => setShowSystemNotification(false)}
            variant="system"
            duration={4000}
          />
        )}

        {/* Product Information Card */}
        <div className="relative flex flex-col items-start gap-6 w-[816px] p-8 rounded-[6px] border border-[#E4E4E7] bg-white">
            {isLoading ? (
              <div className="flex flex-col gap-6 w-full">
                <Skeleton className="h-7 w-72" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold">1. Product information</h2>

                <div className="w-full">
                  <FormRow label="Name" required>
                    <div className="flex-1 flex items-center gap-3 h-10">
                      <Input
                        type="text"
                        value={getProductFieldValue('name')}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        placeholder="Unique product variant name"
                        className="flex-1 h-10"
                        required
                        style={getProductFieldValue('name') ? {
                          overflow: 'hidden',
                          color: 'var(--base-foreground, #18181B)',
                          textOverflow: 'ellipsis',
                          fontFamily: 'var(--typography-font-family-font-sans, Inter)',
                          fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
                          fontStyle: 'normal',
                          fontWeight: 'var(--font-weight-normal, 400)',
                          lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
                        } : {}}
                      />
                      <div className="flex items-center h-10 gap-[var(--Gap-2,8px)] shrink-0">
                        <CopyAction field="name" onCopyConfirm={handleCopyConfirm} disabled={!getProductFieldValue('name')} />
                        <div className="h-10 border-l border-[#E4E4E7]"></div>
                        <AttributeBadge differsOn="variant-language" diffLabels={DIFF_LABELS} />
                      </div>
                    </div>
                  </FormRow>
                </div>

                <div className="w-full">
                  <FormRow label="Product Identifier">
                    <div className="flex-1 flex items-center gap-3 h-10">
                      <Input
                        type="text"
                        value={getProductFieldValue('productIdentifier')}
                        onChange={(e) => handleFieldChange('productIdentifier', e.target.value)}
                        placeholder="Unique product identification code"
                        className="flex-1 h-10"
                      />
                      <div className="flex items-center h-10 gap-[var(--Gap-2,8px)] shrink-0">
                        <CopyAction field="productIdentifier" onCopyConfirm={handleCopyConfirm} disabled={!getProductFieldValue('productIdentifier')} />
                        <div className="h-10 border-l border-[#E4E4E7]"></div>
                        <AttributeBadge differsOn="variant" diffLabels={DIFF_LABELS} />
                      </div>
                    </div>
                  </FormRow>
                </div>

                <div className="w-full">
                  <FormRow label="Provider">
                    <div className="flex-1 flex items-center gap-3 h-10">
                      <div className="flex-1 h-10">
                        <Combobox
                          options={PROVIDER_OPTIONS}
                          value={getProductFieldValue('provider')}
                          onValueChange={(value) => handleFieldChange('provider', value)}
                          placeholder="Choose provider"
                        />
                      </div>
                      <div className="flex items-center h-10 gap-[var(--Gap-2,8px)] shrink-0">
                        <div className="h-10 w-10"></div>
                        <div className="h-10 w-px"></div>
                        <div className="w-12 shrink-0"></div>
                      </div>
                    </div>
                  </FormRow>
                </div>

                <div className="w-full">
                  <FormRow label="Valid period">
                    <div className="flex-1 flex items-center gap-3 h-10">
                      <div className="flex-1 flex gap-3 items-center h-10">
                        <Input
                          type="date"
                          value={getProductFieldValue('validFrom') || ''}
                          onChange={(e) => handleFieldChange('validFrom', e.target.value)}
                          placeholder="From"
                          className="flex-1 h-10"
                        />
                        <Input
                          type="date"
                          value={getProductFieldValue('validUntil') || ''}
                          onChange={(e) => handleFieldChange('validUntil', e.target.value)}
                          placeholder="Until"
                          className="flex-1 h-10"
                        />
                      </div>
                      <div className="flex items-center h-10 gap-[var(--Gap-2,8px)] shrink-0">
                        <div className="h-10 w-10"></div>
                        <div className="h-10 w-px"></div>
                        <div className="h-10 w-12 shrink-0"></div>
                      </div>
                    </div>
                  </FormRow>
                </div>
              </>
            )}
          </div>
      </div>
    </TooltipProvider>
  )
}
