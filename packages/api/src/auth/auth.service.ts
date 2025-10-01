import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  login(username: string, password: string) {
    const u = process.env.ADMIN_USER || "admin";
    const p = process.env.ADMIN_PASS || "admin123";
    if (username === u && password === p) {
      const token = jwt.sign({ sub: username, role: "admin" }, process.env.JWT_SECRET!, { expiresIn: "1d" });
      return { token };
    }
    throw new Error("Credenciales inválidas");
  }
}
