import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  IconButton,
  useTheme,
  styled,
  TablePagination,
  Tooltip,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  InfoOutlined,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { Rem } from "@/utils";

const MenuStyle = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    boxShadow: theme.shadows[2],
  },
}));

export const HTable = ({
  headers,
  data,
  actions,
  onPageChange,
  onRowsPerPageChange,
  totalCount,
  rowsPerPage,
  onSortRequested,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(Array(data.length).fill(null));
  const [page, setPage] = useState(0);
  const [enableToolTipIndex, setEnableToolTipIndex] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const [hoveredHeader, setHoveredHeader] = useState(null);

  const generateRowsPerPageOptions = (totalCount) => {
    const options = [5];
    const max = Math.min(100, totalCount);
    for (let option = 10; option <= max; option += 10) {
      options.push(option);
    }
    if (!options.includes(totalCount)) {
      options.push(totalCount);
    }
    return options;
  };

  const [rowsPerPageOptions] = useState(generateRowsPerPageOptions(totalCount));

  const getCellIndex = (rowIndex, colIndex) => {
    return rowIndex * headers.length + colIndex;
  };

  const handleMenuClick = (event, row, index) => {
    const newAnchorEl = [...anchorEl];
    newAnchorEl[index] = event.currentTarget;
    setAnchorEl(newAnchorEl);
  };

  const handleMenuClose = (index) => {
    const newAnchorEl = [...anchorEl];
    newAnchorEl[index] = null;
    setAnchorEl(newAnchorEl);
  };

  const handleMenuItemClick = (action, row, index) => {
    if (row) {
      const actionItem = actions.menu[action];
      if (typeof actionItem === "function") {
        const dynamicAction = actionItem(row);
        if (dynamicAction && dynamicAction.click) {
          dynamicAction.click(row);
        }
      } else if (typeof actionItem === "object" && actionItem.click) {
        actionItem.click(row);
      }
      handleMenuClose(index);
    }
  };

  const handlePMenuItemClick = (action, row, index) => {
    if (row) {
      const actionItem = actions.pmenu[action];
      if (typeof actionItem === "function") {
        const dynamicAction = actionItem(row);
        if (dynamicAction && dynamicAction.click) {
          dynamicAction.click(row);
        }
      } else if (typeof actionItem === "object" && actionItem.click) {
        actionItem.click(row);
      }
      handleMenuClose(index);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onMoueEnter = (ref, cellIndex) => {
    if (ref && ref.target && ref.target.scrollWidth > ref.target.clientWidth) {
      setEnableToolTipIndex(cellIndex);
    } else {
      setEnableToolTipIndex(null);
    }
  };

  const handleHeaderMouseEnter = (key) => {
    setHoveredHeader(key);
  };

  const handleHeaderMouseLeave = () => {
    setHoveredHeader(null);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
        key = null;
      }
    }
    setSortConfig({ key, direction });
    if (onSortRequested) {
      onSortRequested({ key, direction });
    }
  };

  const menuDisabled = (action, row) => {
    let disabled = false;
    if (action && action.disabled && action.disabled(row)) {
      disabled = true;
    }
    return disabled;
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell
                key={header.key}
                style={{
                  ...(header.headerStyle || null),
                  fontWeight: "bold",
                  fontSize: Rem(13),
                  paddingTop: Rem(10),
                  paddingBottom: Rem(10),
                  cursor: header.sortable ? "pointer" : "default",
                }}
                onClick={() => header.sortable && requestSort(header.key)}
                onMouseEnter={() => handleHeaderMouseEnter(header.key)}
                onMouseLeave={handleHeaderMouseLeave}
              >
                {header.label}{" "}
                {header.sortable && (
                  <>
                    {(sortConfig.key !== header.key || !sortConfig.direction) &&
                      hoveredHeader === header.key && <span>&uarr;&darr;</span>}
                    {sortConfig.key === header.key &&
                      sortConfig.direction === "asc" && (
                        <ArrowUpward
                          style={{ marginBottom: Rem(-3), fontSize: Rem(16) }}
                        />
                      )}
                    {sortConfig.key === header.key &&
                      sortConfig.direction === "desc" && (
                        <ArrowDownward
                          style={{ marginBottom: Rem(-3), fontSize: Rem(16) }}
                        />
                      )}
                  </>
                )}
                {header.info && (
                  <Tooltip title={header?.info}>
                    <InfoOutlined
                      style={{ marginBottom: Rem(-3), fontSize: Rem(16) }}
                    />
                  </Tooltip>
                )}
              </TableCell>
            ))}
            {actions && (
              <TableCell
                style={{
                  fontWeight: "bold",
                  fontSize: Rem(13),
                  paddingTop: Rem(10),
                  paddingBottom: Rem(10),
                  textAlign: "center",
                  ...(actions.style || null),
                }}
              >
                {actions?.name}{" "}
                {actions.info && (
                  <Tooltip title={actions?.info}>
                    <InfoOutlined
                      style={{ marginBottom: Rem(-3), fontSize: Rem(16) }}
                    />
                  </Tooltip>
                )}
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.key || index} hover={true}>
              {headers.map((header, colIndex) => {
                const cellContent = header.render
                  ? header.render(row)
                  : row[header.key];
                const cellIndex = getCellIndex(index, colIndex);
                return (
                  <TableCell
                    key={header.key}
                    style={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      ...(header.styles
                        ? header.styles(row[header.key])
                        : null),
                      paddingTop: Rem(8),
                      paddingBottom: Rem(8),
                      fontSize: Rem(14),
                    }}
                    onMouseEnter={(e) => onMoueEnter(e, cellIndex)}
                  >
                    {enableToolTipIndex === cellIndex || header.tooltip ? (
                      <Tooltip
                        title={<span>{cellContent}</span>}
                        placement="bottom-start"
                      >
                        <span>{cellContent}</span>
                      </Tooltip>
                    ) : (
                      cellContent
                    )}
                  </TableCell>
                );
              })}
              {actions && actions.menu && (
                <TableCell
                  style={{
                    paddingTop: Rem(8),
                    paddingBottom: Rem(8),
                    fontSize: Rem(14),
                    textAlign: "center",
                  }}
                >
                  {menuDisabled(actions, row) ? (
                    <IconButton
                      disabled
                      onClick={(e) => handleMenuClick(e, row, index)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  ) : (
                    <Tooltip title={actions?.actionTooltip}>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, row, index)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <MenuStyle
                    anchorEl={anchorEl[index]}
                    open={Boolean(anchorEl[index])}
                    onClose={() => handleMenuClose(index)}
                  >
                    {actions.menu &&
                      Object.keys(actions.menu).map((action) => (
                        <MenuItem
                          key={action}
                          onClick={() =>
                            handleMenuItemClick(action, row, index)
                          }
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            "&:hover": {
                              color: theme.palette.primary.main,
                            },
                            minWidth: actions.menu[action].name ? 200 : 100,
                            justifyContent: actions.menu[action].name
                              ? "left"
                              : "center",
                          }}
                        >
                          {typeof actions.menu[action] === "function" ? (
                            <span
                              style={{
                                marginRight: 5,
                                marginBottom: 2,
                                ...actions.menu[action](row).iconStyle,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {actions.menu[action](row).icon}
                            </span>
                          ) : (
                            <span
                              style={{
                                marginRight: 5,
                                marginBottom: 2,
                                ...actions.menu[action].iconStyle,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {actions.menu[action].icon}
                            </span>
                          )}
                          {typeof actions.menu[action] === "function" ? (
                            <span
                              style={{
                                ...actions.menu[action](row).textStyle,
                              }}
                            >
                              {actions.menu[action](row).name}
                            </span>
                          ) : (
                            <span style={{ ...actions.menu[action].textStyle }}>
                              {actions.menu[action].name}
                            </span>
                          )}
                        </MenuItem>
                      ))}
                  </MenuStyle>
                </TableCell>
              )}

              {actions && actions.pmenu && (
                <TableCell
                  style={{
                    paddingTop: Rem(8),
                    paddingBottom: Rem(8),
                    textAlign: "center",
                  }}
                >
                  {actions.pmenu &&
                    Object.keys(actions.pmenu).map((action, i) => (
                      <Tooltip
                        key={i}
                        title={
                          typeof actions.pmenu[action] === "function"
                            ? actions.pmenu[action](row)?.tooltip
                            : actions.pmenu[action]?.tooltip
                        }
                      >
                        <span
                          onClick={() =>
                            handlePMenuItemClick(action, row, index)
                          }
                        >
                          {typeof actions.pmenu[action] === "function"
                            ? actions.pmenu[action](row).button
                            : actions.pmenu[action].button}
                        </span>
                      </Tooltip>
                    ))}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalCount && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={totalCount || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </>
  );
};

HTable.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      headerStyle: PropTypes.object,
      render: PropTypes.func,
      styles: PropTypes.func,
      sortable: PropTypes.bool,
    })
  ).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  actions: PropTypes.shape({
    info: PropTypes.string,
    name: PropTypes.string,
    style: PropTypes.object,
    actionTooltip: PropTypes.string,
    disabled: PropTypes.func,
    menu: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.shape({
          click: PropTypes.func,
          name: PropTypes.string,
          icon: PropTypes.element,
          iconStyle: PropTypes.object,
          textStyle: PropTypes.object,
        }),
        PropTypes.func,
      ])
    ),
    pmenu: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.shape({
          click: PropTypes.func,
          name: PropTypes.string,
          button: PropTypes.element,
          iconStyle: PropTypes.object,
          textStyle: PropTypes.object,
        }),
        PropTypes.func,
      ])
    ),
  }),
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  totalCount: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onSortRequested: PropTypes.func,
};
