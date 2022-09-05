'use strict';

function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function compute_rest_props(props, keys) {
    const rest = {};
    keys = new Set(keys);
    for (const k in props)
        if (!keys.has(k) && k[0] !== '$')
            rest[k] = props[k];
    return rest;
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, cancelable, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail, { cancelable = false } = {}) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail, { cancelable });
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
            return !event.defaultPrevented;
        }
        return true;
    };
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
    return context;
}
function getContext(key) {
    return get_current_component().$$.context.get(key);
}
Promise.resolve();

// source: https://html.spec.whatwg.org/multipage/indices.html
const boolean_attributes = new Set([
    'allowfullscreen',
    'allowpaymentrequest',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'hidden',
    'ismap',
    'loop',
    'multiple',
    'muted',
    'nomodule',
    'novalidate',
    'open',
    'playsinline',
    'readonly',
    'required',
    'reversed',
    'selected'
]);

const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
// https://infra.spec.whatwg.org/#noncharacter
function spread(args, attrs_to_add) {
    const attributes = Object.assign({}, ...args);
    if (attrs_to_add) {
        const classes_to_add = attrs_to_add.classes;
        const styles_to_add = attrs_to_add.styles;
        if (classes_to_add) {
            if (attributes.class == null) {
                attributes.class = classes_to_add;
            }
            else {
                attributes.class += ' ' + classes_to_add;
            }
        }
        if (styles_to_add) {
            if (attributes.style == null) {
                attributes.style = style_object_to_string(styles_to_add);
            }
            else {
                attributes.style = style_object_to_string(merge_ssr_styles(attributes.style, styles_to_add));
            }
        }
    }
    let str = '';
    Object.keys(attributes).forEach(name => {
        if (invalid_attribute_name_character.test(name))
            return;
        const value = attributes[name];
        if (value === true)
            str += ' ' + name;
        else if (boolean_attributes.has(name.toLowerCase())) {
            if (value)
                str += ' ' + name;
        }
        else if (value != null) {
            str += ` ${name}="${value}"`;
        }
    });
    return str;
}
function merge_ssr_styles(style_attribute, style_directive) {
    const style_object = {};
    for (const individual_style of style_attribute.split(';')) {
        const colon_index = individual_style.indexOf(':');
        const name = individual_style.slice(0, colon_index).trim();
        const value = individual_style.slice(colon_index + 1).trim();
        if (!name)
            continue;
        style_object[name] = value;
    }
    for (const name in style_directive) {
        const value = style_directive[name];
        if (value) {
            style_object[name] = value;
        }
        else {
            delete style_object[name];
        }
    }
    return style_object;
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function escape_attribute_value(value) {
    return typeof value === 'string' ? escape(value) : value;
}
function escape_object(obj) {
    const result = {};
    for (const key in obj) {
        result[key] = escape_attribute_value(obj[key]);
    }
    return result;
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots, context) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(context || (parent_component ? parent_component.$$.context : [])),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, $$slots, context);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    const assignment = (boolean && value === true) ? '' : `="${escape_attribute_value(value.toString())}"`;
    return ` ${name}${assignment}`;
}
function style_object_to_string(style_object) {
    return Object.keys(style_object)
        .filter(key => style_object[key])
        .map(key => `${key}: ${style_object[key]};`)
        .join(' ');
}

const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (const subscriber of subscribers) {
                    subscriber[1]();
                    subscriber_queue.push(subscriber, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            subscribers.delete(subscriber);
            if (subscribers.size === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}
function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
        let inited = false;
        const values = [];
        let pending = 0;
        let cleanup = noop;
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = is_function(result) ? result : noop;
            }
        };
        const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (inited) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
        inited = true;
        sync();
        return function stop() {
            run_all(unsubscribers);
            cleanup();
        };
    });
}

const LOCATION = {};
const ROUTER = {};

/**
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
 *
 * https://github.com/reach/router/blob/master/LICENSE
 * */

function getLocation(source) {
  return {
    ...source.location,
    state: source.history.state,
    key: (source.history.state && source.history.state.key) || "initial"
  };
}

function createHistory(source, options) {
  const listeners = [];
  let location = getLocation(source);

  return {
    get location() {
      return location;
    },

    listen(listener) {
      listeners.push(listener);

      const popstateListener = () => {
        location = getLocation(source);
        listener({ location, action: "POP" });
      };

      source.addEventListener("popstate", popstateListener);

      return () => {
        source.removeEventListener("popstate", popstateListener);

        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);
      };
    },

    navigate(to, { state, replace = false } = {}) {
      state = { ...state, key: Date.now() + "" };
      // try...catch iOS Safari limits to 100 pushState calls
      try {
        if (replace) {
          source.history.replaceState(state, null, to);
        } else {
          source.history.pushState(state, null, to);
        }
      } catch (e) {
        source.location[replace ? "replace" : "assign"](to);
      }

      location = getLocation(source);
      listeners.forEach(listener => listener({ location, action: "PUSH" }));
    }
  };
}

// Stores history entries in memory for testing or other platforms like Native
function createMemorySource(initialPathname = "/") {
  let index = 0;
  const stack = [{ pathname: initialPathname, search: "" }];
  const states = [];

  return {
    get location() {
      return stack[index];
    },
    addEventListener(name, fn) {},
    removeEventListener(name, fn) {},
    history: {
      get entries() {
        return stack;
      },
      get index() {
        return index;
      },
      get state() {
        return states[index];
      },
      pushState(state, _, uri) {
        const [pathname, search = ""] = uri.split("?");
        index++;
        stack.push({ pathname, search });
        states.push(state);
      },
      replaceState(state, _, uri) {
        const [pathname, search = ""] = uri.split("?");
        stack[index] = { pathname, search };
        states[index] = state;
      }
    }
  };
}

// Global history uses window.history as the source if available,
// otherwise a memory history
const canUseDOM = Boolean(
  typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
);
const globalHistory = createHistory(canUseDOM ? window : createMemorySource());

/**
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
 *
 * https://github.com/reach/router/blob/master/LICENSE
 * */

const paramRe = /^:(.+)/;

const SEGMENT_POINTS = 4;
const STATIC_POINTS = 3;
const DYNAMIC_POINTS = 2;
const SPLAT_PENALTY = 1;
const ROOT_POINTS = 1;

/**
 * Check if `string` starts with `search`
 * @param {string} string
 * @param {string} search
 * @return {boolean}
 */
function startsWith(string, search) {
  return string.substr(0, search.length) === search;
}

/**
 * Check if `segment` is a root segment
 * @param {string} segment
 * @return {boolean}
 */
function isRootSegment(segment) {
  return segment === "";
}

/**
 * Check if `segment` is a dynamic segment
 * @param {string} segment
 * @return {boolean}
 */
function isDynamic(segment) {
  return paramRe.test(segment);
}

/**
 * Check if `segment` is a splat
 * @param {string} segment
 * @return {boolean}
 */
function isSplat(segment) {
  return segment[0] === "*";
}

/**
 * Split up the URI into segments delimited by `/`
 * @param {string} uri
 * @return {string[]}
 */
function segmentize(uri) {
  return (
    uri
      // Strip starting/ending `/`
      .replace(/(^\/+|\/+$)/g, "")
      .split("/")
  );
}

/**
 * Strip `str` of potential start and end `/`
 * @param {string} str
 * @return {string}
 */
function stripSlashes(str) {
  return str.replace(/(^\/+|\/+$)/g, "");
}

/**
 * Score a route depending on how its individual segments look
 * @param {object} route
 * @param {number} index
 * @return {object}
 */
function rankRoute(route, index) {
  const score = route.default
    ? 0
    : segmentize(route.path).reduce((score, segment) => {
        score += SEGMENT_POINTS;

        if (isRootSegment(segment)) {
          score += ROOT_POINTS;
        } else if (isDynamic(segment)) {
          score += DYNAMIC_POINTS;
        } else if (isSplat(segment)) {
          score -= SEGMENT_POINTS + SPLAT_PENALTY;
        } else {
          score += STATIC_POINTS;
        }

        return score;
      }, 0);

  return { route, score, index };
}

/**
 * Give a score to all routes and sort them on that
 * @param {object[]} routes
 * @return {object[]}
 */
function rankRoutes(routes) {
  return (
    routes
      .map(rankRoute)
      // If two routes have the exact same score, we go by index instead
      .sort((a, b) =>
        a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
      )
  );
}

/**
 * Ranks and picks the best route to match. Each segment gets the highest
 * amount of points, then the type of segment gets an additional amount of
 * points where
 *
 *  static > dynamic > splat > root
 *
 * This way we don't have to worry about the order of our routes, let the
 * computers do it.
 *
 * A route looks like this
 *
 *  { path, default, value }
 *
 * And a returned match looks like:
 *
 *  { route, params, uri }
 *
 * @param {object[]} routes
 * @param {string} uri
 * @return {?object}
 */
function pick(routes, uri) {
  let match;
  let default_;

  const [uriPathname] = uri.split("?");
  const uriSegments = segmentize(uriPathname);
  const isRootUri = uriSegments[0] === "";
  const ranked = rankRoutes(routes);

  for (let i = 0, l = ranked.length; i < l; i++) {
    const route = ranked[i].route;
    let missed = false;

    if (route.default) {
      default_ = {
        route,
        params: {},
        uri
      };
      continue;
    }

    const routeSegments = segmentize(route.path);
    const params = {};
    const max = Math.max(uriSegments.length, routeSegments.length);
    let index = 0;

    for (; index < max; index++) {
      const routeSegment = routeSegments[index];
      const uriSegment = uriSegments[index];

      if (routeSegment !== undefined && isSplat(routeSegment)) {
        // Hit a splat, just grab the rest, and return a match
        // uri:   /files/documents/work
        // route: /files/* or /files/*splatname
        const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

        params[splatName] = uriSegments
          .slice(index)
          .map(decodeURIComponent)
          .join("/");
        break;
      }

      if (uriSegment === undefined) {
        // URI is shorter than the route, no match
        // uri:   /users
        // route: /users/:userId
        missed = true;
        break;
      }

      let dynamicMatch = paramRe.exec(routeSegment);

      if (dynamicMatch && !isRootUri) {
        const value = decodeURIComponent(uriSegment);
        params[dynamicMatch[1]] = value;
      } else if (routeSegment !== uriSegment) {
        // Current segments don't match, not dynamic, not splat, so no match
        // uri:   /users/123/settings
        // route: /users/:id/profile
        missed = true;
        break;
      }
    }

    if (!missed) {
      match = {
        route,
        params,
        uri: "/" + uriSegments.slice(0, index).join("/")
      };
      break;
    }
  }

  return match || default_ || null;
}

/**
 * Check if the `path` matches the `uri`.
 * @param {string} path
 * @param {string} uri
 * @return {?object}
 */
function match(route, uri) {
  return pick([route], uri);
}

/**
 * Add the query to the pathname if a query is given
 * @param {string} pathname
 * @param {string} [query]
 * @return {string}
 */
function addQuery(pathname, query) {
  return pathname + (query ? `?${query}` : "");
}

/**
 * Resolve URIs as though every path is a directory, no files. Relative URIs
 * in the browser can feel awkward because not only can you be "in a directory",
 * you can be "at a file", too. For example:
 *
 *  browserSpecResolve('foo', '/bar/') => /bar/foo
 *  browserSpecResolve('foo', '/bar') => /foo
 *
 * But on the command line of a file system, it's not as complicated. You can't
 * `cd` from a file, only directories. This way, links have to know less about
 * their current path. To go deeper you can do this:
 *
 *  <Link to="deeper"/>
 *  // instead of
 *  <Link to=`{${props.uri}/deeper}`/>
 *
 * Just like `cd`, if you want to go deeper from the command line, you do this:
 *
 *  cd deeper
 *  # not
 *  cd $(pwd)/deeper
 *
 * By treating every path as a directory, linking to relative paths should
 * require less contextual information and (fingers crossed) be more intuitive.
 * @param {string} to
 * @param {string} base
 * @return {string}
 */
function resolve(to, base) {
  // /foo/bar, /baz/qux => /foo/bar
  if (startsWith(to, "/")) {
    return to;
  }

  const [toPathname, toQuery] = to.split("?");
  const [basePathname] = base.split("?");
  const toSegments = segmentize(toPathname);
  const baseSegments = segmentize(basePathname);

  // ?a=b, /users?b=c => /users?a=b
  if (toSegments[0] === "") {
    return addQuery(basePathname, toQuery);
  }

  // profile, /users/789 => /users/789/profile
  if (!startsWith(toSegments[0], ".")) {
    const pathname = baseSegments.concat(toSegments).join("/");

    return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
  }

  // ./       , /users/123 => /users/123
  // ../      , /users/123 => /users
  // ../..    , /users/123 => /
  // ../../one, /a/b/c/d   => /a/b/one
  // .././one , /a/b/c/d   => /a/b/c/one
  const allSegments = baseSegments.concat(toSegments);
  const segments = [];

  allSegments.forEach(segment => {
    if (segment === "..") {
      segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });

  return addQuery("/" + segments.join("/"), toQuery);
}

/**
 * Combines the `basepath` and the `path` into one path.
 * @param {string} basepath
 * @param {string} path
 */
function combinePaths(basepath, path) {
  return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
}

/* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.48.0 */

const Router = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $location, $$unsubscribe_location;
	let $routes, $$unsubscribe_routes;
	let $base, $$unsubscribe_base;
	let { basepath = "/" } = $$props;
	let { url = null } = $$props;
	const locationContext = getContext(LOCATION);
	const routerContext = getContext(ROUTER);
	const routes = writable([]);
	$$unsubscribe_routes = subscribe(routes, value => $routes = value);
	const activeRoute = writable(null);
	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

	// If locationContext is not set, this is the topmost Router in the tree.
	// If the `url` prop is given we force the location to it.
	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

	$$unsubscribe_location = subscribe(location, value => $location = value);

	// If routerContext is set, the routerBase of the parent Router
	// will be the base for this Router's descendants.
	// If routerContext is not set, the path and resolved uri will both
	// have the value of the basepath prop.
	const base = routerContext
	? routerContext.routerBase
	: writable({ path: basepath, uri: basepath });

	$$unsubscribe_base = subscribe(base, value => $base = value);

	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
		// If there is no activeRoute, the routerBase will be identical to the base.
		if (activeRoute === null) {
			return base;
		}

		const { path: basepath } = base;
		const { route, uri } = activeRoute;

		// Remove the potential /* or /*splatname from
		// the end of the child Routes relative paths.
		const path = route.default
		? basepath
		: route.path.replace(/\*.*$/, "");

		return { path, uri };
	});

	function registerRoute(route) {
		const { path: basepath } = $base;
		let { path } = route;

		// We store the original path in the _path property so we can reuse
		// it when the basepath changes. The only thing that matters is that
		// the route reference is intact, so mutation is fine.
		route._path = path;

		route.path = combinePaths(basepath, path);

		if (typeof window === "undefined") {
			// In SSR we should set the activeRoute immediately if it is a match.
			// If there are more Routes being registered after a match is found,
			// we just skip them.
			if (hasActiveRoute) {
				return;
			}

			const matchingRoute = match(route, $location.pathname);

			if (matchingRoute) {
				activeRoute.set(matchingRoute);
				hasActiveRoute = true;
			}
		} else {
			routes.update(rs => {
				rs.push(route);
				return rs;
			});
		}
	}

	function unregisterRoute(route) {
		routes.update(rs => {
			const index = rs.indexOf(route);
			rs.splice(index, 1);
			return rs;
		});
	}

	if (!locationContext) {
		// The topmost Router in the tree is responsible for updating
		// the location store and supplying it through context.
		onMount(() => {
			const unlisten = globalHistory.listen(history => {
				location.set(history.location);
			});

			return unlisten;
		});

		setContext(LOCATION, location);
	}

	setContext(ROUTER, {
		activeRoute,
		base,
		routerBase,
		registerRoute,
		unregisterRoute
	});

	if ($$props.basepath === void 0 && $$bindings.basepath && basepath !== void 0) $$bindings.basepath(basepath);
	if ($$props.url === void 0 && $$bindings.url && url !== void 0) $$bindings.url(url);

	{
		{
			const { path: basepath } = $base;

			routes.update(rs => {
				rs.forEach(r => r.path = combinePaths(basepath, r._path));
				return rs;
			});
		}
	}

	{
		{
			const bestMatch = pick($routes, $location.pathname);
			activeRoute.set(bestMatch);
		}
	}

	$$unsubscribe_location();
	$$unsubscribe_routes();
	$$unsubscribe_base();
	return `${slots.default ? slots.default({}) : ``}`;
});

/* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.48.0 */

const Route = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $activeRoute, $$unsubscribe_activeRoute;
	let $location, $$unsubscribe_location;
	let { path = "" } = $$props;
	let { component = null } = $$props;
	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
	$$unsubscribe_activeRoute = subscribe(activeRoute, value => $activeRoute = value);
	const location = getContext(LOCATION);
	$$unsubscribe_location = subscribe(location, value => $location = value);

	const route = {
		path,
		// If no path prop is given, this Route will act as the default Route
		// that is rendered if no other Route in the Router is a match.
		default: path === ""
	};

	let routeParams = {};
	let routeProps = {};
	registerRoute(route);

	// There is no need to unregister Routes in SSR since it will all be
	// thrown away anyway.
	if (typeof window !== "undefined") {
		onDestroy(() => {
			unregisterRoute(route);
		});
	}

	if ($$props.path === void 0 && $$bindings.path && path !== void 0) $$bindings.path(path);
	if ($$props.component === void 0 && $$bindings.component && component !== void 0) $$bindings.component(component);

	{
		if ($activeRoute && $activeRoute.route === route) {
			routeParams = $activeRoute.params;
		}
	}

	{
		{
			const { path, component, ...rest } = $$props;
			routeProps = rest;
		}
	}

	$$unsubscribe_activeRoute();
	$$unsubscribe_location();

	return `${$activeRoute !== null && $activeRoute.route === route
	? `${component !== null
		? `${validate_component(component || missing_component, "svelte:component").$$render($$result, Object.assign({ location: $location }, routeParams, routeProps), {}, {})}`
		: `${slots.default
			? slots.default({ params: routeParams, location: $location })
			: ``}`}`
	: ``}`;
});

