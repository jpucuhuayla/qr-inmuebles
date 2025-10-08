import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      message: "QR Inmuebles API",
      version: "1.0.0",
      status: "online",
      endpoints: {
        auth: "/auth/login",
        properties: "/properties",
        files: "/files",
      },
      documentation: "https://qr-inmuebles-web-js8k.vercel.app",
    };
  }

  @Get("health")
  health() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
