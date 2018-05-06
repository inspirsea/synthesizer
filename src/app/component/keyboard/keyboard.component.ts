import { Component, OnInit } from '@angular/core';
import { FrequenciesService } from '../../service/frequencies.service';

@Component({
  selector: 'keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements OnInit {
  constructor(private frequenciesService: FrequenciesService) { }

  public bindings = [
    'q',
    'w',
    'e',
    'r',
    't',
    'y',
    'u',
    'i',
    'o',
    'p',
    'å',
    'a',
    's',
    'd',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'ö',
    'ä',
    'z',
    'x',
    'c',
    'v',
    'b',
    'n',
    'm',
    ',',
    '.',
    '-',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '8',
    '0',
    '+',
    '´',
    '¨'
  ];

  ngOnInit() {
  }

}
