<template>
  <div class="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] flex flex-col items-end">
    <!-- Tooltip / Little Chat Box -->
    <transition name="fade">
      <div v-if="!isOpen" class="mb-4 mr-2 md:mr-4 bg-white dark:bg-slate-800 px-4 py-2 md:px-6 md:py-3 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 relative animate-bounce-slow max-w-[200px] md:max-w-none">
        <p class="text-[10px] md:text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider whitespace-normal md:whitespace-nowrap leading-tight">
          Hi! I'm your AI Pilot. Need help?
        </p>
        <!-- Arrow -->
        <div class="absolute -bottom-2 right-6 md:right-8 w-4 h-4 bg-white dark:bg-slate-800 border-r border-b border-slate-100 dark:border-slate-700 rotate-45"></div>
      </div>
    </transition>

    <!-- Chat Toggle Button -->
    <button
      @click="toggleChat"
      class="w-16 h-16 md:w-48 md:h-48 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative"
      :class="{ 'animate-slow-buzz': !isOpen && unreadCount > 0 }"
      aria-label="Toggle Chat"
    >
      <!-- Unread Badge -->
      <div v-if="!isOpen && unreadCount > 0" class="absolute top-2 right-2 md:top-8 md:right-8 w-5 h-5 md:w-8 md:h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-black z-10 border-2 md:border-4 border-white dark:border-slate-900 animate-bounce">
        {{ unreadCount }}
      </div>

      <div v-if="!isOpen" class="w-full h-full flex items-center justify-center p-2">
        <img
          src="/landing-v3/assets/Greenday_Copilot.png"
          alt="DRONE HUB Pilot"
          class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_15px_30px_rgba(16,185,129,0.5)]"
        />
      </div>
      <template v-else>
        <X :size="32" class="text-emerald-600 drop-shadow-xl md:hidden" />
        <X :size="80" class="hidden md:block text-emerald-600 drop-shadow-xl" />
      </template>
    </button>

    <!-- Chat Window -->
    <transition name="chat-slide">
      <div
        v-if="isOpen"
        class="mb-4 md:mb-6 w-[calc(100vw-2rem)] md:w-[380px] h-[calc(100vh-12rem)] md:h-[580px] bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col"
        :class="{ 'dark bg-slate-900 border-slate-700': isDark }"
      >
        <!-- Header -->
        <div class="p-4 md:p-5 bg-slate-900 text-white relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div class="flex items-center gap-3 md:gap-4">
              <div class="relative">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg md:rounded-xl flex flex-col items-center justify-center shadow-lg shadow-emerald-500/30 overflow-hidden p-0.5 md:p-1">
                  <img src="/landing-v3/assets/Greenday_Copilot.png" alt="DRONE HUB Pilot" class="w-full h-full object-contain" />
                </div>
                <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-3.5 md:h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full"></div>
              </div>
                <div>
                  <h3 class="font-black uppercase text-xs md:text-sm leading-none mb-1">DRONE HUB Pilot</h3>
                  <div class="flex items-center gap-1.5 text-[8px] md:text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                  <span class="flex h-1.5 w-1.5 md:h-2 md:w-2 relative">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-emerald-500"></span>
                  </span>
                  System Online
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1.5 md:gap-2">
              <button @click="isDark = !isDark" class="p-2 md:p-2.5 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl transition-all min-w-[48px] min-h-[48px] flex items-center justify-center">
                <Zap v-if="isDark" :size="18" class="text-emerald-400 md:hidden" />
                <Zap v-if="isDark" :size="20" class="hidden md:block text-emerald-400" />
                <Sparkles v-if="!isDark" :size="18" class="md:hidden" />
                <Sparkles v-if="!isDark" :size="20" class="hidden md:block" />
              </button>
              <button @click="isOpen = false" class="p-2 md:p-2.5 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl transition-all min-w-[48px] min-h-[48px] flex items-center justify-center">
                <X :size="18" class="md:hidden" />
                <X :size="20" class="hidden md:block" />
              </button>
            </div>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto p-4 md:p-5 space-y-3 md:space-y-4 bg-slate-50/50" :class="{ 'bg-slate-800/50': isDark }" ref="messageContainer">
          <div v-for="msg in messages" :key="msg.id"
               class="flex flex-col"
               :class="[msg.role === 'user' ? 'items-end' : 'items-start']">
            <div
              class="max-w-[85%] p-3 md:p-3.5 rounded-[1rem] md:rounded-[1.2rem] text-[11px] md:text-xs font-bold shadow-sm leading-relaxed"
              :class="[
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-500/10'
                  : (isDark ? 'bg-slate-700 text-slate-100 rounded-tl-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100')
              ]"
            >
              {{ msg.content }}
              <div v-if="msg.status" class="text-[7px] md:text-[8px] mt-1.5 opacity-60 flex justify-end gap-1 font-black uppercase tracking-widest">
                {{ msg.timestamp }}
                <template v-if="msg.role === 'user'">
                  <CheckCheck v-if="msg.status === 'read'" :size="8" class="md:hidden" />
                  <CheckCheck v-if="msg.status === 'read'" :size="10" class="hidden md:block" />
                  <Check v-if="msg.status !== 'read'" :size="8" class="md:hidden" />
                  <Check v-if="msg.status !== 'read'" :size="10" class="hidden md:block" />
                </template>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="flex items-center gap-1.5 md:gap-2 bg-white dark:bg-slate-700 p-2 md:p-2.5 rounded-lg md:rounded-xl w-fit shadow-sm">
            <div class="flex gap-1">
              <div class="w-1 h-1 md:w-1.5 md:h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
              <div class="w-1 h-1 md:w-1.5 md:h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div class="w-1 h-1 md:w-1.5 md:h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="px-3 py-2 md:px-4 md:py-2.5 flex gap-2 overflow-x-auto no-scrollbar border-t" :class="{ 'bg-slate-900 border-slate-700': isDark, 'bg-white border-slate-100': !isDark }">
          <button
            v-for="action in quickActions"
            :key="action.id"
            @click="handleSend(action.prompt)"
            class="whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest border-2 transition-all shadow-sm"
            :class="isDark
              ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-emerald-500 hover:text-emerald-400'
              : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-500 hover:text-emerald-600'"
          >
            {{ action.label }}
          </button>
        </div>

        <!-- Input Area -->
        <div class="p-3 md:p-4 border-t" :class="isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-100 bg-white'">
          <form @submit.prevent="handleSend()" class="relative group">
            <input
              v-model="input"
              type="text"
              :placeholder="$t('chat.placeholder')"
              class="w-full pl-3 md:pl-4 pr-10 md:pr-12 py-3 md:py-3.5 bg-slate-100 rounded-[1rem] md:rounded-[1.2rem] border-2 border-transparent focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all text-[11px] md:text-xs font-black uppercase tracking-tight"
              :class="{ 'bg-slate-800 text-white placeholder-slate-500': isDark, 'text-slate-900 placeholder-slate-400': !isDark }"
            />
            <button
              type="submit"
              class="absolute right-1 md:right-1.5 top-1/2 -translate-y-1/2 p-2 md:p-2.5 bg-emerald-600 text-white rounded-lg md:rounded-xl hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 min-w-[48px] min-h-[48px] flex items-center justify-center"
            >
              <Send :size="16" class="md:hidden" />
              <Send :size="18" class="hidden md:block" />
            </button>
          </form>
          <div class="mt-2.5 md:mt-3 flex items-center justify-between text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest">
            <div class="flex items-center gap-1.5 md:gap-2">
              <Zap :size="8" class="text-emerald-500 md:hidden" />
              <Zap :size="10" class="hidden md:block text-emerald-500" />
              <span>DRONE HUB AI Copilot</span>
            </div>
            <div class="flex items-center gap-1">
              <Shield :size="8" class="md:hidden" />
              <Shield :size="10" class="hidden md:block" />
              <span>Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import {
  X, Sparkles, Zap, Minimize2,
  Send, Check, CheckCheck, Shield
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const isOpen = ref(false);
const isMinimized = ref(false);
const isDark = ref(false);
const isTyping = ref(false);
const input = ref('');
const unreadCount = ref(1);
const messageContainer = ref(null);

const messages = ref([
  {
    id: 'initial',
    role: 'agent',
    content: 'สวัสดีครับ! ผม DRONE HUB AI Copilot พัฒนาโดย O2Odesign ยินดีต้อนรับครับ สนใจรับสิทธิพิเศษ โปรโมชั่นพิเศษ หรือข้อมูลโดรนรุ่นใหม่ดีครับ?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'read'
  }
]);

const quickActions = [
  { id: 1, label: '💰 ราคาแพ็กเกจ', prompt: 'ขอทราบราคาแพ็กเกจโดรนหน่อยครับ' },
  { id: 2, label: '🔥 โปรโมชั่นพิเศษ', prompt: 'ขอดูรายละเอียดโปรโมชั่น Limited quantity available หน่อยครับ' },
  { id: 3, label: '🤝 ร่วมเป็นพาร์ทเนอร์', prompt: 'สนใจร่วมธุรกิจครับ' }
];

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) unreadCount.value = 0;
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

