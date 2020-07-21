import { TwistyViewerElement } from "./TwistyViewerElement";
import { Cube3D } from "../../../twisty-old/3D/cube3D";
import { Puzzles } from "../../../kpuzzle";
import { ManagedCustomElement } from "../ManagedCustomElement";
import { twisty3DCanvasCSS } from "./Twisty3DCanvas.css";
import { RenderScheduler } from "../../animation/RenderScheduler";
import {
  PositionDispatcher,
  PuzzlePosition,
} from "../../animation/alg/AlgCursor";

// <twisty-3d-canvas>
export class Twisty3DCanvas extends ManagedCustomElement
  implements TwistyViewerElement {
  // camera: Camera;
  // renderer: Renderer; // TODO: share renderers across elements? (issue: renderers are not designed to be constantly resized?)
  private scheduler = new RenderScheduler(this.render.bind(this));
  private cube3D: Cube3D;
  constructor(cursor?: PositionDispatcher) {
    super();
    this.addCSS(twisty3DCanvasCSS);
    // console.log("fooly");
    // /*...*/
    // this.twisty3DScene.addRenderTarget(this);

    this.cube3D = new Cube3D(Puzzles["3x3x3"]); // TODO: Dynamic puzzle
    this.cube3D.newVantage(this.contentWrapper);
    cursor!.addPositionListener(this);
  }

  onPositionChange(position: PuzzlePosition): void {
    const oldPos = {
      state: position.state,
      moves: position.movesInProgress,
    };

    this.cube3D.draw(oldPos);
  }

  scheduleRender(): void {
    this.scheduler.requestAnimFrame();
    // this.scheduler.requestAnimFrame();
  }

  private render(): void {
    /*...*/
  }
}

if (customElements) {
  customElements.define("twisty-3d-canvas", Twisty3DCanvas);
}
