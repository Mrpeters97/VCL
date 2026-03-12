import { Badge } from './badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '.';

const BADGE_TEXT = {
  'variant-channel': 'V-C',
  'variant': 'V',
  'channel': 'C',
  'channel-local': 'C',
};

export default function AttributeBadge({ differsOn, diffLabels }) {
  if (!differsOn) {
    return <div className="w-12 shrink-0" aria-hidden="true"></div>;
  }

  const badgeText = BADGE_TEXT[differsOn] || '';
  const tooltipText = diffLabels[differsOn] || '';

  return (
    <div className="w-12 shrink-0 flex justify-start">
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="whitespace-nowrap text-xs font-semibold cursor-help">
            {badgeText}
          </Badge>
        </TooltipTrigger>
        <TooltipContent align="center">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}