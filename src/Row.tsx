import React, { ReactNode, useContext } from 'react'
import styled from 'styled-components'
import { Column, Row as RowType } from './types'
import Context from './Context'

const GridRow = styled.div`
    position: absolute;
`

const GridCell = styled.div`
    position: absolute;
    height: 100%;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    /** 优化 webkit 中的渲染效率 */
    content-visibility: auto;
`

const CellBody = styled.div`
    padding: 0px 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`

interface RowProps<R>
    extends Pick<React.HTMLAttributes<HTMLDivElement>, 'style'> {
    row: RowType<R>
    width: number
    columns: readonly Column<R>[]
    estimatedColumnWidth: number
    cacheRemoveCount: number
}

function Row<R>({
    row,
    width,
    style = {},
    columns = [],
    estimatedColumnWidth,
    cacheRemoveCount,
}: RowProps<R>) {
    const { data } = row
    const { state } = useContext(Context)
    const renderCell = () => {
        const result: Array<ReactNode> = []

        let left = 0
        columns.some((column) => {
            const columnWidth = column.width || 120
            if (
                left <
                state.scrollLeft - estimatedColumnWidth * cacheRemoveCount
            ) {
                left += columnWidth
                return false
            }
            const txt = (data as any)[column.name] as string
            result.push(
                <GridCell
                    key={`${row.key}-${column.name}`}
                    style={{
                        left,
                        width: columnWidth,
                    }}
                >
                    <CellBody>{txt}</CellBody>
                </GridCell>
            )
            left += columnWidth
            if (
                left >
                width +
                    state.scrollLeft +
                    estimatedColumnWidth * cacheRemoveCount
            ) {
                return true
            }
            return false
        })
        return result
    }

    return <GridRow style={style}>{renderCell()}</GridRow>
}

export default Row
