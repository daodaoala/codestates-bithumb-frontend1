import React, { useState, useEffect, useRef } from 'react'
import { Route, useLocation } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Order from './chartService/Order'
import Market from './market/Market'

const useStyles = makeStyles((theme) => ({
    root:{
        marginTop:"110px", 
        padding: "0 100px", 
        minHeight: "calc( 100vh - 594px )",
        height:"auto",
        [theme.breakpoints.up('lg')]: {
            padding: "0 300px", 
        },
    }
}));

const Section = () => {
    const cls = useStyles();
    const location = useLocation();

    return (
        <Box className={cls.root} display="flex" justifyContent="center">
            <Route path="/" component={Market} exact/>
            <Route path="/trade/order/BTC_KRW" component={Order} exact/>  
        </Box>
    );

}

export default Section;