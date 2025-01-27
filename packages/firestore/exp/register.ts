/**
 * @license
 * Copyright 2020 Google LLC
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

import { _registerComponent, registerVersion } from '@firebase/app-exp';
import { Component, ComponentType } from '@firebase/component';

import { version } from '../package.json';
import { FirebaseFirestore } from '../src/exp/database';
import { Settings } from '../src/exp/settings';

declare module '@firebase/component' {
  interface NameServiceMapping {
    'firestore-exp': FirebaseFirestore;
  }
}

export function registerFirestore(): void {
  _registerComponent(
    new Component(
      'firestore-exp',
      (container, { options: settings }: { options?: Settings }) => {
        const app = container.getProvider('app-exp').getImmediate()!;
        const firestoreInstance = new FirebaseFirestore(
          app,
          container.getProvider('auth-internal')
        );
        if (settings) {
          firestoreInstance._setSettings(settings);
        }
        return firestoreInstance;
      },
      ComponentType.PUBLIC
    )
  );
  registerVersion('firestore-exp', version, 'node');
}
