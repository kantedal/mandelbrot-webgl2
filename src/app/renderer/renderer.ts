import {FLOAT_TYPE, IUniform, VEC2_TYPE, default as Shader} from './utils/shader'
import RenderTarget from './utils/render-target'

/*
 Shader imports
 */
const mandebrotVert = require('raw-loader!glslify-loader!./shaders/mandelbrot.vert');
const mandelbrotFrag = require('raw-loader!glslify-loader!./shaders/mandelbrot.frag');

export default class Renderer {
  private _renderTarget: RenderTarget;
  private _uniforms: {[name: string]: IUniform};

  private _mouseDown: boolean = false;
  private _mouseStartPosition: number[] = [0.0, 0.0];

  constructor() {
    let shader = new Shader(mandebrotVert, mandelbrotFrag);
    this._uniforms = {
      u_time: { type: FLOAT_TYPE, value: 0.0 },
      u_zoom: { type: FLOAT_TYPE, value: 1.0 },
      u_resolution: { type: VEC2_TYPE, value: [window.innerWidth, window.innerHeight]},
      u_mousePosition: { type: VEC2_TYPE, value: [0.0, 0.0]},
      u_centerPosition: { type: VEC2_TYPE, value: [0.0, 0.0]},
      u_screenPosition: { type: VEC2_TYPE, value: [0.0, 0.0] }
    };
    shader.uniforms = this._uniforms;

    this._renderTarget = new RenderTarget(shader, window.innerWidth, window.innerHeight);

    window.onmousewheel = (e) => this._uniforms['u_zoom'].value += e.deltaY * 0.0003 * this._uniforms['u_zoom'].value;

    window.onmousemove = (e) => {
      if (this._mouseDown) {
        this._uniforms['u_mousePosition'].value = [
          (e.clientX - this._mouseStartPosition[0]) * this._uniforms['u_zoom'].value,
          (e.clientY - this._mouseStartPosition[1]) * this._uniforms['u_zoom'].value,
        ];
      }
    };

    window.onmousedown = (e) => {
      this._mouseDown = true;
      this._mouseStartPosition = [e.clientX, e.clientY];
    };

    window.onmouseup = (e) => {
      this._mouseDown = false;
      this._uniforms['u_centerPosition'].value = [
        this._uniforms['u_centerPosition'].value[0] + this._uniforms['u_mousePosition'].value[0],
        this._uniforms['u_centerPosition'].value[1] + this._uniforms['u_mousePosition'].value[1],
      ];
      this._uniforms['u_mousePosition'].value = [0,0];
    };

  }

  public render() {
    this._uniforms['u_time'].value += 0.01;
    this._uniforms['u_resolution'].value = [window.innerWidth, window.innerHeight];

    this._renderTarget.render();
  }

  public updateSize() {
    this._renderTarget.setWindowSize(window.innerWidth, window.innerHeight)
  }
}