/* node_modules/svelte-routing/src/Link.svelte generated by Svelte v3.48.0 */

const Link = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let ariaCurrent;
	let $$restProps = compute_rest_props($$props, ["to","replace","state","getProps"]);
	let $location, $$unsubscribe_location;
	let $base, $$unsubscribe_base;
	let { to = "#" } = $$props;
	let { replace = false } = $$props;
	let { state = {} } = $$props;
	let { getProps = () => ({}) } = $$props;
	const { base } = getContext(ROUTER);
	$$unsubscribe_base = subscribe(base, value => $base = value);
	const location = getContext(LOCATION);
	$$unsubscribe_location = subscribe(location, value => $location = value);
	createEventDispatcher();
	let href, isPartiallyCurrent, isCurrent, props;

	if ($$props.to === void 0 && $$bindings.to && to !== void 0) $$bindings.to(to);
	if ($$props.replace === void 0 && $$bindings.replace && replace !== void 0) $$bindings.replace(replace);
	if ($$props.state === void 0 && $$bindings.state && state !== void 0) $$bindings.state(state);
	if ($$props.getProps === void 0 && $$bindings.getProps && getProps !== void 0) $$bindings.getProps(getProps);
	href = to === "/" ? $base.uri : resolve(to, $base.uri);
	isPartiallyCurrent = startsWith($location.pathname, href);
	isCurrent = href === $location.pathname;
	ariaCurrent = isCurrent ? "page" : undefined;

	props = getProps({
		location: $location,
		href,
		isPartiallyCurrent,
		isCurrent
	});

	$$unsubscribe_location();
	$$unsubscribe_base();

	return `<a${spread(
		[
			{ href: escape_attribute_value(href) },
			{
				"aria-current": escape_attribute_value(ariaCurrent)
			},
			escape_object(props),
			escape_object($$restProps)
		],
		{}
	)}>${slots.default ? slots.default({}) : ``}</a>`;
});

/* src/components/Head.svelte generated by Svelte v3.48.0 */

