import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ContractDetail from './ContractDetail';
import WorldMarket from'./WorldMarket';
import Quote from'./Quote';
import './../../App.css'
import { Chart1 as ChartJS } from 'chart.js/auto'
import { Chart1 , Line } from "react-chartjs-2";


const CoinInfo = () => {
    const [value, setValue] = useState(1);
    const [value1, setValue1] = useState(3);
    const [socketConnected, setSocketConnected] = useState(false);
    const [sendMsg, setSendMsg] = useState(false);
    const [tickerList, setTickerList] = useState([]); //현재가 데이터 리스트
    const [price, setPrice] = useState();
    const [highPrice, setHighPrice] = useState();
    const [lowPrice, setLowPrice] = useState();
    const [lineHighData, setLineHighData] = useState([]);
    const [lineLowData, setLineLowData] = useState([]);
    const [startPrice, setStartPrice] = useState([]);
    const [closePrice, setClosePrice] = useState([]);
    const [prevClosePrice, setPrevClosePrice] = useState(); //전일종가
    const [volumePower, setVolumePower] = useState();
    const [valuePrice, setValuePrice] = useState();
    const [volume, setVolume] = useState();
    const [chgRate, setChgRate] = useState();
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
                type: "ticker",
                symbols: [ "BTC_KRW" ],
                tickTypes: [ "1H" ],
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
            console.log("data",data)
            setTickerList((prevItems) => [...prevItems, data]);
            setPrice(data.content.closePrice.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'))
            setVolumePower(data.content.volumePower)
            setHighPrice(data.content.highPrice.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'))
            setLowPrice(data.content.lowPrice.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'))
            setPrevClosePrice(data.content.prevClosePrice.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'))
            setValuePrice(data.content.value.substr(0,5).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'))
            setVolume(data.content.volume.substr(0,10).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'))
            setChgRate(data.content.chgRate)
            lineHighData.push(data.content.highPrice)
            lineLowData.push(data.content.lowPrice)
            closePrice.push(data.content.closePrice)
            startPrice.push(data.content.openPrice)
        }};
    }, [sendMsg])

    const data = {
        labels: ["00:00","01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00","24:00"],
        datasets: [
          {
            label: "시가",
            data: startPrice,
            fill: false,
            borderColor: "#36A2EB"
          },
          {
            label: "종가",
            data: closePrice,
            fill: false,
            borderColor: "#FFCD56"
          },
          {
            label: "저가(1H)",
            data: lineLowData,
            fill: false,
            borderColor: "#4BC0C0"
          },
          {
            label: "고가(1H)",
            data: lineHighData,
            fill: false,
            borderColor: "red"
          },
        ]
    };

    //미니차트
    const data1 = {
        width: '360px',
        responsive: true,
        labels: ["00:00","01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00","24:00"],
        datasets: [{
            data: startPrice,
            fill: true,
            borderColor: "#8EB7F4",
            borderRadius: 4,
            backgroundColor:"rgba(189, 213, 249, 0.7)",
            borderWidth: 1,
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
                                    display:true 
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
                        elements: {
                            point:{
                                radius: 0
                            },
                        },
                        width: '360px',
                        responsive: true,
                    }}
                />
            </>
        )
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <span className="title">비트코인</span>
            <span className="w_title">BTC /KRW</span>
            <Box className="myAssets" display="flex" justifyContent="space-between">                 
                <Box>자산</Box>
                <Box>BTC 사용가능 &nbsp;<b className='color_bla'>0.00000000 </b> / 사용중 &nbsp; <b className='color_bla'>0.00000000 </b>&nbsp; <a href="#" className={clsx('color_org','bold')}>BTC 입금</a></Box>
                <Box>KRW 사용가능 &nbsp;<b className='color_bla'>0 </b> / 사용중&nbsp;<b className='color_bla'>0 </b> &nbsp; <a href="#" className={clsx('color_org','bold')}>KRW 입금</a></Box>    
            </Box>
            <Box className='chart-page'>
                <Paper>
                     <Line data={data} />
                </Paper>
            </Box>
            <Box className='ct'>
                <Grid container spacing={1}>
                    <Grid item xs={4} md={3}>
                        <Box className='info_con'>
                            <span className={clsx(chgRate > 0 ? "color_red":"color_blu","current_price")}>{price}</span>
                            {chgRate > 0 ?
                                <span className="info_hd">+{chgRate}% </span> :
                                <span className="info_hd_minus">{chgRate}% </span>  
                            }   
                        </Box>
                        <Box className='tb_List'>
                            <Box className='tb_List_L'>
                                <Box>
                                    <p>거래량(24H)</p>
                                    <p>거래금액(24H)</p>
                                    <p>체결강도</p>
                                </Box>
                                <Box style={{textAlign:"right"}}>
                                    <p className={clsx('color_bla','bold')}>{volume} BTC</p>
                                    <p className={clsx('color_bla','bold')}>{valuePrice} 억</p>
                                    <p className={clsx('color_red','bold')}>{volumePower}%</p>
                                </Box>
                            </Box>
                            <Box className='tb_List_R'>
                                <Box>
                                    <p>고가(1H)</p>
                                    <p>저가(1H)</p>
                                    <p>전일종가</p>
                                </Box>
                                <Box>
                                    <p className={clsx('color_bla','bold')}>{highPrice}</p>
                                    <p className={clsx('color_bla','bold')}>{lowPrice}</p>
                                    <p className={clsx('color_bla','bold')}>{prevClosePrice}</p>
                                </Box>
                            </Box>
                        </Box>

                        <Box display="flex" justifyContent="space-between" mt="20px" sx={{ width:"360px"}}>
                            <Box display="flex">
                                <Box className={clsx('tab1', value===1 && "clickedTab" )} onClick={()=>setValue(1)}>차트</Box>
                                <Box className={clsx('tab2', value===2 && "clickedTab" )} onClick={()=>setValue(2)}>BTC정보</Box>
                            </Box> 
                            <Box display="flex">
                                <Box sx={{ fontSize:"12px", fontWeight:800, color:"#ff8435", cursor:"pointer", margin: "0 10px" }}>주문/거래현황</Box>
                                <Box sx={{ fontSize:"12px", fontWeight:800, color:"#ff8435", cursor:"pointer", marginLeft: "10px"}}>팝업차트</Box>
                            </Box> 
                        </Box>
                        <Paper style={{width:"360px" ,borderTop:"1px solid #a4a4a4"}}>
                            {value===1 && (
                                <>
                                <Box sx={{height:"200px"}}>
                                    {renderLine( data1 )}
                                </Box>
                                <Box display="flex" sx={{ width:"360px"}}>
                                    <Box className={clsx('tab3', value1===3 && "clickedTab" )} onClick={()=>setValue1(3)}>체결내역</Box>
                                    <Box className={clsx('tab3', value1===4 && "clickedTab" )} onClick={()=>setValue1(4)}>세계시세</Box>
                                </Box>
                                <Paper style={{width:"360px" ,borderTop:"1px solid #a4a4a4"}}>
                                    {value1===3 && <ContractDetail />}
                                    {value1===4 && <WorldMarket />}
                                </Paper>
                                </>
                            )}
                            {value===2 && <WorldMarket />}
                        </Paper>
                    </Grid>

                    {/* 호가창 */}
                    <Grid item xs={4} md={9}>
                        <Box className='arcList'>
                            <Quote openPrice={startPrice}/>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

        </Box>
    )
}

export default CoinInfo;