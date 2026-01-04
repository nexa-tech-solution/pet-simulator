import { ChatFooterSection } from '@/features/chat/ChatFooterSection';
import { ChatHeaderSection } from '@/features/chat/ChatHeaderSection';
import { ChatSection } from '@/features/chat/ChatSection';
import { HeaderSection } from '@/features/home/HeaderSection';

export default async function ChatPage() {
  return (
    <div
      className='flex flex-col min-h-screen w-full overflow-hidden transition-colors duration-1000 bg-linear-to-b from-sky-300 via-blue-100 to-white dark:from-slate-700 dark:via-slate-800 dark:to-slate-900     group-data-[sleep=true]:from-slate-900
        group-data-[sleep=true]:via-indigo-950
        group-data-[sleep=true]:to-slate-900 relative'
    >
      <div className='sticky top-0 z-50'>
        <HeaderSection withBack />
        <ChatHeaderSection />
      </div>
      <ChatSection />
      <ChatFooterSection />
    </div>
  );
}