const Head = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<header id="${"inicio"}" class="${"container-fluid barra-top-info bg-azul"}"><div class="${"container-fluid barra-top-info-items py-2"}"><div class="${"row no-gutters"}"><div class="${"col-6 d-flex text-white align-items-center"}"><div class="${"icono me-2 bg-naranja"}"><i class="${"fas fa-map-marker-alt"}"></i></div>
                <div><span>89 Av. Nte. y 3a Calle Pte. #4628 Colonia Escalón, San Salvador.</span></div></div>

            <div class="${"col-6"}"><div class="${"row no-gutters"}"><div class="${"col-7 d-flex text-white align-items-center"}"><div class="${"icono me-2 bg-naranja"}"><i class="${"far fa-envelope"}"></i></div>
                    <div><span>info1@abcbilingualschool.edu.sv</span></div></div>

                    <div class="${"col-5 d-flex text-white justify-content-end align-items-center"}"><div class="${"icono me-2 bg-naranja"}"><i class="${"fas fa-phone-alt"}"></i></div>
                    <div><span>2264-0508/7696-9556</span></div></div></div></div></div></div></header>`;
});

/* src/components/NavLink.svelte generated by Svelte v3.48.0 */

function getProps({ location, href, isPartiallyCurrent, isCurrent }) {
	const isActive = href === "/"
	? isCurrent
	: isPartiallyCurrent || isCurrent;

	// The object returned here is spread on the anchor element's attributes
	if (isActive) {
		return { class: "active" };
	}

	return {};
}

const NavLink = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { to = "" } = $$props;
	if ($$props.to === void 0 && $$bindings.to && to !== void 0) $$bindings.to(to);

	return `${validate_component(Link, "Link").$$render($$result, { to, getProps }, {}, {
		default: () => {
			return `${slots.default ? slots.default({}) : ``}`;
		}
	})}`;
});

// ? Titulos y Links del menú en español 
const navItemsEs = [ "Inicio", "Institución", "Personal", "Vida escolar", "Menú cafetería", "Circulares", "Fechas importantes", "Manual ABC 22-23", "Manual Teams", "Jornalización Parvularia", "Jornalización Primaria-Secundaria", "Contáctanos" ];
const navLinksEs = [ "/", "/institucion", "/personal", "/vida-escolar", "img/menu-cafeteria.jpg", "/circulares", "/fechas-importantes", "/assets/documents/Manual-de-convivencia-2022-2023.pdf", "/assets/documents/Manual-Teams.pdf", "/assets/documents/jornalizacion-parvularia.pdf", "/assets/documents/jornalizacion-prepa-12vo.pdf", "/contactanos" ];
const navDropEs = [ "Menú", "Conócenos", "Información" ];

// ? Titulos y Links del menú en ingles 
const navItemsEn = [ "Home", "Institution", "Our team", "School life", "Cafeteria menu", "Newsletter", "Important dates", "ABC manual 22-23", "Teams manual ", "Preschool Scheduling", "Primary-High School Scheduling", "Contact us" ];
const navLinksEn = [ "/home", "/institution", "/our-team", "/school-life", "img/menu-cafeteria.jpg", "/newsletter", "/important-dates", "/assets/documents/Manual-de-convivencia-2022-2023.pdf", "/assets/documents/Manual-Teams.pdf", "/assets/documents/jornalizacion-parvularia.pdf", "/assets/documents/jornalizacion-prepa-12vo.pdf", "/contact-us" ];
const navDropEn = ["Menu","About us","Information"];


// ? Menú de cafetería 
const cafeteria = [
    "Semana del 5 al 9 de Septiembre",

    // *LUNES *********** 
    "Tornillos con queso.",
    // *MARTES ********** 
    "Tortitas de carne.",
    // *MIERCOLES ******* 
    "Pollo a la plancha.",
    // *JUEVES ********** 
    "Picado de verduras.",
    // *VIERNES ********* 
    "Chilaquiles con queso",

    // *--------------------------- 
    "Menú del 5 al 9 de septiembre",
    "Menu from september 5 to 9",
    "September 3, 2022"
];

let equipos = {
    admin: {
        title: ["Personal Administrativo", "Administrative Staff"],
        eq: [
            {"nombre":"Mrs. Verónica Jordan Moore", "cargo":"PRESIDENTA JUNTA DIRECTIVA","position":"PRESIDENT BOARD OF DIRECTORS","link":"/assets/img/equipo/admin/01_Veronica_Jordan_Moore.jpg"},
            {"nombre":"Mrs. Valeria Walsh de Arias", "cargo":"DIRECTORA GENERAL","position":"PRINCIPAL","link":"/assets/img/equipo/admin/02_Valeria_Walsh_de_Arias.jpg"},
            {"nombre":"Mrs. Margarita S. de Maldonado", "cargo":"DIRECTORA ACADÉMICA","position":"ACADEMIC DIRECTOR","link":"/assets/img/equipo/admin/03_Margarita_de_Maldonado.jpg"},
            {"nombre":"Mrs. Violeta de Portillo", "cargo":"COORDINADORA GENERAL","position":"GENERAL COORDINATOR","link":"/assets/img/equipo/admin/04_Violeta_de_Portillo.jpg"},
            {"nombre":"Mr. Carlos Zavaleta", "cargo":"CONTADOR","position":"ACCOUNTANT","link":"/assets/img/equipo/admin/05_Carlos_Zavaleta.jpg"},
            {"nombre":"Ms. Karla Guerrero", "cargo":"ASISTENTE ADMINISTRATIVA","position":"ADMINISTRATIVE ASSISTANT","link":"/assets/img/equipo/admin/06_Karla_Guerrero.jpg"},
            {"nombre":"Ms. Gabriela Toledo", "cargo":"CONSEJERA ESTUDIANTIL","position":"STUDENT COUNSELOR","link":"/assets/img/equipo/admin/07_Gabriela_Toledo.jpg"}
        ]
    },
    parvu: {
        title: ["Personal de Parvularia", "Preschool Staff"],
        eq: [
            {"nombre":"Ms. Maira Gutiérrez", "cargo":"PREMATERNAL","position":"NURSERY","link":"/assets/img/equipo/parvularia/01_Maira_Gutierrez.jpg"},
            {"nombre":"Ms. Michelle Ayala", "cargo":"MATERNAL","position":"EARLY CHILDHOOD","link":"/assets/img/equipo/parvularia/02_Michelle_Ayala.jpg"},
            {"nombre":"Ms. Adriana Somoza", "cargo":"PRE KINDER A","position":"PREKINDER A","link":"/assets/img/equipo/parvularia/03_Adriana_Somoza.jpg"},
            {"nombre":"Ms. Eugenia González", "cargo":"PRE KINDER B","position":"PREKINDER B","link":"/assets/img/equipo/parvularia/04_Eugenia_Gonzalez.jpg"},
            {"nombre":"Ms. Paola Aguilar", "cargo":"KINDER A","position":"KINDER A","link":"/assets/img/equipo/parvularia/05_Paola_Aguilar.jpg"},
            {"nombre":"Ms. Adriana Avelar", "cargo":"KINDER B","position":"KINDER B","link":"/assets/img/equipo/parvularia/06_Adriana_Avelar.jpg"},
            {"nombre":"Mrs. Erika Salinas", "cargo":"PREPARATORIA A","position":"PREPARATORY A","link":"/assets/img/equipo/parvularia/07_Erika_Salinas.jpg"},
            {"nombre":"Ms. Iliana Guzmán", "cargo":"PREPARATORIA B","position":"PREPARATORY B","link":"/assets/img/equipo/parvularia/08_Iliana_Guzman.jpg"},
            {"nombre":"Ms. Gabriela Araujo", "cargo":"ASISTENTE DE KINDER A","position":"KINDER A ASSISTANT","link":"/assets/img/equipo/parvularia/09_Gabriela_Araujo.jpg"},
            {"nombre":"Ms. Fátima Rivera", "cargo":"ASISTENTE DE KINDER B","position":"KINDER B ASSISTANT","link":"/assets/img/equipo/parvularia/10_Fatima_Rivera.jpg"},
            {"nombre":"Ms. Paola López", "cargo":"ASISTENTE DE PREPARATORIA A","position":"PREPARATORY A ASSISTANT","link":"/assets/img/equipo/parvularia/11_Paola_Lopez.jpg"},
            {"nombre":"Ms. Camila Escolán", "cargo":"ASISTENTE DE PREPARATORIA B","position":"PREPARATORY B ASSISTANT","link":"/assets/img/equipo/parvularia/12_Camila_Escolan.jpg"},
            {"nombre":"Mr. Miguel Salazar", "cargo":"DEPORTE","position":"PHYSICAL EDUCATION","link":"/assets/img/equipo/parvularia/13_Miguel_Salazar.jpg"}
        ]
    },
    prima: {
        title: ["Personal de Primaria", "Primary School Staff"],
        eq: [
            {"nombre":"Ms. Ingrid Aguilera", "cargo":"1º GRADO A","position":"1st GRADE A","link":"/assets/img/equipo/primaria/01_Ingrid_Aguilera.jpg"},
            {"nombre":"Mrs. Alejandra Argueta", "cargo":"1º GRADO B","position":"1st GRADE B","link":"/assets/img/equipo/primaria/02_Alejandra_de_Salgado.jpg"},
            {"nombre":"Mrs. Tatiana de Portillo", "cargo":"2º GRADO A","position":"2nd GRADE A","link":"/assets/img/equipo/primaria/03_Tatiana_de_Portillo.jpg"},
            {"nombre":"Ms. Roxana Peñate", "cargo":"2º GRADO B","position":"2nd GRADE B","link":"/assets/img/equipo/primaria/04_Roxana_Penate.jpg"},
            {"nombre":"Mrs. María Eugenia de Calderón", "cargo":"3º GRADO A","position":"3rd GRADE A","link":"/assets/img/equipo/primaria/05_Maria_Eugenia_de_Calderon.jpg"},
            {"nombre":"Mrs. Carmen Torres", "cargo":"3º GRADO B","position":"3rd GRADE B","link":"/assets/img/equipo/primaria/06_Carmen_Torres.jpg"},
            {"nombre":"Mrs. María Begoña González", "cargo":"4º GRADO","position":"4th GRADE","link":"/assets/img/equipo/primaria/07_Maria_Begona_Gonzalez.jpg"},
            {"nombre":"Ms. Sally Ventura", "cargo":"5º GRADO","position":"5th GRADE","link":"/assets/img/equipo/primaria/08_Sally_Ventura.jpg"},
            {"nombre":"Mr. Carlos Revolorio", "cargo":"MÚSICA","position":"MUSIC","link":"/assets/img/equipo/primaria/09_Carlos_Revolorio.jpg"},
            {"nombre":"Mrs. Marielos de Walsh", "cargo":"ARTE","position":"ART","link":"/assets/img/equipo/primaria/10_Marielos_de_Walsh.jpg"},
            {"nombre":"Mr. Eduardo Solórzano", "cargo":"DEPORTE","position":"PHYSICAL EDUCATION","link":"/assets/img/equipo/primaria/11_Eduardo_Solorzano.jpg"}
        ]
    },
    secun: {
        title: ["Personal de Secundaria", "High School Staff"],
        eq: [
            {"nombre":"Ms. Galia Merino", "cargo":"6º GRADO","position":"6th GRADE","link":"/assets/img/equipo/secundaria/01_Galia_Merino.jpg"},
            {"nombre":"Mr. David Bayona", "cargo":"7º GRADO / COMPUTACIÓN","position":"7th GRADE / COMPUTER SCIENCE","link":"/assets/img/equipo/secundaria/02_David_Bayona.jpg"},
            {"nombre":"Mr. Guillermo Torres", "cargo":"8º GRADO","position":"8th GRADE","link":"/assets/img/equipo/secundaria/03_Guillermo_Torres.jpg"},
            {"nombre":"Ms. Verónica Martínez", "cargo":"9º GRADO","position":"9th GRADE","link":"/assets/img/equipo/secundaria/04_Veronica_Martinez.jpg"},
            {"nombre":"Mrs. Ana Regina Miranda", "cargo":"10º GRADO","position":"10th GRADE","link":"/assets/img/equipo/secundaria/05_Ana_Regina_Miranda.jpg"},
            {"nombre":"Mrs. Ana Gertrudis de Barrera", "cargo":"11º GRADO","position":"11th GRADE","link":"/assets/img/equipo/secundaria/06_Ana_Gertrudis_de_Barrera.jpg"},
            {"nombre":"Mr. Carlos Revolorio", "cargo":"12º GRADO","position":"12th GRADE","link":"/assets/img/equipo/secundaria/07_Carlos_Revolorio.jpg"},
            {"nombre":"Ms. Luz Cáceres", "cargo":"MAESTRA DE FRANCES","position":"FRENCH TEACHER","link":"/assets/img/equipo/secundaria/08_Luz_Caceres.jpg"},
            {"nombre":"Mr. Eduardo Santos", "cargo":"MAESTRO DE FRANCES","position":"FRENCH TEACHER","link":"/assets/img/equipo/secundaria/09_Eduardo_Santos.jpg"},
            {"nombre":"Mrs. Marielos de Walsh", "cargo":"ARTE","position":"ART","link":"/assets/img/equipo/secundaria/10_Marielos_de_Walsh.jpg"},
            {"nombre":"Mr. Eduardo Solórzano", "cargo":"DEPORTE","position":"PHYSICAL EDUCATION","link":"/assets/img/equipo/primaria/11_Eduardo_Solorzano.jpg"}
        ]
    },
    nivel: {
        title: ["Aula de Nivelación", "Development Center"],
        eq: [
            {"nombre":"Ms. Gabriela Cuellar", "cargo":"PARVULARIA","position":"PRESCHOOL","link":"/assets/img/equipo/nivelacion/01_Gabriela_Cuellar.jpg"},
            {"nombre":"Ms. Camila Ibarra", "cargo":"CICLO 1A","position":"LAVEL 1A","link":"/assets/img/equipo/nivelacion/02_Camila_Ibarra.jpg"},
            {"nombre":"Ms. Raquel Valle", "cargo":"CICLO 2A","position":"LAVEL 2A","link":"/assets/img/equipo/nivelacion/03_Raquel_Valle.jpg"},
            {"nombre":"Ms. Ariana Leonor Parrillas", "cargo":"CICLO 2B","position":"LAVEL 2B","link":"/assets/img/equipo/nivelacion/04_Ariana_Leonor_Parrillas.jpg"},
            {"nombre":"Mrs. Zuleima Navarro de Vigil", "cargo":"CICLO 3","position":"LAVEL 3","link":"/assets/img/equipo/nivelacion/05_Zuleima_Navarro_de_Vigil.jpg"},
            // {"nombre":"Ms. Eugenia González", "cargo":"ASISTENTE CICLO 1B","position":"LAVEL 1B ASSISTANT","link":"/assets/img/equipo/nivelacion/06_Eugenia_Gonzalez.jpg"}
        ]
    }
};

const menuItems = writable( navItemsEs );
const menuLinks = writable( navLinksEs );
const menuDrop = writable( navDropEs );

const conectionOnLine = writable(true);

/* src/components/Navbar.svelte generated by Svelte v3.48.0 */

const Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $menuDrop, $$unsubscribe_menuDrop;
	let $menuLinks, $$unsubscribe_menuLinks;
	let $menuItems, $$unsubscribe_menuItems;
	let $conectionOnLine, $$unsubscribe_conectionOnLine;
	$$unsubscribe_menuDrop = subscribe(menuDrop, value => $menuDrop = value);
	$$unsubscribe_menuLinks = subscribe(menuLinks, value => $menuLinks = value);
	$$unsubscribe_menuItems = subscribe(menuItems, value => $menuItems = value);
	$$unsubscribe_conectionOnLine = subscribe(conectionOnLine, value => $conectionOnLine = value);
	$$unsubscribe_menuDrop();
	$$unsubscribe_menuLinks();
	$$unsubscribe_menuItems();
	$$unsubscribe_conectionOnLine();

	return `<div class="${"container"}"><a class="${"navbar-brand"}" href><img class="${"abc-logo"}" src="${"/assets/img/logos/abc-logo.jpg"}" alt="${"ABC Bilingual School El Salvador"}">
		<span class="${"texto-brand"}">ABC Bilingual School</span></a>

	<button class="${"navbar-toggler"}" type="${"button"}" data-bs-toggle="${"collapse"}" data-bs-target="${"#navbarNavDropdown"}" aria-controls="${"navbarNavDropdown"}" aria-expanded="${"false"}" aria-label="${"Toggle navigation"}"><span class="${"navbar-toggler-icon"}"></span>  ${escape($menuDrop[0])}</button>

	<div class="${"collapse navbar-collapse"}" id="${"navbarNavDropdown"}"><ul class="${"navbar-nav"}"><li class="${"nav-item"}">${validate_component(NavLink, "NavLink").$$render($$result, { to: $menuLinks[0] }, {}, {
		default: () => {
			return `<div class="${"nav-link rounded-xl"}">${escape($menuItems[0])} </div>`;
		}
	})}</li>

			<li class="${"nav-item dropdown"}"><div class="${"nav-link dropdown-toggle rounded-xl link-conocenos"}" id="${"navbarDropdownMenuLink"}" role="${"button"}" data-bs-toggle="${"dropdown"}" aria-expanded="${"false"}">${escape($menuDrop[1])} </div>
				<ul class="${"dropdown-menu"}" aria-labelledby="${"navbarDropdownMenuLink"}"><li>${validate_component(NavLink, "NavLink").$$render($$result, { to: $menuLinks[1] }, {}, {
		default: () => {
			return `<div class="${"dropdown-item"}">${escape($menuItems[1])} </div>`;
		}
	})}</li>
					<li>${validate_component(NavLink, "NavLink").$$render($$result, { to: $menuLinks[2] }, {}, {
		default: () => {
			return `<div class="${"dropdown-item"}">${escape($menuItems[2])} </div>`;
		}
	})}</li>
					<li>${validate_component(NavLink, "NavLink").$$render($$result, { to: $menuLinks[3] }, {}, {
		default: () => {
			return `<div class="${"dropdown-item"}">${escape($menuItems[3])} </div>`;
		}
	})}</li>
					<hr>
					<li><div data-bs-toggle="${"modal"}" data-bs-target="${"#menuModal"}"><div class="${"dropdown-item"}">${escape($menuItems[4])} </div></div></li></ul></li>

			<li class="${"nav-item dropdown"}"><div class="${"nav-link dropdown-toggle rounded-xl link-informacion"}" id="${"navbarDropdownMenuLink"}" role="${"button"}" data-bs-toggle="${"dropdown"}" aria-expanded="${"false"}">${escape($menuDrop[2])} </div>
				<ul class="${"dropdown-menu"}" aria-labelledby="${"navbarDropdownMenuLink"}"><li>${validate_component(NavLink, "NavLink").$$render($$result, { to: $menuLinks[5] }, {}, {
		default: () => {
			return `<div class="${"dropdown-item"}">${escape($menuItems[5])} </div>`;
		}
	})}</li>
					<li>${validate_component(NavLink, "NavLink").$$render($$result, { to: $menuLinks[6] }, {}, {
		default: () => {
			return `<div class="${"dropdown-item"}">${escape($menuItems[6])} </div>`;
		}
	})}</li>
					${$conectionOnLine
	? `
						 <hr>
						 <li><a target="${"_blank"}" rel="${"noopener"}"${add_attribute("href", $menuLinks[7], 0)}><div class="${"dropdown-item"}">${escape($menuItems[7])} </div></a></li>
						 <li><a target="${"_blank"}" rel="${"noopener"}"${add_attribute("href", $menuLinks[8], 0)}><div class="${"dropdown-item"}">${escape($menuItems[8])} </div></a></li>
						 `
	: ``}</ul></li>

			<li class="${"nav-item"}">${validate_component(NavLink, "NavLink").$$render($$result, { to: $menuLinks[11] }, {}, {
		default: () => {
			return `<div class="${"nav-link rounded-xl"}">${escape($menuItems[11])} </div>`;
		}
	})}</li></ul></div></div>`;
});

/* src/components/Header.svelte generated by Svelte v3.48.0 */

const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `${validate_component(Head, "Head").$$render($$result, {}, {}, {})}
<nav class="${"navbar navbar-expand-lg navbar-light bg-blanco shadow"}" id="${"navbar-fixed"}">${validate_component(Navbar, "Navbar").$$render($$result, {}, {}, {})}</nav>
<nav class="${"navbar navbar-expand-lg navbar-light bg-blanco shadow"}" id="${"navbar-top"}">${validate_component(Navbar, "Navbar").$$render($$result, {}, {}, {})}</nav>`;
});

// ? Animacion de los elementos con el Scroll 
const contentWayPointAnimalo = () => {

    var waypoints = document.querySelectorAll('.animalo');
    waypoints.forEach( waypoint => {
        new Waypoint ({
            element: waypoint,
            handler: function(direction){

                if(direction === 'down' && !this.element.classList.contains('animated')){

                    waypoint.classList.add('item-animate');
                    
                    setTimeout(() => {
                        let el = document.querySelectorAll('.animalo.item-animate');

                        el.forEach((e, index) =>{
                            
                            setTimeout( () => {
                                let effect = e.dataset.animateEffect;
                                e.classList.add(effect, 'animated');
                                e.classList.remove('item-animate');
                            },  index * 350 , 'easeInOutExpo');

                        });

                    }, 100);
                }
            }, offset: '95%'
        });
    } );
};


// ? Agrega o remueve la clase 'active' en los dropdown-toggles del Navbar 
const menuRemoveClass = (clase) => {
    const _link1 = document.querySelectorAll('.dropdown-toggle');
    _link1.forEach( e => e.classList.remove('active') );
    if(clase) {
        const _link2 = document.querySelectorAll(clase);
        _link2.forEach( e => e.classList.add('active') );
    }
};


// ? Me lleva al inicio de la página si el scroll es mayor a cero 
const goScrollUp = () => {

    return new Promise( ( resolve, reject ) => {

        if ( document.documentElement.scrollTop > 0 ) {
    
            window.scrollTo({
                top:0,
                left:0,
                behavior:"smooth"
            });
            resolve(1000);
        }else {
            resolve(100); 
        }
    } )

};

/* src/components/Language.svelte generated by Svelte v3.48.0 */

const Language = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp, page } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);
	if ($$props.page === void 0 && $$bindings.page && page !== void 0) $$bindings.page(page);

	return `<div class="${"buttonfloat"}"><a${add_attribute("href", page, 0)}>${esp
	? `<img src="${"/assets/img/usa.png"}" class="${"flag"}" alt="${"flag"}">`
	: `<img src="${"/assets/img/el-salvador.png"}" class="${"flag"}" alt="${"flag"}">`}</a></div>`;
});

/* src/views/Common.svelte generated by Svelte v3.48.0 */

const Common = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $menuItems, $$unsubscribe_menuItems;
	$$unsubscribe_menuItems = subscribe(menuItems, value => $menuItems = value);
	let { esp, clase, url = [] } = $$props;
	let page;

	// console.log(url);
	// console.log(typeof(url));
	// Comprobamos que prop 'url' es un string o un arreglo
	if (typeof url == "string") {
		page = url;
	} else {
		if (esp) {
			page = url[1];
		} else {
			page = url[0];
		}
	}

	// Iniciamos el idioma en el menú
	if (esp) {
		if ($menuItems[0] == "Home") {
			menuItems.update(n => navItemsEs);
			menuLinks.update(n => navLinksEs);
			menuDrop.update(n => navDropEs);
		}
	} else {
		if ($menuItems[0] == "Inicio") {
			menuItems.update(n => navItemsEn);
			menuLinks.update(n => navLinksEn);
			menuDrop.update(n => navDropEn);
		}
	}

	const checkConnection = () => {
		console.log(messages[navigator.onLine]);
		contentMessage.classList.remove("true");
		contentMessage.classList.remove("false");

		setTimeout(
			function () {
				contentMessage.innerHTML = messages[navigator.onLine];
				contentMessage.classList.add(navigator.onLine);
			},
			600
		);

		if (navigator.onLine) {
			console.log("con conexion");
			conectionOnLine.update(n => true);

			//Recarga los iframes
			const iframe = document.querySelectorAll('.iframe');

			iframe.forEach(e => {
				e.src = e.src;
			});

			const cambiarClase = document.querySelectorAll('.oculto');

			setTimeout(
				function () {
					cambiarClase.forEach(e => {
						//e.removeClass('class', 'visible');
						e.classList.remove("oculto");

						e.classList.add("visible");
					});
				},
				2000
			);

			// const showElement = document.querySelectorAll('.v-offLine-ocultar');
			// showElement.forEach(e => e.classList.remove("v-ocultar"));
			// const hiddenElement = document.querySelectorAll('.v-onLine-ocultar');
			// hiddenElement.forEach(e => e.classList.add("v-ocultar"));
			setTimeout(
				() => {
					const menuBottom = document.querySelector('.nav-eq');

					if (menuBottom) {
						menuBottom.classList.remove('subir');
					}
				},
				6000
			);

			setTimeout(
				function () {
					contentMessage.classList.remove("true");
				},
				6000
			);

			contentWayPointAnimalo();
		} else {
			console.log("sin conexion");
			conectionOnLine.update(n => false);

			setTimeout(
				() => {
					const menuBottom = document.querySelector('.nav-eq');

					if (menuBottom) {
						menuBottom.classList.add('subir');
					}
				},
				1200
			);

			const cambiarClase = document.querySelectorAll('.visible');

			cambiarClase.forEach(e => {
				//e.setAttribute('class', 'oculto');
				e.classList.remove("visible");

				e.classList.add("oculto");
			});
		} // const showElement = document.querySelectorAll('.v-onLine-ocultar');
		// showElement.forEach(e => e.classList.remove("v-ocultar"));
	}; // const hiddenElement = document.querySelectorAll('.v-offLine-ocultar');
	// hiddenElement.forEach(e => e.classList.add("v-ocultar"));

	onMount(async () => {
		window.addEventListener("online", checkConnection);
		window.addEventListener("offline", checkConnection);

		if (!navigator.onLine) {
			checkConnection();
		}

		menuRemoveClass(clase);
		let tiempo = await goScrollUp();

		setTimeout(
			() => {
				contentWayPointAnimalo();
			},
			tiempo
		);
	}); // console.log(navigator.onLine)

	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);
	if ($$props.clase === void 0 && $$bindings.clase && clase !== void 0) $$bindings.clase(clase);
	if ($$props.url === void 0 && $$bindings.url && url !== void 0) $$bindings.url(url);
	if ($$props.checkConnection === void 0 && $$bindings.checkConnection && checkConnection !== void 0) $$bindings.checkConnection(checkConnection);
	$$unsubscribe_menuItems();
	return `${validate_component(Language, "Language").$$render($$result, { esp, page }, {}, {})}`;
});

/* src/components/Slider.svelte generated by Svelte v3.48.0 */

const Slider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<section id="${"My-Slider"}" class="${"carousel slide carousel-fade"}" data-bs-ride="${"carousel"}"><ol class="${"carousel-indicators"}"><li data-bs-target="${"#My-Slider"}" data-bs-slide-to="${"0"}" class="${"active"}"></li>
        <li data-bs-target="${"#My-Slider"}" data-bs-slide-to="${"1"}"></li>
        <li data-bs-target="${"#My-Slider"}" data-bs-slide-to="${"2"}"></li>
        <li data-bs-target="${"#My-Slider"}" data-bs-slide-to="${"3"}"></li>
        <li data-bs-target="${"#My-Slider"}" data-bs-slide-to="${"4"}"></li>
        <li data-bs-target="${"#My-Slider"}" data-bs-slide-to="${"5"}"></li>
        <li data-bs-target="${"#My-Slider"}" data-bs-slide-to="${"6"}"></li>
        <li data-bs-target="${"#My-Slider"}" data-bs-slide-to="${"7"}"></li>
        <li data-bs-target="${"#My-Slider"}" data-bs-slide-to="${"8"}"></li></ol>

    <div class="${"carousel-inner"}">
        <div class="${"carousel-item active"}" style="${"background-image:url('/assets/img/slider/slider_1.jpg')"}">
            <div class="${"mask"}"></div>
            
            <div class="${"container texto-carrusel"}">${!esp
	? `<p class="${"display-3 font-weight-bold animated fadeInDown delay-1s"}">They are the most important.</p>
                    <p class="${"h3 animated fadeIn delay-2s"}">More than 35 years of building values for a better world.</p>`
	: `<p class="${"display-3 font-weight-bold animated fadeInDown delay-1s"}">Ellos son lo más Importante.</p>
                    <p class="${"h3 animated fadeIn delay-2s"}">Más de 35 años de construir valores para un mundo mejor.</p>`}</div></div>

        
        <div class="${"carousel-item"}" style="${"background-image:url('/assets/img/slider/slider_2.jpg')"}">
            <div class="${"mask"}"></div>
            
            <div class="${"container texto-carrusel"}">${!esp
	? `<p class="${"display-3 font-weight-bold animated fadeInDown delay-1s"}">We educate with Values.</p>
                <p class="${"h3 animated fadeIn delay-2s"}">We pride ourselves on our personalized education.</p>`
	: `<p class="${"display-3 font-weight-bold animated fadeInDown delay-1s"}">Educamos con Valores.</p>
                <p class="${"h3 animated fadeIn delay-2s"}">Nos enorgullecemos de nuestra educación personalizada.</p>`}</div></div>

        
        <div class="${"carousel-item"}" style="${"background-image:url('/assets/img/slider/slider_3.jpg')"}">
            <div class="${"mask"}"></div>
            
            <div class="${"container texto-carrusel-3"}">${!esp
	? `<p class="${"display-3 font-weight-bold animated fadeInRight delay-1s"}">Equality for all.</p>
                <p class="${"h3 animated fadeIn delay-2s"}">We promote respect and equality, &quot;STOP bullying&quot;.</p>`
	: `<p class="${"display-3 font-weight-bold animated fadeInRight delay-1s"}">Igualdad para todos.</p>
                <p class="${"h3 animated fadeIn delay-2s"}">Fomentamos el respeto y la igualdad, &quot;ALTO al bullying&quot;.</p>`}</div></div>

        
        <div class="${"carousel-item"}" style="${"background-image:url('/assets/img/slider/slider_4.jpg')"}"><div class="${"mask"}"></div>
            <div class="${"container texto-carrusel"}">${!esp
	? `<p class="${"display-3 font-weight-bold animated fadeInDown delay-1s"}">They are the most important.</p>
                    <p class="${"h3 animated fadeIn delay-2s"}">More than 35 years of building values for a better world.</p>`
	: `<p class="${"display-3 font-weight-bold animated fadeInDown delay-1s"}">Ellos son lo más Importante.</p>
                    <p class="${"h3 animated fadeIn delay-2s"}">Más de 35 años de construir valores para un mundo mejor.</p>`}</div></div>

        
        <div class="${"carousel-item"}" style="${"background-image:url('/assets/img/slider/slider_5.jpg')"}"><div class="${"mask"}"></div>
            <div class="${"container texto-carrusel"}">${!esp
	? `<p class="${"display-3 font-weight-bold animated fadeInDown delay-1s"}">We educate with Values.</p>
                <p class="${"h3 animated fadeIn delay-2s"}">We pride ourselves on our personalized education.</p>`
	: `<p class="${"display-3 font-weight-bold animated fadeInDown delay-1s"}">Educamos con Valores.</p>
                <p class="${"h3 animated fadeIn delay-2s"}">Nos enorgullecemos de nuestra educación personalizada.</p>`}</div></div>

        
        <div class="${"carousel-item"}" style="${"background-image:url('/assets/img/slider/slider_6.jpg')"}"><div class="${"mask"}"></div>
            <div class="${"container texto-carrusel-3"}">${!esp
	? `<p class="${"display-3 font-weight-bold animated fadeInRight delay-1s"}">Equality for all.</p>
                <p class="${"h3 animated fadeIn delay-2s"}">We promote respect and equality, &quot;STOP bullying&quot;.</p>`
	: `<p class="${"display-3 font-weight-bold animated fadeInRight delay-1s"}">Igualdad para todos.</p>
                <p class="${"h3 animated fadeIn delay-2s"}">Fomentamos el respeto y la igualdad, &quot;ALTO al bullying&quot;.</p>`}</div></div>

        
        <div class="${"carousel-item"}" style="${"background-image:url('/assets/img/slider/slider_7.jpg')"}"><div class="${"mask"}"></div>
            <div class="${"container texto-carrusel"}">${!esp
	? `<p class="${"display-3 font-weight-bold animated fadeInDown delay-1s"}">They are the most important.</p>
                    <p class="${"h3 animated fadeIn delay-2s"}">More than 35 years of building values for a better world.</p>`
	: `<p class="${"display-3 font-weight-bold animated fadeInDown delay-1s"}">Ellos son lo más Importante.</p>
                    <p class="${"h3 animated fadeIn delay-2s"}">Más de 35 años de construir valores para un mundo mejor.</p>`}</div></div>

        
        <div class="${"carousel-item"}" style="${"background-image:url('/assets/img/slider/slider_8.jpg')"}"><div class="${"mask"}"></div>
            <div class="${"container texto-carrusel"}">${!esp
	? `<p class="${"display-3 font-weight-bold animated fadeInDown delay-1s"}">We educate with Values.</p>
                <p class="${"h3 animated fadeIn delay-2s"}">We pride ourselves on our personalized education.</p>`
	: `<p class="${"display-3 font-weight-bold animated fadeInDown delay-1s"}">Educamos con Valores.</p>
                <p class="${"h3 animated fadeIn delay-2s"}">Nos enorgullecemos de nuestra educación personalizada.</p>`}</div></div>

        
        <div class="${"carousel-item"}" style="${"background-image:url('/assets/img/slider/slider_9.jpg')"}"><div class="${"mask"}"></div>
            <div class="${"container texto-carrusel-3"}">${!esp
	? `<p class="${"display-3 font-weight-bold animated fadeInRight delay-1s"}">Equality for all.</p>
                <p class="${"h3 animated fadeIn delay-2s"}">We promote respect and equality, &quot;STOP bullying&quot;.</p>`
	: `<p class="${"display-3 font-weight-bold animated fadeInRight delay-1s"}">Igualdad para todos.</p>
                <p class="${"h3 animated fadeIn delay-2s"}">Fomentamos el respeto y la igualdad, &quot;ALTO al bullying&quot;.</p>`}</div></div></div>

    <button type="${"button"}" class="${"carousel-control-prev"}" data-bs-target="${"#My-Slider"}" data-bs-slide="${"prev"}"><span class="${"carousel-control-prev-icon"}" aria-hidden="${"true"}"></span>
        <span class="${"sr-only"}">Previous</span></button>

    <button type="${"button"}" class="${"carousel-control-next"}" data-bs-target="${"#My-Slider"}" data-bs-slide="${"next"}"><span class="${"carousel-control-next-icon"}" aria-hidden="${"true"}"></span>
        <span class="${"sr-only"}">Next</span></button></section>`;
});

