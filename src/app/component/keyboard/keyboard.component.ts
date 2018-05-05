import { Component, OnInit } from '@angular/core';
import { FrequenciesService } from '../../service/frequencies.service';

@Component({
  selector: 'keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
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
    'o'
  ];

  ngOnInit() {
  }

}
