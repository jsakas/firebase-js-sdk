/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CacheNode } from './CacheNode';
import { Node } from '../snap/Node';

/**
 * Stores the data we have cached for a view.
 *
 * serverSnap is the cached server data, eventSnap is the cached event data (server data plus any local writes).
 */
export interface ViewCache {
  readonly eventCache: CacheNode;
  readonly serverCache: CacheNode;
}

export function newViewCache(
  eventCache: CacheNode,
  serverCache: CacheNode
): ViewCache {
  return { eventCache, serverCache };
}

export function viewCacheUpdateEventSnap(
  viewCache: ViewCache,
  eventSnap: Node,
  complete: boolean,
  filtered: boolean
): ViewCache {
  return newViewCache(
    new CacheNode(eventSnap, complete, filtered),
    viewCache.serverCache
  );
}

export function viewCacheUpdateServerSnap(
  viewCache: ViewCache,
  serverSnap: Node,
  complete: boolean,
  filtered: boolean
): ViewCache {
  return newViewCache(
    viewCache.eventCache,
    new CacheNode(serverSnap, complete, filtered)
  );
}

export function viewCacheGetCompleteEventSnap(
  viewCache: ViewCache
): Node | null {
  return viewCache.eventCache.isFullyInitialized()
    ? viewCache.eventCache.getNode()
    : null;
}

export function viewCacheGetCompleteServerSnap(
  viewCache: ViewCache
): Node | null {
  return viewCache.serverCache.isFullyInitialized()
    ? viewCache.serverCache.getNode()
    : null;
}
