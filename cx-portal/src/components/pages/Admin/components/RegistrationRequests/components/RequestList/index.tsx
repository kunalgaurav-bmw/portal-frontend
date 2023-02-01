/********************************************************************************
 * Copyright (c) 2021,2022 BMW Group AG
 * Copyright (c) 2021,2022 Contributors to the Eclipse Foundation
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

import { PageLoadingTable, PaginFetchArgs } from 'cx-portal-shared-components'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { setSearchInput } from 'features/appManagement/actions'
import { updateApplicationRequestSelector } from 'features/control/updatesSlice'
import {
  AppFilterType,
  ApplicationRequest,
  ProgressButtonsProps,
} from 'features/admin/applicationRequestApiSlice'
import { RegistrationRequestsTableColumns } from '../../registrationTableColumns'
import { GridCellParams } from '@mui/x-data-grid'
import './RequestListStyle.scss'

export const RequestList = ({
  fetchHook,
  onTableCellClick,
  loaded,
  handleDownloadDocument,
  showConfirmOverlay,
  onConfirmationCancel,
  onChipButtonSelect,
}: {
  fetchHook: (paginArgs: PaginFetchArgs) => any
  onTableCellClick: (params: GridCellParams) => void
  loaded: number
  handleDownloadDocument: (documentId: string, documentType: string) => void
  showConfirmOverlay?: (applicationId: string) => void
  onConfirmationCancel?: (applicationId: string, name: string) => void
  onChipButtonSelect?: (
    button: ProgressButtonsProps,
    row: ApplicationRequest
  ) => void
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [refresh, setRefresh] = useState<number>(0)
  const searchInputData = useSelector(updateApplicationRequestSelector)
  const [group, setGroup] = useState<string>(AppFilterType.INREVIEW)
  const [searchExpr, setSearchExpr] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>(
    AppFilterType.INREVIEW
  )
  const [fetchHookArgs, setFetchHookArgs] = useState({})
  const setView = (e: React.MouseEvent<HTMLInputElement>) => {
    const viewValue = e.currentTarget.value
    setFilterStatus(viewValue)
    setGroup(viewValue)
    setRefresh(Date.now())
  }

  useEffect(() => {
    if (onValidate(searchExpr)) {
      setFetchHookArgs({
        statusFilter: filterStatus,
        expr: searchExpr,
      })
    }
    // eslint-disable-next-line
  }, [filterStatus, searchExpr])

  const filterView = [
    {
      buttonText: t('content.admin.registration-requests.filter.all'),
      buttonValue: AppFilterType.ALL,
      onButtonClick: setView,
    },
    {
      buttonText: t('content.admin.registration-requests.filter.review'),
      buttonValue: AppFilterType.INREVIEW,
      onButtonClick: setView,
    },
    {
      buttonText: t('content.admin.registration-requests.filter.closed'),
      buttonValue: AppFilterType.CLOSED,
      onButtonClick: setView,
    },
  ]

  const columns = RegistrationRequestsTableColumns(
    useTranslation,
    handleDownloadDocument,
    showConfirmOverlay,
    onConfirmationCancel,
    onChipButtonSelect
  )

  useEffect(() => {
    if (loaded !== 0) setRefresh(Date.now())
  }, [loaded])

  const onValidate = (expr: string) => {
    const validateExpr = /^[ A-Za-z0-9]*$/.test(expr)
    if (validateExpr) dispatch(setSearchInput({ open: true, text: expr }))
    return validateExpr
  }

  return (
    <section id="registration-section-id">
      <PageLoadingTable<ApplicationRequest>
        searchExpr={searchExpr}
        rowHeight={160}
        alignCell="start"
        onCellClick={onTableCellClick}
        toolbarVariant={'searchAndFilter'}
        hasBorder={false}
        columnHeadersBackgroundColor={'transparent'}
        searchPlaceholder={t('global.table.searchName')}
        searchInputData={searchInputData}
        onSearch={(expr: string) => {
          console.log(onValidate(expr))
          if (!onValidate(expr)) return
          setRefresh(Date.now())
          setSearchExpr(expr)
        }}
        searchDebounce={1000}
        title={t('content.admin.registration-requests.tabletitle')}
        loadLabel={t('global.actions.more')}
        fetchHook={fetchHook}
        fetchHookArgs={fetchHookArgs}
        fetchHookRefresh={refresh}
        getRowId={(row: { [key: string]: string }) => row.applicationId}
        columns={columns}
        descriptionText={`${t(
          'content.admin.registration-requests.introText1'
        )}${t('content.admin.registration-requests.introText2')}`}
        defaultFilter={group}
        filterViews={filterView}
      />
    </section>
  )
}
