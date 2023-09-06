const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const request = require('request')
const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

app.get("/", async (req, res) => {
  res.send('hello, welcome to guanhai');
});
app.post("/guanhai_ticket", function (req, res) {
  const { sceneStr, expireSeconds } = req.body
  request({
    method: 'POST',
    url: 'http://api.weixin.qq.com/cgi-bin/qrcode/create?from_appid=wx1c096fbf07724f12',
    body: JSON.stringify({
      action_name: 'QR_STR_SCENE',
      expire_seconds: expireSeconds || 3600,
      action_info: {
        scene: {
          scene_str: sceneStr
        }
      }
    })
  }, function (error, response) {
    if (error) {
      res.send(error.toString())
    } else {
      console.log('接口返回内容', response.body)
      res.send(JSON.parse(response.body))
    }
  })
})
const port = process.env.PORT || 80;

async function bootstrap() {
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
