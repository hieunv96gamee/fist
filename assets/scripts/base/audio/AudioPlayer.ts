import AudioManager from "./AudioManager";
import {AudioPlayId} from "../../config/AudioPlayId";


const {ccclass, property} = cc._decorator;

@ccclass('AudioObject')
export class AudioObject {

    @property({
        type: cc.Enum(AudioPlayId)
    })
    name: AudioPlayId = AudioPlayId.none;

    @property({
        type: cc.AudioClip
    })
    audioClip: cc.AudioClip = null;

    @property(cc.Boolean)
    isMusic: boolean = false;
}

export class AudioPlay {
    audioId: number;
    volume: number;
    isMusic: boolean;

    constructor(_audioId: number, _volume: number, _isMusic) {
        this.audioId = _audioId;
        this.volume = _volume;
        this.isMusic = _isMusic;
    }
}


@ccclass
export default class AudioPlayer extends cc.Component {

    @property([AudioObject])
    private arrayAudioObj: AudioObject[] = [];

    private maps: Map<AudioPlayId, AudioObject> = null;

    private arrayMusic: AudioPlay[] = [];
    private arrayEffect: AudioPlay[] = [];

    playAudio(name: AudioPlayId, loop: boolean = false, volume: number = 1): AudioPlay {
        let audioObj = this.getAudioObject(name);
        if (!audioObj) {
            cc.error('playAudio: ' + name);
            return null;
        }

        let audioPlay;
        if (audioObj.isMusic) {
            let id = cc.audioEngine.play(audioObj.audioClip, loop,
                volume * AudioManager.RealMusicVolume);
            audioPlay = new AudioPlay(id, volume, true);
            this.arrayMusic.push(audioPlay);

        } else {
            let id = cc.audioEngine.play(audioObj.audioClip, loop,
                volume * AudioManager.RealEffectVolume);
            audioPlay = new AudioPlay(id, volume, false);
            this.arrayEffect.push(audioPlay);
        }

        return audioPlay;
    }

    stopAudioPlay(audioPlay: AudioPlay) {
        if (audioPlay.isMusic) {
            let id = this.arrayMusic.indexOf(audioPlay);
            if (id !== -1) {
                cc.audioEngine.stop(audioPlay.audioId);
                this.arrayMusic.splice(id, 1);
            }

        } else {
            let id = this.arrayEffect.indexOf(audioPlay);
            if (id !== -1) {
                cc.audioEngine.stop(audioPlay.audioId);
                this.arrayEffect.splice(id, 1);
            }
        }
    }

    setAudioPlayVolume(audioPlay: AudioPlay, volume: number) {
        audioPlay.volume = volume;
        if (audioPlay.isMusic) {
            cc.audioEngine.setVolume(audioPlay.audioId,
                volume * AudioManager.RealMusicVolume);

        } else {
            cc.audioEngine.setVolume(audioPlay.audioId,
                volume * AudioManager.RealEffectVolume);
        }
    }

    setVolume(volume: number) {
        this.setMusicVolume(volume);
        this.setEffectVolume(volume);
    }

    setMusicVolume(volume: number) {
        this.arrayMusic.forEach((audioPlay) => {
            cc.audioEngine.setVolume(audioPlay.audioId,
                audioPlay.volume * volume);
        });
    }

    setEffectVolume(volume: number) {
        this.arrayEffect.forEach((audioPlay) => {
            cc.audioEngine.setVolume(audioPlay.audioId,
                audioPlay.volume * volume);
        });
    }

    stopAllAudio() {
        this.stopAllEffect();
        this.stopAllMusic();
    }

    stopAllMusic() {
        this.arrayMusic.forEach((audioPlay) => {
            cc.audioEngine.stop(audioPlay.audioId);
        });
        this.arrayMusic = [];
    }

    stopAllEffect() {
        this.arrayEffect.forEach((audioPlay) => {
            cc.audioEngine.stop(audioPlay.audioId);
        });
        this.arrayEffect = [];
    }

    getAudioObject(name: AudioPlayId) {
        cc.log('getAudioObject: ' + name);
        if (!this.maps) {
            this.initMaps();
        }
        return this.maps.get(name);
    }

    initMaps() {
        this.maps = new Map<AudioPlayId, AudioObject>();

        // cc.log(this.arrayAudioObj);

        this.arrayAudioObj.forEach((obj, i) => {
            // cc.log('initMaps: ' + obj.name + ' ' + i);
            this.maps.set(obj.name, obj);
        });
    }

    protected onLoad(): void {
        AudioManager.add(this);
    }

    protected onDestroy(): void {
        AudioManager.remove(this);
        this.stopAllAudio();
    }
}
