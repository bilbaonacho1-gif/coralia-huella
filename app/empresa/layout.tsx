import Image from "next/image";
import { SideBrand } from "@/components/SideBrand";

export default function EmpresaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex-1 flex relative">
            <Image
                src="/hojas.webp"
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-left opacity-30 lg:opacity-20 pointer-events-none"
            />
            <div className="relative flex flex-1">
                <SideBrand />
                <div className="flex-1 flex flex-col min-w-0">{children}</div>
            </div>
        </div>
    );
}