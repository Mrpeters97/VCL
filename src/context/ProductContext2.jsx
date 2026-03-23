import React, { createContext, useState, useCallback, useContext } from 'react'

const ProductContext = createContext()

const ARRAY_FIELDS = new Set(['ean'])

export function ProductProvider({ children }) {
  // Variant Selector State
  const [variant, setVariant] = useState('Monthly terminable - 1 GB')
  const [channel, setChannel] = useState('Belsimpel.nl')
  const [language, setLanguage] = useState('English')
  
  // Helper to generate variant-channel key
  const getVariantChannelKey = useCallback((v = variant, c = channel) => {
    return `${v}_${c}`
  }, [variant, channel])

  // Product Data State
  const [productData, setProductData] = useState({
    productIdentifier: { variantChannelValues: {}, differsOn: 'variant' },
    name: { variantChannelValues: {}, differsOn: 'variant-channel-language' },
    provider: { variantChannelValues: {}, differsOn: null },
    validFrom: { variantChannelValues: {}, differsOn: null },
    validUntil: { variantChannelValues: {}, differsOn: null },
    ean: { variantChannelValues: {}, differsOn: 'channel' },
    brand: { variantChannelValues: {}, differsOn: null },
    customerSegment: { variantChannelValues: {}, differsOn: null },
    activationType: { variantChannelValues: {}, differsOn: null },
    simType: { variantChannelValues: {}, differsOn: null },
    bundleType: { variantChannelValues: {}, differsOn: null },
    regularMonthlyCost: { variantChannelValues: {}, differsOn: 'variant-channel' },
    regularSetupCost: { variantChannelValues: {}, differsOn: 'variant-channel' },
    promotionSetupCost: { variantChannelValues: {}, differsOn: null },
    firstPromotionPrice: { variantChannelValues: {}, differsOn: null },
    firstPromotionPeriod: { variantChannelValues: {}, differsOn: null },
    secondPromotionPrice: { variantChannelValues: {}, differsOn: null },
    postUsageBehaviorData: { variantChannelValues: {}, differsOn: null },
    maxUploadSpeed: { variantChannelValues: {}, differsOn: null },
    maxDownloadSpeed: { variantChannelValues: {}, differsOn: null },
    networkFrequencyAccess: { variantChannelValues: {}, differsOn: null },
    networkOperator: { variantChannelValues: {}, differsOn: null },
    pairingCode: { variantChannelValues: {}, differsOn: null },
    linkedRegularSubscription: { variantChannelValues: {}, differsOn: null },
    loyaltyBenefits: { variantChannelValues: {}, differsOn: null },
    loyaltyBenefitsRequirements: { variantChannelValues: {}, differsOn: null },
  })

  const getProductFieldValue = useCallback((field) => {
    const key = getVariantChannelKey()
    const fieldData = productData[field]
    if (!fieldData) return ''
    
    const value = fieldData.variantChannelValues[key]
    if (value === undefined || value === null) {
      return ARRAY_FIELDS.has(field) ? [''] : ''
    }
    return value
  }, [productData, getVariantChannelKey])

  const updateProductField = useCallback((field, value) => {
    const key = getVariantChannelKey()
    setProductData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        variantChannelValues: {
          ...prev[field].variantChannelValues,
          [key]: value
        }
      }
    }))
  }, [getVariantChannelKey])

  const markFieldAsCopied = useCallback((field, copyMode) => {
    const currentKey = getVariantChannelKey()
    const currentValue = productData[field]?.variantChannelValues?.[currentKey]
    
    if (currentValue === undefined || currentValue === null || currentValue === '' || (Array.isArray(currentValue) && currentValue.every(v => !v))) {
      return
    }
    
    setProductData(prev => {
      const updated = { ...prev }
      const fieldData = updated[field]
      
      if (!fieldData.variantChannelValues) {
        fieldData.variantChannelValues = {}
      }
      
      const VARIANTS = ['Monthly terminable - 1 GB', 'Monthly terminable - Unlimited', '1 year terminable - 1 GB', '1 year terminable - Unlimited', '2 years terminable - 1 GB', '2 years terminable - Unlimited']
      const CHANNELS = ['Belsimpel.nl', 'Gomibo.hu', 'Gomibo.pl', 'Gomibo.be', 'Gomibo.ie', 'Gomibo.pt', 'Gomibo.bg', 'Gomibo.it', 'Gomibo.ro', 'Gomibo.cy', 'Gomibo.hr', 'Gomibo.si', 'Gomibo.dk', 'Gomibo.lv', 'Gomibo.sk', 'Gomibo.de', 'Gomibo.lt', 'Gomibo.es', 'Gomibo.ee', 'Gomibo.lu', 'Gomibo.cz', 'Gomibo.fi', 'Gomibo.mt', 'Gomibo.co.uk', 'Gomibo.fr', 'Gomibo.no', 'Gomibo.se', 'Gomibo.gr', 'Gomibo.at', 'Gomibo.ch']
      
      const keysToUpdate = []
      
      if (copyMode === 'variants') {
        VARIANTS.forEach(v => {
          keysToUpdate.push(`${v}_${channel}`)
        })
      } else if (copyMode === 'channels') {
        CHANNELS.forEach(c => {
          keysToUpdate.push(`${variant}_${c}`)
        })
      } else if (copyMode === 'all') {
        VARIANTS.forEach(v => {
          CHANNELS.forEach(c => {
            keysToUpdate.push(`${v}_${c}`)
          })
        })
      }
      
      keysToUpdate.forEach(key => {
        fieldData.variantChannelValues[key] = currentValue
      })
      
      return updated
    })
  }, [getVariantChannelKey, variant, channel, productData])

  const handleVariantChange = useCallback((newVariant) => {
    setVariant(newVariant)
  }, [])

  const handleChannelChange = useCallback((newChannel) => {
    setChannel(newChannel)
  }, [])

  const handleLanguageChange = useCallback((newLanguage) => {
    setLanguage(newLanguage)
  }, [])

  const value = {
    variant,
    channel,
    language,
    handleVariantChange,
    handleChannelChange,
    handleLanguageChange,
    productData,
    updateProductField,
    getProductFieldValue,
    markFieldAsCopied,
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProduct must be used within ProductProvider')
  }
  return context
}
