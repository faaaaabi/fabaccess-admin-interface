import React from "react";
import {Checkbox, TableCell, TableHead, TableRow, TableSortLabel} from "@material-ui/core";
import Props from "./types";


const EnhancedTableHead: React.FC<Props> = (props: Props) => {
    const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, isSelectableTable} = props;
    const createSortHandler = (property: string) => (event: React.SyntheticEvent) => {
        onRequestSort(event, property);
    };
    const isSelectionAllowed = isSelectableTable || false;

    return (
        <TableHead>
            <TableRow>
                {isSelectionAllowed ? (
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={(numSelected === rowCount) && numSelected > 0 && rowCount > 0}
                            onChange={onSelectAllClick}
                            inputProps={{'aria-label': 'select all desserts'}}
                        />
                    </TableCell>
                ) : (
                    <></>
                )}
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.isSortable ? (
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={order}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                    {orderBy === headCell.id ? (
                                        <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                                    ) : null}
                                </TableSortLabel>
                            )
                            : headCell.label
                        }
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

export default EnhancedTableHead;