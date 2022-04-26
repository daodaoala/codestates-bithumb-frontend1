import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Chart1 as ChartJS } from 'chart.js/auto'
import { Chart1 , Line } from "react-chartjs-2";
import './../../App.css';


const Top5Market = ( {tickerList} ) => {
    const [marketBtn, setMarketBtn] = useState(1);          // 원화마켓 / BTC마켓 버튼
	const [topFiveList, setTopFiveList] = useState([]);     // TOP 5 리스트   
    const [topFiveBtcList, setTopFiveBtcList] = useState([]);     // TOP 5 리스트   
    const [btcList, setBtcList] = useState([]); 
    const [btcTickerList, setBtcTickerList] = useState([]); 
    const [chartList1, setChartList1] = useState([]); 

    useEffect(() => {
        getChangeChart();
    }, []);

    useEffect(() => {
		getTopFiveTickers(tickerList)
	}, [tickerList])

    useEffect(() => {
		getTopFiveBtcTickers(btcTickerList)
	}, [btcTickerList])

    useEffect(() => {
        if( marketBtn === 1) {
		    getTickersBTC()
            setInterval(() => {
                getTickersBTC();
            }, 5000);
        }
	}, [])

    useEffect(() => {
		createArr(btcList, setBtcTickerList)
	}, [btcList])
  
    // Top 5 원화마켓 변동률 리스트 구하기
    const getTopFiveTickers = ( tickerList ) => {
        // const fiveTicker = [...tickerList].sort((a,b) => Math.abs(b.fluctate_rate_24H) - Math.abs(a.fluctate_rate_24H)).splice(0, 5)
        const fiveTicker = [...tickerList].sort((a,b) => b.fluctate_rate_24H - a.fluctate_rate_24H).splice(0, 5)
		setTopFiveList(fiveTicker)
	}

    // Top 5 BTC마켓 변동률 리스트 구하기
    const getTopFiveBtcTickers = ( btcTickerList ) => {
        const fiveTicker = [...btcTickerList].sort((a,b) => b.fluctate_rate_24H - a.fluctate_rate_24H).splice(0, 5)
		setTopFiveBtcList(fiveTicker)
	}


    //BTC 코인 시세 호출 API
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

    const getChangeChart = async() => {
        try {
            const orderCurrency = 'CSPR';
            const paymentCurrency = 'KRW';
            const chartIntervals = '24h';
            const response = await axios.get(`https://api.bithumb.com/public/candlestick/${orderCurrency}_${paymentCurrency}/${chartIntervals}`);
            response.data.data.map((data) => (
                chartList1.push(data[2])
            ))
        } catch (e) {
            console.log("에러", e);
        }
    }
  
    //객체 배열로 변환
    const createArr = ( btcList, setBtcTickerList ) => {
        setBtcTickerList(Object.keys(btcList).map((name) => ({name, ...btcList[name]})));
    }

    // 유형에 따라 값 형식표시
    const getValue = (value, type) => {
        try {
            if( type === 'price') {
                return value.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
            } else if( type === 'btc-price'){
                return parseFloat(value).toFixed(8)
            }
        } catch (e) {
            return '';
        }
    }

    //미니차트
    const data1 = {
        width: '200px',
        responsive: true,
        labels: ["00:00","01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00","24:00"],
        datasets: [{
            data: chartList1,
            fill: true,
            borderColor: "#E9E9E9",
            backgroundColor:"rgba(249, 249, 249, 0.7)",
        }],
    };

    function renderLine(data1) {   
        return (
            <>
                <Line
                    data={data1} 
                    options={{
                        scales: {
                            x: {
                                grid: {
                                  display: false,
                                  drawOnChartArea:false
                                },
                                scaleLabel:{
                                    display: false
                                },
                                ticks: {
                                    display:false 
                                }
                            },
                            y: {
                                grid: {
                                  display: false,
                                  drawOnChartArea:false
                                },
                                scaleLabel:{
                                    display: false
                                },
                                ticks: {
                                    display:false 
                                },
                                gridLines: {
                                    display:false,
                                },
                                borders:{
                                    borderColor:"white"
                                }
                            },
                        },
                        plugins: {
                            legend: {
                                display: false, 
                            },
                        },
                        width: '200px',
                        responsive: true,
                    }}
                />
            </>
        )
    };
    return (
        <>
            <Box display="flex" justifyContent="center" style={{padding:"36px 0 10px", textAlign:"center"}}>
                <Box className='top5_area'>마켓 변동률 TOP5</Box>
                <Box className={clsx('top5_market_tab1', marketBtn===1 && 'click_top5_market')} onClick={()=>setMarketBtn(1)}>원화 마켓</Box>
                <Box className={clsx('top5_market_tab2', marketBtn===2 && 'click_top5_market')}  onClick={()=>setMarketBtn(2)}>BTC 마켓</Box>
            </Box>       
            { marketBtn === 1 && 
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
                                                <ArrowDropUpIcon style={{ margin: "8px 0 -8px", fontSize:"27px" }}/>
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
                                    <Box ml="-10px" sx={{height:"116px",width:"220px"}}>
                                        {renderLine( data1 )}
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            }

            { marketBtn === 2 && 
                <Box className='top5-content-wrap'>
                    <Grid container spacing={1}>
                        {topFiveBtcList && topFiveBtcList.map((data,i) => (
                            <Grid item xs={2.4}>
                                <Paper>
                                    <Box className='top5_name'>{data.name}</Box>
                                    { data.fluctate_rate_24H > 0 ? (
                                        <>
                                            <Box className={clsx('top5_price', 'color_red')}>{data.closing_price && getValue( data.closing_price , 'btc-price' )}</Box>
                                            <Box className={clsx('top5_rate', 'color_red')}>
                                                <ArrowDropUpIcon style={{ margin: "8px 0 -8px", fontSize:"27px" }}/>
                                                + {data.fluctate_rate_24H} %
                                            </Box>
                                        </>
                                        ) : (
                                        <>
                                            <Box className={clsx('top5_price', 'color_blu')}>{data.closing_price && getValue( data.closing_price , 'btc-price' )}</Box>
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
            }
        </>
    );
}

export default Top5Market;

