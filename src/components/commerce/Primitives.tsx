/** Small presentational pieces shared by the commerce UI (server-safe). */

/** The long brass-button arrow from the design (34×20 viewBox). */
export function Arrow({ width = 30, height = 18 }: { width?: number; height?: number }) {
  return (
    <svg className="sv-arrow" width={width} height={height} viewBox="0 0 34 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
      <path d="M0 10h32M23 1l9 9-9 9" />
    </svg>
  );
}

/** Section label: rule + (NN) + TITLE. */
export function SectionLabel({
  num,
  children,
  id,
  as: Tag = "div",
  className,
}: {
  num: string;
  children: React.ReactNode;
  id?: string;
  as?: "div" | "h1" | "h2" | "p";
  className?: string;
}) {
  return (
    <Tag id={id} className={className ? `sv-label ${className}` : "sv-label"}>
      <span className="sv-label__rule" aria-hidden="true" />
      <span className="sv-label__num">{num}</span>
      <span>{children}</span>
    </Tag>
  );
}
