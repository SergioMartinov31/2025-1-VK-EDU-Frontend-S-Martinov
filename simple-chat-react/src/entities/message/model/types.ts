export interface VoiceMessage {
  voice_text?: string;
  file?: string;
  audioUrl?: string;
  url?: string;
  path?: string;
  src?: string;
  duration?: number;
  mime?: string;
}

export interface Message {
  isOurs: boolean;
  text: string;
  time: string;
  voiceMessageObj?: VoiceMessage | string | null;
}
