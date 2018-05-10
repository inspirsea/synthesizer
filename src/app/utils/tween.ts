import { interval, timer, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class Tween {

  private timer: Observable<number>;
  private startTime: number;

  constructor(private start: number, private end: number, private time: number) {
    return this;
  }

  public subscribe(callback: (dur: number) => void, callErr?: (e: any) => void, callComplete?: () => void) {
    this.timer = timer(this.time);
    this.startTime = new Date().getTime();
    return interval().pipe(takeUntil(this.timer)).subscribe(it => {
      callback(this.getValue());
    }, (err) => {
      callErr(err);
    }, () => {
      callComplete();
    });
  }

  private getValue() {
    return this.start + ((this.end - this.start) * ((new Date().getTime() - this.startTime) / this.time));
  }
}