/* src/components/Servicios.svelte generated by Svelte v3.48.0 */

const Servicios = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<section id="${"servicios"}" class="${"row no-gutters services-section bg-light"}">
    <div class="${"col-sm-12 col-md-6 col-lg-3 bg-rojo animalo"}" data-animate-effect="${"fadeInUp"}">${validate_component(Link, "Link").$$render(
		$$result,
		{
			to: esp ? "circulares" : "newsletter",
			class: "link-1"
		},
		{},
		{
			default: () => {
				return `<div class="${"p-4 w-100 h-100"}"><div class="${"d-flex justify-content-center"}"><div class="${"icono bg-blanco sombra-l"}"><i class="${"far fa-newspaper"}"></i></div></div>

                ${!esp
				? `<h4 class="${"text-white text-center"}">Circulars and monthly newsletter</h4>
                    <hr class="${"bg-light"}">
                    <p class="${"text-white text-center"}">Our monthly newsletter as well as the communications contain or have important information. We invite you to read them!</p>`
				: `<h4 class="${"text-white text-center"}">Circulares y Boletín mensual</h4>
                    <hr class="${"bg-light"}">
                    <p class="${"text-white text-center"}">Nuestro boletín informativo mensual y todas las circulares contienen información importante de las actividades que se desarrollan en el colegio. ¡Los invitamos a estar pendientes!.</p>`}</div>`;
			}
		}
	)}</div>
    
    
    <div class="${"col-sm-12 col-md-6 col-lg-3 bg-naranja animalo"}" data-animate-effect="${"fadeInUp"}"><a href class="${"link-2"}" data-bs-toggle="${"modal"}" data-bs-target="${"#menuModal"}"><div class="${"p-4 w-100 h-100"}"><div class="${"d-flex justify-content-center"}"><div class="${"icono bg-blanco sombra-l"}"><i class="${"fas fa-mug-hot"}"></i></div></div>

                ${!esp
	? `<h4 class="${"text-white text-center"}">Cafeteria Menu</h4>
                    <hr class="${"bg-light"}">
                    <p class="${"text-white text-center"}">Every week we offer a delicious variety of healthy food and snacks for our students.</p>`
	: `<h4 class="${"text-white text-center"}">Menú de Cafetería</h4>
                    <hr class="${"bg-light"}">
                    <p class="${"text-white text-center"}">Todas las semanas ofrecemos una deliciosa variedad de comida saludable para el almuerzo de sus hijos. Le recordamos que además tenemos a la venta refrigerios.</p>`}</div></a></div>

    
    <div class="${"col-sm-12 col-md-6 col-lg-3 bg-azul animalo"}" data-animate-effect="${"fadeInUp"}">${validate_component(Link, "Link").$$render(
		$$result,
		{
			to: esp ? "fechas-importantes" : "important-dates",
			class: "link-3"
		},
		{},
		{
			default: () => {
				return `<div class="${"p-4 w-100 h-100"}"><div class="${"d-flex justify-content-center"}"><div class="${"icono bg-blanco sombra-l"}"><i class="${"far fa-calendar-alt"}"></i></div></div>

                ${!esp
				? `<h4 class="${"text-white text-center"}">Important dates</h4>
                    <hr class="${"bg-light"}">
                    <p class="${"text-white text-center"}">Monthly we share important dates for parents and students of the different activities that take place in the school.</p>`
				: `<h4 class="${"text-white text-center"}">Fechas Importantes</h4>
                    <hr class="${"bg-light"}">
                    <p class="${"text-white text-center"}">Mes a mes les compartimos las fechas importantes para que como padres de familia estén pendientes de las actividades de sus hijos.</p>`}</div>`;
			}
		}
	)}</div>

    
    <div class="${"col-sm-12 col-md-6 col-lg-3 bg-rojo animalo"}" data-animate-effect="${"fadeInUp"}">${validate_component(Link, "Link").$$render(
		$$result,
		{
			to: esp ? "vida-escolar" : "school-life",
			class: "link-4"
		},
		{},
		{
			default: () => {
				return `<div class="${"p-4 w-100 h-100"}"><div class="${"d-flex justify-content-center"}"><div class="${"icono bg-blanco sombra-l"}"><i class="${"fas fa-user-graduate"}"></i></div></div>

                ${!esp
				? `<h4 class="${"text-white text-center"}">School life</h4>
                    <hr class="${"bg-light"}">
                    <p class="${"text-white text-center"}">We invite you to see our school activities.</p>`
				: `<h4 class="${"text-white text-center"}">Vida Escolar</h4>
                    <hr class="${"bg-light"}">
                    <p class="${"text-white text-center"}">Lo invitamos a ver el día a día de sus hijos y sus actividades dentro de nuestra institución a través de las fotos de vida escolar.</p>`}</div>`;
			}
		}
	)}</div></section>`;
});

/* src/components/Instituciones.svelte generated by Svelte v3.48.0 */

const Instituciones = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<section id="${"instituciones"}" class="${"container seccion-instituciones py-5"}"><div class="${"row"}"><div class="${"col-sm-6 col-lg-3 d-flex justify-content-center align-items-center py-1 my-3 animalo"}" data-animate-effect="${"fadeIn"}"><a href="${"https://www.tboxplanet.com"}" target="${"_blank"}"><img src="${"/assets/img/logos/Logo_t-box.png"}" alt="${""}" style="${"height: 60px"}"></a></div>

        <div class="${"col-sm-6 col-lg-3 d-flex justify-content-center align-items-center py-1 my-3 animalo"}" data-animate-effect="${"fadeIn"}"><a href="${"https://santillana.com.sv"}" target="${"_blank"}"><img src="${"/assets/img/logos/Logo_Santillana.png"}" alt="${""}" style="${"height: 60px"}"></a></div>

        <div class="${"col-sm-6 col-lg-3 d-flex justify-content-center align-items-center py-1 my-3 animalo"}" data-animate-effect="${"fadeIn"}"><a href="${"https://www.pearson.com"}" target="${"_blank"}"><img src="${"/assets/img/logos/Logo_Pearson.png"}" alt="${""}" style="${"height: 60px"}"></a></div>

        <div class="${"col-sm-6 col-lg-3 d-flex justify-content-center align-items-center py-1 my-3 animalo"}" data-animate-effect="${"fadeIn"}"><a href="${"http://www.nipsa.org"}" target="${"_blank"}"><img src="${"/assets/img/logos/NIPSA_Logo.png"}" alt="${""}" style="${"height: 60px"}"></a></div>

        <div class="${"col-sm-6 col-lg-4 d-flex justify-content-center align-items-center py-1 my-3 animalo"}" data-animate-effect="${"fadeIn"}"><a href="${"https://www.mheducation.com"}" target="${"_blank"}"><img src="${"/assets/img/logos/Logo_McGraw-Hill.jpg"}" alt="${""}" style="${"height: 100px"}"></a></div>

        <div class="${"col-sm-6 col-lg-4 d-flex justify-content-center align-items-center py-1 my-3 animalo"}" data-animate-effect="${"fadeIn"}"><a href="${"https://www.hmhco.com"}" target="${"_blank"}"><img src="${"/assets/img/logos/Logo_HMH.png"}" alt="${""}" style="${"height: 100px"}"></a></div>

        <div class="${"col-sm-12 col-lg-4 d-flex justify-content-center align-items-center py-1 my-3 animalo"}" data-animate-effect="${"fadeIn"}"><a href="${"https://www.afelsalvador.com"}" target="${"_blank"}"><img src="${"/assets/img/logos/Logo_alianza-francesa.png"}" alt="${""}" style="${"height: 150px"}"></a></div></div></section>`;
});

/* src/components/Nosotros.svelte generated by Svelte v3.48.0 */

const Nosotros = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp, hidden } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);
	if ($$props.hidden === void 0 && $$bindings.hidden && hidden !== void 0) $$bindings.hidden(hidden);

	return `<section id="${"conocenos"}" class="${"container about-us-section"}"><div class="${"row pt-5"}"><div class="${"col-md-5 order-last p-4 bg-claro animalo"}" data-animate-effect="${"fadeInUp"}"><h2 class="${"mb-4"}">${escape(!esp ? 'What we offer' : 'Qué ofrecemos')}</h2>
            <p>${escape(!esp
	? 'We are an institution committed to training individuals with a high sense of personal and social responsibility, comprehensive citizens with academic excellence, who have the tools to lead in a global world.'
	: 'Somos una institución comprometida con la formación de individuos con alto sentido de responsabilidad personal y social, ciudadanos integrales con excelencia académica, que poseen las herramientas para liderar en un mundo global.')}</p>
            <p>${escape(!esp
	? 'We pride ourselves on our work as educators and on our personalized education.'
	: 'Nos enorgullecemos de nuestro trabajo como educadores y de nuestra educación personalizada.')}</p>
            <p>${escape(!esp
	? 'Our teachers are trained to educate our students through values and principles, to form successful citizens.'
	: 'Nuestros maestros están capacitados para educar a nuestros estudiantes a través de valores y principios, para formar ciudadanos exitosos.')}</p>

            ${!hidden
	? `<h4 class="${"mt-4 ml-4"}">${escape(!esp
		? 'Our program includes:'
		: 'Nuestro programa incluye:')}</h4>
                <ul calss="${"programa"}"><li><span><i class="${"fas fa-arrow-right sombra"}"></i></span>
                        <span>${escape(!esp
		? 'Bilingual English - Spanish education from maternal.'
		: 'Educación bilingüe inglés – español desde maternal.')}</span></li>
                    <li><span><i class="${"fas fa-arrow-right sombra"}"></i></span>
                        <span>${escape(!esp ? 'French lessons.' : 'Clases de francés.')}</span></li>
                    <li><span><i class="${"fas fa-arrow-right sombra"}"></i></span>
                        <span>${escape(!esp ? 'Computing.' : 'Computación.')}</span></li>
                    <li><span><i class="${"fas fa-arrow-right sombra"}"></i></span>
                        <span>${escape(!esp ? 'Robotics program.' : 'Programa de robótica.')}</span></li>
                    <li><span><i class="${"fas fa-arrow-right sombra"}"></i></span>
                        <span>${escape(!esp ? 'Sports program.' : 'Programa deportivo.')}</span></li>
                    <li><span><i class="${"fas fa-arrow-right sombra"}"></i></span>
                        <span>${escape(!esp ? 'Music program.' : 'Programa de música.')}</span></li>
                    <li><span><i class="${"fas fa-arrow-right sombra"}"></i></span>
                        <span>${escape(!esp ? 'Art program.' : 'Programa de arte.')}</span></li>
                    <li><span><i class="${"fas fa-arrow-right sombra"}"></i></span>
                        <span>${escape(!esp
		? 'Motivational talk program.'
		: 'Programa de charlas motivacionales.')}</span></li>
                    <li><span><i class="${"fas fa-arrow-right sombra"}"></i></span>
                        <span>${escape(!esp
		? 'Anti-bullying program.'
		: 'Programa en contra del bullying (acoso escolar).')}</span></li>
                    <li><span><i class="${"fas fa-arrow-right sombra"}"></i></span>
                        <span>${escape(!esp
		? 'Use of technology in the classroom starting in preschool.'
		: 'Uso de tecnología en el aula comenzando en parvularia.')}</span></li>
                    <li><span><i class="${"fas fa-arrow-right sombra"}"></i></span>
                        <span>${escape(!esp ? 'Student government.' : 'Gobierno estudiantil.')}</span></li></ul>

                <h4 class="${"mt-4 ml-4"}">${escape(!esp ? 'Extracurricular:' : 'Extra Curriculares:')}</h4>
                <ul calss="${"programa"}"><li><span><i class="${"fas fa-arrow-right sombra"}"></i></span>
                        <span>${escape(!esp ? 'Cooking club.' : 'Club de cocina.')}</span></li>
                    <li><span><i class="${"fas fa-arrow-right sombra"}"></i></span>
                        <span>${escape(!esp ? 'Chess Club.' : 'Club de ajedrez.')}</span></li>
                    <li><span><i class="${"fas fa-arrow-right sombra"}"></i></span>
                        <span>${escape(!esp ? 'Homework club.' : 'Club de tareas.')}</span></li>
                    <li><span><i class="${"fas fa-arrow-right sombra"}"></i></span>
                        <span>${escape(!esp ? 'Day care.' : 'Day care.')}</span></li></ul>`
	: ``}

            ${hidden
	? `${!esp
		? `<div class="${"d-flex justify-content-center"}">${validate_component(Link, "Link").$$render($$result, { to: "/institution" }, {}, {
				default: () => {
					return `<button class="${"btn rounded-pill bg-naranja text-white sombra px-4 py-2"}">Read more</button>`;
				}
			})}</div>`
		: `<div class="${"d-flex justify-content-center"}">${validate_component(Link, "Link").$$render($$result, { to: "/institucion" }, {}, {
				default: () => {
					return `<button class="${"btn rounded-pill bg-naranja text-white sombra px-4 py-2"}">Leer más</button>`;
				}
			})}</div>`}`
	: ``}</div>

        <div class="${"col-md-7 p-4 animalo"}" data-animate-effect="${"fadeInUp"}"><h2 class="${"mb-4"}">${escape(!esp
	? 'Welcome to ABC Bilingual School'
	: 'Bienvenidos a ABC Bilingual School')}</h2>
            <p>${escape(!esp
	? 'Our institution began operations in 1986, as a team dedicated to providing bilingual education services at the kindergarten level.'
	: 'Nuestra institución inició operaciones en el año 1986, como una empresa dedicada a prestar servicios de educación bilingüe a nivel parvulario.')}</p>
            <p>${escape(!esp
	? 'It started with 8 students, having had strong growth due to the quality of the service provided. This growth gave us the opportunity to establish the organization, legally as of july 1993, as ABC KID`S SCHOOL, S.A. DE C.V.'
	: 'Comenzó con 8 alumnos, habiendo tenido un fuerte crecimiento debido a la calidad del servicio prestado. Este crecimiento hizo que se convirtiera en una pequeña empresa instituyéndose y legalizándose en julio de 1993, como ABC KID`S SCHOOL, S.A. DE C.V.')}</p>
            <p>${escape(!esp
	? 'The operating permit was granted by the Ministry of Education of El Salvador (MINED) under agreement No. 15-0536.'
	: 'El permiso de funcionamiento fue otorgado por Ministerio de Educación de El Salvador (MINED) bajo el acuerdo No. 15-0536.')}</p>

            <div class="${"row no-gutters mt-5"}"><div class="${"col-lg-12 mb-4"}"><div class="${"section-about-us d-flex"}"><div class="${"box-icon-about-us"}"><div class="${"icono bg-azul me-2 sombra"}"><span class="${"fas fa-graduation-cap"}"></span></div></div>
                    <div><h5>${escape(!esp ? 'Mission' : 'Misión')}</h5>
                        <p class="${"text-section-about-us"}">${escape(!esp
	? 'Forge individuals with a high degree of personal and social responsibility, comprehensive citizens with excellent academic quality, endowed with the knowledge and skills to be leaders in their environment.'
	: 'Forjar individuos con un alto grado de responsabilidad personal y social, ciudadanos integrales con excelente calidad académica, dotados con los conocimientos y aptitudes para ser líderes en su medio.')}</p></div></div></div>

                <div class="${"col-lg-12 mb-4"}"><div class="${"section-about-us d-flex"}"><div class="${"box-icon-about-us"}"><div class="${"icono bg-azul me-2 sombra"}"><span class="${"fas fa-handshake"}"></span></div></div>
                    <div><h5>${escape(!esp ? 'Vision' : 'Visión')}</h5>
                        <p class="${"text-section-about-us"}">${escape(!esp
	? "To be the bilingual institution that trains committed leaders with a high sense of the practice of values, to succeed in today's professional world."
	: "Ser la institución bilingüe formadora de líderes comprometidos y con un alto sentido de la práctica de los valores, para triunfar en el mundo profesional actual.")}</p></div></div></div>

                ${!hidden
	? `<div class="${"col-lg-12 mb-4"}"><div class="${"section-about-us d-flex"}"><div class="${"box-icon-about-us"}"><div class="${"icono bg-azul me-2 sombra"}"><span class="${"far fa-award"}"></span></div></div>
                            <div><h5>${escape(!esp ? 'General objective' : 'Objetivo General')}</h5>
                                <p class="${"text-section-about-us"}">${escape(!esp
		? 'Provide a bilingual and personalized comprehensive education that highlights moral values to forge successful future citizens.'
		: 'Proporcionar una educación integral bilingüe y personalizada en la que se resalten los valores morales para forjar futuros ciudadanos exitosos.')}</p></div></div></div>

                    <div class="${"col-lg-12 mb-4"}"><div id="${"valores"}" class="${"bg-azul sombra"}"><h5 class="${"mt-3"}">${escape(!esp ? 'Values' : 'Valores')}</h5>
                            <div class="${"elements"}"><ul><li>Respeto,</li>
                                    <li>Lealtad,</li>
                                    <li>Hermandad,</li>
                                    <li>Humanismo,</li>
                                    <li>Responsabilidad,</li>
                                    <li>Servicio</li></ul></div></div></div>

                    <h4 class="${"ml-5"}">${escape(!esp
		? 'Our educational plan includes:'
		: 'Nuestro plan educativo incluye:')}</h4>

                    <div class="${"row no-gutters mt-4"}"><div class="${"col-lg-12 mb-4"}"><div class="${"section-about-us d-flex"}"><div class="${"box-icon-about-us"}"><div class="${"icono bg-azul me-2 sombra"}"><span class="${"fas fa-bullhorn"}"></span></div></div>
                            <div><p class="${"text-section-about-us"}">${escape(!esp
		? 'Academic leadership with a modern and high-level curriculum in the wide variety of activities we offer.'
		: 'Liderazgo académico con un curriculum moderno y de alto nivel en la amplia variedad de actividades que ofrecemos.')}</p></div></div></div>

                        <div class="${"col-lg-12 mb-4"}"><div class="${"section-about-us d-flex"}"><div class="${"box-icon-about-us"}"><div class="${"icono bg-azul me-2 sombra"}"><span class="${"fas fa-hand-holding-seedling"}"></span></div></div>
                            <div><p class="${"text-section-about-us"}">${escape(!esp
		? 'Education in values and morals, in a healthy environment, surrounded by love and with a positive approach.'
		: 'Educación en valores y moral, en un ambiente sano, rodeado de cariño y con un enfoque positivo.')}</p></div></div></div></div>`
	: ``}</div></div></div></section>`;
});

/* src/components/Video.svelte generated by Svelte v3.48.0 */

const Video = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<section class="${"animalo"}" data-animate-effect="${"fadeIn"}"><div class="${"container my-5"}"><div class="${"embed-responsive embed-responsive-16by9"}" style="${"background-image: url(" + escape(esp
	? '/assets/img/offline/videoBackEs.jpg'
	: '/assets/img/offline/videoBackIn.jpg') + "); background-position: center;"}"><div class="${"visible"}">
                <iframe title="${"mi video"}" class="${"iframe"}" src="${"https://player.vimeo.com/video/405312037"}" width="${"640"}" height="${"360"}" frameborder="${"0"}" allow="${"autoplay; fullscreen"}" allowfullscreen></iframe></div></div></div></section>`;
});

