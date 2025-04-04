/********************************************************************************
 * Copyright (c) 2023 Mercedes-Benz Group AG and BMW Group AG
 * Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

import { Typography, IconButton } from '@catena-x/portal-shared-components'
import type { ProviderProps } from '../StaticTypes'
import '../style.scss'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { Trans } from 'react-i18next'

export default function TextCenterAligned({
  provider,
  scrollTop,
  showScroll,
}: {
  provider: ProviderProps
  scrollTop: () => void
  showScroll: boolean
}) {
  return (
    <div className={'textCenterAligned'}>
      <div>
        {provider.title && (
          <div className="titleWithIcon">
            <Typography variant="h2">{provider.title}</Typography>
            {showScroll && (
              <IconButton onClick={scrollTop}>
                <ArrowUpwardIcon />
              </IconButton>
            )}
          </div>
        )}
        {provider.description && (
          <Trans>
            <Typography className={'description'} variant="body1">
              {provider.description}
            </Typography>
          </Trans>
        )}
      </div>
    </div>
  )
}
