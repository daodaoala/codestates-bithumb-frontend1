import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './../../App.css';


const Top5Market = ( {tickerList} ) => {
	const [topFiveList, setTopFiveList] = useState([]);     // TOP 5 리스트   

    useEffect(() => {
		getTopFiveTickers(tickerList)
	}, [tickerList])
  
    // Top 5 마켓 변동률 리스트 구하기
    const getTopFiveTickers = ( tickerList ) => {
        // const fiveTicker = [...tickerList].sort((a,b) => Math.abs(b.fluctate_rate_24H) - Math.abs(a.fluctate_rate_24H)).splice(0, 5)
        const fiveTicker = [...tickerList].sort((a,b) => b.fluctate_rate_24H - a.fluctate_rate_24H).splice(0, 5)
		setTopFiveList(fiveTicker)
	}

    // 유형에 따라 값 형식표시
    const getValue = (value, type) => {
        try {
            if( type === 'price') {
                return value.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
            }
        } catch (e) {
            return '';
        }
    }

    return (
        <>
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
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
}

export default Top5Market;

