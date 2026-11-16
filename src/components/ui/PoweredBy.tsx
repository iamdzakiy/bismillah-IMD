import Image from 'next/image';
import { POWERED_BY } from '@/lib/constants';

export function PoweredBy() {
  return (
    <section className="px-4 py-16 sm:px-6" aria-labelledby="organisers-title">
      <div className="mx-auto max-w-7xl">
        <h2 id="organisers-title" className="tag-mono mb-8 text-center">
          Organised by
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {POWERED_BY.map((item) => (
            <li key={item.name} className="flex flex-col items-center gap-3">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full p-3 sm:h-24 sm:w-24 ${
                  'dark' in item && item.dark ? 'border border-white/15 bg-ink-700' : 'bg-paper'
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-xs text-white/50">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
