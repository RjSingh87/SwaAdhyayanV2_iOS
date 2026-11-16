/**
 * @format
 */

import ReactNative, {BackHandler, LogBox} from "react-native";

// Ignore non-critical development warnings
LogBox.ignoreLogs([
  "[Reanimated] Dependencies should only be used on the web",
  "Sending `lockDidChange` with no listeners registered.",
  "was not handled by any navigator",
]);

// Suppress known third-party warnings from appearing in DevTools console
const _origWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("[Reanimated] Dependencies should only be used on the web") ||
     args[0].includes("lockDidChange") ||
     args[0].includes("was not handled by any navigator"))
  ) {
    return;
  }
  _origWarn(...args);
};

// 1. InteractionManager polyfill for React Native 0.88+
const _interactionManagerPolyfill = {
  runAfterInteractions(task) {
    let handle;
    const promise = new Promise((resolve) => {
      handle = setTimeout(() => {
        resolve(task ? task() : undefined);
      }, 0);
    });
    return {
      then: promise.then.bind(promise),
      done: (...args) => (promise.done ? promise.done(...args) : promise.then(...args)),
      cancel: () => clearTimeout(handle),
    };
  },
  createInteractionHandle() {
    return 1;
  },
  clearInteractionHandle(handle) {},
  setDeadline(deadline) {},
  addListener() {
    return { remove: () => {} };
  },
  Events: {
    interactionStart: "interactionStart",
    interactionComplete: "interactionComplete",
  },
};

try {
  Object.defineProperty(ReactNative, "InteractionManager", {
    configurable: true,
    enumerable: true,
    get() {
      return _interactionManagerPolyfill;
    },
  });
} catch (e) {}

// 2. BackHandler.removeEventListener polyfill for legacy libraries
if (BackHandler && typeof BackHandler.removeEventListener !== "function") {
  BackHandler.removeEventListener = function (eventName, handler) {
    // No-op fallback for backwards compatibility
  };
}

import {AppRegistry} from "react-native";
import App from "./App";
import {name as appName} from "./app.json";

AppRegistry.registerComponent(appName, () => App);
