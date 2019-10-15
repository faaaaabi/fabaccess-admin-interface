import React from "react";
import {PropTypes} from "@material-ui/core";
import Alignment = PropTypes.Alignment;

type Props = {
    classes?: any,
    numSelected: number,
    onRequestSort: (event: any, property: any) => any,
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void,
    order: 'asc' | 'desc',
    orderBy: string,
    rowCount: number
    headCells: headCell[]
}

export type headCell = {
    id: string,
    numeric: boolean,
    disablePadding: boolean,
    label: string,
    isSortable: boolean,
    align: Alignment
}

export default Props;