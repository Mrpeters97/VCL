import { useState, useEffect, useRef } from 'react'
import { useProduct } from '../../context/ProductContext2'
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

const PRODUCT_CARDS = [
  {
    id: 'product-information',
    title: 'Product information',
    fields: [
      {
        key: 'name',
        label: 'Name',
        required: true,
        type: 'text',
        differsOn: 'variant-language',
        placeholder: 'Unique product variant name',
      },
      {
        key: 'productIdentifier',
        label: 'Product Identifier',
        required: false,
        type: 'text',
        differsOn: 'variant',
        placeholder: 'Unique product identification code',
      },
      {
        key: 'provider',
        label: 'Provider',
        required: false,
        type: 'select',
        options: PROVIDER_OPTIONS,
        placeholder: 'Choose provider',
      },
      {
        key: 'validPeriod',
        label: 'Valid period',
        required: false,
        type: 'daterange',
        fields: ['validFrom', 'validUntil'],
      },
    ],
  },
  {
    id: 'compatibility',
    title: 'Compatibility',
    fields: [
      {
        key: 'customerSegment',
        label: 'Customer segment',
        required: true,
        type: 'select',
        options: [
          { value: 'business', label: 'Business' },
          { value: 'consumer', label: 'Consumer' },
          { value: 'both', label: 'Both' },
        ],
        placeholder: 'Select segment',
      },
      {
        key: 'activationType',
        label: 'Activation type',
        required: true,
        type: 'select',
        options: [
          { value: 'new-number', label: 'New number' },
          { value: 'number-porting', label: 'Number porting' },
          { value: 'renewal', label: 'Renewal' },
        ],
        placeholder: 'Select type',
      },
      {
        key: 'simType',
        label: 'SIM type',
        required: true,
        type: 'select',
        options: [
          { value: 'physical-sim', label: 'Physical SIM' },
          { value: 'esim', label: 'eSIM' },
        ],
        placeholder: 'Select type',
      },
      {
        key: 'bundleType',
        label: 'Bundle type',
        required: true,
        type: 'select',
        options: [
          { value: 'sim-only', label: 'SIM only' },
          { value: 'sim-hardware', label: 'SIM + Hardware' },
        ],
        placeholder: 'Select type',
      },
    ],
  },
  {
    id: 'monthly-costs',
    title: 'Monthly costs',
    fields: [
      {
        key: 'regularMonthlyCost',
        label: 'Regular monthly cost',
        required: true,
        type: 'price',
        differsOn: 'variant',
        placeholder: 'Type price',
      },
      {
        key: 'regularSetupCost',
        label: 'Regular setup cost',
        required: true,
        type: 'price',
        placeholder: 'Type price',
      },
      {
        key: 'promotionSetupCost',
        label: 'Promotion setup costs',
        required: false,
        type: 'price',
        placeholder: 'Type price',
      },
      {
        key: 'firstPromotionPrice',
        label: 'First promotion price',
        required: false,
        type: 'price',
        differsOn: 'variant',
        placeholder: 'Type price',
      },
      {
        key: 'firstPromotionPeriod',
        label: 'First promotion period',
        required: false,
        type: 'text',
        differsOn: 'variant',
        placeholder: 'Type amount of months',
      },
      {
        key: 'secondPromotionPrice',
        label: 'Second promotion price',
        required: false,
        type: 'price',
        differsOn: 'variant',
        placeholder: 'Type price',
      },
    ],
  },
  {
    id: 'bundle',
    title: 'Bundle',
    fields: [
      {
        key: 'postUsageBehaviorData',
        label: 'Post usage behaviour data',
        required: false,
        type: 'select',
        differsOn: 'variant',
        options: [
          { value: 'stop', label: 'Stop' },
          { value: 'throttle', label: 'Throttle' },
          { value: 'continue', label: 'Continue charging' },
        ],
        placeholder: 'Select type',
      },
    ],
  },
  {
    id: 'network',
    title: 'Network',
    fields: [
      {
        key: 'maxUploadSpeed',
        label: 'Maximum upload speed',
        required: false,
        type: 'speed',
        differsOn: 'variant',
        placeholder: 'Type speed',
      },
      {
        key: 'maxDownloadSpeed',
        label: 'Maximum download speed',
        required: false,
        type: 'speed',
        differsOn: 'variant',
        placeholder: 'Type speed',
      },
      {
        key: 'networkFrequencyAccess',
        label: 'Network frequency access',
        required: false,
        type: 'select',
        options: [
          { value: '4g', label: '4G' },
          { value: '5g', label: '5G' },
          { value: 'both', label: 'Both' },
        ],
        placeholder: 'Select frequency',
      },
      {
        key: 'networkOperator',
        label: 'Network operator',
        required: false,
        type: 'select',
        options: [
          { value: 'kpn', label: 'KPN' },
          { value: 'vodafone', label: 'Vodafone' },
          { value: 'tmobile', label: 'T-Mobile' },
        ],
        placeholder: 'Select operator',
      },
    ],
  },
  {
    id: 'pairing-codes',
    title: 'Pairing codes',
    fields: [
      {
        key: 'pairingCode',
        label: 'Pairing code',
        required: false,
        type: 'text',
        differsOn: 'variant',
        placeholder: 'Type pairing code',
      },
    ],
  },
  {
    id: 'loyalty-discounts',
    title: 'Loyalty discounts',
    fields: [
      {
        key: 'linkedRegularSubscription',
        label: 'Linked regular subscription',
        required: false,
        type: 'price',
        differsOn: 'variant',
        placeholder: 'Type price',
      },
      {
        key: 'loyaltyBenefits',
        label: 'Loyalty benefits',
        required: false,
        type: 'text',
        differsOn: 'variant',
        placeholder: 'Type loyalty benefits',
      },
      {
        key: 'loyaltyBenefitsRequirements',
        label: 'Loyalty benefits requirements',
        required: false,
        type: 'select',
        options: [
          { value: 'none', label: 'None' },
          { value: 'contractTerm', label: 'Contract term' },
          { value: 'minimumSpend', label: 'Minimum spend' },
        ],
        placeholder: 'Select requirements',
      },
    ],
  },
]

