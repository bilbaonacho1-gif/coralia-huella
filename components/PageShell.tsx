import Image from "next/image";
import { SideBrand } from "./SideBrand";

export function PageShell({
    background,
    imageClassName = "object-cover object-left opacity-30 lg:opacity-20",
    children,
}: {
    background: string;
    imageClassName?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex-1 flex">
            <Image
                src={background}
                alt=""
                fill
                sizes="100vw"
                className={`${imageClassName} pointer-events-none`}
            />
            <div className="relative flex flex-1">
                <SideBrand />
                <div className="flex-1 flex flex-col min-w-0">{children}</div>
            </div>
        </div>
    );
}