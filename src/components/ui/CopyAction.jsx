import { useState } from 'react';
import { Button } from './button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '.';
import { CopyIcon, CopyIconWhite } from './Icons';

export default function CopyAction({ field, onCopyConfirm }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copyOption, setCopyOption] = useState('variants');

  const handleConfirm = () => {
    onCopyConfirm(field, copyOption);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <CopyIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copy values to</DialogTitle>
          <DialogDescription>
            Directly copy this value to other channels and variants. Existing values will be overwritten and this action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50" htmlFor={`opt-variants-${field}`}>
            <input
              id={`opt-variants-${field}`}
              type="radio"
              name={`copy-option-${field}`}
              value="variants"
              checked={copyOption === 'variants'}
              onChange={(e) => setCopyOption(e.target.value)}
              className="mt-1"
            />
            <div>
              <div className="font-medium text-sm">All variants across current channel</div>
              <div className="text-xs text-gray-600">Copies this value to all variants within the current channel.</div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50" htmlFor={`opt-channels-${field}`}>
            <input
              id={`opt-channels-${field}`}
              type="radio"
              name={`copy-option-${field}`}
              value="channels"
              checked={copyOption === 'channels'}
              onChange={(e) => setCopyOption(e.target.value)}
              className="mt-1"
            />
            <div>
              <div className="font-medium text-sm">All channels for current variant</div>
              <div className="text-xs text-gray-600">Copies this value to this variant across all available channels.</div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50" htmlFor={`opt-all-${field}`}>
            <input
              id={`opt-all-${field}`}
              type="radio"
              name={`copy-option-${field}`}
              value="all"
              checked={copyOption === 'all'}
              onChange={(e) => setCopyOption(e.target.value)}
              className="mt-1"
            />
            <div>
              <div className="font-medium text-sm">All channels and variants</div>
              <div className="text-xs text-gray-600">Copies this value to all variants across all channels.</div>
            </div>
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
          <Button onClick={handleConfirm} className="gap-[var(--Gap-2,8px)] rounded-[var(--border-radius-md,6px)] bg-[var(--base-foreground,#18181B)] px-[var(--Gap-4,16px)] py-[var(--Gap-2-5,10px)] text-[#FAFAFA] hover:bg-[var(--base-foreground,#18181B)]/90">
            Copy to
            <CopyIconWhite />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}