import React from 'react';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CoinInfo from './CoinInfo';

const useStyles = makeStyles((theme) => ({

}));

const Order = () => {
    const cls = useStyles();

    return (
        <Box sx={{ flexGrow: 1, paddingTop:"20px" }}>
            <Grid container spacing={1}>
                <Grid item xs={6} md={3}>
                    <Paper style={{backgrounColor:"#1A2027"}}></Paper>
                </Grid>
                <Grid item xs={6} md={9}>
                    <CoinInfo />
                </Grid>
            </Grid>
        </Box>
    )
}

export default Order;