/* src/components/Parallax.svelte generated by Svelte v3.48.0 */

const Parallax = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;

	onMount(() => {
		jarallax(document.querySelector('.jarallax'), { speed: 0.5 });
	});

	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `


<section id="${"parallax"}" class="${"view jarallax"}"><img class="${"jarallax-img"}" src="${"/assets/img/parallax.jpg"}" alt="${""}">
    
    <div class="${"mask rgba-black-light"}"><div class="${"container d-flex justify-content-center align-items-center text-center h-100"}"><div class="${"row mt-5"}">${!esp
	? `<div class="${"col-md-9 animalo mb-3 text-box-parallax"}" data-animate-effect="${"fadeIn"}"><h1 class="${"text-white font-weight-bold mb-2 animalo"}" data-animate-effect="${"fadeInDown"}">We teach your child with love and respect.</h1>
                        <p class="${"parrafo text-white animalo"}" data-animate-effect="${"fadeIn"}">Respect and love for our students is what defines us as integral educators in our society.</p></div>
                    <div class="${"col-md-3 d-flex align-items-center"}"><p>${validate_component(Link, "Link").$$render(
			$$result,
			{
				to: "school-life",
				class: "btn rounded-pill bg-naranja text-white px-4 py-3 animalo btn-link",
				"data-animate-effect": "fadeIn"
			},
			{},
			{
				default: () => {
					return `School Life`;
				}
			}
		)}</p></div>`
	: `<div class="${"col-md-9 animalo mb-3 text-box-parallax"}" data-animate-effect="${"fadeIn"}"><h1 class="${"text-white font-weight-bold mb-2 animalo"}" data-animate-effect="${"fadeInDown"}">Enseñamos a su hijo con Amor y Respeto.</h1>
                        <p class="${"parrafo text-white animalo"}" data-animate-effect="${"fadeIn"}">El respeto y el amor hacia nuestros alumnos, es lo que nos define como educadores integrales en nuestra sociedad.
                        </p></div>
                    <div class="${"col-md-3 d-flex align-items-center"}"><p>${validate_component(Link, "Link").$$render(
			$$result,
			{
				to: "vida-escolar",
				class: "btn rounded-pill bg-naranja text-white px-4 py-3 animalo btn-link",
				"data-animate-effect": "fadeIn"
			},
			{},
			{
				default: () => {
					return `Vida Escolar`;
				}
			}
		)}</p></div>`}</div></div></div></section>`;
});

/* src/components/MessageOffLine.svelte generated by Svelte v3.48.0 */

const MessageOffLine = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<h2 class="${"h3 text-center"}">${escape(esp
	? 'Esta sección no se puede visualizar por falta de internet'
	: 'This section cannot be displayed due to lack of internet')}</h2>`;
});

/* src/components/EqItems.svelte generated by Svelte v3.48.0 */

const EqItems = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $conectionOnLine, $$unsubscribe_conectionOnLine;
	$$unsubscribe_conectionOnLine = subscribe(conectionOnLine, value => $conectionOnLine = value);
	let { esp, eq } = $$props;
	let equipo;
	let title;

	if (eq == 'administracion' || eq == 'administration') {
		equipo = equipos.admin.eq;
		title = equipos.admin.title;
	} else if (eq == 'parvularia' || eq == 'preschool') {
		equipo = equipos.parvu.eq;
		title = equipos.parvu.title;
	} else if (eq == 'primaria' || eq == 'primary') {
		equipo = equipos.prima.eq;
		title = equipos.prima.title;
	} else if (eq == 'secundaria' || eq == 'highschool') {
		equipo = equipos.secun.eq;
		title = equipos.secun.title;
	} else if (eq == 'nivelacion' || eq == 'development') {
		equipo = equipos.nivel.eq;
		title = equipos.nivel.title;
	}

	onMount(() => {
		if (document.querySelector('.link-parvu')) {
			let link = document.querySelector('.link-parvu').parentElement;

			const addClass = () => {
				if (link) {
					link.classList.add('active');
					link.setAttribute('aria-current', 'page');
				}
			};

			const removeClass = () => {
				if (link) {
					link.classList.remove('active');
					link.removeAttribute('aria-current');
				}
			};

			if (esp) {
				if (location.pathname == '/personal') {
					window.history.pushState('', "parvularia", "/personal/parvularia");
					addClass();
				} else if (location.pathname !== '/personal/parvularia' && link.hasAttribute('aria-current')) {
					// console.log(link.hasAttribute('aria-current'))
					removeClass();
				}
			} else {
				if (location.pathname == '/our-team') {
					window.history.pushState('', "preschool", "/our-team/preschool");
					addClass();
				} else if (location.pathname !== '/our-team/preschool' && link.hasAttribute('aria-current')) {
					// console.log(link.hasAttribute('aria-current'))
					removeClass();
				}
			}
		}
	});

	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);
	if ($$props.eq === void 0 && $$bindings.eq && eq !== void 0) $$bindings.eq(eq);
	$$unsubscribe_conectionOnLine();

	return `<div><h4 class="${"my-4 text-center sub-titulo-seccion"}">${escape(esp ? title[0] : title[1])}</h4>

    ${$conectionOnLine
	? `<div class="${"row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4"}">${each(equipo, equipo => {
			return `<div class="${"col mb-4 animalo"}" data-animate-effect="${"fadeInUp"}">
                    <div class="${"card h-100 sombra-c"}">
                        <div class="${"view overlay"}"><img class="${"card-img-top"}"${add_attribute("src", equipo.link, 0)} alt="${"imageCard"}">
                            <div><div class="${"mask rgba-stylish-light"}"></div>
                            </div></div>
            
                        
                        <div class="${"card-body"}">
                            <div style="${"height: 55%;"}"><h5 class="${"card-title text-center"}">${escape(equipo.nombre)}</h5></div>

                            
                            <div style="${"height: 45%;"}" class="${"d-flex justify-content-center align-items-end"}"><p class="${"card-text text-center"}">${escape(esp ? equipo.cargo : equipo.position)}</p>
                                </div>
                    
                        </div></div>
                    
                </div>`;
		})}</div>`
	: `${validate_component(MessageOffLine, "MessageOffLine").$$render($$result, { esp }, {}, {})}`}</div>`;
});

/* src/components/Equipo.svelte generated by Svelte v3.48.0 */

const Equipo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp, eq } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);
	if ($$props.eq === void 0 && $$bindings.eq && eq !== void 0) $$bindings.eq(eq);

	return `<section id="${"equipo"}"><div class="${"container my-section team-section pt-3"}"><div class="${"text-center"}"><h2 class="${"h2 titulo-seccion"}">${escape(esp ? 'Nuestro Equipo' : 'Our Team')}</h2>
            <p class="${"parrafo-seccion"}"></p></div>


        ${validate_component(EqItems, "EqItems").$$render($$result, { esp, eq }, {}, {})}

        <p class="${"mb-4 d-flex justify-content-center animalo pt-4"}" data-animate-effect="${"fadeIn"}">${esp
	? `${validate_component(Link, "Link").$$render(
			$$result,
			{
				to: "/personal/parvularia",
				class: "btn rounded-pill bg-naranja text-white px-4 py-2 sombra btn-link"
			},
			{},
			{
				default: () => {
					return `Todo el Equipo`;
				}
			}
		)}`
	: `${validate_component(Link, "Link").$$render(
			$$result,
			{
				to: "/our-team/preschool",
				class: "btn rounded-pill bg-naranja text-white px-4 py-2 sombra btn-link"
			},
			{},
			{
				default: () => {
					return `All Team`;
				}
			}
		)}`}</p></div></section>`;
});

/* src/components/Testimoniales.svelte generated by Svelte v3.48.0 */

const Testimoniales = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<section id="${"testimoniales"}" class="${"my-section bg-claro p-0"}"><div class="${"container-fluid"}"><div class="${"container"}"><div class="${"row justify-content-center"}"><div class="${"col-md-8 text-center heading-section animalo"}" data-animate-effect="${"fadeIn"}">${!esp
	? `<h2 class="${"titulo-seccion mb-2 h2"}">Some of parents&#39;<span>feelings about</span></h2>
                        <p class="${"parrafo-seccion"}">These are some of the opinions of parents of students about the educational work we carry out in our institution</p>`
	: `<h2 class="${"titulo-seccion mb-2 h2"}">¿ Que opinan los <span>padres de alumnos ?</span></h2>
                        <p class="${"parrafo-seccion"}">Estas son algunas de las opiniones de padres de alumno acerca de la labor educativa que desempeñamos en nuestra institución</p>`}</div></div>

            <div class="${"row animalo"}" data-animate-effect="${"fadeIn"}"><div class="${"col-md-12"}"><div id="${"carouselExampleCaptions"}" class="${"carousel slide"}" data-bs-ride="${"carousel"}" data-interval="${"15000"}"><div class="${"carousel-inner mb-5"}"><div class="${"carousel-item active"}"><div class="${"d-flex justify-content-center"}"><div class="${"img-box rounded-circle d-flex justify-content-center align-items-center bg-naranja sombra-l"}"><div class="${"img-svg rounded-circle"}"></div></div></div>
                                <div class="${"d-flex justify-content-center"}"><div class="${"caption py-2 text-center"}">${!esp
	? `<h5>Evelyn Gracias</h5>
                                            <p>My son studies here from maternal and I am very proud of the growth of his abilities and the acquired knowledge. At ABC Bilingual School they are educated with values and there is constant innovation to give our children added value in each activity carried out. See my son move around school as if it were his own home, see him interact with teachers and classmates in a healthy environment, expanding his culture and knowledge. That is priceless.</p>`
	: `<h5>Evelyn Gracias</h5>
                                            <p>Mi hijo estudia acá desde maternal y me siento muy orgullosa del crecimiento de sus habilidades y el conocimiento adquirido. En ABC Bilingual School se les educa con valores y hay una constante innovación para darles a nuestros hijos valor agregado en cada actividad realizada. Ver a mi hijo moverse en el colegio como si fuera su propia casa, verlo interactuar con maestros y compañeros en un ambiente sano, ampliando su cultura y conocimiento. Eso no tiene precio.</p>`}</div></div></div>
            
                            <div class="${"carousel-item"}"><div class="${"d-flex justify-content-center"}"><div class="${"img-box rounded-circle d-flex justify-content-center align-items-center bg-naranja sombra-l"}"><div class="${"img-svg rounded-circle"}"></div></div></div>
                                <div class="${"d-flex justify-content-center"}"><div class="${"caption py-2 text-center"}">${!esp
	? `<h5>Regina Daboub de Miguel</h5>
                                            <p>I love the personalized attention that the school offers, it is a very receptive institution and cares about the well-being as well educational and emotional stability of its students.</p>`
	: `<h5>Regina Daboub de Miguel</h5>
                                            <p>Me encanta la atención personalizada que ofrece el colegio, es una institución muy receptiva y se preocupa por el bienestar y la estabilidad educativa y emocional de sus alumnos.</p>`}</div></div></div>
            
                            <div class="${"carousel-item"}"><div class="${"d-flex justify-content-center"}"><div class="${"img-box rounded-circle d-flex justify-content-center align-items-center bg-naranja sombra-l"}"><div class="${"img-svg rounded-circle"}"></div></div></div>
                                <div class="${"d-flex justify-content-center"}"><div class="${"caption py-2 text-center"}">${!esp
	? `<h5>Karla Elena Giménez</h5>
                                            <p>I hereby recommend ABC School. More than a school, it has been a second home of my three children since 2004. The School has watched them grow! And thought them values. My oldest son graduated from ABC in 2018. I couldn&#39;t be more grateful and proud, of The values that the school has thought of my three children. I wish you the best of luck.</p>`
	: `<h5>Karla Elena Giménez</h5>
                                            <p>Lo recomiendo a ojos cerrados. Más que un colegio es la segunda familia de mis tres hijos desde el 2004. ¡Los han visto crecer! ¡Y ya en el 2018, mi primer hijo graduado del ABC! Orgullosísima de ustedes como institución. Agradecida por el grado de humanidad que existe. ¡Miles de éxitos más!</p>`}</div></div></div>
            
                            <div class="${"carousel-item"}"><div class="${"d-flex justify-content-center"}"><div class="${"img-box rounded-circle d-flex justify-content-center align-items-center bg-naranja sombra-l"}"><div class="${"img-svg rounded-circle"}"></div></div></div>
                                <div class="${"d-flex justify-content-center"}"><div class="${"caption py-2 text-center"}">${!esp
	? `<h5>Jancy Alberto</h5>
                                            <p>My daughter just entered but in so little time she has learned a lot. I am very happy with the staff, they are excellent teachers. They recommended it to me and I recommend it in the same way. Excellent facilities, staff, attention and above all the best education.</p>`
	: `<h5>Jancy Alberto</h5>
                                            <p>Mi hija recién entró pero en tan poco tiempo ha aprendido bastante. Estoy muy feliz con el personal, son excelentes docentes. A mi me lo recomendaron y yo lo recomiendo de igual forma. Excelentes instalaciones, personal, atención y sobre todo la mejor educación.</p>`}</div></div></div></div>
                        
                        <ol class="${"carousel-indicators"}"><li data-bs-target="${"#carouselExampleCaptions"}" data-bs-slide-to="${"0"}" class="${"active bg-dark"}"></li>
                            <li data-bs-target="${"#carouselExampleCaptions"}" data-bs-slide-to="${"1"}" class="${"bg-dark"}"></li>
                            <li data-bs-target="${"#carouselExampleCaptions"}" data-bs-slide-to="${"2"}" class="${"bg-dark"}"></li>
                            <li data-bs-target="${"#carouselExampleCaptions"}" data-bs-slide-to="${"3"}" class="${"bg-dark"}"></li></ol>

                        <button type="${"button"}" class="${"carousel-control-prev"}" data-bs-target="${"#carouselExampleCaptions"}" data-bs-slide="${"prev"}"><span class="${"carousel-control-prev-icon"}" aria-hidden="${"true"}"></span>
                            <span class="${"sr-only"}">Previous</span></button>
                        <button type="${"button"}" class="${"carousel-control-next"}" data-bs-target="${"#carouselExampleCaptions"}" data-bs-slide="${"next"}"><span class="${"carousel-control-next-icon"}" aria-hidden="${"true"}"></span>
                            <span class="${"sr-only"}">Next</span></button></div></div></div></div></div></section>`;
});

/* src/components/Fotos.svelte generated by Svelte v3.48.0 */

const Fotos = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<section id="${"fotos"}" class="${"seccion-fotos"}"><div class="${"container-fluid"}"><div class="${"row row-cols-md-2 row-cols-lg-4"}"><div class="${"fotos-item animalo"}" data-animate-effect="${"fadeIn"}"><img src="${"/assets/img/fotos/foto-01.jpg"}" alt="${""}"></div>
            <div class="${"fotos-item animalo"}" data-animate-effect="${"fadeIn"}"><img src="${"/assets/img/fotos/foto-02.jpg"}" alt="${""}"></div>
            <div class="${"fotos-item animalo"}" data-animate-effect="${"fadeIn"}"><img src="${"/assets/img/fotos/foto-03.jpg"}" alt="${""}"></div>
            <div class="${"fotos-item animalo"}" data-animate-effect="${"fadeIn"}"><img src="${"/assets/img/fotos/foto-04.jpg"}" alt="${""}"></div></div></div></section>`;
});

