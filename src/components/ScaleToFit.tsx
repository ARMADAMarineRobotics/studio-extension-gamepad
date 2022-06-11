import { useCallback, useMemo } from "react";


export function ScaleToFit(
    { children }: { children: JSX.Element }
): JSX.Element {
    const resizeObserver = useMemo(() => {
        return new ResizeObserver((entries) => {
            if (entries.length === 0)
                return;
            
            const wrapper = (entries[0]!.target as HTMLDivElement);
            const content = (wrapper.firstChild! as HTMLDivElement);

            const { width: ww, height: wh } = wrapper.getBoundingClientRect();
            const { width: cw, height: ch } = content.getBoundingClientRect();

            // Compute scale that fits the parent div at the same aspect ratio
            let scaleFactor = Math.min(ww / cw, wh / ch);

            // If this doesn't require a modification, leave it be
            if (Math.abs(scaleFactor - 1.0) <= 0.001)
                return;

            // Combine with the scale factor that is currently being applied.
            // This assumes the transformation *only* scales.
            scaleFactor *= (new DOMMatrix(content.style.transform)).a;

            // Apply the transformation
            content.style.transformOrigin = "center";
            content.style.transform = `scale(${scaleFactor})`;
        });
    }, []);

    const observe = useCallback((element: HTMLDivElement) => {
        resizeObserver.disconnect();
        resizeObserver.observe(element);
    }, [resizeObserver]);

    const wrapperStyle = {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    return (
        <div ref={observe} style={wrapperStyle}>
            <div>
                {children}
            </div>
        </div>
    );
}
