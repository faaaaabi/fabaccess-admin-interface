import React from "react";

type Props = {
    classes?: any,
    numSelected: number,
    onRequestSort: (event: any, property: any) => any,
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void,
    order: 'asc' | 'desc' ,
    orderBy: string,
    rowCount: number
    headCells: { id: string, numeric: boolean, disablePadding: boolean, label: string }[]
}

export default Props;