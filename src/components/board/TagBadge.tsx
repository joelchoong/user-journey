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
  mvp: {
    label: 'MVP',
    className: 'bg-tag-mvp-bg text-tag-mvp border border-tag-mvp/20',
  },
  v1: {
    label: 'V1',
    className: 'bg-tag-v1-bg text-tag-v1 border border-tag-v1/20',
  },
  v2: {
    label: 'V2',
    className: 'bg-tag-v2-bg text-tag-v2 border border-tag-v2/20',
  },
  'out-of-scope': {
    label: 'Out of Scope',
    className: 'bg-tag-oos-bg text-tag-oos border border-tag-oos/20',
  },
};

export const TagBadge = ({ tag, size = 'sm' }: TagBadgeProps) => {
  const config = tagConfig[tag];

  return (
    <span
      data-tag="true"
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
