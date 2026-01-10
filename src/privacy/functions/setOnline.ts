/*!
 * Copyright 2024 WPPConnect Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Set who can see your online status.
 *
 * @example
 * ```javascript
 * // Set online visibility to everyone
 * await WPP.privacy.setOnline('all');
 *
 * // Set online visibility to match lastSeen setting
 * await WPP.privacy.setOnline('match_last_seen');
 * ```
 *
 * @category Privacy
 */

import { WPPError } from '../../util';
import {
  getUserPrivacySettings,
  setPrivacyJob,
  setUserPrivacySettings,
} from '../../whatsapp/functions';

export enum setOnlineTypes {
  all = 'all',
  match_last_seen = 'match_last_seen',
}
export async function setOnline(
  value: setOnlineTypes
): Promise<setOnlineTypes> {
  if (
    typeof value !== 'string' ||
    !Object.values(setOnlineTypes).includes(value)
  ) {
    throw new WPPError(
      'incorrect_type',
      `Incorrect type ${value || '<empty>'} for set online privacy`,
      {
        value,
      }
    );
  }
  // Use setPrivacyJob directly to bypass broken setPrivacyForOneCategory
  // WhatsApp removed 'online' from PrivacyDisallowedListType enum but server still accepts it
  await setPrivacyJob({
    name: 'online',
    value: value,
  });

  // Update local cache
  setUserPrivacySettings({ online: value });

  return getUserPrivacySettings().online as setOnlineTypes;
}
