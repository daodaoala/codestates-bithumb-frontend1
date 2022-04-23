import React from 'react';
import AppBar from "@mui/material/AppBar";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const MenuFooter = () => {
    
    return (
        <>
        <AppBar position="static" className="footerBar">
          <Container>
            <Box display="flex" justifyContent="space-between" style={{margin:"55px 50px 20px"}}>
                <Box mt="-10px">
                    <img src="./img/footerlogo.png" />
                    <Box className="footerInfo">가상자산의 가치 변동으로 인한 손실 발<br/>생 가능성 등을 유념하시어 무리한 투자<br/>는 지양 하십시오.</Box>
                </Box>
                <Box>
                  <Box mb="20px" className="footerTitle">회사정보</Box>
                  <Box className="footerInfo">회사소개</Box>
                  <Box className="footerInfo">빗썸스토리</Box>
                  <Box className="footerInfo">채용안내</Box>
                  <Box className="footerInfo">재무보고서</Box>
                </Box>  
                <Box>
                  <Box mb="20px" className="footerTitle">고객지원</Box>
                  <Box className="footerInfo">빗썸 이용안내</Box>
                  <Box className="footerInfo">1:1 문의하기</Box>
                  <Box className="footerInfo">증빙센터</Box>
                  <Box className="footerInfo">수수료 안내</Box>
                  <Box className="footerInfo">이용약관</Box>
                  <Box className="footerInfo">빗썸API 이용약관</Box>
                  <Box className="footerInfo">빗썸프라임 이용약관</Box>
                  <Box className="footerInfo1">개인정보 처리방침</Box>
                  <Box className="footerInfo1">상장 안내</Box>
                </Box>   
                <Box>
                  <Box mb="20px" className="footerTitle">연락처</Box>
                  <Box className="footerInfo">전화상담 : <b className='color_whi'>1661-5566 (365일 운영시간 08:00~23:00 / 심야긴급상담 : 23:00~08:00)</b></Box>
                  <Box className="footerInfo">상장 문의 : <b className='color_whi'>listing@bithumbcorp.com</b></Box>
                  <Box className="footerInfo">제휴 문의 : <b className='color_whi'>partnership@bithumbcorp.com</b></Box>
                  <Box className="footerInfo">제보 채널 : <b className='color_whi'>whistle@bithumbcorp.com</b></Box>
                  <Box className="footerInfo">고객센터 :   서울특별시 서초구 강남대로 489 이니셜타워1 1~2층 (지번 : 반포동 737-10)<br/>
                                                        운영시간 : 평일 오전 10시 00분 ~ 오후 6시 00분 (토,일 공휴일 제외)</Box>
                  <Box className="footerInfo">카카오톡 상담 : <b className='color_whi'>@빗썸(챗봇 상담)</b></Box>
                </Box>  
            </Box>
            <Box className='footerLine'></Box> 
            <Box display="flex" justifyContent="space-between" style={{margin:"0 25px", padding:"0 10px 10px" }}>
              <Box className="footerInfo2">
                주식회사 빗썸코리아 | 서울특별시 강남구 테헤란로 124, 15~16층 (역삼동, 삼원타워) | 대표이사 허백영 | 사업자등록번호 220-88-71844
              </Box>
              <Box className="footerInfo2">
                Copyrightⓒ Bithumb. All rights reserved.
              </Box>
            </Box>
          </Container>
        </AppBar>            
        </>
    );
}

export default MenuFooter;