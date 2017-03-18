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


  constructor() {
    let shader = new Shader(mandebrotVert, mandelbrotFrag);
    this._uniforms = {
      u_time: { type: FLOAT_TYPE, value: 0.0 },
      u_zoom: { type: FLOAT_TYPE, value: 1.0 },
      u_resolution: { type: VEC2_TYPE, value: [window.innerWidth, window.innerHeight]},
      u_mousePosition: { type: VEC2_TYPE, value: [0.0, 0.0]},
      u_mouseDown: { type: FLOAT_TYPE, value: 0.0 },
      u_screenPosition: { type: VEC2_TYPE, value: [0.0, 0.0] }
    };
    shader.uniforms = this._uniforms;

    this._renderTarget = new RenderTarget(shader, window.innerWidth, window.innerHeight)

    window.onmousemove = (e) => this._uniforms['u_mousePosition'].value = this._mouseDown ? [e.clientX, e.clientY] : this._uniforms['u_mousePosition'].value;
    window.onmousewheel = (e) => this._uniforms['u_zoom'].value += e.deltaY * 0.05;
    window.onmousedown = (e) => this._mouseDown = true;
    window.onmouseup = (e) => this._mouseDown = false;
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
