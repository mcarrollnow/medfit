import { MobileChatInterface } from "@/components/mobile-chat-interface"
import { DesktopChatInterface } from "@/components/desktop-chat-interface"

export default function Home() {
  return (
    <>
      <div className="lg:hidden">
        <MobileChatInterface />
      </div>
      <DesktopChatInterface />
    </>
  )
}
