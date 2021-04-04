import { ExperimentalStickering } from "../../twisty";
import { PuzzleLoader } from "../PuzzleLoader";
import {
  PuzzleAppearance,
  PuzzleStickering,
  StickeringManager,
  PieceSet,
  PieceStickering,
} from "./appearance";

export async function ftoStickering(
  puzzleLoader: PuzzleLoader,
  stickering: ExperimentalStickering,
): Promise<PuzzleAppearance> {
  const def = await puzzleLoader.def();
  const puzzleStickering = new PuzzleStickering(def);
  const m = new StickeringManager(def);

  const experimentalFTO_FC = (): PieceSet =>
    m.and([m.move("U"), m.not(m.or(m.moves(["F", "BL", "BR"])))]);
  const experimentalFTO_F2T = (): PieceSet =>
    m.and([m.move("U"), m.not(m.move("F"))]);
  const experimentalFTO_SC = (): PieceSet =>
    m.or([
      experimentalFTO_F2T(),
      m.and([m.move("F"), m.not(m.or(m.moves(["U", "BL", "BR"])))]),
    ]);
  const experimentalFTO_L2C = (): PieceSet =>
    m.not(
      m.or([
        m.and([m.move("U"), m.move("F")]),
        m.and([m.move("F"), m.move("BL")]),
        m.and([m.move("F"), m.move("BR")]),
        m.and([m.move("BL"), m.move("BR")]),
      ]),
    );
  const experimentalFTO_LBT = (): PieceSet =>
    m.not(
      m.or([
        m.and([m.move("F"), m.move("BL")]),
        m.and([m.move("F"), m.move("BR")]),
      ]),
    );

  switch (stickering) {
    case "full":
      break;
    case "experimental-fto-fc":
      puzzleStickering.set(
        m.not(experimentalFTO_FC()),
        PieceStickering.Ignored,
      );
      break;
    case "experimental-fto-f2t":
      puzzleStickering.set(
        m.not(experimentalFTO_F2T()),
        PieceStickering.Ignored,
      );
      break;
    case "experimental-fto-sc":
      puzzleStickering.set(
        m.not(experimentalFTO_SC()),
        PieceStickering.Ignored,
      );
      break;
    case "experimental-fto-l2c":
      puzzleStickering.set(
        m.not(experimentalFTO_L2C()),
        PieceStickering.Ignored,
      );
      break;
    case "experimental-fto-lbt":
      puzzleStickering.set(
        m.not(experimentalFTO_LBT()),
        PieceStickering.Ignored,
      );
      break;
    default:
      console.warn(
        `Unsupported stickering for ${puzzleLoader.id}: ${stickering}. Setting all pieces to dim.`,
      );
      puzzleStickering.set(m.and(m.moves([])), PieceStickering.Dim);
  }
  return puzzleStickering.toAppearance();
}

export async function ftoStickerings(): Promise<ExperimentalStickering[]> {
  return [
    "full",
    "experimental-fto-fc",
    "experimental-fto-f2t",
    "experimental-fto-sc",
    "experimental-fto-l2c",
    "experimental-fto-lbt",
  ];
}
