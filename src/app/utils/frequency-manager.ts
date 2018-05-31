import { Injectable } from '@angular/core';
import { Note } from '../model/note';

@Injectable()
export class FrequencyManager {
  private baseSemi = 1.059463094359;
  public seminotes = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
  ];

  public octaves = [
    0, 1, 2, 3, 4, 5, 6, 7, 8
  ];

  public baseFrequency = 440; // A4 is considered base, this is the one we will tune and base the rest on.

  public getFrequencyMapping(tune: number, fine: number): Note[] {
    const notes: Note[] = [];
    const baseFrequency = this.baseFrequency + tune + fine;
    let index = -57; // C0 = -57; B8 = 50
    let noteIndex = 0;
    let octaveIndex = 0;

    while (index < 51) {
      const note: Note = {
        note: this.seminotes[noteIndex] + this.octaves[octaveIndex],
        frequency: baseFrequency * Math.pow(this.baseSemi, index),
        octave: this.octaves[octaveIndex]
      };

      notes.push(note);
      index++;
      noteIndex++;

      if (noteIndex === 12) {
        noteIndex = 0;
        octaveIndex++;
      }
    }

    return notes;
  }

  public getOctave(freq: number, octave: number): number {
    return freq * Math.pow(this.baseSemi, octave * 12);
  }

  public getSemi(freq: number, semi: number): number {
    return freq * Math.pow(this.baseSemi, semi);
  }

  public getNoteFrequency(notes: Note[], name: string): number {
    return notes.find(note => note.note === name).frequency;
  }
}
