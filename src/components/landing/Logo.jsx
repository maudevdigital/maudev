export default function Logo({ size = 32, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-label="maudev logo"
    >
      <rect width="64" height="64" rx="14" fill="currentColor" fillOpacity="0.08" />
      <rect x="2" y="2" width="60" height="60" rx="13" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" />
      <g fontFamily="ui-monospace, Menlo, Consolas, monospace" fontWeight="800" fill="currentColor">
        <text x="10" y="42" fontSize="22">m</text>
        <text x="28" y="42" fontSize="22">/</text>
        <text x="40" y="42" fontSize="22">d</text>
      </g>
      <circle cx="54" cy="14" r="3" fill="currentColor" />
    </svg>
  );
}
