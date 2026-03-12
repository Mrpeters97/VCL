import { useState } from 'react'
import { Button } from './button'
import { Input } from './input'
import { TooltipProvider } from '.'
import Toast from './Toast'
import FormRow from './FormRow'
import CopyAction from './CopyAction'
import AttributeBadge from './AttributeBadge'

const INITIAL_PRODUCT_DATA = {
  productIdentifier: {
    value: '123456ABC',
    differsOn: 'variant-channel',
  },
  name: {
    value: 'Samsung Galaxy Watch 13',
    differsOn: 'variant-channel',
  },
  ean: {
    value: '12345ABCDE',
    differsOn: 'channel-local',
  },
  brand: {
    value: 'Samsung',
    differsOn: null,
  },
}

const DIFF_LABELS = {
  'variant-channel': 'This attribute differs on variant and channel',
  'variant': 'This attribute differs on variant',
  'channel': 'This attribute differs on channel',
  'channel-local': 'This attribute differs on channel and is local',
}

export default function ProductInformation() {
  const [data, setData] = useState(INITIAL_PRODUCT_DATA)
  const [showToast, setShowToast] = useState(false)

  const handleFieldChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value
      }
    }))
  }

  const handleCopyConfirm = (field, option) => {
    // Simulate copy action
    console.log(`Copying ${field} value with option: ${option}`)
    setTimeout(() => {
      setShowToast(true)
    }, 300)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          {/* Toast Notification */}
          {showToast && (
            <Toast
              message="Values successfully copied to all variants in this channel"
              onClose={() => setShowToast(false)}
            />
          )}

          {/* Product Information Card */}
          <div className="flex flex-col items-start gap-6 w-[816px] p-8 rounded-[6px] border border-[#E4E4E7] bg-white flex-shrink-0">
            <h2 className="text-xl font-semibold">1. Product information</h2>

            <FormRow label="Product Identifier" required>
              <Input
                type="text"
                value={data.productIdentifier.value}
                onChange={(e) => handleFieldChange('productIdentifier', e.target.value)}
                className="flex-1"
                required
              />
              <CopyAction field="productIdentifier" onCopyConfirm={handleCopyConfirm} />
              <div className="h-10 border-l border-[#E4E4E7]"></div>
              <AttributeBadge differsOn={data.productIdentifier.differsOn} diffLabels={DIFF_LABELS} />
            </FormRow>

            <FormRow label="Name" required>
              <Input
                type="text"
                value={data.name.value}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="flex-1"
                required
              />
              <CopyAction field="name" onCopyConfirm={handleCopyConfirm} />
              <div className="h-10 border-l border-[#E4E4E7]"></div>
              <AttributeBadge differsOn={data.name.differsOn} diffLabels={DIFF_LABELS} />
            </FormRow>

            <FormRow label="EAN" required>
              <div className="flex-1 flex flex-col items-start gap-2">
                <Input
                  type="text"
                  value={data.ean.value}
                  onChange={(e) => handleFieldChange('ean', e.target.value)}
                  className="w-full"
                  required
                />
                <Button size="sm" variant="outline">
                  <span className="text-sm font-medium">+ Add EAN</span>
                </Button>
              </div>
              <div className="flex items-center self-start gap-[var(--Gap-2,8px)]">
                <CopyAction field="ean" onCopyConfirm={handleCopyConfirm} />
                <div className="h-10 border-l border-[#E4E4E7]"></div>
                <AttributeBadge differsOn={data.ean.differsOn} diffLabels={DIFF_LABELS} />
              </div>
            </FormRow>

            <FormRow label="Brand" required>
              <select
                value={data.brand.value}
                onChange={(e) => handleFieldChange('brand', e.target.value)}
                className="flex-1 h-10 pl-3 pr-10 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-[var(--border-radius-md,6px)] border border-solid border-[var(--base-input,#E4E4E7)] bg-[var(--base-background,#FFF)]"
                required
              >
                <option value="Samsung">Samsung</option>
                <option value="Apple">Apple</option>
                <option value="Google">Google</option>
              </select>
              <div className="invisible flex items-center gap-[var(--Gap-2,8px)]" aria-hidden="true">
                <div className="h-10 w-10"></div> {/* Placeholder for Copy Button */}
                <div className="h-10 border-l border-[#E4E4E7]"></div>
                <div className="w-12 shrink-0"></div> {/* Placeholder for Badge */}
              </div>
            </FormRow>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
