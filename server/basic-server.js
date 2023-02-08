const http = require('http');
const PORT = 4999;
const ip = 'localhost';
const express = require('express');
const app = express();
const cors = require('cors');

//express server를 이용했을 때 코드
//app.METHOD(PATH, HANDLER)
app.use(cors());

app.use(express.json({ strict: false })); //모든 요청에 json타입으로 파싱하게 설정
//POST 요청 등에 포함된 body(payload)를 구조화할 때(쉽게 얻어내고자 할 때)
//body parsing (js로 다룰 수 있게 json으로 변환) 가져오기
//strict:true가 기본값으로 배열과 객체만 받는다는 뜻임. 이를 false로 비활성화하여 Json.parse가 허용하는 모든 항목을 허용하게 해서 문자열도 parse시켜준다.
//const jsonParser = express.json({strict: false}); jsonParser를 깔지 않고도 use를 사용해서 작동시킬 수 있다.


// 모든 요청시(app.use()) 콘솔에 http메서드, url 찍는 용도
app.use((req, res, next) => {
  const { method, url } = req; // 구조분해할당
  //const method = request.method;
  //const url = request.url;
  console.log(`http request method is ${method}, url is ${url}`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).send("Hello World!"); //문자열은 바로 send
});

app.post('/upper', (req, res) => {
  res.status(201).json(req.body.toUpperCase());//body에 있는 정보를 대문자로 바꿔서 클라이언트에게 보냄
  //res.json() = res.send(JSON.stringify()): json으로 받아온 값을 문자열로 변환해서 웹 서버로 보내기
  //req.body : 받아온 값 payload
  //JSON.parse()는 JSON 문자열을 javascript 객체로 변환한다.응답(response) 바디만을 넣어야한다.바디와 헤더가 들어가면 데이터를 읽어오지 못한다
  //response.json()에는 응답 헤더가 들어가도 바디만 읽어서 불러온다.
})

app.post('/lower', (req, res) => {
  res.status(201).json(req.body.toLowerCase());
})
//get 같은 경우 URL에 parameter를 함께 보내 요청하지만, post는 request body에 parameter를 보내서 정보를 추출해야 한다.
//이럴때 body-parser 미들웨어를 사용하면 간단하게 추출 가능하다.
//미들웨어란 클라이언트에서 req(요청),res(응답) 사이 중간(미들)에 위치하는 함수로, 요청과 응답 사이클에서 중간에 거쳐가는 함수들이라고 생각하면된다.
//body-parser는 node.js 모듈로 클라이언트의 post request body로부터 파라미터를 추출할 수 있게 해주는 것

app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
}); //400에러 즉, 클라이언트의 잘못으로 인한 에러는 인자에 err를 넣지 않는다.

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
});//에러 처리

app.listen(PORT, () => {
  console.log(`Example app listening on port ${ip}:${PORT}`); //터미널에 ip와 포트번호가 찍히는 용도
})

/*
//node.js server를 이용했을 때 코드
const server = http.createServer((request, response) => {
  if(request.method==="OPTIONS"){ //메소드가 options라면
    //preflight request, CORS 설정을 돌려줘야 한다.
    response.writeHead(200, defaultCorsHeader);//상태코드, 헤더정보
    response.end('hello mini-server sprints');//html파일이나 소스를 보내 그 폼을 웹에 띄움
  }
  if(request.method === 'POST' && request.url === '/upper'){ //메소드가 post고, url이 /upper 라면
    //대문자로 응답을 돌려줘야 한다.
    let body = [];
    request.on('data', (chunk) => { //chunk : 데이터조각
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString(); //buffer : chunk를 받아주는 용기
      //즉, chunk들을 buffer에 채운 후 다 차면 buffer를 통째로 옮기고 새 buffer에 아직 옮기지 못한 데이터 조각을 다시 채우는 과정을 반복한다.
      //버퍼링(buffering)? buffer에 chunk를 다 채울 때까지 기다리는 작업, 영상이 버퍼링 중이라며 재생되지 않는 경우
      response.writeHead(200, defaultCorsHeader);
      response.end(body.toUpperCase());
    });
  }
  else if(request.method === 'POST' && request.url === '/lower'){ //메소드가 post고, url이 /lower 라면
    //소문자로 응답을 돌려줘야 한다.
    let body = [];
    request.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      response.writeHead(200, defaultCorsHeader);
      response.end(body.toLowerCase());
    });
  }
  else{
    //에러로 처리합니다. bad request
    response.statusCode = 404;
    response.end();
  }

  console.log(
    `http request method is ${request.method}, url is ${request.url}`
  );
  
});

server.listen(PORT, ip, () => {
  console.log(`http server listen on ${ip}:${PORT}`);
});
*/
const defaultCorsHeader = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Max-Age': 10
};
