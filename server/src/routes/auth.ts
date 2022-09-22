import { isEmpty, validate } from "class-validator";
import { Router, Request, Response } from "express";
import { runInNewContext } from "vm";
import User from "../entities/User";

const mapError = (errors: Object[]) => {
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraint[0][1]);

    return prev;
  }, {});
};

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    let errors: any = {};

    // 이메일과 유저네임이 이미 사용되고 있는 중인지 확인
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    // 이미 있다면 errors 객체에 넣어줌
    if (emailUser) errors.email = "사용되고 있는 이메일 주소입니다.";
    if (usernameUser) errors.username = "사용되고 있는 사용자 이름입니다.";

    // 에러가 있다면 return으로 에러를 response 보내줌
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    // 엔티티에 정해 놓은 조건으로 user 데이터의 유효성 검사
    errors = await validate(user);

    if (errors.length > 0) return res.status(400).json(mapError(errors));

    // 유저 정보를 유저 table에 저장
    await user.save();
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let errors: any = {};

    // 비워져있다면 에러를 프론트엔드로 보내주기
    if (isEmpty(username))
      errors.username = "사용자 이름은 비워둘 수 없습니다.";
    if (isEmpty(password)) errors.password = "비밀번호는 비워둘 수 없습니다.";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // db에서 유저 찾기
    const user = await User.findOneBy({ username });

    if (!user)
      return res
        .status(404)
        .json({ username: "사용자 이름이 등록되지 않았습니다." });
  } catch (error) {}
};

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
