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
import coins from './Coins';
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
    const [value, setValue] = useState(1);
    const [headValue, setHeadValue] = useState(1);
    const [time, setTime] = useState(2);                    // ????????? select
    const [search, setSearch] = useState();                 // ?????????
    const [searchList, setSearchList] = useState([]);       // ????????? ?????????
    const [favorites, setFavorites] = useState([]);         // ??????????????? ?????? ?????????
    const [favoriteIcon, setFavoriteIcon] = useState([]);   // ???????????? ????????? ?????????
    const [tickers, setTickers] = useState([]);             // api??? ????????? KRW ????????? ????????? ??????
    const [tickerList, setTickerList] = useState([]);       // api??? ????????? KRW ????????? ????????? ?????? -> ??????
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

    useEffect(() => {
        getTickers();
        setInterval(() => {
            getTickers();
        }, 6000);
    }, [])

	useEffect(() => {
		createArr(tickers, setTickerList)
        if(favorites.length){
            updateFavoriteList(tickerList, favoriteIcon)
        }
	}, [tickers])

    // ?????? ??????
	useEffect(() => {
        setSearchList(tickerList.filter((data)=> data.name.includes(search.toUpperCase())))
    }, [search])


    //?????? ?????? ?????? API
    async function getTickers() {
        try {
            const orderCurrency = 'ALL';
            const paymentCurrency = 'KRW';
            const response = await axios.get(`https://api.bithumb.com/public/ticker/${orderCurrency}_${paymentCurrency}`);
            delete response.data.data.date;
            setTickers(response.data.data)
        } catch (e) {
            console.log("??????", e);
        }
    }
  
    //?????? ????????? ??????
    const createArr = ( tickers, setTickerList ) => {
        setTickerList(Object.keys(tickers).map((name) => ({name, ...tickers[name]})));
    }

    // ???????????? ????????? ?????? ????????????
    const updateFavoriteList = ( tickerList, favoriteIcon ) => {
        const favoriteList = tickerList.filter(obj => favoriteIcon.includes(obj.name))
        setFavorites(favoriteList)
    }

    //???????????? ?????? ??? ??????
    function includeFavorites( data, name ) {
        console.log("????????????", data, name)
        if( !favoriteIcon.includes(name) ) {
            setFavoriteIcon([...favoriteIcon, name])
            setFavorites([...favorites, data])
        }
        else {
            setFavoriteIcon(favoriteIcon.filter(icon => icon !== name));
            setFavorites(favorites.filter(favorites => favorites.name !== name));
        }
    }

    // ????????? ?????? ??? ????????????
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
                        <Box className={clsx('tab_market', value===1 && 'click_tab_market')} onClick={()=>setValue(1)}>?????? ??????</Box>
                        <Box className={clsx('tab_market', value===2 && 'click_tab_market')} onClick={()=>setValue(2)}>BTC ??????</Box>
                        <Box className={clsx('tab_market', value===3 && 'click_tab_market')} onClick={()=>setValue(3)}>????????????</Box>
                        <Box className={clsx('tab_market', value===4 && 'click_tab_market')} onClick={()=>setValue(4)}>????????????</Box>
                    </Box>
                    <Box className="tab-market-search">
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="??????"
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={(e)=>setSearch(e.target.value)}
                            />
                            {/* <CancelIcon /> */}
                        </Search>
                    </Box>
                </Box>

                { value !== 4 && (
                <Paper style={{width:"1200px" ,borderTop:"1px solid #F2F2F2", margin:"0 0 70px 0" }}>
                    <Box display="flex" p="16px 0">
                        <Box className={clsx('price_head', headValue===1 && 'click_price_head')} onClick={()=>setHeadValue(1)}>?????? {tickerList.length}</Box>
                        <Box className={clsx('price_head', headValue===2 && 'click_price_head')} onClick={()=>setHeadValue(2)}>????????? 10</Box>
                        <Box className={clsx('price_head', headValue===3 && 'click_price_head')} onClick={()=>setHeadValue(3)}>?????? 178</Box>
                        <Box className={clsx('price_head', headValue===4 && 'click_price_head')} onClick={()=>setHeadValue(4)}>?????? 4</Box>
                        <Box className={clsx('price_head', headValue===5 && 'click_price_head')} onClick={()=>setHeadValue(5)}>???????????? 8</Box>
                    </Box>
                    <TableContainer className="scroll-head" sx={{ maxHeight: 700, maxWidth: 1200 }}>
                        <Table stickyHeader aria-label="sticky table" size="small">
                            <TableHead id='market_tablehead'>
                                <TableRow>
                                    <TableCell align="left"> </TableCell>
                                    <TableCell align="left"><b>??????</b></TableCell>
                                    <TableCell align="right"><b>????????? ??????</b></TableCell>
                                    <TableCell align="right">
                                        <Box display="flex" justifyContent="right">
                                            <Box mt="3px" mr="5px">?????????</Box>
                                            <FormControl id="change_rate">
                                                <Select
                                                    value={time}
                                                >
                                                    <MenuItem value={1} style={{ fontSize:"11px", lineHeight: "25px", fontWeight: 500, padding: "0px 16px" }} >????????????</MenuItem>
                                                    <MenuItem value={2} style={{ fontSize:"11px", lineHeight: "25px", fontWeight: 500, padding: "0px 16px" }} >24??????</MenuItem>
                                                    <MenuItem value={3} style={{ fontSize:"11px", lineHeight: "25px", fontWeight: 500, padding: "0px 16px" }} >12??????</MenuItem>
                                                    <MenuItem value={4} style={{ fontSize:"11px", lineHeight: "25px", fontWeight: 500, padding: "0px 16px" }} >1??????</MenuItem>
                                                    <MenuItem value={5} style={{ fontSize:"11px", lineHeight: "25px", fontWeight: 500, padding: "0px 16px" }} >30???</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right"><b>????????????(24H)</b></TableCell>
                                    <TableCell align="center"><b>??????</b></TableCell>
                                    <TableCell align="center"><b>??????</b></TableCell>
                                    <TableCell align="center"><b>??????</b></TableCell>
                                    <TableCell align="center"><b>??????</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody id="table_asset">
                                {search ? (
                                    searchList && searchList.map((data, i)=>(
                                    <>
                                        <TableRow key={data.id}>
                                            <TableCell align="left" style={{ width: "4px"}} >
                                                <StarIcon className={clsx(favoriteIcon.includes(data.name) ? 'click_star_icon' : 'star_icon')} onClick={()=>includeFavorites(data, data.name)}/>
                                            </TableCell>
                                            <TableCell align="left" onClick={()=>history.push("/trade/order/BTC_KRW")}>
                                                {data.name}
                                            </TableCell>
                                            <TableCell align="right" style={{ width: "20%"}}>
                                                {data.closing_price  && getValue(data.closing_price, 'price')} ???
                                            </TableCell>
                                            {data.fluctate_rate_24H > 0 ? (
                                                <TableCell className= "color_red" align="right"  style={{ width: "30%"}}>
                                                    <Box display="flex" justifyContent="flex-end">
                                                        {data.fluctate_24H && getValue(data.fluctate_24H, 'fluctate')} ??? 
                                                        (+{data.fluctate_rate_24H} %)
                                                        <ArrowDropUpIcon />
                                                    </Box>
                                                </TableCell>
                                            ) : (
                                                <TableCell className="color_blu" align="right"  style={{ width: "30%"}}>
                                                    <Box display="flex" justifyContent="flex-end">
                                                        {data.fluctate_24H && getValue(data.fluctate_24H, 'fluctate')} ??? 
                                                        ({data.fluctate_rate_24H} %)
                                                        <ArrowDropDownIcon />
                                                    </Box>
                                                </TableCell>
                                            )}
                                            <TableCell align="right"  style={{ width: "20%"}}>
                                                ??? {data.acc_trade_value_24H && getValue(data.acc_trade_value_24H, 'trade_price')} ???
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
                                    tickerList && tickerList.map((data, i)=>(
                                    <>
                                      <TableRow key={data.id}>
                                            <TableCell align="left" style={{ width: "4px"}} >
                                                <StarIcon className={clsx(favoriteIcon.includes(data.name) ? 'click_star_icon' : 'star_icon')} onClick={()=>includeFavorites(data, data.name)}/>
                                            </TableCell>
                                            <TableCell align="left" onClick={()=>history.push("/trade/order/BTC_KRW")}>
                                                {data.name}
                                            </TableCell>
                                            <TableCell align="right" style={{ width: "20%"}}>
                                                {data.closing_price  && getValue(data.closing_price, 'price')} ???
                                            </TableCell>
                                            {data.fluctate_rate_24H > 0 ? (
                                                <TableCell className= "color_red" align="right"  style={{ width: "30%"}}>
                                                    <Box display="flex" justifyContent="flex-end">
                                                        {data.fluctate_24H && getValue(data.fluctate_24H, 'fluctate')} ??? 
                                                        (+{data.fluctate_rate_24H} %)
                                                        <ArrowDropUpIcon />
                                                    </Box>
                                                </TableCell>
                                            ) : (
                                                <TableCell className="color_blu" align="right"  style={{ width: "30%"}}>
                                                    <Box display="flex" justifyContent="flex-end">
                                                        {data.fluctate_24H && getValue(data.fluctate_24H, 'fluctate')} ??? 
                                                        ({data.fluctate_rate_24H} %)
                                                        <ArrowDropDownIcon />
                                                    </Box>
                                                </TableCell>
                                            )}
                                            <TableCell align="right"  style={{ width: "20%"}}>
                                                ??? {data.acc_trade_value_24H && getValue(data.acc_trade_value_24H, 'trade_price')} ???
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

                {/* ???????????? */}
                { value === 4 && (
                    <Paper style={{width:"1200px" ,borderTop:"1px solid #F2F2F2", margin:"0 0 85px 0"}}>
                        <TableContainer className='scroll-hidden' sx={{ maxHeight: 700, maxWidth: 1200 }}>
                            <Table stickyHeader aria-label="sticky table" size="small">
                                <TableHead id='market_tablehead'>
                                    <TableRow>
                                        <TableCell align="left"> </TableCell>
                                        <TableCell align="left"><b>??????</b></TableCell>
                                        <TableCell align="right"><b>????????? ??????</b></TableCell>
                                        <TableCell align="right">
                                            <Box display="flex" justifyContent="right">
                                                <Box mt="3px" mr="5px">?????????</Box>
                                                <FormControl id="change_rate">
                                                    <Select
                                                        value={time}
                                                    >
                                                        <MenuItem value={1} style={{ fontSize:"11px", lineHeight: "25px", fontWeight: 500, padding: "0px 16px" }} >????????????</MenuItem>
                                                        <MenuItem value={2} style={{ fontSize:"11px", lineHeight: "25px", fontWeight: 500, padding: "0px 16px" }} >24??????</MenuItem>
                                                        <MenuItem value={3} style={{ fontSize:"11px", lineHeight: "25px", fontWeight: 500, padding: "0px 16px" }} >12??????</MenuItem>
                                                        <MenuItem value={4} style={{ fontSize:"11px", lineHeight: "25px", fontWeight: 500, padding: "0px 16px" }} >1??????</MenuItem>
                                                        <MenuItem value={5} style={{ fontSize:"11px", lineHeight: "25px", fontWeight: 500, padding: "0px 16px" }} >30???</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right"><b>????????????(24H)</b></TableCell>
                                        <TableCell align="center"><b>??????</b></TableCell>
                                        <TableCell align="center"><b>??????</b></TableCell>
                                        <TableCell align="center"><b>??????</b></TableCell>
                                        <TableCell align="center"><b>??????</b></TableCell>
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
                                                    {data.closing_price  && getValue(data.closing_price, 'price')} ???
                                                </TableCell>
                                                {data.fluctate_rate_24H > 0 ? (
                                                    <TableCell className= "color_red" align="right"  style={{ width: "30%"}}>
                                                        <Box display="flex" justifyContent="flex-end">
                                                            {data.fluctate_24H && getValue(data.fluctate_24H, 'fluctate')} ??? 
                                                            (+{data.fluctate_rate_24H} %)
                                                            <ArrowDropUpIcon />
                                                        </Box>
                                                    </TableCell>
                                                ) : (
                                                    <TableCell className="color_blu" align="right"  style={{ width: "30%"}}>
                                                        <Box display="flex" justifyContent="flex-end">
                                                            {data.fluctate_24H && getValue(data.fluctate_24H, 'fluctate')} ??? 
                                                            ({data.fluctate_rate_24H} %)
                                                            <ArrowDropDownIcon />
                                                        </Box>
                                                    </TableCell>
                                                )}
                                                <TableCell align="right" style={{ width: "20%"}}>
                                                    ??? {data.acc_trade_value_24H && getValue(data.acc_trade_value_24H, 'trade_price')} ???
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
                                        <Box sx={{textAligh:"center"}}>??????????????? ????????? ??????????????? ????????????.</Box>
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

