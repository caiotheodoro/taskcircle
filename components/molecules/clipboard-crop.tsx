import { useState } from 'react';

import { CopyCheckIcon, CopyIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ClipboardCropProps {
  otp: string;
}
export function ClipboardCrop({ otp }: Readonly<ClipboardCropProps>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={handleCopy}
            className={`tracking-[0.5em] ${copied && 'border-green-500 focus:bg-green-100 bg-green-100'}`}
          >
            {otp}{' '}
            {copied ? (
              <CopyCheckIcon className="ml-2 h-4 w-4" />
            ) : (
              <CopyIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
