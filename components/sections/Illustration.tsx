import type { ArtKind } from '@/lib/data';

/** Gold line illustrations, drawn in with stroke-dashoffset when the card enters */
const art: Record<ArtKind, React.ReactNode> = {
  city: (
    <>
      <path pathLength={1} d="M20 122h160" />
      <path pathLength={1} d="M32 122V64h26v58M58 122V34h34v88M92 122V72h24v50M116 122V48h32v74M148 122V82h22v40" />
      <path pathLength={1} d="M66 48h6M80 48h6M66 62h6M80 62h6M66 76h6M80 76h6M66 90h6M80 90h6M124 62h6M136 62h6M124 76h6M136 76h6M124 90h6M136 90h6" />
      <path pathLength={1} d="M75 34V20M75 20l8 4-8 4" />
    </>
  ),
  contract: (
    <>
      <path pathLength={1} d="M58 18h58l22 22v84H58z" />
      <path pathLength={1} d="M116 18v22h22" />
      <path pathLength={1} d="M70 52h56M70 64h56M70 76h56M70 88h34" />
      <path pathLength={1} d="M68 108c8-10 14 6 22-2s10 4 16-2" />
      <path pathLength={1} d="M166 58l-44 44-10 4 4-10 44-44z M156 68l10 10" />
    </>
  ),
  family: (
    <>
      <circle pathLength={1} cx="70" cy="44" r="12" />
      <circle pathLength={1} cx="130" cy="44" r="12" />
      <circle pathLength={1} cx="100" cy="72" r="9" />
      <path pathLength={1} d="M46 124c0-28 10-48 24-48s24 20 24 48M106 124c0-28 10-48 24-48s24 20 24 48M84 124c0-18 7-32 16-32s16 14 16 32" />
      <path pathLength={1} d="M30 124h140" />
    </>
  ),
  gavel: (
    <>
      <g transform="rotate(-38 95 52)">
        <rect pathLength={1} x="62" y="38" width="66" height="28" rx="5" />
        <path pathLength={1} d="M74 38v28M116 38v28" />
        <path pathLength={1} d="M95 66v66" />
      </g>
      <path pathLength={1} d="M104 124h66v-10h-66zM114 114v-8h46v8" />
      <path pathLength={1} d="M30 124h60" />
    </>
  ),
  house: (
    <>
      <path pathLength={1} d="M38 122V72l46-36 46 36v50z" />
      <path pathLength={1} d="M28 80l56-46 56 46" />
      <path pathLength={1} d="M70 122V94h28v28" />
      <circle pathLength={1} cx="160" cy="62" r="12" />
      <path pathLength={1} d="M160 74v40M160 98h11M160 108h8" />
      <path pathLength={1} d="M20 122h120" />
    </>
  ),
  idea: (
    <>
      <path pathLength={1} d="M100 20a32 32 0 0 0-18 58c4 4 6 9 6 14h24c0-5 2-10 6-14a32 32 0 0 0-18-58z" />
      <path pathLength={1} d="M88 104h24M92 114h16" />
      <circle pathLength={1} cx="100" cy="50" r="11" />
      <path pathLength={1} d="M105 45a6 6 0 1 0 0 10" />
      <path pathLength={1} d="M52 50H40M160 50h-12M64 18l-8-8M136 18l8-8M64 82l-8 8M136 82l8 8" />
    </>
  ),
};

export default function Illustration({ kind }: { kind: ArtKind }) {
  return (
    <svg className="illu" viewBox="0 0 200 140" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {art[kind]}
    </svg>
  );
}
