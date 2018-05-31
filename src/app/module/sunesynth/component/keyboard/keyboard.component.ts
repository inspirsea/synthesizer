import { Component, OnInit } from '@angular/core';
import { FrequencyManager } from '../../../../utils/frequency-manager';
import { Note } from '../../../../model/note';

@Component({
  selector: 'keyboard',
  templateUrl: './keyboard.component.html'
})
export class KeyboardComponent implements OnInit {
  public notes: Note[];

  constructor(private freq: FrequencyManager) { }

  ngOnInit() {
    const notes = this.freq.getFrequencyMapping(0, 0);

    this.notes = notes.slice(36, 62);
  }
}
