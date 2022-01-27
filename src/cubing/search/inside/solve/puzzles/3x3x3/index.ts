import { Alg, AlgBuilder } from "../../../../../alg";
import type { KState } from "../../../../../kpuzzle/KState";
import { puzzles } from "../../../../../puzzles";
import { randomChoiceFactory } from "../../../../../vendor/random-uint-below";
import { mustBeInsideWorker } from "../../../inside-worker";
import { addOrientationSuffix } from "../../addOrientationSuffix";
import { toMin2PhaseState } from "./convert";
import { passesFilter } from "./filter";
import { sgs3x3x3 } from "./legacy-sgs";

export async function random333State(): Promise<KState> {
  const kpuzzle = await puzzles["3x3x3"].kpuzzle();
  let state = kpuzzle.startState();
  for (const piece of sgs3x3x3) {
    state = state.applyAlg(
      Alg.fromString(((await randomChoiceFactory()) as any)(piece)),
    );
  }
  if (!passesFilter(kpuzzle, state)) {
    return random333State();
  }
  return state;
}

let cachedImport: Promise<
  typeof import("../../../../../vendor/min2phase/3x3x3-min2phase")
> | null = null;
function dynamicMin2phaseGWT(): Promise<
  typeof import("../../../../../vendor/min2phase/3x3x3-min2phase")
> {
  return (cachedImport ??= import(
    "../../../../../vendor/min2phase/3x3x3-min2phase"
  ));
}

export async function solve333(s: KState): Promise<Alg> {
  mustBeInsideWorker();
  return Alg.fromString(
    (await dynamicMin2phaseGWT()).solveState(toMin2PhaseState(s)),
  );
}

export async function random333Scramble(): Promise<Alg> {
  return solve333(await random333State());
}

export async function initialize333(): Promise<void> {
  (await dynamicMin2phaseGWT()).initialize();
}

const randomSuffixes = [
  [null, "Rw", "Rw2", "Rw'", "Fw", "Fw'"],
  [null, "Dw", "Dw2", "Dw'"],
];

export async function random333OrientedScramble(): Promise<Alg> {
  return addOrientationSuffix(await random333Scramble(), randomSuffixes);
}

const extraBit = new Alg("R' U' F");
export async function random333FewestMovesScramble(): Promise<Alg> {
  const algBuilder = new AlgBuilder();
  const unorientedScramble = await random333Scramble();
  algBuilder.experimentalPushAlg(extraBit);
  // TODO:Avoid cancellable moves.
  algBuilder.experimentalPushAlg(unorientedScramble);
  algBuilder.experimentalPushAlg(extraBit);
  return algBuilder.toAlg();
}
