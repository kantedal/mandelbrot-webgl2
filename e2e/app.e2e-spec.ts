import { MandelbrotWebgl2Page } from './app.po';

describe('mandelbrot-webgl2 App', () => {
  let page: MandelbrotWebgl2Page;

  beforeEach(() => {
    page = new MandelbrotWebgl2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
