# SKIPLI - Frontend Application

Phần Frontend

## 📁 Cấu trúc thư mục

```
frontend/
├── app/                              # Next.js App Router
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Trang chủ
│   ├── providers.tsx                 # Context providers
│   ├── (auth)/                       # Auth routes group
│   │   ├── login/                    # Trang đăng nhập
│   │   └── verify/                   # Trang xác thực OTP
│   ├── (dashboard)/                  # Dashboard routes group
│   │   ├── layout.tsx                # Dashboard layout
│   │   ├── instructor/               # Trang giáo viên
│   │   │   ├── page.tsx              # Dashboard giáo viên
│   │   │   ├── chat/                 # Chat giáo viên
│   │   │   ├── manage-lessons/       # Quản lý bài học
│   │   │   └── manage-students/      # Quản lý học viên
│   │   └── student/                  # Trang học viên
│   │       ├── page.tsx              # Dashboard học viên
│   │       ├── chat/                 # Chat học viên
│   │       ├── edit-profile/         # Sửa thông tin
│   │       └── my-lessons/           # Bài học của tôi
│   └── api/                          # API routes
│       └── auth/                     # NextAuth API routes
├── components/                       # React components
│   ├── LayoutComponent.tsx           # Layout component
│   ├── chat/                         # Chat components
│   │   ├── ChatContainer.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ConversationList.tsx
│   │   ├── CreateGroupModal.tsx
│   │   └── TypingIndicator.tsx
│   ├── instructor/                   # Instructor components
│   │   ├── AddStudentModal.tsx
│   │   └── AssignLessonModal.tsx
│   └── student/                      # Student components
│       └── DetailsView.tsx
├── hooks/                            # Custom React hooks
│   └── useChat.ts                    # Chat hook
├── services/                         # API services
│   ├── auth.ts                       # Authentication service
│   ├── chat.ts                       # Chat service
│   ├── instructor.ts                 # Instructor service
│   ├── student.ts                    # Student service
│   └── socket.ts                     # Socket.IO service
├── store/                            # Zustand stores
│   └── auth.ts                       # Auth store
├── types/                            # TypeScript types
│   ├── index.ts
│   ├── chat.type.ts
│   ├── lesson.type.ts
│   ├── student.type.ts
│   └── next-auth.d.ts                # NextAuth type definitions
├── utils/                            # Utility functions
│   ├── apiClient.ts                  # Axios instance
│   └── index.ts
└── styles/                           # Style utilities
    └── index.ts
```

## 🔧 Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` trong thư mục `frontend/` với nội dung:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# App Config
NEXT_PUBLIC_APP_NAME=SKIPLI
```

## 🚀 Chạy ứng dụng

### Chế độ development

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`
