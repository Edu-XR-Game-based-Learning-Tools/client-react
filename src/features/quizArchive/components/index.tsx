/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Checkbox, Grid, IconButton, InputBase, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Toolbar, Tooltip, Typography } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import { visuallyHidden } from '@mui/utils'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit/dist/createAction'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import images from 'config/images'
import { AuthType } from 'features/authentication'
import LoadingComponent from 'libs/ui/components/Loading'
import { isNullOrUndefined } from 'libs/utility'
import { Order, getComparator, stableSort } from 'libs/utility/pagination'
import { ReducerType } from 'store'
import { useAppDispatch } from 'store/hooks'

import useQuizArchiveService from '../hooks'
import { quizArchiveActions } from '../store/slice'
import { QuizCollectionDto, QuizCollectionListDto, initQuizCollectionDto } from '../types'

const mapStateToProps = (state: ReducerType) => ({
  quizCollectionList: state.quizArchive.quizCollectionList,
  editCollection: state.quizArchive.editCollection,
  addCollection: state.quizArchive.addCollection,
  setAddCollection: quizArchiveActions.setAddCollection,
  authData: state.authentication.authData,
  isLoading: state.global.isLoading,
})

interface Props {
  quizCollectionList: QuizCollectionListDto
  editCollection: QuizCollectionDto
  addCollection: QuizCollectionDto
  setAddCollection: ActionCreatorWithPayload<QuizCollectionDto, "quizArchive/setAddCollection">
  authData: AuthType
  isLoading: boolean
}

// #region Style
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}))
// #endregion Style

// #region Pagination Data Type
interface TableData {
  id: number
  name: string | null
  noQuiz: number
  updateTime: Date
  action: string | null
}

function createTableData(
  id: number,
  noQuiz: number,
  name: string,
  updateTime: Date,
  action: string | null = null
): TableData {
  return {
    id,
    noQuiz,
    name,
    updateTime,
    action
  }
}

function createTableDataFromDto(
  dto: QuizCollectionDto,
  action: string | null = null
): TableData {
  return {
    id: dto.eId ?? -1,
    noQuiz: dto.quizzes.length,
    name: dto.name,
    updateTime: dto.updatedAt ? new Date(dto.updatedAt.toString()) : new Date(),
    action
  }
}

interface HeadCell {
  id: keyof TableData
  label: string | null
  sortable: boolean
  align: 'left' | 'center' | 'right'
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    label: 'Name',
    sortable: true,
    align: 'left'
  },
  {
    id: 'updateTime',
    label: 'Update Time',
    sortable: true,
    align: 'left'
  },
  {
    id: 'noQuiz',
    label: 'Number of Quiz',
    sortable: true,
    align: 'left'
  },
  {
    id: 'action',
    label: 'Actions',
    sortable: false,
    align: 'right'
  }
]

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, newOrderBy: keyof TableData) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

interface EnhancedTableToolbarProps {
  numSelected: number
}

