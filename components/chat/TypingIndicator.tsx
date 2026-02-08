"use client"

interface TypingIndicatorProps {
    users: string[]
}

export default function TypingIndicator({ users }: TypingIndicatorProps) {
    if (users.length === 0) return null

    const displayText =
        users.length === 1
            ? `${users[0]} is typing`
            : users.length === 2
              ? `${users[0]} and ${users[1]} are typing`
              : `${users.length} people are typing`

    return (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>{displayText}</span>
            <div className="flex gap-1">
                <span className="animate-bounce inline-block" style={{ animationDelay: "0ms" }}>
                    .
                </span>
                <span className="animate-bounce inline-block" style={{ animationDelay: "150ms" }}>
                    .
                </span>
                <span className="animate-bounce inline-block" style={{ animationDelay: "300ms" }}>
                    .
                </span>
            </div>
        </div>
    )
}
