import { memo } from "react";
import type { Tag } from "../types";

interface Props {
  tag: Tag;
  onClick?: () => void;
  selected?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export default memo(function TagBadge({ tag, onClick, selected, removable, onRemove }: Props) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-all
        ${selected ? "ring-2 ring-offset-1 ring-offset-white" : ""}
      `}
      style={{
        backgroundColor: tag.color + "22",
        color: tag.color,
        borderColor: tag.color,
        border: `1px solid ${tag.color}55`,
        ...(selected ? { ringColor: tag.color } : {}),
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: tag.color }}
      />
      {tag.name}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 hover:opacity-70"
        >
          ×
        </button>
      )}
    </span>
  );
})
