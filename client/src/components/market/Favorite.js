import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import MovingIcon from '@mui/icons-material/Moving';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import CancelIcon from '@mui/icons-material/Cancel';
import coins from './Coins';
import './../../App.css';


const Favorite = () => {
    const [value, setValue] = useState(1);
    const [headValue, setHeadValue] = useState(1);
    const [time, setTime] = useState(2);                    // 변동률 select
    const [search, setSearch] = useState();                 // 검색어
    const [searchList, setSearchList] = useState([]);       // 검색어 리스트
    const [favorites, setFavorites] = useState([]);         // 즐겨찾기한 코인 리스트
    const [favoriteIcon, setFavoriteIcon] = useState([]);   // 즐겨찾기 아이콘 리스트
    const [tickers, setTickers] = useState([]);             // api로 받아온 KRW 데이터 리스트 객체
    const [tickerList, setTickerList] = useState([]);       // api로 받아온 KRW 데이터 리스트 객체 -> 배열
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    let history = useHistory();
  
    const handleChangePage = ( newPage ) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = ( event ) => {
      setRowsPerPage( +event.target.value );
      setPage(0);
    };    

    // 즐겨찾기 실시간 시세 업데이트
    const updateFavoriteList = ( tickerList, favoriteIcon ) => {
        const favoriteList = tickerList.filter(obj => favoriteIcon.includes(obj.name))
        setFavorites(favoriteList)
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
            if( type === 'price') {
                return value.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
            } else if ( type === 'fluctate' ) {
                return value.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
            } else if ( type === 'trade_price' ) {
                return parseInt(value).toFixed(0).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
            }
        } catch (e) {
            return '';
        }
    }

    return (
        <>
            <Paper style={{width:"1200px" ,borderTop:"1px solid #F2F2F2", margin:"0 0 85px 0"}}>
                <TableContainer className='scroll-hidden' sx={{ maxHeight: 700, maxWidth: 1200 }}>
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
                        {favorites.length ? (
                        <TableBody id="table_asset">
                            {(rowsPerPage > 0
                                ? favorites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : favorites
                            ).map((data,i)=>( 
                                <>
                                    <TableRow key={data.id}>
                                        <TableCell align="left" style={{ width: "4px"}} >
                                            <StarIcon className={clsx(favoriteIcon.includes(data.name) ? 'click_star_icon' : 'star_icon')} onClick={()=>includeFavorites(data, data.name)}/>
                                        </TableCell>
                                        <TableCell align="left">
                                            {data.name}
                                        </TableCell>
                                        <TableCell align="right" style={{ width: "20%"}}>
                                            {data.closing_price  && getValue(data.closing_price, 'price')} 원
                                        </TableCell>
                                        {data.fluctate_rate_24H > 0 ? (
                                            <TableCell className= "color_red" align="right"  style={{ width: "30%"}}>
                                                <Box display="flex" justifyContent="flex-end">
                                                    {data.fluctate_24H && getValue(data.fluctate_24H, 'fluctate')} 원 
                                                    (+{data.fluctate_rate_24H} %)
                                                    <ArrowDropUpIcon />
                                                </Box>
                                            </TableCell>
                                        ) : (
                                            <TableCell className="color_blu" align="right"  style={{ width: "30%"}}>
                                                <Box display="flex" justifyContent="flex-end">
                                                    {data.fluctate_24H && getValue(data.fluctate_24H, 'fluctate')} 원 
                                                    ({data.fluctate_rate_24H} %)
                                                    <ArrowDropDownIcon />
                                                </Box>
                                            </TableCell>
                                        )}
                                        <TableCell align="right" style={{ width: "20%"}}>
                                            ≈ {data.acc_trade_value_24H && getValue(data.acc_trade_value_24H, 'trade_price')} 원
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
                        ) : (
                            <>
                                <Box sx={{textAligh:"center"}}>즐겨찾기로 등록된 가상자산이 없습니다.</Box>
                            </>
                        )}
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10]}
                    component="div"
                    count={favorites.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </>
    );
}

export default Favorite;