const handleSend = async (customInput = null) => {
  const text = customInput || input.value;
  if (!text.trim()) return;

  messages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content: text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'sent'
  });

  if (!customInput) input.value = '';
  await scrollToBottom();

  // Call real AI Agent API
  isTyping.value = true;
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: text })
    });

    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();
    isTyping.value = false;

    messages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'agent',
      content: data.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    });
    scrollToBottom();
  } catch (error) {
    console.error('Chat Error:', error);
    isTyping.value = false;
    messages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'agent',
      content: "ขออภัยครับ ระบบขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง หรือติดต่อเจ้าหน้าที่โดยตรงครับ",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'error'
    });
    scrollToBottom();
  }
};

onMounted(() => {
  // Check if we have history in localStorage
  const history = localStorage.getItem('kgy_landing_chat_v3');
  if (history) {
    // messages.value = JSON.parse(history);
  }
});

watch(messages, (newVal) => {
  localStorage.setItem('kgy_landing_chat_v3', JSON.stringify(newVal));
}, { deep: true });
</script>

<style scoped>
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes slow-buzz {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(1px, 1px) rotate(0.5deg); }
  50% { transform: translate(0, 0) rotate(0deg); }
  75% { transform: translate(-1px, 1px) rotate(-0.5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

.animate-slow-buzz {
  animation: slow-buzz 3s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