/* src/components/Footer-block-1.svelte generated by Svelte v3.48.0 */

const Footer_block_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<div class="${"col-sm-6 col-lg-3 mb-5 animalo"}" data-animate-effect="${"fadeInUp"}"><div class="${"block-1"}">${!esp
	? `<h3 class="${"block-title"}">Any questions ?</h3>`
	: `<h3 class="${"block-title"}">¿ Alguna Pregunta ?</h3>`}

        <ul><li><span class="${"icon fas fa-map-marker-alt"}"></span><span class="${"text"}">89 Av. Nte. y 3a Calle. Pte. #4628 Colonia Escalón, San Salvador, El Salvador, C.A.</span></li>
            <li><span class="${"icon fas fa-phone-alt"}"></span><span class="${"text"}">PBX:2264-0508/7696-9556</span></li>
            <li><span class="${"icon far fa-envelope"}"></span><span class="${"text"}">info1@abcbilingualschool.edu.sv</span></li></ul></div></div>`;
});

/* src/components/Footer-block-2.svelte generated by Svelte v3.48.0 */

const Footer_block_2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<div class="${"col-sm-6 col-lg-3 mb-5 animalo retardo-1"}" data-animate-effect="${"fadeInUp"}"><div class="${"block-2"}"><h3 class="${"block-title"}">${escape(esp ? "Últimas Circulares" : "Latest circulars")}</h3>

        <div class="${"mb-3 d-flex"}"><a href="${"/assets/img/circulares/circular-01.pdf"}" target="${"_blank"}"><img src="${"/assets/img/circulares/circular-01.jpg"}" alt="${""}" class="${"card-img-top"}"></a>

            

            <div class="${"content-info"}"><a href="${"/assets/img/circulares/circular-01.pdf"}" target="${"_blank"}">${escape(esp
	? "Bienvenida e Información"
	: "Welcome and Information")}</a>

                
            
                <div class="${"meta mt-2"}"><div><a href><i class="${"icon far fa-calendar-alt"}"></i> August 27, 2022</a></div>
                    <div><a href><i class="${"icon fas fa-user-alt"}"></i> Admin</a></div>
                    <div><a href><i class="${"icon far fa-comment-alt"}"></i> 19</a></div></div></div></div>

        <div class="${"d-flex"}"><a href data-bs-toggle="${"modal"}" data-bs-target="${"#menuModal"}"><img src="${"/assets/img/menu-cafeteria.jpg"}" alt="${""}" class="${"card-img-top"}"></a>

            <div class="${"content-info"}"><a href data-bs-toggle="${"modal"}" data-bs-target="${"#menuModal"}">${escape(esp ? cafeteria[6] : cafeteria[7])}</a>

                <div class="${"meta mt-2"}"><div><a href><i class="${"icon far fa-calendar-alt"}"></i> ${escape(cafeteria[8])}</a></div>
                    <div><a href><i class="${"icon fas fa-user-alt"}"></i> Admin</a></div>
                    <div><a href><i class="${"icon far fa-comment-alt"}"></i> 19</a></div></div></div></div></div></div>`;
});

/* src/components/Footer-block-3.svelte generated by Svelte v3.48.0 */

const Footer_block_3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp, link1, link2, link3, link4, link5 } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);
	if ($$props.link1 === void 0 && $$bindings.link1 && link1 !== void 0) $$bindings.link1(link1);
	if ($$props.link2 === void 0 && $$bindings.link2 && link2 !== void 0) $$bindings.link2(link2);
	if ($$props.link3 === void 0 && $$bindings.link3 && link3 !== void 0) $$bindings.link3(link3);
	if ($$props.link4 === void 0 && $$bindings.link4 && link4 !== void 0) $$bindings.link4(link4);
	if ($$props.link5 === void 0 && $$bindings.link5 && link5 !== void 0) $$bindings.link5(link5);

	return `<div class="${"col-sm-4 col-lg-2 mb-5 d-flex justify-content-center animalo retardo-2"}" data-animate-effect="${"fadeInUp"}"><div class="${"block-3"}">${!esp
	? `<h3 class="${"block-title"}">Menu</h3>

            <ul class="${"menu"}"><li>${link1.search('#') > -1
		? `<a data-easing="${"easeOutQuint"}" class="${"link"}"${add_attribute("href", link1, 0)}>Home</a>`
		: `${validate_component(Link, "Link").$$render($$result, { to: link1 }, {}, {
				default: () => {
					return `Home`;
				}
			})}`}</li>
                <li>${link2.search('#') > -1
		? `<a data-easing="${"easeOutQuint"}" class="${"link"}"${add_attribute("href", link2, 0)}>About us</a>`
		: `${validate_component(Link, "Link").$$render($$result, { to: link2 }, {}, {
				default: () => {
					return `About us`;
				}
			})}`}</li>
                <li>${link3.search('#') > -1
		? `<a data-easing="${"easeOutQuint"}" class="${"link"}"${add_attribute("href", link3, 0)}>Team</a>`
		: `${validate_component(Link, "Link").$$render($$result, { to: link3 }, {}, {
				default: () => {
					return `Team`;
				}
			})}`}</li>
                <li>${link4.search('#') > -1
		? `<a data-easing="${"easeOutQuint"}" class="${"link"}"${add_attribute("href", link4, 0)}>School life</a>`
		: `${validate_component(Link, "Link").$$render($$result, { to: link4 }, {}, {
				default: () => {
					return `School life`;
				}
			})}`}</li>
                <li>${link5.search('#') > -1
		? `<a data-easing="${"easeOutQuint"}" class="${"link"}"${add_attribute("href", link5, 0)}>Contact us</a>`
		: `${validate_component(Link, "Link").$$render($$result, { to: link5 }, {}, {
				default: () => {
					return `Contact us`;
				}
			})}`}</li></ul>`
	: `<h3 class="${"block-title"}">Menú</h3>

            <ul class="${"menu"}"><li>${link1.search('#') > -1
		? `<a data-easing="${"easeOutQuint"}" class="${"link"}"${add_attribute("href", link1, 0)}>Inicio</a>`
		: `${validate_component(Link, "Link").$$render($$result, { to: link1 }, {}, {
				default: () => {
					return `Inicio`;
				}
			})}`}</li>
                <li>${link2.search('#') > -1
		? `<a data-easing="${"easeOutQuint"}" class="${"link"}"${add_attribute("href", link2, 0)}>Conocenos</a>`
		: `${validate_component(Link, "Link").$$render($$result, { to: link2 }, {}, {
				default: () => {
					return `Conocenos`;
				}
			})}`}</li>
                <li>${link3.search('#') > -1
		? `<a data-easing="${"easeOutQuint"}" class="${"link"}"${add_attribute("href", link3, 0)}>Equipo</a>`
		: `${validate_component(Link, "Link").$$render($$result, { to: link3 }, {}, {
				default: () => {
					return `Equipo`;
				}
			})}`}</li>
                <li>${link4.search('#') > -1
		? `<a data-easing="${"easeOutQuint"}" class="${"link"}"${add_attribute("href", link4, 0)}>Vida escolar</a>`
		: `${validate_component(Link, "Link").$$render($$result, { to: link4 }, {}, {
				default: () => {
					return `Vida escolar`;
				}
			})}`}</li>
                <li>${link5.search('#') > -1
		? `<a data-easing="${"easeOutQuint"}" class="${"link"}"${add_attribute("href", link5, 0)}>Contáctanos</a>`
		: `${validate_component(Link, "Link").$$render($$result, { to: link5 }, {}, {
				default: () => {
					return `Contáctanos`;
				}
			})}`}</li></ul>`}

        <ul class="${"footer-social list-unstyled float-md-left float-lft mt-3"}"><li class="${"animalo retardo-3"}" data-animate-effect="${"fadeInUp"}"><a href="${"https://www.facebook.com/abcbilingualschool"}" target="${"_blank"}"><span class="${"fab fa-facebook-f"}"></span></a></li>
            <li class="${"animalo retardo-4"}" data-animate-effect="${"fadeInUp"}"><a href="${"https://www.instagram.com/abc_bilingual_school"}" target="${"_blank"}"><span class="${"fab fa-instagram"}"></span></a></li></ul></div></div>`;
});

/* src/components/Footer-block-4.svelte generated by Svelte v3.48.0 */

let urlEmailEs$1 = 'https://design-2u.com/tools/email-abc/email-corto.html';
let urlEmailIn$1 = 'https://design-2u.com/tools/email-abc/email-short.html';

const Footer_block_4 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<div class="${"col-sm-8 col-lg-4 mb-5 animalo retardo-5"}" data-animate-effect="${"fadeInUp"}"><div class="${"block-4"}"><div class="${"border border-light m-2 p-3"}"><div class="${"text-center"}">${!esp
	? `<h3 class="${"block-title mb-4"}">Subscribe</h3>
                <p class="${"text"}">Subscribe to receive weekly information in your email.</p>
                <div class="${"small-form-back"}" style="${"background-image: url(/assets/img/offline/smallFormBackIn.png);"}"><div class="${"visible"}"><iframe title="${"form"}" class="${"iframe"}"${add_attribute("src", urlEmailIn$1, 0)} frameborder="${"0"}" style="${"height: 200px; width: 100%;"}"></iframe></div></div>`
	: `<h3 class="${"block-title mb-4"}">Suscríbete</h3>
                <p class="${"text"}">Suscríbete para recibir información semanal en tu correo.</p>
                <div class="${"small-form-back"}" style="${"background-image: url(/assets/img/offline/smallFormBackEs.png);"}"><div class="${"visible"}"><iframe title="${"form"}" class="${"iframe"}"${add_attribute("src", urlEmailEs$1, 0)} frameborder="${"0"}" style="${"height: 200px; width: 100%;"}"></iframe></div></div>`}</div></div></div></div>`;
});

/* src/components/Footer-block-5.svelte generated by Svelte v3.48.0 */

const Footer_block_5 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<div class="${"row"}"><div class="${"col-md-12 text-center text-copyright"}"><p class="${"animalo retardo-6"}" data-animate-effect="${"fadeIn"}">Copyright © 2019 | Design4Me | Bootstrap Responsive Web Design.
        </p></div></div>`;
});

/* src/components/Footer.svelte generated by Svelte v3.48.0 */

const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp, pagina } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);
	if ($$props.pagina === void 0 && $$bindings.pagina && pagina !== void 0) $$bindings.pagina(pagina);

	return `<footer><div class="${"container-fluid seccion-footer"}"><div class="${"container"}"><div class="${"row"}">${validate_component(Footer_block_1, "Block1").$$render($$result, { esp }, {}, {})}
                ${validate_component(Footer_block_2, "Block2").$$render($$result, { esp }, {}, {})}

                ${!esp
	? `${pagina == 1
		? `${validate_component(Footer_block_3, "Block3").$$render(
				$$result,
				{
					esp,
					link1: "#",
					link2: "#conocenos",
					link3: "#equipo",
					link4: "/school-life",
					link5: "/contact-us"
				},
				{},
				{}
			)}`
		: `${pagina == 2
			? `${validate_component(Footer_block_3, "Block3").$$render(
					$$result,
					{
						esp,
						link1: "/home",
						link2: "#conocenos",
						link3: "/our-team/administration",
						link4: "/school-life",
						link5: "/contact-us"
					},
					{},
					{}
				)}`
			: `${pagina == 3
				? `${validate_component(Footer_block_3, "Block3").$$render(
						$$result,
						{
							esp,
							link1: "/home",
							link2: "/institution",
							link3: "#equipo",
							link4: "/school-life",
							link5: "/contact-us"
						},
						{},
						{}
					)}`
				: `${pagina == 4
					? `${validate_component(Footer_block_3, "Block3").$$render(
							$$result,
							{
								esp,
								link1: "/home",
								link2: "/institution",
								link3: "/our-team/administration",
								link4: "#vida-escolar",
								link5: "/contact-us"
							},
							{},
							{}
						)}`
					: `${pagina == 5
						? `${validate_component(Footer_block_3, "Block3").$$render(
								$$result,
								{
									esp,
									link1: "/home",
									link2: "/institution",
									link3: "/our-team/administration",
									link4: "/school-life",
									link5: "/contact-us"
								},
								{},
								{}
							)}`
						: `${pagina == 6
							? `${validate_component(Footer_block_3, "Block3").$$render(
									$$result,
									{
										esp,
										link1: "/home",
										link2: "/institution",
										link3: "/our-team/administration",
										link4: "/school-life",
										link5: "#contactanos"
									},
									{},
									{}
								)}`
							: ``}`}`}`}`}`}`
	: `${pagina == 1
		? `${validate_component(Footer_block_3, "Block3").$$render(
				$$result,
				{
					esp,
					link1: "#",
					link2: "#conocenos",
					link3: "#equipo",
					link4: "/vida-escolar",
					link5: "/contactanos"
				},
				{},
				{}
			)}`
		: `${pagina == 2
			? `${validate_component(Footer_block_3, "Block3").$$render(
					$$result,
					{
						esp,
						link1: "/",
						link2: "#conocenos",
						link3: "/personal/administracion",
						link4: "/vida-escolar",
						link5: "/contactanos"
					},
					{},
					{}
				)}`
			: `${pagina == 3
				? `${validate_component(Footer_block_3, "Block3").$$render(
						$$result,
						{
							esp,
							link1: "/",
							link2: "/institucion",
							link3: "#equipo",
							link4: "/vida-escolar",
							link5: "/contactanos"
						},
						{},
						{}
					)}`
				: `${pagina == 4
					? `${validate_component(Footer_block_3, "Block3").$$render(
							$$result,
							{
								esp,
								link1: "/",
								link2: "/institucion",
								link3: "/personal/administracion",
								link4: "#vida-escolar",
								link5: "/contactanos"
							},
							{},
							{}
						)}`
					: `${pagina == 5
						? `${validate_component(Footer_block_3, "Block3").$$render(
								$$result,
								{
									esp,
									link1: "/",
									link2: "/institucion",
									link3: "/personal/administracion",
									link4: "/vida-escolar",
									link5: "/contactanos"
								},
								{},
								{}
							)}`
						: `${pagina == 6
							? `${validate_component(Footer_block_3, "Block3").$$render(
									$$result,
									{
										esp,
										link1: "/",
										link2: "/institucion",
										link3: "/personal/administracion",
										link4: "/vida-escolar",
										link5: "#contactanos"
									},
									{},
									{}
								)}`
							: ``}`}`}`}`}`}`}
                        
                ${validate_component(Footer_block_4, "Block4").$$render($$result, { esp }, {}, {})}</div>

            ${validate_component(Footer_block_5, "Block5").$$render($$result, {}, {}, {})}</div></div></footer>`;
});

/* src/views/Inicio.svelte generated by Svelte v3.48.0 */

const Inicio = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	let hidden = true, pagina = 1, inicio = true, url = ["/", "home"];
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<main>${validate_component(Common, "Common").$$render($$result, { esp, inicio, url }, {}, {})}
    ${validate_component(Slider, "Slider").$$render($$result, { esp }, {}, {})}
    ${validate_component(Servicios, "Servicios").$$render($$result, { esp }, {}, {})}
    ${validate_component(Instituciones, "Instituciones").$$render($$result, {}, {}, {})}
    ${validate_component(Nosotros, "Nosotros").$$render($$result, { esp, hidden }, {}, {})}
    ${validate_component(Video, "Video").$$render($$result, { esp }, {}, {})}
    ${validate_component(Parallax, "Parallax").$$render($$result, { esp }, {}, {})}
    ${validate_component(Equipo, "Equipo").$$render($$result, { esp, eq: "administracion" }, {}, {})}
    ${validate_component(Testimoniales, "Testimoniales").$$render($$result, { esp }, {}, {})}
    ${validate_component(Fotos, "Fotos").$$render($$result, {}, {}, {})}</main>
${validate_component(Footer, "Footer").$$render($$result, { esp, pagina }, {}, {})}`;
});

/* src/views/Institucion.svelte generated by Svelte v3.48.0 */

const Institucion = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	let hidden = false, pagina = 2, url = ["institucion", "institution"];
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<main>${validate_component(Common, "Common").$$render($$result, { esp, clase: ".link-conocenos", url }, {}, {})}
    ${validate_component(Nosotros, "Nosotros").$$render($$result, { esp, hidden }, {}, {})}
    ${validate_component(Instituciones, "Instituciones").$$render($$result, {}, {}, {})}
    ${validate_component(Fotos, "Fotos").$$render($$result, {}, {}, {})}</main>
${validate_component(Footer, "Footer").$$render($$result, { esp, pagina }, {}, {})}`;
});

