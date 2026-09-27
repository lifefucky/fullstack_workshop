// ai-chat-next/src/services/audioService.ts
import { Howl } from "howler";

class AudioService {
  private musicVolume: number;
  private music: Howl | null;

  constructor() {
    this.musicVolume = 0.5;
    this.music = null;
  }

  playMusic(path: string): void {
    if (this.music) {
      this.music.stop();
    }
    this.music = new Howl({ 
      src: [path], 
      loop: true, 
      volume: this.musicVolume 
    });
    this.music.play();
  }

  stopMusic(): void {
    if (this.music) {
      this.music.stop();
      this.music = null;
    }
  }

  getMusicVolume(): number {
    return this.musicVolume;
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(volume, 1));
    if (this.music) {
      this.music.volume(this.musicVolume);
    }
  }
}

export const audioService = new AudioService();
