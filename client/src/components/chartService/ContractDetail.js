import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import './../../App.css'


const ContractDetail = () => {
    const [socketConnected, setSocketConnected] = useState(false);
    const [sendMsg, setSendMsg] = useState(false);
    const [transaction, setTransaction] = useState([]);
    const webSocketUrl = `wss://pubwss.bithumb.com/pub/ws`;
    let ws = useRef(null);
  
    // 소켓 객체 생성
    useEffect(() => {
      if (!ws.current) {
        ws.current = new WebSocket(webSocketUrl);
        ws.current.onopen = () => {
          console.log("connected to " + webSocketUrl);
          setSocketConnected(true);
        };
        ws.current.onclose = (error) => {
          console.log("disconnect from " + webSocketUrl);
          console.log(error);
        };
        ws.current.onerror = (error) => {
          console.log("connection error " + webSocketUrl);
          console.log(error);
        };
      }
      return () => {
        console.log("clean up");
        ws.current.close();
      };
    }, []);
  
    // 소켓이 연결되었을 시에 send 메소드
    useEffect(() => {
        if (socketConnected) {
        ws.current.send(
            JSON.stringify({
                type: "transaction",
                symbols: [ "BTC_KRW" ],
            }),
        );
        setSendMsg(true);
        }
    }, [socketConnected]);

    // send 후에 onmessage로 데이터 가져오기
    useEffect(() => {
        if (sendMsg) {
        ws.current.onmessage = (evt) => {
            const data = JSON.parse(evt.data);
            // console.log(data);
            setTransaction((prevItems) => [...prevItems, data]);
        }};
    }, [sendMsg])

    // 유형에 따라 값 형식표시
    const getValue = (value, type) => {
        try {
            if( type === 'Fastening type') {
                return value === '1' ? '매도' : '매수'
            } else if (type === 'price') {
                return value.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')
            } else if (type === 'time') {
                return value.substring(11, 19)
            } else if (type === 'Amt') {
                return parseFloat(value).toFixed(2)
            } else if (type === 'Qty') {
                return parseFloat(value).toFixed(4)
            }
        }catch (e) {
            return '';
        }
    }
    return (
        <Box sx={{ flexGrow: 1, width:"360px" }}>
          <TableContainer className="scroll-head" sx={{ maxHeight: 260, maxWidth: 360 }}>
            <Table id="contract_detail" stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell className="tableHeader" align="left" style={{padding:"0 8px"}}>시간</TableCell>
                        <TableCell className="tableHeader" align="center">종류</TableCell>
                        <TableCell className="tableHeader" align="right">가격(KRW)</TableCell>
                        <TableCell className="tableHeader" align="right">수량(BTC)</TableCell>
                        <TableCell className="tableHeader" align="right" style={{padding:"0 8px"}}>체결금액</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transaction && transaction.map((row,i) => (
                        <>
                        {i>1 && row.content.list.map((o,j) => (
                            <TableRow key={o.id}>
                                <TableCell component="th" align="left" style={{padding:"0 8px"}}>
                                    {o.contDtm && getValue(o.contDtm,'time')}
                                </TableCell>
                                <TableCell component="th" align="center">
                                    {o.buySellGb && getValue(o.buySellGb,'Fastening type')}
                                </TableCell>
                                <TableCell component="th" size="small" align="right" >
                                    {o.contPrice && getValue(o.contPrice, 'price')}
                                </TableCell>
                                {o.updn !== "dn" ? (
                                    <TableCell component="th" size="small" align="right" className="color_blu" >
                                        <b>{o.contQty && getValue(o.contQty, 'Qty')} BTC</b>
                                    </TableCell>
                                ):(
                                    <TableCell component="th" size="small" align="right" className="color_red" >
                                       <b>{o.contQty && getValue(o.contQty, 'Qty')} BTC</b>
                                    </TableCell>
                                )}
                                <TableCell component="th" align="right" style={{padding:"0 8px"}}>
                                    {o.contAmt && getValue(o.contAmt, 'Amt')}
                                </TableCell>
                            </TableRow>
                        ))}
                        </>
                    ))}
                </TableBody>
            </Table>
          </TableContainer>
        </Box>
    )
}

export default ContractDetail;