/* src/components/NavBottom.svelte generated by Svelte v3.48.0 */

const NavBottom = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<nav class="${"navbar navbar-expand-lg navbar-light bg-light nav-eq"}"><div class="${"container"}">${!esp
	? `<button class="${"navbar-toggler"}" type="${"button"}" data-bs-toggle="${"collapse"}" data-bs-target="${"#navbarNavAltMarkup"}" aria-controls="${"navbarNavAltMarkup"}" aria-expanded="${"false"}" aria-label="${"Toggle navigation"}"><span class="${"navbar-toggler-icon"}"></span> Menu
             </button>
             <div class="${"collapse navbar-collapse"}" id="${"navbarNavAltMarkup"}"><div class="${"navbar-nav"}">${validate_component(NavLink, "Link").$$render($$result, { to: "administration" }, {}, {
			default: () => {
				return `<div class="${"nav-item nav-link rounded-xl"}">Administration</div>`;
			}
		})}
						
					${validate_component(NavLink, "Link").$$render($$result, { to: "preschool" }, {}, {
			default: () => {
				return `<div class="${"nav-item nav-link rounded-xl link-parvu"}">Preschool</div>`;
			}
		})}

					${validate_component(NavLink, "Link").$$render($$result, { to: "primary" }, {}, {
			default: () => {
				return `<div class="${"nav-item nav-link rounded-xl"}">Primary School</div>`;
			}
		})}

					${validate_component(NavLink, "Link").$$render($$result, { to: "highschool" }, {}, {
			default: () => {
				return `<div class="${"nav-item nav-link rounded-xl"}">High School</div>`;
			}
		})}

					${validate_component(NavLink, "Link").$$render($$result, { to: "development" }, {}, {
			default: () => {
				return `<div class="${"nav-item nav-link rounded-xl"}">Development Center</div>`;
			}
		})}</div></div>`
	: `<button class="${"navbar-toggler"}" type="${"button"}" data-bs-toggle="${"collapse"}" data-bs-target="${"#navbarNavAltMarkup"}" aria-controls="${"navbarNavAltMarkup"}" aria-expanded="${"false"}" aria-label="${"Toggle navigation"}"><span class="${"navbar-toggler-icon"}"></span> Menú
             </button>
             <div class="${"collapse navbar-collapse"}" id="${"navbarNavAltMarkup"}"><div class="${"navbar-nav"}">${validate_component(NavLink, "Link").$$render($$result, { to: "administracion" }, {}, {
			default: () => {
				return `<div class="${"nav-item nav-link rounded-xl"}">Administración</div>`;
			}
		})}

					${validate_component(NavLink, "Link").$$render($$result, { to: "parvularia" }, {}, {
			default: () => {
				return `<div class="${"nav-item nav-link rounded-xl link-parvu"}">Parvularia</div>`;
			}
		})}

					${validate_component(NavLink, "Link").$$render($$result, { to: "primaria" }, {}, {
			default: () => {
				return `<div class="${"nav-item nav-link rounded-xl"}">Primaria</div>`;
			}
		})}

					${validate_component(NavLink, "Link").$$render($$result, { to: "secundaria" }, {}, {
			default: () => {
				return `<div class="${"nav-item nav-link rounded-xl"}">Secundaria</div>`;
			}
		})}

					${validate_component(NavLink, "Link").$$render($$result, { to: "nivelacion" }, {}, {
			default: () => {
				return `<div class="${"nav-item nav-link rounded-xl"}">Aula de Nivelación</div>`;
			}
		})}</div></div>`}</div></nav>`;
});

/* src/components/Personal.svelte generated by Svelte v3.48.0 */

const Personal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp, eq, url } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);
	if ($$props.eq === void 0 && $$bindings.eq && eq !== void 0) $$bindings.eq(eq);
	if ($$props.url === void 0 && $$bindings.url && url !== void 0) $$bindings.url(url);

	return `${validate_component(Common, "Common").$$render($$result, { esp, clase: ".link-conocenos", url }, {}, {})}
<section id="${"equipo"}"><div class="${"container my-section team-section pt-3"}"><div class="${"text-center"}"><h2 class="${"h2 titulo-seccion"}">${escape(esp ? 'Nuestro Equipo' : 'Our Team')}</h2>
            <p class="${"parrafo-seccion"}"></p></div>

        ${validate_component(EqItems, "EqItems").$$render($$result, { esp, eq }, {}, {})}

        </div></section>`;
});

/* src/views/404.svelte generated by Svelte v3.48.0 */

const _404 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { start = false } = $$props;

	onMount(() => {
	});

	if ($$props.start === void 0 && $$bindings.start && start !== void 0) $$bindings.start(start);

	return `<div id="${"no-found"}" class="${"contenedor bg-purple"}"><div class="${"stars"}"><div class="${"custom-navbar"}"><div class="${"brand-logo"}"><img src="${"/assets/img/logos/abc-logo.png"}" height="${"80px"}" alt="${"img"}"></div>
        <div class="${"navbar-links"}"><ul><li><a href="${"http://salehriaz.com/404Page/404.html"}" target="${"_blank"}">Home</a></li>
            <li><a href="${"http://salehriaz.com/404Page/404.html"}" target="${"_blank"}">About</a></li>
            <li><a href="${"http://salehriaz.com/404Page/404.html"}" target="${"_blank"}">Features</a></li>
            <li><a href="${"http://salehriaz.com/404Page/404.html"}" class="${"btn-request"}" target="${"_blank"}">Request A Demo</a></li></ul></div></div>
      <div class="${"central-body"}"><img class="${"image-404"}" src="${"/assets/img/svg/404.svg"}" width="${"300px"}" alt="${"img"}">
        </div>
      <div class="${"objects"}"><img class="${"object_rocket"}" src="${"/assets/img/svg/rocket.svg"}" width="${"40px"}" alt="${"img"}">
        <div class="${"earth-moon"}"><img class="${"object_earth"}" src="${"/assets/img/svg/earth.svg"}" width="${"100px"}" alt="${"img"}">
          <img class="${"object_moon"}" src="${"/assets/img/svg/moon.svg"}" width="${"80px"}" alt="${"img"}"></div>
        <div class="${"box_astronaut"}"><img class="${"object_astronaut"}" src="${"/assets/img/svg/astronaut.svg"}" width="${"140px"}" alt="${"img"}"></div></div>
      <div class="${"glowing_stars"}"><div class="${"star"}"></div>
        <div class="${"star"}"></div>
        <div class="${"star"}"></div>
        <div class="${"star"}"></div>
        <div class="${"star"}"></div></div></div></div>`;
});

/* src/views/Personal.svelte generated by Svelte v3.48.0 */
let pagina$1 = 3;

const Personal_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<main>${validate_component(Router, "Router").$$render($$result, {}, {}, {
		default: () => {
			return `${esp
			? `${validate_component(Route, "Route").$$render($$result, { path: "/administracion" }, {}, {
					default: () => {
						return `${validate_component(Personal, "Personal").$$render(
							$$result,
							{
								esp,
								eq: "administracion",
								url: "/our-team/administration"
							},
							{},
							{}
						)}`;
					}
				})}
            ${validate_component(Route, "Route").$$render($$result, { path: "/parvularia" }, {}, {
					default: () => {
						return `${validate_component(Personal, "Personal").$$render(
							$$result,
							{
								esp,
								eq: "parvularia",
								url: "/our-team/preschool"
							},
							{},
							{}
						)}`;
					}
				})}
            ${validate_component(Route, "Route").$$render($$result, { path: "/primaria" }, {}, {
					default: () => {
						return `${validate_component(Personal, "Personal").$$render(
							$$result,
							{
								esp,
								eq: "primaria",
								url: "/our-team/primary"
							},
							{},
							{}
						)}`;
					}
				})}
            ${validate_component(Route, "Route").$$render($$result, { path: "/secundaria" }, {}, {
					default: () => {
						return `${validate_component(Personal, "Personal").$$render(
							$$result,
							{
								esp,
								eq: "secundaria",
								url: "/our-team/highschool"
							},
							{},
							{}
						)}`;
					}
				})}
            ${validate_component(Route, "Route").$$render($$result, { path: "/nivelacion" }, {}, {
					default: () => {
						return `${validate_component(Personal, "Personal").$$render(
							$$result,
							{
								esp,
								eq: "nivelacion",
								url: "/our-team/development"
							},
							{},
							{}
						)}`;
					}
				})}
            ${validate_component(Route, "Route").$$render($$result, { path: "/" }, {}, {
					default: () => {
						return `${validate_component(Personal, "Personal").$$render(
							$$result,
							{
								esp,
								eq: "parvularia",
								url: "/our-team/preschool"
							},
							{},
							{}
						)}`;
					}
				})}`
			: `${validate_component(Route, "Route").$$render($$result, { path: "/administration" }, {}, {
					default: () => {
						return `${validate_component(Personal, "Personal").$$render(
							$$result,
							{
								esp,
								eq: "administration",
								url: "/personal/administracion"
							},
							{},
							{}
						)}`;
					}
				})}
            ${validate_component(Route, "Route").$$render($$result, { path: "/preschool" }, {}, {
					default: () => {
						return `${validate_component(Personal, "Personal").$$render(
							$$result,
							{
								esp,
								eq: "preschool",
								url: "/personal/parvularia"
							},
							{},
							{}
						)}`;
					}
				})}
            ${validate_component(Route, "Route").$$render($$result, { path: "/primary" }, {}, {
					default: () => {
						return `${validate_component(Personal, "Personal").$$render(
							$$result,
							{
								esp,
								eq: "primary",
								url: "/personal/primaria"
							},
							{},
							{}
						)}`;
					}
				})}
            ${validate_component(Route, "Route").$$render($$result, { path: "/highschool" }, {}, {
					default: () => {
						return `${validate_component(Personal, "Personal").$$render(
							$$result,
							{
								esp,
								eq: "highschool",
								url: "/personal/secundaria"
							},
							{},
							{}
						)}`;
					}
				})}
            ${validate_component(Route, "Route").$$render($$result, { path: "/development" }, {}, {
					default: () => {
						return `${validate_component(Personal, "Personal").$$render(
							$$result,
							{
								esp,
								eq: "development",
								url: "/personal/nivelacion"
							},
							{},
							{}
						)}`;
					}
				})}
            ${validate_component(Route, "Route").$$render($$result, { path: "/" }, {}, {
					default: () => {
						return `${validate_component(Personal, "Personal").$$render(
							$$result,
							{
								esp,
								eq: "preschool",
								url: "/personal/parvularia"
							},
							{},
							{}
						)}`;
					}
				})}`}

        ${validate_component(Route, "Route").$$render($$result, { path: "*" }, {}, {
				default: () => {
					return `${validate_component(_404, "NoFound").$$render($$result, { start: "true" }, {}, {})}`;
				}
			})}
        ${validate_component(NavBottom, "NavBottom").$$render($$result, { esp }, {}, {})}`;
		}
	})}

    ${validate_component(Instituciones, "Instituciones").$$render($$result, {}, {}, {})}</main>
${validate_component(Footer, "Footer").$$render($$result, { esp, pagina: pagina$1 }, {}, {})}`;
});

/* src/components/InstaFeed.svelte generated by Svelte v3.48.0 */

const InstaFeed = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $conectionOnLine, $$unsubscribe_conectionOnLine;
	$$unsubscribe_conectionOnLine = subscribe(conectionOnLine, value => $conectionOnLine = value);
	let { esp } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);
	$$unsubscribe_conectionOnLine();

	return `<section id="${"vida-escolar"}" class="${"container-fluid my-section pt-5"}"><div class="${"container text-center"}"><h2 class="${"h2 titulo-seccion"}">${escape(esp ? "Vida Escolar" : "School Life")}</h2>
        <p class="${"parrafo-seccion"}">${escape(esp
	? "Feed de nuestro Instagram."
	: "Our Instagram Feed.")}</p></div>

    <div class="${"container instagram-feed"}">${$conectionOnLine
	? `
             <script src="${"https://apps.elfsight.com/p/platform.js"}" defer></script>
             <div class="${"wall"}"></div>
             <div class="${"elfsight-app-fb5ebeca-3a74-4647-b6da-2c4b478c6250"}"></div>`
	: `${validate_component(MessageOffLine, "MessageOffLine").$$render($$result, { esp }, {}, {})}`}</div></section>`;
});

/* src/views/VidaEscolar.svelte generated by Svelte v3.48.0 */

const VidaEscolar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	let pagina = 4, url = ["vida-escolar", "school-life"];
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<main>${validate_component(Common, "Common").$$render($$result, { esp, clase: ".link-conocenos", url }, {}, {})}
    ${validate_component(InstaFeed, "Feed").$$render($$result, { esp }, {}, {})}
    ${validate_component(Video, "Video").$$render($$result, { esp }, {}, {})}
    ${validate_component(Fotos, "Fotos").$$render($$result, {}, {}, {})}</main>
${validate_component(Footer, "Footer").$$render($$result, { esp, pagina }, {}, {})}`;
});

/* src/components/Circular.svelte generated by Svelte v3.48.0 */

const Circular = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { url, img, doc } = $$props;
	if ($$props.url === void 0 && $$bindings.url && url !== void 0) $$bindings.url(url);
	if ($$props.img === void 0 && $$bindings.img && img !== void 0) $$bindings.img(img);
	if ($$props.doc === void 0 && $$bindings.doc && doc !== void 0) $$bindings.doc(doc);

	return `

<div class="${"col pb-3 animalo"}" data-animate-effect="${"fadeInUp"}">${img
	? `<div class="${"gallery"}"><a${add_attribute("href", url, 0)}><img${add_attribute("src", url, 0)} class="${"img-fluid card sombra"}" alt="${"circular"}"></a></div>`
	: `<a${add_attribute("href", doc, 0)} target="${"_blank"}"><img${add_attribute("src", url, 0)} class="${"img-fluid card sombra"}" alt="${"circular"}"></a>`}</div>`;
});

/* src/components/Circulares.svelte generated by Svelte v3.48.0 */

const Circulares = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;

	onMount(() => {
		sLightbox();
	});

	const sLightbox = () => {
		new SimpleLightbox('.gallery a',
		{
				overlayOpacity: 0.9,
				captionPosition: 'outside'
			});
	};

	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<section id="${"circulares"}" class="${"container-fluid"}"><div class="${"container my-5 pb-3 sombra card"}"><h2 class="${"h2 text-center titulo-seccion"}">${escape(!esp ? 'Newsletter' : 'Circulares')}</h2>
        <h4 class="${"text-center sub-titulo-seccion"}">${escape(!esp
	? 'Important Information'
	: 'Información importante')}</h4>

        <div id="${"info"}" class="${"row row-cols-2 row-cols-sm-3 row-cols-md-4 d-flex justify-content-center"}">${validate_component(Circular, "Circular").$$render(
		$$result,
		{
			url: "/assets/img/circulares/circular-03.png",
			img: "true"
		},
		{},
		{}
	)}
            ${validate_component(Circular, "Circular").$$render(
		$$result,
		{
			url: "/assets/img/circulares/circular-02.png",
			img: "true"
		},
		{},
		{}
	)}
            ${validate_component(Circular, "Circular").$$render(
		$$result,
		{
			url: "/assets/img/circulares/circular-01.jpg",
			doc: "/assets/img/circulares/circular-01.pdf"
		},
		{},
		{}
	)}
            </div></div></section>`;
});

/* src/views/Circulares.svelte generated by Svelte v3.48.0 */

const Circulares_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	let pagina = 5, url = ["circulares", "newsletter"];
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<main>${validate_component(Common, "Common").$$render($$result, { esp, clase: ".link-informacion", url }, {}, {})}
    ${validate_component(Circulares, "Circulares").$$render($$result, { esp }, {}, {})}
    ${validate_component(Testimoniales, "Testimoniales").$$render($$result, { esp }, {}, {})}
    ${validate_component(Fotos, "Fotos").$$render($$result, {}, {}, {})}</main>
${validate_component(Footer, "Footer").$$render($$result, { esp, pagina }, {}, {})}`;
});

/* src/components/Fecha.svelte generated by Svelte v3.48.0 */

const Fecha = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { url, title } = $$props;
	if ($$props.url === void 0 && $$bindings.url && url !== void 0) $$bindings.url(url);
	if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);

	return `


