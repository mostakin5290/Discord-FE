
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { FooterProps, HeaderProps } from "@/types"
import { Header } from "@/components/landing/header"
import Footer from "@/components/landing/footer"

interface PageLayoutProps {
    children: ReactNode
    header?: HeaderProps | false | null
    footer?: FooterProps | false | null
    className?: string
}

export function PageLayout({ children, header = {}, footer = {}, className = "" }: PageLayoutProps) {
    return (
        <div className={cn("main-wrapper", className)}>
            {header !== false && <Header {...header} />}

            <main>{children}</main>

            {footer !== false && <Footer {...footer} />}
        </div>
    )
}
