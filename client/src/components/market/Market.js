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
import Top5Market from './Top5Market'
import BTCMarket from './BTCMarket'
import {coinName} from './Coins';
import './../../App.css';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    border: '1px solid #e5e5e5',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
    width: '260px',
    height: '40px',
    padding: '0 14px',
    marginTop: '10px'
}));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#848484'
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(3)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
    },
}));


const Market = () => {
    // const [state, setState] = useState(
    //     () => JSON.parse(window.localStorage.getItem("favorites")));
    const [value, setValue] = useState(1);
    const [headValue, setHeadValue] = useState(1);
    const [time, setTime] = useState(2);                        // 변동률 select
    const [search, setSearch] = useState();                     // 검색어
    const [searchList, setSearchList] = useState([]);           // 원화 마켓 검색어 리스트
    const [favorites, setFavorites] = useState([]);             // 즐겨찾기한 코인 리스트
    const [favoriteIcon, setFavoriteIcon] = useState([]);       // 즐겨찾기 아이콘 리스트
    const [tickers, setTickers] = useState([]);                 // api로 받아온 KRW 데이터 리스트 객체
    const [tickerList, setTickerList] = useState([]);           // api로 받아온 KRW 데이터 리스트 객체 -> 배열
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    let history = useHistory();
  
    const handleChangePage = ( event, newPage ) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = ( event ) => {
      setRowsPerPage( +event.target.value );
      setPage(0);
    };    

    useEffect(() => {
        getTickers();
        setInterval(() => {
            getTickers();
        }, 3000);
    }, [])

    // console.log("state",state)
	useEffect(() => {
		createArr(tickers, setTickerList)
        if(favorites.length){
            updateFavoriteList(tickerList, favoriteIcon)
        }
	}, [tickers])

    // 검색 기능
	useEffect(() => {
        setSearchList(tickerList.filter((data)=> data.name.includes(search.toUpperCase())))
        setFavorites(favorites.filter((data)=> data.name.includes(search.toUpperCase())))
    }, [search])


    //코인 시세 호출 API
    async function getTickers() {
        try {
            const orderCurrency = 'ALL';
            const paymentCurrency = 'KRW';
            const response = await axios.get(`https://api.bithumb.com/public/ticker/${orderCurrency}_${paymentCurrency}`);
            delete response.data.data.date;
            setTickers(response.data.data)
        } catch (e) {
            console.log("에러", e);
        }
    }
  
    //객체 배열로 변환
    const createArr = ( tickers, setTickerList ) => {
        setTickerList(Object.keys(tickers).map((name) => ({name, ...tickers[name]})));
    }

    // 즐겨찾기 실시간 시세 업데이트
    const updateFavoriteList = ( tickerList, favoriteIcon ) => {
        const favoriteList = tickerList.filter(obj => favoriteIcon.includes(obj.name))
        if( !search ){
            setFavorites(favoriteList)
        } 
        else {
            setFavorites(favoriteList.filter((data)=> data.name.includes(search.toUpperCase())))
        }
    }

    //즐겨찾기 추가 및 해제
    function includeFavorites( data, name ) {
        console.log("즐겨찾기", data, name)
        if( !favoriteIcon.includes(name) ) {
            setFavoriteIcon([...favoriteIcon, name])
            setFavorites([...favorites, data])
            // window.localStorage.setItem("favorites", data);
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
            <Box>
                <Top5Market tickerList={tickerList}/>
                <Box display="flex" justifyContent="space-between" sx={{ width:"1200px"}}>
                    <Box>
                        <Box className={clsx('tab_market', value===1 && 'click_tab_market')} onClick={()=>setValue(1)}>원화 마켓</Box>
                        <Box className={clsx('tab_market', value===2 && 'click_tab_market')} onClick={()=>setValue(2)}>BTC 마켓</Box>
                        <Box className={clsx('tab_market', value===3 && 'click_tab_market')} onClick={()=>setValue(3)}>보유자산</Box>
                        <Box className={clsx('tab_market', value===4 && 'click_tab_market')} onClick={()=>setValue(4)}>즐겨찾기</Box>
                    </Box>
                    <Box className="tab-market-search">
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="검색"
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={(e)=>setSearch(e.target.value)}
                            />
                            {/* <CancelIcon /> */}
                        </Search>
                    </Box>
                </Box>

                { (value !== 4 && value !== 2)  && (
                <Paper style={{width:"1200px" ,borderTop:"1px solid #F2F2F2", margin:"0 0 70px 0" }}>
                    <Box display="flex" p="16px 0">
                        <Box className={clsx('price_head', headValue===1 && 'click_price_head')} onClick={()=>setHeadValue(1)}>전체 {tickerList.length}</Box>
                        <Box className={clsx('price_head', headValue===2 && 'click_price_head')} onClick={()=>setHeadValue(2)}>메이저 10</Box>
                        <Box className={clsx('price_head', headValue===3 && 'click_price_head')} onClick={()=>setHeadValue(3)}>일반 178</Box>
                        <Box className={clsx('price_head', headValue===4 && 'click_price_head')} onClick={()=>setHeadValue(4)}>신규 4</Box>
                        <Box className={clsx('price_head', headValue===5 && 'click_price_head')} onClick={()=>setHeadValue(5)}>투자유의 8</Box>
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
                                {search ? (
                                    searchList && searchList.map((data)=>(
                                    <>
                                        <TableRow key="{data}">
                                            <TableCell align="left" style={{ width: "4px"}} >
                                                <StarIcon className={clsx(favoriteIcon.includes(data.name) ? 'click_star_icon' : 'star_icon')} onClick={()=>includeFavorites(data, data.name)}/>
                                            </TableCell>
                                            <TableCell align="left" onClick={()=>history.push("/trade/order/BTC_KRW")}>
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
                                            <TableCell align="right"  style={{ width: "20%"}}>
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
                                ))
                                ) : ( 
                                    tickerList && tickerList.map((data)=>(
                                    <>
                                      <TableRow key="{data}">
                                            <TableCell align="left" style={{ width: "4px"}} >
                                                <StarIcon className={clsx(favoriteIcon.includes(data.name) ? 'click_star_icon' : 'star_icon')} onClick={()=>includeFavorites(data, data.name)}/>
                                            </TableCell>
                                            <TableCell align="left" onClick={()=>history.push("/trade/order/BTC_KRW")}>
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
                                            <TableCell align="right"  style={{ width: "20%"}}>
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
                                )))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                )}

                { value === 2 && (
                    <BTCMarket tickerList={tickerList}/>
                )}

                {/* 즐겨찾기 */}
                { value === 4 && (
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
                                    ).map((data)=>( 
                                       <>
                                            <TableRow key="{data}">
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
                                        <TableRow>
                                            <TableCell align="left"></TableCell>
                                            <TableCell align="left"></TableCell>
                                            <TableCell align="right"></TableCell>
                                            <TableCell align="right">즐겨찾기한 가상자산이 없습니다.</TableCell>
                                            <TableCell align="left"></TableCell>
                                            <TableCell align="center"></TableCell>
                                            <TableCell align="center"></TableCell>
                                            <TableCell align="center"></TableCell>
                                            <TableCell align="center"></TableCell>
                                        </TableRow>
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
                )}
            </Box>
        </>
    );
}

export default Market;





  {/* { (search && searchFavorite.length) ? (
                                    <TableBody id="table_asset">
                                        {(rowsPerPage > 0
                                             ? searchFavorite.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                             : searchFavorite
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
                                        <Box sx={{textAligh:"center"}}>검색된 가상자산이 없습니다.</Box>
                                    </>
                                )}
                                   
                                { (!searchFavorite && favorites) ? (
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
                                )} */}

















                //                 {search ? (
                //                     searchFavorite && searchFavorite.map((data, i)=>(
                //                     <>
                //                         <TableRow key={data.id}>
                //                             <TableCell align="left" style={{ width: "4px"}} >
                //                                 <StarIcon className={clsx(favoriteIcon.includes(data.name) ? 'click_star_icon' : 'star_icon')} onClick={()=>includeFavorites(data, data.name)}/>
                //                             </TableCell>
                //                             <TableCell align="left" onClick={()=>history.push("/trade/order/BTC_KRW")}>
                //                                 {data.name}
                //                             </TableCell>
                //                             <TableCell align="right" style={{ width: "20%"}}>
                //                                 {data.closing_price  && getValue(data.closing_price, 'price')} 원
                //                             </TableCell>
                //                             {data.fluctate_rate_24H > 0 ? (
                //                                 <TableCell className= "color_red" align="right"  style={{ width: "30%"}}>
                //                                     <Box display="flex" justifyContent="flex-end">
                //                                         {data.fluctate_24H && getValue(data.fluctate_24H, 'fluctate')} 원 
                //                                         (+{data.fluctate_rate_24H} %)
                //                                         <ArrowDropUpIcon />
                //                                     </Box>
                //                                 </TableCell>
                //                             ) : (
                //                                 <TableCell className="color_blu" align="right"  style={{ width: "30%"}}>
                //                                     <Box display="flex" justifyContent="flex-end">
                //                                         {data.fluctate_24H && getValue(data.fluctate_24H, 'fluctate')} 원 
                //                                         ({data.fluctate_rate_24H} %)
                //                                         <ArrowDropDownIcon />
                //                                     </Box>
                //                                 </TableCell>
                //                             )}
                //                             <TableCell align="right"  style={{ width: "20%"}}>
                //                                 ≈ {data.acc_trade_value_24H && getValue(data.acc_trade_value_24H, 'trade_price')} 원
                //                             </TableCell>
                //                             <TableCell align="center" style={{ width: "5%"}}>
                //                                 <VerticalAlignBottomIcon style={{color:"#46C0E9", width:"18px"}}/>
                //                             </TableCell>
                //                             <TableCell align="center" style={{ width: "5%"}}>
                //                                 <VerticalAlignTopIcon style={{color:"#46C0E9", width:"18px"}}/>
                //                             </TableCell>
                //                             <TableCell align="center" style={{ width: "5%"}}>
                //                                 <MovingIcon style={{color:"#46C0E9", width:"18px"}}/>
                //                             </TableCell>
                //                             <TableCell align="center" style={{ width: "5%"}}>
                //                                 <SyncAltIcon style={{color:"#46C0E9", width:"18px"}}/>
                //                             </TableCell>
                //                         </TableRow>
                //                     </>
                //                 ))
                //                 ) : ( 
                //                     (rowsPerPage > 0
                //                         ? favorites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                //                         : favorites
                //                     ).map((data, i)=>(
                //                     <>
                //                       <TableRow key={data.id}>
                //                             <TableCell align="left" style={{ width: "4px"}} >
                //                                 <StarIcon className={clsx(favoriteIcon.includes(data.name) ? 'click_star_icon' : 'star_icon')} onClick={()=>includeFavorites(data, data.name)}/>
                //                             </TableCell>
                //                             <TableCell align="left" onClick={()=>history.push("/trade/order/BTC_KRW")}>
                //                                 {data.name}
                //                             </TableCell>
                //                             <TableCell align="right" style={{ width: "20%"}}>
                //                                 {data.closing_price  && getValue(data.closing_price, 'price')} 원
                //                             </TableCell>
                //                             {data.fluctate_rate_24H > 0 ? (
                //                                 <TableCell className= "color_red" align="right"  style={{ width: "30%"}}>
                //                                     <Box display="flex" justifyContent="flex-end">
                //                                         {data.fluctate_24H && getValue(data.fluctate_24H, 'fluctate')} 원 
                //                                         (+{data.fluctate_rate_24H} %)
                //                                         <ArrowDropUpIcon />
                //                                     </Box>
                //                                 </TableCell>
                //                             ) : (
                //                                 <TableCell className="color_blu" align="right"  style={{ width: "30%"}}>
                //                                     <Box display="flex" justifyContent="flex-end">
                //                                         {data.fluctate_24H && getValue(data.fluctate_24H, 'fluctate')} 원 
                //                                         ({data.fluctate_rate_24H} %)
                //                                         <ArrowDropDownIcon />
                //                                     </Box>
                //                                 </TableCell>
                //                             )}
                //                             <TableCell align="right"  style={{ width: "20%"}}>
                //                                 ≈ {data.acc_trade_value_24H && getValue(data.acc_trade_value_24H, 'trade_price')} 원
                //                             </TableCell>
                //                             <TableCell align="center" style={{ width: "5%"}}>
                //                                 <VerticalAlignBottomIcon style={{color:"#46C0E9", width:"18px"}}/>
                //                             </TableCell>
                //                             <TableCell align="center" style={{ width: "5%"}}>
                //                                 <VerticalAlignTopIcon style={{color:"#46C0E9", width:"18px"}}/>
                //                             </TableCell>
                //                             <TableCell align="center" style={{ width: "5%"}}>
                //                                 <MovingIcon style={{color:"#46C0E9", width:"18px"}}/>
                //                             </TableCell>
                //                             <TableCell align="center" style={{ width: "5%"}}>
                //                                 <SyncAltIcon style={{color:"#46C0E9", width:"18px"}}/>
                //                             </TableCell>
                //                       </TableRow>
                //                     </>
                //                 )))}
                //             </Table>
                //         </TableContainer>
                //         <TablePagination
                //             rowsPerPageOptions={[10]}
                //             component="div"
                //             count={favorites.length}
                //             rowsPerPage={rowsPerPage}
                //             page={page}
                //             onPageChange={handleChangePage}
                //             onRowsPerPageChange={handleChangeRowsPerPage}
                //         />
                //     </Paper>
                // )}