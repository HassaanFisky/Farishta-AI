// Type shim for html2canvas — run `npm install` after freeing disk space
declare module "html2canvas" {
  interface Options {
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
    backgroundColor?: string | null;
    logging?: boolean;
    width?: number;
    height?: number;
  }
  function html2canvas(
    element: HTMLElement,
    options?: Options
  ): Promise<HTMLCanvasElement>;
  export default html2canvas;
}
