import { PlurkDto } from '@/dto/Plurk.dto';
import { PlurkUserDto } from '@/dto/PlurkUser.dto';
import { SearchResponseDto } from '@/dto/SearchResponse.dto';
import { PlurkType } from '../../dto/PlurkType.enum';

const MAX_PLURK = 20;
const MIN_PLURK = 0;

function genPlurkUser(): PlurkUserDto {
  const id = Math.floor(Math.random() * 100000);
  const nickName = 'plurkoffice';
  const displayName = '噗浪辦公室';

  return new PlurkUserDto({
    id, nickName, displayName,
  });
}

function genPlurk(): PlurkDto {
  const id = Math.floor(Math.random() * 100000);
  const link = 'https://www.plurk.com/p/pcf3cu';
  const owner = genPlurkUser();
  const plurkType = PlurkType[Math.floor(Math.random() * Object.keys(PlurkType).length)];
  const content = '[emo998] **2023 全新商品系列與夏季特賣會隆重登場** [emo999] \n https://images.plurk.com/27jI7NYbXY3ZK6OfjrG9WQ.jpg https://images.plurk.com/2eWhbbn38tlsNMby4IbZor.jpg https://images.plurk.com/1WpuMTEEHwgWZ6Chlrx6NP.jpg \n [emo1007] 即日起至 9/20，是噗浪久違的夏季特賣 [emo1008] \n 這一次我們與超優質的台灣設計品牌－－https://www.monkey-design.com.tw/ (猴子設計)合作，打造多款實用小物，全部只在噗浪商店才買得到喔！ \n 此外，舊有商品系列更有全面九折優惠。單筆訂單滿額加贈噗幣兌換實體卡 [emo1004] \n 快來一探究竟吧 [emo279] [emo279] [emo279]';
  const contentHtml = '<img class="emoticon_my" src="https://emos.plurk.com/9773aac3a2cb3125a1661be25d5b292f_w38_h18.gif" width="38" height="18">  <b>2023 全新商品系列與夏季特賣會隆重登場</b>  <img class="emoticon_my" src="https://emos.plurk.com/2a568d09a1ae1ea6aa34ba922a44a5f2_w16_h18.gif" width="16" height="18"><br /><br class="double-br" /><a href="https://images.plurk.com/27jI7NYbXY3ZK6OfjrG9WQ.jpg" class="ex_link pictureservices" rel="nofollow"><img src="https://images.plurk.com/mx_27jI7NYbXY3ZK6OfjrG9WQ.jpg" alt="https://images.plurk.com/27jI7NYbXY3ZK6OfjrG9WQ.jpg" height="48"></a> <a href="https://images.plurk.com/2eWhbbn38tlsNMby4IbZor.jpg" class="ex_link pictureservices" rel="nofollow"><img src="https://images.plurk.com/mx_2eWhbbn38tlsNMby4IbZor.jpg" alt="https://images.plurk.com/2eWhbbn38tlsNMby4IbZor.jpg" height="48"></a> <a href="https://images.plurk.com/1WpuMTEEHwgWZ6Chlrx6NP.jpg" class="ex_link pictureservices" rel="nofollow"><img src="https://images.plurk.com/mx_1WpuMTEEHwgWZ6Chlrx6NP.jpg" alt="https://images.plurk.com/1WpuMTEEHwgWZ6Chlrx6NP.jpg" height="48"></a><br /><br class="double-br" /><img class="emoticon_my" src="https://emos.plurk.com/8eec8377694c8f2e5781e652bc4e30e3_w24_h24.gif" width="24" height="24">  即日起至 9/20，是噗浪久違的夏季特賣  <img class="emoticon_my" src="https://emos.plurk.com/df2c91cde052e53afd39e5a63754c3d2_w24_h24.gif" width="24" height="24"><br /><br class="double-br" />這一次我們與超優質的台灣設計品牌－－<a href="https://www.monkey-design.com.tw/" class="ex_link" rel="nofollow" target="_blank">猴子設計</a>合作，打造多款實用小物，全部只在噗浪商店才買得到喔！<br /><br class="double-br" />此外，舊有商品系列更有全面九折優惠。單筆訂單滿額加贈噗幣兌換實體卡  <img class="emoticon_my" src="https://emos.plurk.com/94c409f0f08db1e38ccbc76bde5a0cf0_w24_h24.gif" width="24" height="24"><br /><br class="double-br" />快來一探究竟吧  <img class="emoticon_my" src="https://emos.plurk.com/8245fd0f092566a24abeaad2726b7968_w20_h20.gif" width="20" height="20">   <img class="emoticon_my" src="https://emos.plurk.com/8245fd0f092566a24abeaad2726b7968_w20_h20.gif" width="20" height="20">   <img class="emoticon_my" src="https://emos.plurk.com/8245fd0f092566a24abeaad2726b7968_w20_h20.gif" width="20" height="20">';
  const postTime = '2023-08-01T01:32:35.000Z';
  const lastEditTime = '2023-08-03T01:32:35.000Z';

  return new PlurkDto({
    id,
    link,
    ownerId: owner.id,
    owner,
    plurkType,
    content,
    contentHtml,
    postTime,
    lastEditTime,
  });
}

function genData(): SearchResponseDto {
  const request = { query: 'search query', filter: 1 };
  const plurkCnt = MIN_PLURK + Math.floor(Math.random() * (MAX_PLURK - MIN_PLURK));
  const firstTimestampStr = '2023-08-01T01:32:35.000Z';
  const lastTimestampStr = '2023-08-07T01:32:35.000Z';
  const next = 'http://localhost/search?query=query&filter=MY&offset=2023-08-07T12:37:48.000Z';

  return new SearchResponseDto({
    request,
    plurks: Array(plurkCnt).fill(null).map(genPlurk),
    counts: plurkCnt,
    firstTimestampStr,
    lastTimestampStr,
    next,
  });
}

export default genData();
