import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import StarIcon from '@mui/icons-material/Star';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import MovingIcon from '@mui/icons-material/Moving';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import CancelIcon from '@mui/icons-material/Cancel';
import {coinName} from './Coins';
import './../../App.css';


const BTCMarket = ( {tickerList} ) => {
    const [headValue, setHeadValue] = useState(1);
    const [time, setTime] = useState(2);                        // 변동률 select
    const [favorites, setFavorites] = useState([]);             // 즐겨찾기한 코인 리스트
    const [favoriteIcon, setFavoriteIcon] = useState([]);       // 즐겨찾기 아이콘 리스트   
    const [btcList, setBtcList] = useState([]); 
    const [btcTickerList, setBtcTickerList] = useState([]); 
    let history = useHistory();


    useEffect(() => {
        getTickersBTC();
        setInterval(() => {
            getTickersBTC();
        }, 6000);
    }, [])

	useEffect(() => {
		createArr(btcList, setBtcTickerList)
	}, [btcList])

    // 검색 기능
	// useEffect(() => {
    //     setFavorites(favorites.filter((data)=> data.name.includes(search.toUpperCase())))
    // }, [search])


    //코인 시세 호출 API
    async function getTickersBTC() {
        try {
            const orderCurrency = 'ALL';
            const paymentCurrency = 'BTC';
            const response = await axios.get(`https://api.bithumb.com/public/ticker/${orderCurrency}_${paymentCurrency}`);
            delete response.data.data.date;
            setBtcList(response.data.data)
        } catch (e) {
            console.log("에러", e);
        }
    }

    //객체 배열로 변환
    const createArr = ( btcList, setBtcTickerList ) => {
        setBtcTickerList(Object.keys(btcList).map((name) => ({name, ...btcList[name]})));
    }

    //즐겨찾기 추가 및 해제
    function includeFavorites( data, name ) {
        console.log("즐겨찾기", data, name)
        if( !favoriteIcon.includes(name) ) {
            setFavoriteIcon([...favoriteIcon, name])
            setFavorites([...favorites, data])
        }
        else {
            setFavoriteIcon(favoriteIcon.filter(icon => icon !== name));
            setFavorites(favorites.filter(favorites => favorites.name !== name));
        }
    }

    // 유형에 따라 값 형식표시
    const getValue = (value, type) => {
        try {
            if( type === 'btcprice'){
                return parseFloat(value).toFixed(8)
            } else if(type === 'trade_price') {
                return parseFloat(value).toFixed(3)
            }
        } catch (e) {
            return '';
        }
    }

    return (
        <>
            <Paper style={{width:"1200px" ,borderTop:"1px solid #F2F2F2", margin:"0 0 70px 0" }}>
                <Box display="flex" p="16px 0">
                    <Box className={clsx('price_head', headValue===1 && 'click_price_head')} onClick={()=>setHeadValue(1)}>전체 {btcTickerList.length}</Box>
                    <Box className={clsx('price_head', headValue===2 && 'click_price_head')} onClick={()=>setHeadValue(2)}>메이저 5</Box>
                    <Box className={clsx('price_head', headValue===3 && 'click_price_head')} onClick={()=>setHeadValue(3)}>일반 84</Box>
                    <Box className={clsx('price_head', headValue===4 && 'click_price_head')} onClick={()=>setHeadValue(4)}>신규 4</Box>
                    <Box className={clsx('price_head', headValue===5 && 'click_price_head')} onClick={()=>setHeadValue(5)}>투자유의 1</Box>
                </Box>
                <TableContainer className="scroll-head" sx={{ maxHeight: 700, maxWidth: 1200 }}>
                    <Table stickyHeader aria-label="sticky table" size="small">
                        <TableHead id='market_tablehead'>
                            <TableRow>
                                <TableCell align="left"> </TableCell>
                                <TableCell align="left"><b>자산</b></TableCell>
                                <TableCell align="right"><b>실시간 시세</b></TableCell>
                                <TableCell align="right">
                                    <Box display="flex" justifyContent="right">
                                        <Box mt="3px" mr="5px">변동률</Box>
                                        <FormControl id="change_rate">
                                            <Select
                                                value={time}
                                            >
                                                <MenuItem value={1} style={{ fontSize:"11px", lineHeight: "25px", fontWeight: 500, padding: "0px 16px" }} >전일대비</MenuItem>
                                                <MenuItem value={2} style={{ fontSize:"11px", lineHeight: "25px", fontWeight: 500, padding: "0px 16px" }} >24시간</MenuItem>
                                                <MenuItem value={3} style={{ fontSize:"11px", lineHeight: "25px", fontWeight: 500, padding: "0px 16px" }} >12시간</MenuItem>
                                                <MenuItem value={4} style={{ fontSize:"11px", lineHeight: "25px", fontWeight: 500, padding: "0px 16px" }} >1시간</MenuItem>
                                                <MenuItem value={5} style={{ fontSize:"11px", lineHeight: "25px", fontWeight: 500, padding: "0px 16px" }} >30분</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </TableCell>
                                <TableCell align="right"><b>거래금액(24H)</b></TableCell>
                                <TableCell align="center"><b>입금</b></TableCell>
                                <TableCell align="center"><b>출금</b></TableCell>
                                <TableCell align="center"><b>차트</b></TableCell>
                                <TableCell align="center"><b>거래</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody id="table_asset"> 
                            {btcTickerList && btcTickerList.map((data, i)=>(
                                <>
                                    <TableRow key="{data}">
                                        <TableCell align="left" style={{ width: "4px"}} >
                                            <StarIcon className={clsx(favoriteIcon.includes(data.name) ? 'click_star_icon' : 'star_icon')} onClick={()=>includeFavorites(data, data.name)}/>
                                        </TableCell>
                                        <TableCell align="left" onClick={()=>history.push("/trade/order/BTC_KRW")}>
                                            {data.name}
                                        </TableCell>
                                        <TableCell align="right" style={{ width: "20%"}}>
                                            {data.closing_price  && getValue(data.closing_price, 'btcprice')} BTC
                                        </TableCell>
                                        {data.fluctate_rate_24H > 0 ? (
                                            <TableCell className= "color_red" align="right"  style={{ width: "30%"}}>
                                                <Box display="flex" justifyContent="flex-end">
                                                    +{data.fluctate_24H && getValue(data.fluctate_24H, 'btcprice')} BTC 
                                                    (+{data.fluctate_rate_24H} %)
                                                    <ArrowDropUpIcon />
                                                </Box>
                                            </TableCell>
                                        ) : (( (data.fluctate_rate_24H === 0 || data.fluctate_rate_24H === '0.00') ? (
                                                <TableCell align="right"  style={{ width: "30%"}}>
                                                    <Box display="flex" justifyContent="flex-end">
                                                        0.00000000 BTC 
                                                        (0.00 %)
                                                        <ArrowDropDownIcon />
                                                    </Box>
                                                </TableCell>
                                            ) : (
                                                <TableCell className="color_blu" align="right"  style={{ width: "30%"}}>
                                                    <Box display="flex" justifyContent="flex-end">
                                                        {data.fluctate_24H && getValue(data.fluctate_24H, 'btcprice')} BTC 
                                                        ({data.fluctate_rate_24H} %)
                                                        <ArrowDropDownIcon />
                                                    </Box>
                                                </TableCell>
                                            )
                                        ))}
                                        <TableCell align="right"  style={{ width: "20%"}}>
                                            {data.acc_trade_value_24H && getValue(data.acc_trade_value_24H, 'trade_price')} BTC
                                        </TableCell>
                                        <TableCell align="center" style={{ width: "5%"}}>
                                            <VerticalAlignBottomIcon style={{color:"#46C0E9", width:"18px"}}/>
                                        </TableCell>
                                        <TableCell align="center" style={{ width: "5%"}}>
                                            <VerticalAlignTopIcon style={{color:"#46C0E9", width:"18px"}}/>
                                        </TableCell>
                                        <TableCell align="center" style={{ width: "5%"}}>
                                            <MovingIcon style={{color:"#46C0E9", width:"18px"}}/>
                                        </TableCell>
                                        <TableCell align="center" style={{ width: "5%"}}>
                                            <SyncAltIcon style={{color:"#46C0E9", width:"18px"}}/>
                                        </TableCell>
                                    </TableRow>
                                </>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
}

export default BTCMarket;


