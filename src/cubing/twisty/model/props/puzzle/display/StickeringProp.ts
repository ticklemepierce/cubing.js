import { SimpleTwistyPropSource } from "../../TwistyProp";
import type { PuzzleID } from "../structure/PuzzleIDRequestProp";

// TODO: turn these maps into lists?
// TODO: alg.cubing.net parity
export const experimentalStickerings: Record<string, {groups?: Partial<Record<PuzzleID, string>>}> = {
  "full": {groups: {"3x3x3": "Stickering"}}, // default
  "OLL": {groups: {"3x3x3": "Last Layer"}},
  "PLL": {groups: {"3x3x3": "Last Layer"}},
  "LL": {groups: {"3x3x3": "Last Layer"}},
  "COLL": {groups: {"3x3x3": "Last Layer"}},
  "OCLL": {groups: {"3x3x3": "Last Layer"}},
  "CLL": {groups: {"3x3x3": "Last Layer"}},
  "ELL": {groups: {"3x3x3": "Last Layer"}},
  "ZBLL": {groups: {"3x3x3": "Last Layer"}},
  "ELS": {groups: {"3x3x3": "MGLS"}},
  "CLS": {groups: {"3x3x3": "MGLS"}},
  "F2L": {groups: {"3x3x3": "F2L"}},
  "ZBLS": {groups: {"3x3x3": "F2L"}},
  "WVLS": {groups: {"3x3x3": "F2L"}},
  "VLS": {groups: {"3x3x3": "F2L"}},
  "LS": {groups: {"3x3x3": "F2L"}},
  "Daisy": {groups: {"3x3x3": "F2L"}},
  "Cross": {groups: {"3x3x3": "F2L"}},
  "EO": {groups: {"3x3x3": "ZZ"}},
  "EOline": {groups: {"3x3x3": "ZZ"}},
  "EOcross": {groups: {"3x3x3": "ZZ"}},
  "CMLL": {groups: {"3x3x3": "Roux"}},
  "L10P": {groups: {"3x3x3": "Roux"}},
  "L6E": {groups: {"3x3x3": "Roux"}},
  "L6EO": {groups: {"3x3x3": "Roux"}},
  "2x2x2": {groups: {"3x3x3": "Petrus"}},
  "2x2x3": {groups: {"3x3x3": "Petrus"}},
  "Void Cube": {groups: {"3x3x3": "Miscellaneous"}},
  "invisible": {groups: {"3x3x3": "Miscellaneous"}},
  "picture": {groups: {"3x3x3": "Miscellaneous"}},
  "centers-only": {groups: {"3x3x3": "Miscellaneous"}}, // TODO
  "experimental-centers-U": {},
  "experimental-centers-U-D": {},
  "experimental-centers-U-L-D": {},
  "experimental-centers-U-L-B-D": {},
  "experimental-centers": {},
  "experimental-fto-fc": {groups: {"fto": "Bencisco"}},
  "experimental-fto-f2t": {groups: {"fto": "Bencisco"}},
  "experimental-fto-sc": {groups: {"fto": "Bencisco"}},
  "experimental-fto-l2c": {groups: {"fto": "Bencisco"}},
  "experimental-fto-lbt": {groups: {"fto": "Bencisco"}},
  "experimental-fto-l3t": {groups: {"fto": "Bencisco"}},
  "experimental-global-customs-1": {},
  "experimental-global-customs-2": {},
};
export type ExperimentalStickering = keyof typeof experimentalStickerings;

export function getStickeringGroup(stickering: ExperimentalStickering, puzzleID: PuzzleID): string  {
  const groups = experimentalStickerings[stickering]?.groups;
  if (!groups) {
    return "Stickering"
  }
  return groups[puzzleID] ?? "Stickering";
}
export class StickeringProp extends SimpleTwistyPropSource<ExperimentalStickering> {
  getDefaultValue(): ExperimentalStickering {
    return "full"; // TODO: auto
  }
}
