import { requireHostReact } from './reactHost.js';

/**
 * Returns a hook from the installed host React instance.
 *
 * @param {keyof typeof import('react')} name - Hook name on the React namespace.
 * @returns {unknown} Hook function from host React.
 */
function hook(name) {
  const react = requireHostReact();
  const fn = react[name];
  if (typeof fn !== 'function') {
    throw new Error(`React hook "${String(name)}" is not available on hc.react.`);
  }
  return fn;
}

/** @type {typeof import('react').useState} */
export function useState(initialState) {
  return hook('useState')(initialState);
}

/** @type {typeof import('react').useEffect} */
export function useEffect(effect, deps) {
  return hook('useEffect')(effect, deps);
}

/** @type {typeof import('react').useCallback} */
export function useCallback(callback, deps) {
  return hook('useCallback')(callback, deps);
}

/** @type {typeof import('react').useMemo} */
export function useMemo(factory, deps) {
  return hook('useMemo')(factory, deps);
}

/** @type {typeof import('react').useRef} */
export function useRef(initialValue) {
  return hook('useRef')(initialValue);
}

/** @type {typeof import('react').useSyncExternalStore} */
export function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
  return hook('useSyncExternalStore')(subscribe, getSnapshot, getServerSnapshot);
}

/** @type {typeof import('react').forwardRef} */
export function forwardRef(render) {
  return hook('forwardRef')(render);
}

/** @type {typeof import('react').cloneElement} */
export function cloneElement(element, props, ...children) {
  return hook('cloneElement')(element, props, ...children);
}

/** @type {typeof import('react').isValidElement} */
export function isValidElement(element) {
  return hook('isValidElement')(element);
}

/** @type {typeof import('react').createContext} */
export function createContext(defaultValue) {
  return hook('createContext')(defaultValue);
}

/** @type {typeof import('react').useContext} */
export function useContext(context) {
  return hook('useContext')(context);
}

/** @type {typeof import('react').useId} */
export function useId() {
  return hook('useId')();
}

/** @type {typeof import('react').useLayoutEffect} */
export function useLayoutEffect(effect, deps) {
  return hook('useLayoutEffect')(effect, deps);
}

/** @type {typeof import('react').createElement} */
export function createElement(type, props, ...children) {
  return hook('createElement')(type, props, ...children);
}
