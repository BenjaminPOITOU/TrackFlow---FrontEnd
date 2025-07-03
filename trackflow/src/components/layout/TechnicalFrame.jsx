/**
 * Renders the static decorative markers for the left side of the frame.
 * This is a private, non-exported component for internal use by TechnicalFrame.
 * @returns {JSX.Element} The left-side markers.
 */
const LeftMarkers = () => {
  return (
    <div className="absolute top-0 left-0 bottom-0 w-6 flex flex-col items-center justify-between py-12 z-0 pointer-events-none">
      <div className="flex flex-col items-center gap-2">
        <div className="w-0.5 h-8 bg-muted-foreground"></div>
        <div className="w-2 h-2 rounded-full border border-muted-foreground"></div>
        <div className="w-2 h-2 rounded-full border border-muted-foreground"></div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
        <div className="w-0.5 h-16 bg-muted-foreground"></div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="text-xs text-muted-foreground rotate-90 whitespace-nowrap">
          {"304"}
        </div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
      </div>
    </div>
  );
};

/**
 * Renders the static decorative markers for the right side of the frame.
 * This is a private, non-exported component for internal use by TechnicalFrame.
 * @returns {JSX.Element} The right-side markers.
 */
const RightMarkers = () => {
  return (
    <div className="absolute top-0 right-0 bottom-0 w-6 flex flex-col items-center justify-between py-12 z-0 pointer-events-none">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <div className="text-xs">FW</div>
        <div className="w-6 h-6 border border-muted-foreground rounded-full flex items-center justify-center">
          <div className="w-3 h-3 border border-muted-foreground rounded-full"></div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <div className="w-6 h-6 border border-muted-foreground rounded-full flex items-center justify-center">
          <div className="text-xs">+</div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <div className="text-xs">NIN</div>
        <div className="text-xs">14</div>
      </div>
    </div>
  );
};

/**
 * Renders a decorative technical-style frame around its content.
 * The frame consists of static visual markers on the left and right sides.
 * This is a Server Component as it is purely presentational.
 * @param {{ children: React.ReactNode }} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered inside the frame.
 * @returns {JSX.Element} A framed content wrapper.
 */
export default function TechnicalFrame({ children }) {
  return (
    <div className="relative h-full">
      <LeftMarkers />
      <RightMarkers />
      <div className="relative z-10 h-full p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}