"use client";

type Props = {
  category: string;
  value: boolean | null;
  isActive: boolean;
  onRecord: (category: string, value: boolean) => void;
};

export default function CategoryControl({ category, value, isActive, onRecord }: Props) {
  const recorded = value !== null;

  const bg = recorded
    ? value
      ? "bg-green-500"
      : "bg-red-500"
    : "bg-gray-300";

  return (
    <div className={`flex items-center rounded px-2 py-1 ${bg}`}>
      {isActive && !recorded ? (
        <>
          <button
            onClick={() => onRecord(category, false)}
            className="text-xs bg-gray-600 hover:bg-gray-700 rounded px-1.5 py-0.5 leading-none"
            aria-label="No"
          >
            ▼
          </button>
          <span className="flex-1 text-center text-xs font-medium text-gray-800">
            {category}
          </span>
          <button
            onClick={() => onRecord(category, true)}
            className="text-xs bg-gray-600 hover:bg-gray-700 rounded px-1.5 py-0.5 leading-none"
            aria-label="Yes"
          >
            ▲
          </button>
        </>
      ) : (
        <span className="flex-1 text-center text-xs font-medium text-white">
          {category}
        </span>
      )}
    </div>
  );
}
