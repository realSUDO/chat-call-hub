import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";

let client: IAgoraRTCClient | null = null;
let localAudioTrack: IMicrophoneAudioTrack | null = null;
let isAgentSpeaking = false;
let speakingCallback: ((speaking: boolean) => void) | null = null;

const APP_ID = import.meta.env.VITE_AGORA_APP_ID || "";
const CHANNEL = import.meta.env.VITE_AGORA_CHANNEL || "channel1";
const TOKEN = import.meta.env.VITE_AGORA_TOKEN || null;

function initializeClient() {
  client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  setupEventListeners();
}

function setupEventListeners() {
  if (!client) return;

  client.on("user-published", async (user, mediaType) => {
    await client!.subscribe(user, mediaType);
    console.log("subscribe success");
    
    if (mediaType === "audio") {
      const remoteAudioTrack = user.audioTrack;
      remoteAudioTrack?.play();
    }
  });

  client.on("user-unpublished", async (user) => {
    console.log("user unpublished", user);
  });

  client.on("volume-indicator", (volumes) => {
    volumes.forEach((volume) => {
      if (volume.uid === 1001) {
        const speaking = volume.level > 5;
        if (speaking !== isAgentSpeaking) {
          isAgentSpeaking = speaking;
          speakingCallback?.(speaking);
        }
      }
    });
  });
}

async function createLocalAudioTrack() {
  localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
}

export async function joinVoiceChannel() {
  if (!APP_ID) {
    throw new Error("Agora App ID not configured");
  }

  initializeClient();
  const uid = 0;
  
  await client!.join(APP_ID, CHANNEL, TOKEN, uid);
  await createLocalAudioTrack();
  await client!.publish([localAudioTrack!]);
  
  client!.enableAudioVolumeIndicator();
  
  console.log("Joined voice channel");
  
  // Start AI agent
  try {
    const response = await fetch('http://localhost:3001/ai/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: CHANNEL, uid: uid.toString() })
    });
    const data = await response.json();
    console.log("AI Agent started:", data);
  } catch (error) {
    console.error("Failed to start AI agent:", error);
  }
  
  return true;
}

export async function leaveVoiceChannel() {
  // Stop AI agent first
  try {
    await fetch('http://localhost:3001/ai/stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("AI Agent stopped");
  } catch (error) {
    console.error("Failed to stop AI agent:", error);
  }
  
  if (localAudioTrack) {
    localAudioTrack.close();
    localAudioTrack = null;
  }
  
  if (client) {
    await client.leave();
    client = null;
  }
  
  console.log("Left voice channel");
}

export function isInVoiceChannel() {
  return client !== null;
}

export function toggleMute(): boolean {
  if (!localAudioTrack) return false;
  const newMutedState = !localAudioTrack.muted;
  localAudioTrack.setMuted(newMutedState);
  console.log("Microphone muted:", newMutedState);
  return newMutedState;
}

export function onAgentSpeaking(callback: (speaking: boolean) => void) {
  speakingCallback = callback;
}
