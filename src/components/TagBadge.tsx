import { CardTag } from '@/types/journey';
import { cn } from '@/lib/utils';

interface TagBadgeProps {
  tag: CardTag;
  size?: 'sm' | 'md';
}

const tagConfig: Record<CardTag, { label: string; className: string }> = {
  user: {
    label: 'User',
    className: 'bg-tag-user-bg text-tag-user',
  },
  system: {
    label: 'System',
    className: 'bg-tag-system-bg text-tag-system',
  },
  admin: {
    label: 'Admin',
    className: 'bg-tag-admin-bg text-tag-admin',
  },
  edge: {
    label: 'Edge Case',
    className: 'bg-tag-edge-bg text-tag-edge',
  },
};

export const TagBadge = ({ tag, size = 'sm' }: TagBadgeProps) => {
  const config = tagConfig[tag];

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      )}
    >
      {config.label}
    </span>
  );
};
