import Image from "next/image";
import Link from "next/link";
import { SideBrand } from "./SideBrand";

export function PageShell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex-1 flex">
            <SideBrand />
            <div className="flex-1 flex flex-col min-w-0">
                <Link
                    href="/"
                    className="lg:hidden px-6 pt-6 hover:opacity-80 transition-opacity"
                >
                    <Image
                        src="/coralia.avif"
                        alt="Coralia Environmental — ir al inicio"
                        width={120}
                        height={130}
                        className="h-auto w-14"
                    />
                </Link>
                {children}
            </div>
        </div>
    );
}