export default function ProductInformation() {
  const { productData, updateProductField, getProductFieldValue, markFieldAsCopied, variant, channel, language } = useProduct()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('Values successfully copied')
  const [isLoading, setIsLoading] = useState(false)
  const [showSystemNotification, setShowSystemNotification] = useState(false)
  const [systemNotificationMessage, setSystemNotificationMessage] = useState('')
  const prevValuesRef = useRef({ variant, channel, language })

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
      setIsLoading(true)
      setSystemNotificationMessage(changeMessage)

      const timer = setTimeout(() => {
        setIsLoading(false)
        setShowSystemNotification(true)
      }, 1500)

      const hideTimer = setTimeout(() => {
        setShowSystemNotification(false)
      }, 5500)

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

  const handleArrayFieldChange = (field, index, value) => {
    const currentArray = getProductFieldValue(field)
    const newArray = [...currentArray]
    newArray[index] = value
    handleFieldChange(field, newArray)
  }

  const handleAddArrayField = (field) => {
    const currentArray = getProductFieldValue(field)
    handleFieldChange(field, [...currentArray, ''])
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
    markFieldAsCopied(field, copyMode)
    const message = getCopyModeMessage(copyMode)
    setToastMessage(message)
    setTimeout(() => {
      setShowToast(true)
    }, 300)
  }

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

  // Auto-fill monthly costs based on variant
  useEffect(() => {
    if (!variant) return

    // Set Regular Setup Cost to 0 for all variants if empty
    if (!getProductFieldValue('regularSetupCost')) {
      updateProductField('regularSetupCost', 0)
    }

    // Set Regular Monthly Cost based on variant if empty
    if (!getProductFieldValue('regularMonthlyCost')) {
      const costMap = {
        'Monthly terminable - 1 GB': 11,
        'Monthly terminable - Unlimited': 26,
        '1 year terminable - 1 GB': 10,
        '1 year terminable - Unlimited': 25,
        '2 years terminable - 1 GB': 10,
        '2 years terminable - Unlimited': 25,
      }
      updateProductField('regularMonthlyCost', costMap[variant] || '')
    }
  }, [variant])

  const renderField = (fieldConfig) => {
    const value = getProductFieldValue(fieldConfig.key)

    if (fieldConfig.type === 'text-array') {
      return (
        <div className="flex-1 flex flex-col items-start gap-2">
          {value.map((item, index) => (
            <Input
              key={index}
              type="text"
              value={item}
              onChange={(e) => handleArrayFieldChange(fieldConfig.key, index, e.target.value)}
              placeholder={fieldConfig.placeholder}
              className="w-full"
              required={fieldConfig.required}
            />
          ))}
          <Button size="sm" variant="outline" onClick={() => handleAddArrayField(fieldConfig.key)}>
            <span className="text-sm font-medium">+ Add {fieldConfig.label}</span>
          </Button>
        </div>
      )
    }

    if (fieldConfig.type === 'select') {
      return (
        <div className="flex-1">
          <Combobox
            options={fieldConfig.options}
            value={value}
            onValueChange={(newValue) => handleFieldChange(fieldConfig.key, newValue)}
            placeholder={fieldConfig.placeholder}
          />
        </div>
      )
    }

    if (fieldConfig.type === 'price') {
      return (
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(fieldConfig.key, e.target.value)}
              placeholder={fieldConfig.placeholder}
              className="flex-1 pr-12"
              required={fieldConfig.required}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">Eur</span>
          </div>
        </div>
      )
    }

    if (fieldConfig.type === 'speed') {
      return (
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(fieldConfig.key, e.target.value)}
              placeholder={fieldConfig.placeholder}
              className="flex-1 pr-12"
              required={fieldConfig.required}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">MB/s</span>
          </div>
        </div>
      )
    }

    if (fieldConfig.type === 'date') {
      return (
        <Input
          type="date"
          value={value || ''}
          onChange={(e) => handleFieldChange(fieldConfig.key, e.target.value)}
          placeholder={fieldConfig.placeholder}
          className="flex-1"
          required={fieldConfig.required}
        />
      )
    }

    if (fieldConfig.type === 'daterange') {
      const fromValue = getProductFieldValue(fieldConfig.fields[0])
      const untilValue = getProductFieldValue(fieldConfig.fields[1])
      
      return (
        <div className="flex-1 flex gap-3 items-center">
          <input
            type="date"
            value={fromValue || ''}
            onChange={(e) => handleFieldChange(fieldConfig.fields[0], e.target.value)}
            className="flex-1 px-3 py-2 border border-[#E4E4E7] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={untilValue || ''}
            onChange={(e) => handleFieldChange(fieldConfig.fields[1], e.target.value)}
            className="flex-1 px-3 py-2 border border-[#E4E4E7] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )
    }

    // Default text field
    return (
      <Input
        type="text"
        value={value}
        onChange={(e) => handleFieldChange(fieldConfig.key, e.target.value)}
        placeholder={fieldConfig.placeholder}
        className="flex-1"
        required={fieldConfig.required}
        style={value && fieldConfig.key === 'name' ? {
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
    )
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex justify-center w-full">
        {showToast && (
          <Toast
            message={toastMessage}
            onClose={() => setShowToast(false)}
            variant="success"
          />
        )}

        {showSystemNotification && (
          <Toast
            message={systemNotificationMessage}
            onClose={() => setShowSystemNotification(false)}
            variant="system"
            duration={4000}
          />
        )}

        <div className="flex flex-col gap-6 w-full max-w-full">
          {PRODUCT_CARDS.map((card, cardIndex) => (
            <div
              key={card.id}
              id={card.id}
              className="relative flex flex-col items-start gap-6 p-8 rounded-[6px] border border-[#E4E4E7] bg-white"
            >
              {isLoading ? (
                <div className="flex flex-col gap-6 w-full">
                  <Skeleton className="h-7 w-72" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{cardIndex + 1}. {card.title}</h2>

                  <div className="w-full flex flex-col gap-6">
                    {card.fields.map((field) => (
                      <div key={field.key} className="w-full">
                        <FormRow label={field.label} required={field.required}>
                          <div className="flex-1 flex items-center gap-3 h-10">
                            <div className="flex-1 h-10">
                              {renderField(field)}
                            </div>
                            <div className="flex items-center h-10 gap-[var(--Gap-2,8px)] shrink-0">
                              {field.differsOn ? (
                                <>
                                  <CopyAction
                                    field={field.key}
                                    onCopyConfirm={handleCopyConfirm}
                                    disabled={!getProductFieldValue(field.key) || (Array.isArray(getProductFieldValue(field.key)) && getProductFieldValue(field.key).every(v => !v))}
                                  />
                                  <div className="h-10 border-l border-[#E4E4E7]"></div>
                                  <AttributeBadge differsOn={field.differsOn} diffLabels={DIFF_LABELS} />
                                </>
                              ) : (
                                <>
                                  <div className="h-10 w-10 shrink-0"></div>
                                  <div className="h-10 w-px"></div>
                                  <div className="h-10 w-12 shrink-0"></div>
                                </>
                              )}
                            </div>
                          </div>
                        </FormRow>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
