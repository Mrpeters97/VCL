import { useProduct } from '../context/ProductContext2'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Combobox } from './ui/combobox'

const CHANNELS = [
  'Belsimpel.nl', 'Gomibo.hu', 'Gomibo.pl', 'Gomibo.be', 'Gomibo.ie', 'Gomibo.pt',
  'Gomibo.bg', 'Gomibo.it', 'Gomibo.ro', 'Gomibo.cy', 'Gomibo.hr', 'Gomibo.si',
  'Gomibo.dk', 'Gomibo.lv', 'Gomibo.sk', 'Gomibo.de', 'Gomibo.lt', 'Gomibo.es',
  'Gomibo.ee', 'Gomibo.lu', 'Gomibo.cz', 'Gomibo.fi', 'Gomibo.mt', 'Gomibo.co.uk',
  'Gomibo.fr', 'Gomibo.no', 'Gomibo.se', 'Gomibo.gr', 'Gomibo.at', 'Gomibo.ch',
]

const LANGUAGE_AVAILABILITY = {
  'English': CHANNELS,
  'Dutch': ['Belsimpel.nl', 'Gomibo.be'],
  'German': ['Gomibo.de', 'Gomibo.at', 'Gomibo.ch', 'Gomibo.lu'],
  'French': ['Gomibo.fr', 'Gomibo.be', 'Gomibo.ch', 'Gomibo.lu'],
  'Italian': ['Gomibo.it', 'Gomibo.ch'],
}

const LANGUAGES = ['English', 'Dutch', 'German', 'French', 'Italian']

const VARIANTS = [
  { value: '128-black', label: '128 Black' },
  { value: '128-white', label: '128 White' },
  { value: '128-silver', label: '128 Silver' },
  { value: '128-gold', label: '128 Gold' },
  { value: '256-black', label: '256 Black' },
  { value: '256-white', label: '256 White' },
  { value: '256-silver', label: '256 Silver' },
  { value: '256-gold', label: '256 Gold' },
  { value: '512-black', label: '512 Black' },
  { value: '512-white', label: '512 White' },
]

function BoxHeader() {
  return (
    <div className="flex flex-col items-start gap-1 flex-1">
      <h3 className="text-lg font-semibold leading-normal text-black">
        Select variant + language
      </h3>
      <p className="text-sm leading-normal text-gray-600">
        Select the product variant + language combination to adjust the specific product information.
      </p>
    </div>
  )
}

export default function VariantSelector() {
  const {
    variant,
    language,
    handleVariantChange,
    handleLanguageChange,
  } = useProduct()

  const getLanguageOptions = () => {
    return [
      {
        label: 'Languages',
        items: LANGUAGES.map(lang => ({ value: lang, label: lang }))
      }
    ]
  }

  const handleLanguageChangeWithValidation = (newLanguage) => {
    handleLanguageChange(newLanguage)
  }

  const handleVariantChangeWithValidation = (newVariant) => {
    handleVariantChange(newVariant)
  }

  return (
    <div className="w-[816px] flex flex-col items-start gap-3">
      <BoxHeader />
      <div className="w-full bg-white rounded-md border border-gray-200 py-3 px-6 sticky top-16 z-40 shadow-sm">
        <div className="flex items-center gap-6">
          {/* Variant Selector */}
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-black mb-2">
              Variant
            </label>
            <Combobox
              options={VARIANTS.map(v => ({ value: v.value, label: v.label }))}
              value={variant}
              onValueChange={handleVariantChangeWithValidation}
              placeholder="Select variant"
            />
          </div>

          {/* divider */}
          <div className="h-14 border-l border-gray-200"></div>

          {/* Language Selector */}
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-black mb-2">
              Language
            </label>
            <Combobox
              options={LANGUAGES.map(lang => ({ value: lang, label: lang }))}
              value={language}
              onValueChange={handleLanguageChangeWithValidation}
              placeholder="Select language"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
