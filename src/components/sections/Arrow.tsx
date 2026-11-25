/** The long OBLO arrow used on primary buttons. */
export function Arrow({ width = 30, height = 18 }: { width?: number; height?: number }) {
  return (
    <svg
      className="sv-arrow"
      width={width}
      height={height}
      viewBox="0 0 34 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M0 10h32M23 1l9 9-9 9" />
    </svg>
  );
}
