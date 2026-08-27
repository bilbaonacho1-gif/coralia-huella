import { SideBrand } from "@/components/SideBrand";

export default function ConsultorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex-1 flex">
            <SideBrand />
            <div className="flex-1 flex flex-col min-w-0">{children}</div>
        </div>
    );
}