<a${add_attribute("href", url, 0)} class="${"col pb-3 animalo"}" data-animate-effect="${"fadeInUp"}"><img${add_attribute("src", url, 0)} class="${"img-fluid card sombra"}" alt="${"fecha"}"${add_attribute("title", title, 0)}></a>`;
});

/* src/components/Fechas.svelte generated by Svelte v3.48.0 */

const Fechas = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;

	onMount(() => {
		sLightbox();
	});

	const sLightbox = () => {
		new SimpleLightbox('.gallery a',
		{
				overlayOpacity: 0.9,
				captionPosition: 'outside'
			});
	}; // jQuery('.venobox').venobox({
	//     spinner    : 'cube-grid',
	//     spinColor    : '#fbb802',
	//     border: '5px',

	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<section id="${"fechas"}" class="${"container-fluid"}"><div class="${"container my-5 pb-3 sombra card"}"><h2 class="${"h2 text-center titulo-seccion"}">${escape(esp ? "Fechas Importantes" : "Important Dates")}</h2>
        <h4 class="${"text-center sub-titulo-seccion"}">${escape(esp ? "Información Importante" : "Important Information")}</h4>

        <div id="${"info"}" class="${"gallery row row-cols-2 row-cols-sm-3 row-cols-md-4 d-flex justify-content-center"}">${validate_component(Fecha, "Fecha").$$render(
		$$result,
		{
			url: "/assets/img/eventos/fechas.png",
			title: "Fechas importantes"
		},
		{},
		{}
	)}
            ${validate_component(Fecha, "Fecha").$$render(
		$$result,
		{
			url: "/assets/img/eventos/sept-01.jpg",
			title: "Mes de la salud bucal"
		},
		{},
		{}
	)}
            ${validate_component(Fecha, "Fecha").$$render(
		$$result,
		{
			url: "/assets/img/eventos/sept-02.jpg",
			title: "Entrega de proyectos Science Fair"
		},
		{},
		{}
	)}
            ${validate_component(Fecha, "Fecha").$$render(
		$$result,
		{
			url: "/assets/img/eventos/sept-03.jpg",
			title: "Acto Cívico / Feria del maíz"
		},
		{},
		{}
	)}
            ${validate_component(Fecha, "Fecha").$$render(
		$$result,
		{
			url: "/assets/img/eventos/sept-04.jpg",
			title: "Vacación - Día de la Independencia"
		},
		{},
		{}
	)}
            ${validate_component(Fecha, "Fecha").$$render(
		$$result,
		{
			url: "/assets/img/eventos/sept-05.jpg",
			title: "Toma de fotografía para carnet"
		},
		{},
		{}
	)}
            ${validate_component(Fecha, "Fecha").$$render(
		$$result,
		{
			url: "/assets/img/eventos/sept-06.jpg",
			title: "Elección gobierno estudiantil"
		},
		{},
		{}
	)}
            ${validate_component(Fecha, "Fecha").$$render(
		$$result,
		{
			url: "/assets/img/eventos/sept-07.jpg",
			title: "Semana de las ciencias"
		},
		{},
		{}
	)}
            ${validate_component(Fecha, "Fecha").$$render(
		$$result,
		{
			url: "/assets/img/eventos/sept-08.jpg",
			title: "Día del niño PTA"
		},
		{},
		{}
	)}</div></div></section>`;
});

/* src/views/Fechas.svelte generated by Svelte v3.48.0 */

const Fechas_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	let pagina = 5, url = ["fechas-importantes", "important-dates"];
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<main>${validate_component(Common, "Common").$$render($$result, { esp, clase: ".link-informacion", url }, {}, {})}
    ${validate_component(Fechas, "Fechas").$$render($$result, { esp }, {}, {})}
    ${validate_component(Testimoniales, "Testimoniales").$$render($$result, { esp }, {}, {})}
    ${validate_component(Fotos, "Fotos").$$render($$result, {}, {}, {})}</main>
${validate_component(Footer, "Footer").$$render($$result, { esp, pagina }, {}, {})}`;
});

/* src/components/InfoBoxes.svelte generated by Svelte v3.48.0 */

const InfoBoxes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<section id="${"contactanos"}" class="${"container-fluid py-5"}">${!esp
	? `<div class="${"text-center py-4 animalo"}" data-animate-effect="${"fadeIn"}"><h2 class="${"h2 titulo-seccion"}">Contact us<span>/ Location</span></h2>
             <p class="${"parrafo-seccion"}">You can contact us through our email or call us on our phone numbers. You can also visit us and we will attend you immediately</p></div>`
	: `<div class="${"text-center py-4 animalo"}" data-animate-effect="${"fadeIn"}"><h2 class="${"h2 titulo-seccion"}">Contáctanos<span>/ Ubicación</span></h2>
             <p class="${"parrafo-seccion"}">Puedes contactarnos por medio de nuestro correo electrónico o llamarnos a nuestros números telefónicos. Tambien puedes visitarnos y te atenderemos de inmediato</p></div>`}

    <div class="${"row row-cols-1 row-cols-md-2 row-cols-lg-4"}"><div class="${"col item px-2 mb-2 animalo"}" data-animate-effect="${"fadeInRight"}"><div class="${"p-3 bg-azul text-center color-naranja h-100"}"><i class="${"fas fa-map-marker-alt"}"></i>
                <h4>${escape(!esp ? 'Address' : 'Dirección')}</h4>
                <p>89 Av. Nte. y 3a Calle Pte. #4628 Colonia Escalón, San Salvador, El Salvador, C.A.</p></div></div>

        <div class="${"col item px-2 mb-2 animalo"}" data-animate-effect="${"fadeInRight"}"><div class="${"p-3 bg-rojo text-center color-claro h-100"}"><i class="${"fas fa-phone-alt"}"></i>
                <h4>${escape(!esp ? 'Phone' : 'Teléfono')}</h4>
                <p>2264-0508 / 7696-9556</p></div></div>

        <div class="${"col item _email px-2 mb-2 animalo"}" data-animate-effect="${"fadeInRight"}"><div class="${"p-3 bg-naranja text-center color-azul h-100"}"><i class="${"far fa-envelope"}"></i>
                <h4>E-mail</h4>
                <p>info1@abcbilingualschool.edu.sv</p></div></div>

        <div class="${"col item px-2 mb-2 animalo"}" data-animate-effect="${"fadeInRight"}"><div class="${"p-3 bg-azul text-center color-naranja h-100"}"><i class="${"fas fa-share-alt"}"></i>
                <h4>${escape(!esp ? 'Social networks' : 'Redes Sociales')}</h4>
                <div class="${"social-icons d-flex justify-content-center"}"><ul class="${"list-unstyled float-md-left float-left mt-3"}"><li class="${""}"><a href="${"https://www.facebook.com/abcbilingualschool"}" target="${"_blank"}"><span class="${"fab fa-facebook-f"}"></span></a></li>
                        <li class="${""}"><a href="${"https://www.instagram.com/abc_bilingual_school"}" target="${"_blank"}"><span class="${"fab fa-instagram"}"></span></a></li></ul></div></div></div></div></section>`;
});

/* src/components/Formulario.svelte generated by Svelte v3.48.0 */

let urlEmailEs = 'https://design-2u.com/tools/email-abc/email-completo.html';
let urlEmailIn = 'https://design-2u.com/tools/email-abc/email-full.html';

const Formulario = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);

	return `<section id="${"mapa-formulario"}" class="${"mapa-y-form bg-azul py-5"}"><div class="${"container-fluid"}"><div class="${"row"}"><div class="${"form-back col-md-12 col-lg-5 mb-3 order-lg-last animalo p-0 h-100"}" data-animate-effect="${"fadeInRight"}" style="${"background-image: url(" + escape(esp
	? '/assets/img/offline/formBackEs.jpg'
	: '/assets/img/offline/formBackIn.jpg') + ");"}"><div class="${"d-flex justify-content-center visible p-0 h-100"}">${!esp
	? `<iframe title="${"form"}" class="${"iframe"}"${add_attribute("src", urlEmailIn, 0)} frameborder="${"0"}" style="${"height: 550px; width: 100%; max-width: 400px;"}"></iframe>`
	: `<iframe title="${"form"}" class="${"iframe"}"${add_attribute("src", urlEmailEs, 0)} frameborder="${"0"}" style="${"height: 550px; width: 100%; max-width: 400px;"}"></iframe>`}</div></div>

            <div class="${"map-back col-md-12 col-lg-7 animalo p-0 h-100"}" data-animate-effect="${"fadeInLeft"}" style="${"background-image: url(" + escape(esp
	? '/assets/img/offline/mapBackEs.jpg'
	: '/assets/img/offline/mapBackIn.jpg') + ");"}"><div class="${"visible p-0 h-100"}">
                    <iframe title class="${"iframe"}" src="${"https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3606.2090978151423!2d-89.24348720253126!3d13.705277082850435!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f63301f44ce3d33%3A0xfa50e6bfe968f136!2sABC%20Bilingual%20School!5e0!3m2!1sen!2ssv!4v1651537049535!5m2!1sen!2ssv"}" width="${"100%"}" height="${"550"}" style="${"border:0;"}" allowfullscreen="${""}" loading="${"lazy"}" referrerpolicy="${"no-referrer-when-downgrade"}"></iframe>
                <div></div></div></div></div></div></section>`;
});

/* src/views/Contactanos.svelte generated by Svelte v3.48.0 */
let pagina = 6;

const Contactanos = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { esp, url = ["/contactanos", "/contact-us"] } = $$props;
	if ($$props.esp === void 0 && $$bindings.esp && esp !== void 0) $$bindings.esp(esp);
	if ($$props.url === void 0 && $$bindings.url && url !== void 0) $$bindings.url(url);

	return `<main>${validate_component(Common, "Common").$$render($$result, { esp, url }, {}, {})}
    ${validate_component(InfoBoxes, "Boxes").$$render($$result, { esp }, {}, {})}
    ${validate_component(Formulario, "Formulario").$$render($$result, { esp }, {}, {})}
    ${validate_component(Instituciones, "Instituciones").$$render($$result, {}, {}, {})}</main>
${validate_component(Footer, "Footer").$$render($$result, { esp, pagina }, {}, {})}`;
});

/* src/components/Cafeteria.svelte generated by Svelte v3.48.0 */

const Cafeteria = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<div class="${"modal fade"}" id="${"menuModal"}" tabindex="${"-1"}" role="${"dialog"}" aria-labelledby="${"myModalLabel"}" aria-hidden="${"true"}"><div class="${"modal-dialog modal-notify modal-xl modal-dialog-scrollable modal-azul modal-dialog-centered"}" role="${"document"}">
        <div class="${"modal-content"}">
            <div class="${"modal-header"}"><h4 class="${"modal-title color-naranja"}">ABC Bilingual School.</h4>
                <button type="${"button"}" class="${"btn-close"}" data-bs-dismiss="${"modal"}" aria-label="${"Close"}"></button></div>
    
            
            <div class="${"modal-body"}"><div class="${"row row-cols-1 d-flex justify-content-center"}"><div class="${"col text-center menu-item"}"><img src="${"/assets/img/menu-logo.jpg"}" class="${"img-menu-logo"}" alt="${""}"></div>
                    <div class="${"col text-center menu-item"}"><h1 class="${"menu-titulo"}">Menú Almuerzo</h1>
                        <p class="${"menu-titulo__fecha"}">${escape(cafeteria[0])}</p></div></div>
                <div class="${"row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-5 d-flex justify-content-center"}"><div class="${"col text-center menu-item d-flex justify-content-center"}"><div class="${"menu-item__contenedor"}"><div class="${"menu-item__dia"}"><p>Lunes</p></div>
                            <div class="${"menu-item__plato"}"><p>${escape(cafeteria[1])}</p></div></div></div>
                    <div class="${"col text-center menu-item d-flex justify-content-center"}"><div class="${"menu-item__contenedor"}"><div class="${"menu-item__dia"}"><p>Martes</p></div>
                            <div class="${"menu-item__plato"}"><p>${escape(cafeteria[2])}</p></div></div></div>
                    <div class="${"col text-center menu-item d-flex justify-content-center"}"><div class="${"menu-item__contenedor"}"><div class="${"menu-item__dia"}"><p>Miércoles</p></div>
                            <div class="${"menu-item__plato"}"><p>${escape(cafeteria[3])}</p></div></div></div>
                    <div class="${"col text-center menu-item d-flex justify-content-center"}"><div class="${"menu-item__contenedor"}"><div class="${"menu-item__dia"}"><p>Jueves</p></div>
                            <div class="${"menu-item__plato"}"><p>${escape(cafeteria[4])}</p></div></div></div>
                    <div class="${"col text-center menu-item d-flex justify-content-center"}"><div class="${"menu-item__contenedor"}"><div class="${"menu-item__dia"}"><p>Viernes</p></div>
                            <div class="${"menu-item__plato"}"><p>${escape(cafeteria[5])}</p></div></div></div></div>
                <div class="${"precios d-flex justify-content-center"}"><div class="${"row row-cols-1 row-cols-sm-2"}"><div class="${"col d-flex justify-content-center"}"><div class="${"precio text-center"}">Parvularia a 3er grado: <span class="${"color-naranja"}">$3.00</span></div></div>
                        <div class="${"col d-flex justify-content-center"}"><div class="${"precio text-center"}">4to a 12vo grado: <span class="${"color-naranja"}">$3.25</span></div></div></div></div>
                <div class="${"text-center"}"><h4>Todos los platos llevan dos acompañamientos, arroz y ensalada. Refresco natural.</h4>
                    <h4>Teléfono 2264-0508 Ext. 4.</h4></div></div>

    
            
            <div class="${"modal-footer justify-content-center"}"><button type="${"button"}" class="${"btn btn-outline-primary waves-effect"}" data-bs-dismiss="${"modal"}">Cerrar</button></div></div>
        </div></div>`;
});

/* src/App.svelte generated by Svelte v3.48.0 */

const App = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { url = "" } = $$props;

	onMount(() => {
		// ESTE CODIGO HACE QUE EL MENU APARESCA Y SE VALLA
		var flag = false;
		var nav = document.querySelector("#navbar-fixed");

		window.onscroll = function () {
			var scroll = document.documentElement.scrollTop;

			if (scroll > 1000) {
				if (!flag) {
					nav.classList.add('animated', 'fadeInDown');
					flag = true;
				}
			} else {
				if (flag) {
					nav.classList.remove('fadeInDown');
					nav.classList.add('fadeOutUp');
					flag = false;

					setTimeout(
						function () {
							nav.classList.remove('animated', 'fadeOutUp');
						},
						200,
						'easeInOutExpo'
					);
				}
			}
		};

		let contentMessage = document.querySelector("#contentMessage");

		let messages = {
			"true": "✅ Conectado a internet",
			"false": "🚫 Sin conexión a internet"
		};

		window.contentMessage = contentMessage;
		window.messages = messages;
		lightbox.option({ 'disableScrolling': true });
		Waves.attach('.nav-link, .dropdown-item, .btn-link', ['waves-block', 'waves-light']);
		Waves.init();
	});

	if ($$props.url === void 0 && $$bindings.url && url !== void 0) $$bindings.url(url);

	return `
${validate_component(Router, "Router").$$render($$result, { url }, {}, {
		default: () => {
			return `${validate_component(Header, "Header").$$render($$result, {}, {}, {})}
	
	${validate_component(Route, "Route").$$render($$result, { path: "/contact-us" }, {}, {
				default: () => {
					return `${validate_component(Contactanos, "Contactanos").$$render($$result, { esp: false }, {}, {})}`;
				}
			})}
	${validate_component(Route, "Route").$$render($$result, { path: "/contactanos" }, {}, {
				default: () => {
					return `${validate_component(Contactanos, "Contactanos").$$render($$result, { esp: true }, {}, {})}`;
				}
			})}

	${validate_component(Route, "Route").$$render($$result, { path: "/important-dates" }, {}, {
				default: () => {
					return `${validate_component(Fechas_1, "Fechas").$$render($$result, { esp: false }, {}, {})}`;
				}
			})}
	${validate_component(Route, "Route").$$render($$result, { path: "/fechas-importantes" }, {}, {
				default: () => {
					return `${validate_component(Fechas_1, "Fechas").$$render($$result, { esp: true }, {}, {})}`;
				}
			})}

	${validate_component(Route, "Route").$$render($$result, { path: "/newsletter" }, {}, {
				default: () => {
					return `${validate_component(Circulares_1, "Circulares").$$render($$result, { esp: false }, {}, {})}`;
				}
			})}
	${validate_component(Route, "Route").$$render($$result, { path: "/circulares" }, {}, {
				default: () => {
					return `${validate_component(Circulares_1, "Circulares").$$render($$result, { esp: true }, {}, {})}`;
				}
			})}

	${validate_component(Route, "Route").$$render($$result, { path: "/school-life" }, {}, {
				default: () => {
					return `${validate_component(VidaEscolar, "VEscolar").$$render($$result, { esp: false }, {}, {})}`;
				}
			})}
	${validate_component(Route, "Route").$$render($$result, { path: "/vida-escolar" }, {}, {
				default: () => {
					return `${validate_component(VidaEscolar, "VEscolar").$$render($$result, { esp: true }, {}, {})}`;
				}
			})}

	${validate_component(Route, "Route").$$render($$result, { path: "/our-team/*" }, {}, {
				default: () => {
					return `${validate_component(Personal_1, "Personal").$$render($$result, { esp: false }, {}, {})}`;
				}
			})}
	${validate_component(Route, "Route").$$render($$result, { path: "/personal/*" }, {}, {
				default: () => {
					return `${validate_component(Personal_1, "Personal").$$render($$result, { esp: true }, {}, {})}`;
				}
			})}

	${validate_component(Route, "Route").$$render($$result, { path: "/institution" }, {}, {
				default: () => {
					return `${validate_component(Institucion, "Institucion").$$render($$result, { esp: false }, {}, {})}`;
				}
			})}
	${validate_component(Route, "Route").$$render($$result, { path: "/institucion" }, {}, {
				default: () => {
					return `${validate_component(Institucion, "Institucion").$$render($$result, { esp: true }, {}, {})}`;
				}
			})}

	${validate_component(Route, "Route").$$render($$result, { path: "/home" }, {}, {
				default: () => {
					return `${validate_component(Inicio, "Inicio").$$render($$result, { esp: false }, {}, {})}`;
				}
			})}
	${validate_component(Route, "Route").$$render($$result, { path: "/" }, {}, {
				default: () => {
					return `${validate_component(Inicio, "Inicio").$$render($$result, { esp: true }, {}, {})}`;
				}
			})}

	${validate_component(Route, "Route").$$render($$result, { path: "/*", component: _404 }, {}, {})}`;
		}
	})}
${validate_component(Cafeteria, "Cafeteria").$$render($$result, {}, {}, {})}

<div id="${"contentMessage"}" class="${"card-body text-center animate p-2"}"></div>`;
});

module.exports = App;
