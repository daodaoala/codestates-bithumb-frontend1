import React from 'react';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import './../../App.css'

const useStyles = makeStyles((theme) => ({
    main_table_container:{
        maxHeight: "100%",
    },
    main_table:{
        minWidth: "360px",
        "& .MuiTableCell-root":{
            fontSize:"11px"
        }
    },
}));

const worldPrice = [
    {
        exchange: "Binance",
        price: "55,518,158원",
        local: "$45,750.44",
        volume: "47,463.48311 BTC"
    },
    {
        exchange: "Digifinex",
        price: "55,527,563원",
        local: "$45,758.19",
        volume: "11,003.91634597 BTC"
    }
]

const WorldMarket = () => {
    const cls = useStyles();

    return (
        <Box sx={{ flexGrow: 1, width:"360px"}}>
          <TableContainer className="scroll-head">
            <Table stickyHeader aria-label="sticky table" className={cls.main_table} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">거래소</TableCell>
                        <TableCell align="right">가격</TableCell>
                        <TableCell align="right">현지통화</TableCell>
                        <TableCell align="center">거래량</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {worldPrice.map((row,i) => (
                        <TableRow key={row.id}>
                            <TableCell align="left">{row.exchange}</TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                            <TableCell align="right">{row.local}</TableCell>
                            <TableCell align="center">{row.volume}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </TableContainer>
        </Box>
    )
}

export default WorldMarket;