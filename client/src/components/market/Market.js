import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Grid';
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
    const [marketBtn, setMarketBtn] = useState(1);          // 원화마켓 / BTC마켓 버튼
    const [time, setTime] = useState(2);                    // 변동률 select
    const [search, setSearch] = useState();                 // 검색어
    const [favorites, setFavorites] = useState([]);         // 즐겨찾기한 코인 리스트
    const [favoriteIcon, setFavoriteIcon] = useState([]);   // 즐겨찾기 아이콘 리스트
    const [tickers, setTickers] = useState([]);             // api로 받아온 KRW 데이터 리스트 객체
    const [tickerList, setTickerList] = useState([]);       // api로 받아온 KRW 데이터 리스트 객체 -> 배열
	const [topFiveList, setTopFiveList] = useState([]);     // TOP 5 리스트   
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
        }, 3000);
    }, [])

	useEffect(() => {
		createArr(tickers, setTickerList)
        if(favorites.length){
            updateFavoriteList(tickerList, favoriteIcon)
        }
	}, [tickers])

    useEffect(() => {
		getTopFiveTickers(tickerList)
	}, [tickerList])

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

    // Top 5 마켓 변동률 리스트 구하기
    const getTopFiveTickers = ( tickerList ) => {
        // const fiveTicker = [...tickerList].sort((a,b) => Math.abs(b.fluctate_rate_24H) - Math.abs(a.fluctate_rate_24H)).splice(0, 5)
        const fiveTicker = [...tickerList].sort((a,b) => b.fluctate_rate_24H - a.fluctate_rate_24H).splice(0, 5)
		setTopFiveList(fiveTicker)
	}

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

    const getCoinName = (value) => {
        // var coin = coins.filter( function (o) {
        //     // console.log(o.symbol, value)
        //     return o.symbol === value
        // })
        // console.log("coin",coin)
        // return coin[0].name
    }

    return (
        <>
            <Box>
                <Box display="flex" justifyContent="center" style={{padding:"36px 0 10px", textAlign:"center"}}>
                    <Box className='top5_area'>마켓 변동률 TOP5</Box>
                    <Box className={clsx('top5_market_tab1', marketBtn===1 && 'click_top5_market')} onClick={()=>setMarketBtn(1)}>원화 마켓</Box>
                    <Box className={clsx('top5_market_tab2', marketBtn===2 && 'click_top5_market')}  onClick={()=>setMarketBtn(2)}>BTC 마켓</Box>
                </Box>
                <Box className='top5-content-wrap'>
                    <Grid container spacing={1}>
                        {topFiveList && topFiveList.map((data,i) => (
                            <Grid item xs={2.4}>
                                <Paper>
                                    <Box className='top5_name'>{data.name}</Box>
                                    { data.fluctate_rate_24H > 0 ? (
                                        <>
                                            <Box className={clsx('top5_price', 'color_red')}>{data.closing_price && getValue( data.closing_price , 'price' )}</Box>
                                            <Box className={clsx('top5_rate', 'color_red')}>
                                                <ArrowDropDownIcon style={{ margin: "8px 0 -8px", fontSize:"27px" }}/>
                                                + {data.fluctate_rate_24H} %
                                            </Box>
                                        </>
                                    ) : (
                                        <>
                                            <Box className={clsx('top5_price', 'color_blu')}>{data.closing_price && getValue( data.closing_price , 'price' )}</Box>
                                            <Box className={clsx('top5_rate', 'color_blu')}>
                                                <ArrowDropDownIcon style={{ margin: "8px 0 -8px", fontSize:"27px" }}/>
                                                 {data.fluctate_rate_24H} %
                                            </Box>
                                        </>
                                    )}
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
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
                        </Search>
                    </Box>
                </Box>

                { value !== 4 && (
                <Paper style={{width:"1200px" ,borderTop:"1px solid #F2F2F2", margin:"0 0 70px 0" }}>
                    <Box display="flex" p="16px 0">
                        <Box className={clsx('price_head', headValue===1 && 'click_price_head')} onClick={()=>setHeadValue(1)}>전체 {tickerList.length}</Box>
                        <Box className={clsx('price_head', headValue===2 && 'click_price_head')} onClick={()=>setHeadValue(2)}>메이저 10</Box>
                        <Box className={clsx('price_head', headValue===3 && 'click_price_head')} onClick={()=>setHeadValue(3)}>일반 175</Box>
                        <Box className={clsx('price_head', headValue===4 && 'click_price_head')} onClick={()=>setHeadValue(4)}>신규 6</Box>
                        <Box className={clsx('price_head', headValue===5 && 'click_price_head')} onClick={()=>setHeadValue(5)}>투자유의 7</Box>
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
                                {tickerList && tickerList.map((data, i)=>(
                                    <>
                                      <TableRow key={data.id}>
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
                                                    {data.fluctate_24H && getValue(data.fluctate_24H, 'fluctate')} 원 
                                                    (+{data.fluctate_rate_24H} %)
                                                    <ArrowDropUpIcon style={{margin:"8px 0 -8px", fontSize:"27px"}}/>
                                                </TableCell>
                                            ) : (
                                                <TableCell className="color_blu" align="right"  style={{ width: "30%"}}>
                                                    {data.fluctate_24H && getValue(data.fluctate_24H, 'fluctate')} 원 
                                                    ({data.fluctate_rate_24H} %)
                                                    <ArrowDropDownIcon style={{margin:"8px 0 -8px", fontSize:"27px"}}/>
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
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
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
                                                    <TableCell className= "color_red" align="right" style={{ width: "30%"}}>
                                                        {data.fluctate_24H && getValue(data.fluctate_24H, 'fluctate')} 원 
                                                        (+{data.fluctate_rate_24H} %)
                                                        <ArrowDropUpIcon style={{margin:"8px 0 -8px", fontSize:"27px"}}/>
                                                    </TableCell>
                                                ) : (
                                                    <TableCell className="color_blu" align="right" style={{ width: "20%"}}>
                                                        {data.fluctate_24H && getValue(data.fluctate_24H, 'fluctate')} 원 
                                                        ({data.fluctate_rate_24H} %)
                                                        <ArrowDropDownIcon style={{margin:"8px 0 -8px", fontSize:"27px"}}/>
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
                )}
            </Box>
        </>
    );
}

export default Market;

