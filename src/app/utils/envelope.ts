import { ADSR } from '../model/ADSR';
import { Subscription, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export abstract class Envelope {
  private active = false;
  private decaySub: Subscription;

  constructor(protected audioContext: AudioContext, protected adsr: ADSR) {
  }

  public attack() {
    if (!this.active) {
      this.active = true;
      this.reset();
      this.setAttack();

      this.decaySub = of(null).pipe(delay(this.adsr.attackTime * 1000)).subscribe(it => {
        this.setDecay();
      });
    }
  }

  public release() {
    this.active = false;
    this.rampDown();
  }

  protected abstract setAttack();

  protected abstract setDecay();

  protected abstract setRelease();

  private rampDown() {
    this.decaySub.unsubscribe();
    this.setRelease();
  }

  private reset() {
    this.audioContext.resume();
    if (this.decaySub) {
      this.decaySub.unsubscribe();
    }
  }
}
