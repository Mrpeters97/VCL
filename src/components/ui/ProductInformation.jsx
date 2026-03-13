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
  'variant-channel': 'This attribute differs on variant and channel',
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

export default function ProductInformation() {
  const { productData, updateProductField, getProductFieldValue, markFieldAsCopied, variant, channel, language } = useProduct()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('Values successfully copied')
  const [isLoading, setIsLoading] = useState(false)
  const [showSystemNotification, setShowSystemNotification] = useState(false)
  const [systemNotificationMessage, setSystemNotificationMessage] = useState('')
  const prevValuesRef = useRef({ variant, channel, language })

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
                  <FormRow label="Product Identifier" required>
                    <Input
                      type="text"
                      value={getProductFieldValue('productIdentifier')}
                      onChange={(e) => handleFieldChange('productIdentifier', e.target.value)}
                      placeholder="Enter unique product identification code"
                      className="flex-1"
                      required
                    />
                    <CopyAction field="productIdentifier" onCopyConfirm={handleCopyConfirm} disabled={!getProductFieldValue('productIdentifier')} />
                    <div className="h-10 border-l border-[#E4E4E7]"></div>
                    <AttributeBadge differsOn={productData.productIdentifier.differsOn} diffLabels={DIFF_LABELS} />
                  </FormRow>
                </div>

                <div className="w-full">
                  <FormRow label="Name" required>
                    <Input
                      type="text"
                      value={getProductFieldValue('name')}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      placeholder="Enter unique product name"
                      className="flex-1"
                      required
                    />
                    <CopyAction field="name" onCopyConfirm={handleCopyConfirm} disabled={!getProductFieldValue('name')} />
                    <div className="h-10 border-l border-[#E4E4E7]"></div>
                    <AttributeBadge differsOn={productData.name.differsOn} diffLabels={DIFF_LABELS} />
                  </FormRow>
                </div>

                <div className="w-full">
                  <FormRow label="EAN" required>
                    <div className="flex-1 flex flex-col items-start gap-2">
                      {getProductFieldValue('ean').map((ean, index) => (
                        <Input
                          key={index}
                          type="text"
                          value={ean}
                          onChange={(e) => handleEanChange(index, e.target.value)}
                          placeholder="1234567890"
                          className="w-full"
                          required
                        />
                      ))}
                      <Button size="sm" variant="outline" onClick={handleAddEan}>
                        <span className="text-sm font-medium">+ Add EAN</span>
                      </Button>
                    </div>
                    <div className="flex items-center self-start gap-[var(--Gap-2,8px)]">
                      <CopyAction field="ean" onCopyConfirm={handleCopyConfirm} disabled={getProductFieldValue('ean').every((ean) => !ean)} />
                      <div className="h-10 border-l border-[#E4E4E7]"></div>
                      <AttributeBadge differsOn={productData.ean.differsOn} diffLabels={DIFF_LABELS} />
                    </div>
                  </FormRow>
                </div>

                <div className="w-full">
                  <FormRow label="Brand" required>
                    <div className="flex-1">
                      <Combobox
                        options={BRAND_OPTIONS}
                        value={getProductFieldValue('brand')}
                        onValueChange={(value) => handleFieldChange('brand', value)}
                        placeholder="Select a brand"
                      />
                    </div>
                    <div className="invisible flex items-center gap-[var(--Gap-2,8px)]" aria-hidden="true">
                      <div className="h-10 w-10"></div> {/* Placeholder for Copy Button */}
                      <div className="h-10 border-l border-[#E4E4E7]"></div>
                      <div className="w-12 shrink-0"></div> {/* Placeholder for Badge */}
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
