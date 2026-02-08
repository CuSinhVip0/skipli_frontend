import { useRouter } from "next/navigation"

export const LayoutComponent = ({
    title = "",
    subtitle = "",
    showBreadcrumbsTitle = true,
    rightLayout = null,
    classNameContent = "",
    modals = null,
    children,
    contentRef,
}: Readonly<{
    children: React.ReactNode
}> & {
    title?: string
    subtitle?: string
    showBreadcrumbsTitle?: boolean
    rightLayout?: React.ReactNode | null
    classNameContent?: string
    modals?: React.ReactNode | null
    contentRef?: React.RefObject<HTMLDivElement> | null
}) => {
    const router = useRouter()

    return (
        <div className={`p-4! m-0 box-border h-full w-full`}>
            <div
                className={`h-full  w-full flex flex-col gap-2 md:gap-4 md:pt-4 pt-0 md:pb-4 pb-2`}
            >
                {showBreadcrumbsTitle && (
                    <div
                        className={` md:flex flex-col md:flex-row md:items-center  gap-4 md:gap-0 md:px-4 px-0 hidden justify-between`}
                    >
                        <div className={` basis-auto`}>
                            <div className={"text-gray-600 font-bold text-lg "}>
                                <i
                                    className={
                                        "fa fa-arrow-left h-5 w-5 mt-0.5 mr-2 cursor-pointer "
                                    }
                                    onClick={() => {
                                        router.back()
                                    }}
                                ></i>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800 m-0">
                                        {title}
                                    </h1>
                                    <p className="text-neutral-400 text-sm">{subtitle}</p>
                                </div>
                            </div>
                        </div>
                        <div className={`grow flex flex-row justify-end gap-4 `}>{rightLayout}</div>
                    </div>
                )}
                <div
                    ref={contentRef}
                    className={` ${classNameContent} relative  grow overflow-auto `}
                >
                    {children}
                </div>
            </div>
            {modals}
        </div>
    )
}
