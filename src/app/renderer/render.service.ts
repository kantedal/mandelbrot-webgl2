import {Injectable, ElementRef} from '@angular/core'
import {initContext} from './utils/render-context'
import Renderer from './renderer'

@Injectable()
export class RenderService {
  private _renderer: Renderer;

  constructor() {}

  public init(canvas: ElementRef) {
    initContext(canvas);

    this._renderer = new Renderer();

    canvas.nativeElement.width = window.innerWidth;
    canvas.nativeElement.height = window.innerHeight;

    window.onresize = () => {
      canvas.nativeElement.width = window.innerWidth;
      canvas.nativeElement.height = window.innerHeight;
    };

    this.render();
  }

  private render = () => {
    this._renderer.render();
    requestAnimationFrame(this.render)
  }
}
