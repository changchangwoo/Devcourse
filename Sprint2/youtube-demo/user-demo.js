const express = require("express");
const app = express();
app.use(express.json());
app.listen(7777);
const db = new Map();
let idx = 1;
// 로그인

// 회원가입
app.post("/join", (req, res) => {
  if (req.body == !{}) {
    res.status(400).json({
      message: `입력 값을 다시 확인해주세요`,
    });
  } else {
    db.set(idx++, req.body);
    console.log(db);
    res.status(201).json({
      message: `${db.get(idx - 1).name}님 회원가입을 축하합니다`,
    });
  }
});

// 회원 개별 조회 및 삭제
// route 메소드 사용
app
  .route("/users/:id")
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const user = db.get(id);
    if (user === undefined) {
      res.status(404).json({
        message: "회원 정보가 없습니다",
      });
    } else {
      res.json({
        userId: user.userId,
        name: user.name,
      });
    }
  })
  .delete((req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const user = db.get(id);
    if (user === undefined) {
      res.status(404).json({
        message: "회원 정보가 없습니다",
      });
    } else {
      db.delete(id);
      res.status(200).json({
        message: `${user.name}님 다음에 또 뵙겠습니다`,
      });
    }
  });
