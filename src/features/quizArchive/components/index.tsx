/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Checkbox, Grid, IconButton, InputBase, Menu, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Tooltip, Typography } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import { visuallyHidden } from '@mui/utils'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import images from 'config/images'
import { AuthType } from 'features/authentication'
import { ReducerType } from 'store'

const mapStateToProps = (state: ReducerType) => ({
  authData: state.authentication.authData,
  isLoading: state.global.isLoading,
})

interface AuthProps {
  authData: AuthType
  isLoading: boolean
}


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


interface Data {
  id: number
  name: string
  updateTime: Date
  action: string | null
}

function createData(
  id: number,
  name: string,
  updateTime: Date,
  action: string | null = null
): Data {
  return {
    id,
    name,
    updateTime,
    action
  }
}

const rows = [
  createData(0, 'Cupcake', new Date()),
  createData(1, 'Cupcake', new Date(new Date().setDate(new Date().getDate() - 1))),
]

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof never>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string | Date | null },
  b: { [key in Key]: number | string | Date | null },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

interface HeadCell {
  id: keyof Data
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
    id: 'action',
    label: 'Actions',
    sortable: false,
    align: 'right'
  }
]

const DEFAULT_ORDER = 'asc'
const DEFAULT_ORDER_BY = 'updateTime'
const DEFAULT_ROWS_PER_PAGE = 5
const DEFAULT_ROWS_PER_PAGE_LIST = [5, 10, 20]


interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, newOrderBy: keyof Data) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props
  const createSortHandler =
    (newOrderBy: keyof Data) => (event: React.MouseEvent<unknown>) => {
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

interface EnhancedTableToolbarProps {
  numSelected: number
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected } = props

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
            <IconButton>
              <images.AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Toolbar>
  )
}

const ArchiveContainer = (props: AuthProps) => {
  const { t } = useTranslation()
  const { authData, isLoading } = props
  const navigate = useNavigate()

  const [order, setOrder] = useState<Order>(DEFAULT_ORDER)
  const [orderBy, setOrderBy] = useState<keyof Data>(DEFAULT_ORDER_BY)
  const [selected, setSelected] = useState<readonly number[]>([])
  const [page, setPage] = useState(0)
  const [visibleRows, setVisibleRows] = useState<Data[] | null>(null)
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE)

  // Menu horizontal
  const [anchorMoreEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isMoreOpen = Boolean(anchorMoreEl)

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement> | null) => {
    event?.stopPropagation()
    setAnchorEl(event == null ? event : event.currentTarget)
  }

  useEffect(() => {
    let rowsOnMount = stableSort(
      rows,
      getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY),
    )
    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
    )

    setVisibleRows(rowsOnMount)
  }, [])

  const handleRequestSort = useCallback(
    (event: React.MouseEvent<unknown>, newOrderBy: keyof Data) => {
      const isAsc = orderBy === newOrderBy && order === 'asc'
      const toggledOrder = isAsc ? 'desc' : 'asc'
      setOrder(toggledOrder)
      setOrderBy(newOrderBy)

      const sortedRows = stableSort(rows, getComparator(toggledOrder, newOrderBy))
      const updatedRows = sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      )
      setVisibleRows(updatedRows)
    },
    [order, orderBy, page, rowsPerPage],
  )

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleCheckboxClick = (event: React.MouseEvent<unknown>, id: number) => {
    if (isMoreOpen) return

    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
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

  const handleChangePage = useCallback(
    (event: unknown, newPage: number) => {
      setPage(newPage)

      const sortedRows = stableSort(rows, getComparator(order, orderBy))
      const updatedRows = sortedRows.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage,
      )
      setVisibleRows(updatedRows)
    },
    [order, orderBy, rowsPerPage],
  )

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10)
      setRowsPerPage(updatedRowsPerPage)

      setPage(0)

      const sortedRows = stableSort(rows, getComparator(order, orderBy))
      const updatedRows = sortedRows.slice(
        0 * updatedRowsPerPage,
        0 * updatedRowsPerPage + updatedRowsPerPage,
      )
      setVisibleRows(updatedRows)
    },
    [order, orderBy],
  )

  const handleEdit = useCallback((event, index) => {
    event?.stopPropagation()
    navigate(`/edit/${index}`)
  }, [navigate]);

  const handleDelete = useCallback((event, index) => {
    event?.stopPropagation()

  }, []);

  const isSelected = (id: number) => selected.indexOf(id) !== -1

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
              rowCount={rows.length}
            />
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
                        {row.name}
                      </TableCell>
                      <TableCell>{row.updateTime.toISOString()}</TableCell>
                      <TableCell>
                        <Grid container justifyContent={'right'}>
                          <Tooltip title="Edit">
                            <IconButton onClick={(evt) => handleEdit(evt, index)}>
                              <images.EditIcon />
                            </IconButton>
                          </Tooltip>
                          <div>
                            <IconButton
                              aria-controls={isMoreOpen ? 'basic-menu' : undefined}
                              aria-haspopup="true"
                              aria-expanded={isMoreOpen ? 'true' : undefined}
                              onClick={(evt) => handleMoreClick(evt)}>
                              <images.MoreHorizIcon />
                            </IconButton>
                            <Menu
                              id="basic-menu"
                              anchorEl={anchorMoreEl}
                              open={isMoreOpen}
                              onClose={() => handleMoreClick(null)}
                              MenuListProps={{
                                'aria-labelledby': 'basic-button',
                              }}
                            >
                              <Tooltip title="Delete">
                                <IconButton onClick={(evt) => handleDelete(evt, index)}>
                                  <images.DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Menu>
                          </div>
                        </Grid>
                        {/* <Grid container justifyContent={'right'}>
                          <Button variant="outlined">
                            {t('archive.start')}
                          </Button>
                        </Grid> */}
                      </TableCell>
                    </TableRow>
                  )
                })
                : null}
              {/* {paddingHeight > 0 && (
                <TableRow
                  style={{
                    height: paddingHeight,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={DEFAULT_ROWS_PER_PAGE_LIST}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}

export default connect(mapStateToProps)(ArchiveContainer)
