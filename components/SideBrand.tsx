import Image from "next/image";
import Link from "next/link";

export function SideBrand() {
    return (
        <aside className="hidden lg:flex w-[260px] shrink-0 flex-col
                      min-h-dvh sticky top-0 self-start">
            <Link href="/" className="p-8 hover:opacity-80 transition-opacity">
                <Image
                    src="/coralia.avif"
                    alt="Coralia Environmental — ir al inicio"
                    width={110}
                    height={123}
                    className="h-auto"
                />
            </Link>
        </aside>
    );
}