const DEFAULT_ORDER = 'desc'
const DEFAULT_ORDER_BY = 'updateTime'
const DEFAULT_ROWS_PER_PAGE = Number.MAX_SAFE_INTEGER
const DEFAULT_ROWS_PER_PAGE_LIST = [Number.MAX_SAFE_INTEGER]
// #endregion Pagination Data Type

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected } = props
  const { updateQuizCollection } = useQuizArchiveService()

  const handleAddNew = useCallback((event) => {
    event?.stopPropagation()
    updateQuizCollection(initQuizCollectionDto)
  }, [updateQuizCollection])

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <>
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
          <Tooltip title="Delete">
            <IconButton>
              <images.DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Box
          display={'flex'}
          sx={{ flex: '1 1 100%' }}
          justifyContent={'space-between'}>
          <Search>
            <SearchIconWrapper>
              <images.SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Tooltip title="Add">
            <IconButton onClick={handleAddNew}>
              <images.AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Toolbar>
  )
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props
  const createSortHandler =
    (newOrderBy: keyof TableData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, newOrderBy)
    }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            align={headCell.align}
          >
            {
              headCell.sortable ?
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel> :
                headCell.label
            }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const ArchiveContainer = (props: Props) => {
  const { t } = useTranslation()
  const { addCollection, setAddCollection, editCollection, quizCollectionList, isLoading } = props
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { getQuizCollectionList, updateQuizCollection, deleteQuizCollection } = useQuizArchiveService()

  const tableData = useRef<TableData[]>([])
  const [order, setOrder] = useState<Order>(DEFAULT_ORDER)
  const [orderBy, setOrderBy] = useState<keyof TableData>(DEFAULT_ORDER_BY)
  const [selected, setSelected] = useState<readonly number[]>([])
  const [page, setPage] = useState(0)
  const [visibleRows, setVisibleRows] = useState<TableData[] | null>(null)
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE)
  const [editFieldRows, setEditFieldRows] = useState<(string | null)[]>([])

  // #region Menu horizontal
  const [anchorEditEl, setAnchorEditEl] = useState<null | HTMLElement>(null)
  const isEditOpen = Boolean(anchorEditEl)
  const [anchorMoreEl, setAnchorMoreEl] = useState<null | HTMLElement>(null)
  const isMoreOpen = Boolean(anchorMoreEl)
  const [anchorIndex, setAnchorIndex] = useState<number | null>(null)

  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement> | null, index: number | null = null) => {
    event?.stopPropagation()
    setAnchorIndex(index)
    setAnchorEditEl(event == null ? event : event.currentTarget)
  }

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement> | null, index: number | null = null) => {
    event?.stopPropagation()
    setAnchorIndex(index)
    setAnchorMoreEl(event == null ? event : event.currentTarget)
  }

  const hideAnchorMenu = useCallback(() => {
    setAnchorIndex(null)
    setAnchorEditEl(null)
    setAnchorMoreEl(null)
  }, [])
  // #endregion Menu horizontal

  // #region Refresh on Rerender
  useEffect(() => {
    getQuizCollectionList()
  }, [editCollection, getQuizCollectionList])

  useEffect(() => {
    if (!quizCollectionList.success || !quizCollectionList.collections) return
    tableData.current = quizCollectionList.collections.map((ele) => createTableDataFromDto(ele))

    let rowsOnMount = stableSort(
      tableData.current,
      getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY),
    )
    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
    )

    setVisibleRows(rowsOnMount)
  }, [quizCollectionList, tableData])

  useEffect(() => {
    if (!quizCollectionList.success || !quizCollectionList.collections) return
    setEditFieldRows((prev) => {
      const newData = quizCollectionList.collections.map((_, index) => prev[index])
      return newData
    })
  }, [quizCollectionList])

  useEffect(() => {
    if (addCollection.eId) {
      dispatch(setAddCollection(initQuizCollectionDto))
      navigate(`/archive/edit/${addCollection.eId}`)
    }
  }, [addCollection.eId, dispatch, navigate, setAddCollection])
  // #endregion Refresh on Rerender

  // #region Paginate Data
  const handleChangePage = useCallback(
    (event: unknown, newPage: number) => {
      setPage(newPage)

      const sortedRows = stableSort(tableData.current, getComparator(order, orderBy))
      const updatedRows = sortedRows.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage,
      )
      setVisibleRows(updatedRows)
    },
    [order, orderBy, rowsPerPage, tableData],
  )

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10)
      setRowsPerPage(updatedRowsPerPage)

      setPage(0)

      const sortedRows = stableSort(tableData.current, getComparator(order, orderBy))
      const updatedRows = sortedRows.slice(
        0 * updatedRowsPerPage,
        0 * updatedRowsPerPage + updatedRowsPerPage,
      )
      setVisibleRows(updatedRows)
    },
    [order, orderBy, tableData],
  )
  // #endregion Paginate Data

  // #region Arrange Data
  const handleRequestSort = useCallback(
    (event: React.MouseEvent<unknown>, newOrderBy: keyof TableData) => {
      const isAsc = orderBy === newOrderBy && order === 'asc'
      const toggledOrder = isAsc ? 'desc' : 'asc'
      setOrder(toggledOrder)
      setOrderBy(newOrderBy)

      const sortedRows = stableSort(tableData.current, getComparator(toggledOrder, newOrderBy))
      const updatedRows = sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      )
      setVisibleRows(updatedRows)
    },
    [order, orderBy, page, rowsPerPage, tableData],
  )

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = tableData.current.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleCheckboxClick = (event: React.MouseEvent<unknown>, eId: number) => {
    if (isMoreOpen || isEditOpen) return

    const selectedIndex = selected.indexOf(eId)
    let newSelected: readonly number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, eId)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    setSelected(newSelected)
  }
  // #endregion Arrange Data

  // #region Edit Data
  const getIndexOfDataByRowIndex = useCallback((rowIndex: number): number | null => {
    if (!visibleRows) return null
    const data = quizCollectionList.collections.find((ele) => ele.eId === visibleRows[rowIndex].id)
    console.log(rowIndex, visibleRows[rowIndex])
    console.log(data)
    if (!data) return null
    const index = quizCollectionList.collections.indexOf(data)
    console.log(index)
    return index
  }, [quizCollectionList.collections, visibleRows])

  const setEditFieldRowsCallback = useCallback((rowIndex, value) => {
    setEditFieldRows((prev) => {
      const newData = prev?.map(_ => _) ?? null
      if (newData) newData[rowIndex] = value
      return newData
    })
  }, [])

  const handleEditFieldClick = (event: React.MouseEvent, index: number) => {
    event?.stopPropagation()
    const valueFromRow = visibleRows && !isNullOrUndefined(visibleRows[index].name) ? visibleRows[index].name : ''
    setEditFieldRowsCallback(index, !isNullOrUndefined(editFieldRows[index]) ? null : valueFromRow)
    hideAnchorMenu()
  }

  const handleEditDetailsClick = (event: React.MouseEvent, rowIndex: number) => {
    event?.stopPropagation()
    const index = getIndexOfDataByRowIndex(rowIndex)
    if (index === null) return
    navigate(`/archive/edit/${quizCollectionList.collections[index].eId}`)
    hideAnchorMenu()
  }

  const handleSaveClick = (event: React.MouseEvent, rowIndex: number) => {
    event?.stopPropagation()
    const index = getIndexOfDataByRowIndex(rowIndex)
    if (index === null) return
    const newDto = { ...quizCollectionList.collections[index], name: editFieldRows[rowIndex] }
    updateQuizCollection(newDto)
    setEditFieldRowsCallback(rowIndex, null)
  }

  const handleDeleteClick = (event: React.MouseEvent, rowIndex: number) => {
    event?.stopPropagation()
    const index = getIndexOfDataByRowIndex(rowIndex)
    if (index === null) return
    deleteQuizCollection(quizCollectionList.collections[index])
    hideAnchorMenu()
  }
  // #endregion Edit Data

  const isSelected = (id: number) => selected.indexOf(id) !== -1

  const rowNameField = function rowNameField(row: TableData, index: number) {
    if (!visibleRows) return <></>

    // console.log(index, editFieldRows[index])
    return (
      editFieldRows && !isNullOrUndefined(editFieldRows[index]) ?
        <Box display={'flex'}>
          <TextField
            type='text'
            required
            value={editFieldRows[index]}
            onClick={(evt) => evt?.stopPropagation()}
            onChange={(evt) => {
              setEditFieldRowsCallback(index, evt.target.value)
            }}
            variant='outlined'
            multiline
            maxRows={12}
            sx={{
              input: { color: 'white', height: '100%', border: 'none' },
              '& .MuiInputBase-root,.MuiInputBase-root:hover': {
                height: '100%',
                backgroundColor: '#00000055',
                color: 'white',
                '& > fieldset': {
                  borderColor: '#E0E3E755 !important',
                  borderWidth: 1,
                },
              },
            }}
            style={{ width: '100%' }}
          />
          <Tooltip title="Save">
            <IconButton onClick={(evt) => handleSaveClick(evt, index)}>
              <images.SaveIcon />
            </IconButton>
          </Tooltip>
        </Box>
        :
        <div>{visibleRows[index].name}</div>
    )
  }

  const rowActions = function rowActions(row: TableData, index: number) {
    return (
      <Grid container justifyContent={'right'}>
        <div>
          <IconButton
            aria-controls={isEditOpen && anchorIndex === index ? 'edit-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={isEditOpen && anchorIndex === index ? 'true' : undefined}
            onClick={(evt) => handleEditClick(evt, index)}>
            <images.UpdateIcon />
          </IconButton>
          <Menu
            id="edit-menu"
            anchorEl={anchorEditEl}
            open={isEditOpen && anchorIndex === index}
            onClose={() => handleEditClick(null)}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={(evt) => handleEditFieldClick(evt, index)}>
              <images.EditIcon />
              <div style={{ width: "0.5rem" }} />
              Edit Field
            </MenuItem>
            <div style={{ height: "0.5rem" }} />
            <MenuItem onClick={(evt) => handleEditDetailsClick(evt, index)}>
              <images.InfoIcon />
              <div style={{ width: "0.5rem" }} />
              Details Edit
            </MenuItem>
          </Menu>
        </div>
        <div>
          <IconButton
            aria-controls={isMoreOpen && anchorIndex === index ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={isMoreOpen && anchorIndex === index ? 'true' : undefined}
            onClick={(evt) => handleMoreClick(evt, index)}>
            <images.MoreHorizIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorMoreEl}
            open={isMoreOpen && anchorIndex === index}
            onClose={() => handleMoreClick(null)}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <Tooltip title="Delete">
              <IconButton onClick={(evt) => handleDeleteClick(evt, index)}>
                <images.DeleteIcon />
              </IconButton>
            </Tooltip>
          </Menu>
        </div>
      </Grid>
    )
  }

  const tableBody = (
    <TableBody>
      {visibleRows
        ? visibleRows.map((row, index) => {
          const isItemSelected = isSelected(row.id)
          const labelId = `enhanced-table-checkbox-${index}`

          return (
            <TableRow
              hover
              onClick={(event) => handleCheckboxClick(event, row.id)}
              role="checkbox"
              aria-checked={isItemSelected}
              tabIndex={-1}
              key={row.id}
              selected={isItemSelected}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={isItemSelected}
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </TableCell>
              <TableCell
                component="th"
                id={labelId}
                scope="row"
              >
                {rowNameField(row, index)}
              </TableCell>
              <TableCell>{row.updateTime.toISOString()}</TableCell>
              <TableCell>{row.noQuiz}</TableCell>
              <TableCell>
                {rowActions(row, index)}
              </TableCell>
            </TableRow>
          )
        })
        : null}
    </TableBody>)

  return (
    <Box sx={{ width: '100%' }} display={'flex'} justifyContent={'center'}>
      <Paper sx={{ width: '80%', mb: 2 }} style={{ backgroundColor: 'inherit' }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='small'
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={tableData.current.length}
            />
            {tableBody}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={DEFAULT_ROWS_PER_PAGE_LIST}
          component="div"
          count={tableData.current.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '.MuiTablePagination-displayedRows': {
              marginRight: '1rem',
            },
            '.MuiTablePagination-actions': {
              display: 'none',
            },
          }}
        />
      </Paper>
      <LoadingComponent isLoading={isLoading} />
    </Box>
  )
}

export default connect(mapStateToProps)(ArchiveContainer)
