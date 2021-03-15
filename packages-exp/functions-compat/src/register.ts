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

import firebase, {
  _FirebaseNamespace,
  FirebaseApp
} from '@firebase/app-compat';
import { FunctionsService } from './service';
import {
  Component,
  ComponentType,
  InstanceFactory,
  ComponentContainer,
  InstanceFactoryOptions
} from '@firebase/component';
import {
  Functions as FunctionsServiceExp,
  HttpsCallableOptions,
  HttpsCallable
} from '@firebase/functions-exp';

declare module '@firebase/component' {
  interface NameServiceMapping {
    'app-compat': FirebaseApp;
    'functions-compat': FunctionsService;
    'functions-exp': FunctionsServiceExp;
  }
}

declare module '@firebase/functions-exp' {
  export function httpsCallable<RequestData = unknown, ResponseData = unknown>(
    functionsInstance: FunctionsService | FunctionsServiceExp,
    name: string,
    options?: HttpsCallableOptions
  ): HttpsCallable<RequestData, ResponseData>;
}

const factory: InstanceFactory<'functions-compat'> = (
  container: ComponentContainer,
  { instanceIdentifier: regionOrCustomDomain }: InstanceFactoryOptions
) => {
  // Dependencies
  const app = container.getProvider('app-compat').getImmediate();
  const functionsServiceExp = container
    .getProvider('functions-exp')
    .getImmediate({
      identifier: regionOrCustomDomain
    });

  return new FunctionsService(app, functionsServiceExp);
};

export function registerFunctions(): void {
  const namespaceExports = {
    Functions: FunctionsService
  };
  (firebase as _FirebaseNamespace).INTERNAL.registerComponent(
    new Component('functions-compat', factory, ComponentType.PUBLIC)
      .setServiceProps(namespaceExports)
      .setMultipleInstances(true)
  );
}
