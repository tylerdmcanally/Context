import { Source } from '@/types/story';

interface SourcesListProps {
  sources: Source[];
}

export default function SourcesList({ sources }: SourcesListProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t border-white/10">
      <h3 className="text-lg font-serif font-semibold mb-6 text-white">Sources</h3>
      <ul className="space-y-3">
        {sources.map((source, index) => (
          <li key={index} className="text-sm">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline font-medium"
            >
              {source.name}
            </a>
            <span className="text-white/50 ml-2">({source.bias})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

