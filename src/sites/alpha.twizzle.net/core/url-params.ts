import { EXPERIMENTAL_PROP_NO_VALUE } from "../../../cubing/twisty";
import type {
  AlgProp,
  AlgWithIssues,
} from "../../../cubing/twisty/model/props/puzzle/state/AlgProp";
import type { TwistyPlayerModel } from "../../../cubing/twisty/model/TwistyPlayerModel";
import type { TwistyPropSource } from "../../../cubing/twisty/model/TwistyProp";
import {
  TwistyPlayerAttribute,
  twistyPlayerAttributeMap,
  TwistyPlayerConfig,
} from "../../../cubing/twisty/views/TwistyPlayer";

function updateURL(url: URL): void {
  window.history.replaceState("", "", url.toString());
}

// TODO: Find a way to connect this to the `TwistyPlayer` constructor?

export type URLParamUpdaterOptions = {
  prefix?: string;
};

export class URLParamUpdater {
  #prefix: string;
  constructor(model: TwistyPlayerModel, options?: URLParamUpdaterOptions) {
    this.#prefix = options?.prefix ?? "";

    this.listenToAlgProp(model.algProp, "alg");
    this.listenToAlgProp(model.setupProp, "setup-alg");
    this.listenToStringSourceProp(model.stickeringProp, "stickering");
    this.listenToStringSourceProp(model.setupAnchorProp, "setup-anchor");
    this.listenToPuzzleIDRequestProp(
      model.puzzleIDRequestProp,
      "puzzle",
      "3x3x3",
    );
  }

  // TODO: Cache parsed URL?
  setURLParam(
    unprefixedKey: string,
    value: string,
    defaultString: string,
  ): void {
    const prefixedKey = this.#prefix + unprefixedKey;
    const url = new URL(location.href);
    if (value === defaultString) {
      url.searchParams.delete(prefixedKey);
    } else {
      url.searchParams.set(prefixedKey, value);
    }
    updateURL(url);
  }

  async listenToStringSourceProp(
    prop: TwistyPropSource<string>,
    key: string,
    defaultString?: string,
  ): Promise<void> {
    const actualDefaultString = defaultString ?? (await prop.getDefaultValue());
    prop.addFreshListener((s: string) => {
      this.setURLParam(key, s, actualDefaultString);
    });
  }

  async listenToPuzzleIDRequestProp(
    prop: TwistyPropSource<string | typeof EXPERIMENTAL_PROP_NO_VALUE>,
    key: string,
    defaultString: string,
  ): Promise<void> {
    prop.addFreshListener((s: string | typeof EXPERIMENTAL_PROP_NO_VALUE) => {
      if (s === EXPERIMENTAL_PROP_NO_VALUE) {
        s = defaultString;
      }
      this.setURLParam(key, s, defaultString);
    });
  }

  listenToAlgProp(prop: AlgProp, key: string): void {
    prop.addFreshListener((algWithIssues: AlgWithIssues) => {
      this.setURLParam(key, algWithIssues.alg.toString(), "");
    });
  }
}

const paramMapping: Record<string, TwistyPlayerAttribute> = {
  "alg": "alg",
  "setup-alg": "experimental-setup-alg",
  "setup-anchor": "experimental-setup-anchor",
  "puzzle": "puzzle",
  "stickering": "experimental-stickering",
};

export function getConfigFromURL(prefix = ""): TwistyPlayerConfig {
  const params = new URL(location.href).searchParams;
  const config: TwistyPlayerConfig = {};
  for (const [ourParam, twistyPlayerParam] of Object.entries(paramMapping)) {
    const paramValue = params.get(prefix + ourParam);
    if (paramValue !== null) {
      // TODO: type
      const configKey = twistyPlayerAttributeMap[twistyPlayerParam];
      (config as any)[configKey] = paramValue;
    }
  }
  return config;
}

export function remapLegacyURLParams(
  mapping: Record<string, string | null>,
): void {
  const url = new URL(location.href);
  for (const [oldKey, newKey] of Object.entries(mapping)) {
    // `null` indicates there is no new key, i.e. just drop the old key
    if (newKey !== null) {
      // The new key takes precedents, so we only remap the old key if the new key
      // is not already set.
      if (!url.searchParams.has(newKey)) {
        const value = url.searchParams.get(oldKey);
        if (value !== null) {
          url.searchParams.set(newKey, value);
        }
      }
    }
    url.searchParams.delete(oldKey);
  }
  updateURL(url);
}
