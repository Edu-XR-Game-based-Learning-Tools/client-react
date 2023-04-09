import { Button, ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@mui/material'
import React, { Key } from 'react'

type LibComponentProps = {
  options: Array<Key>,
  selectedIndex: number,
  setSelectedIndex: (idx: number) => void
}

const LibComponent = (props: LibComponentProps) => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    props.setSelectedIndex(index)
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  return (
    <React.Fragment>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
        <Button onClick={handleToggle}>{props.options[props.selectedIndex]}</Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {props.options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === props.selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  )
}

export default LibComponent