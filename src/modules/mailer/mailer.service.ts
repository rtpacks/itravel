import { Inject, Injectable } from '@nestjs/common';
import { MailerService as NestMailService } from '@nestjs-modules/mailer';
import { BizException } from 'src/shared/exceptions/BizException';
import { ConfigService } from '@nestjs/config';
import { getCommonConf } from 'src/config/common.config';

@Injectable()
export class MailerService {
  constructor(
    private nestMailerService: NestMailService,
    private configService: ConfigService,
  ) {}

  async example(str?: string) {
    try {
      this.nestMailerService.sendMail({
        to: 'luckywords@foxmail.com', // 要发送的目标邮箱
        // from: 'noreply@nestjs.com', // 自定义发送者的邮箱，默认在mudule已配置了，可以不配置
        subject: 'Testing Nest MailerModule ✔', // 标题
        // text: str ? `Test: ${str}` : 'welcome', // 发送的文字
        html: str ? `Test: ${str}` : 'welcome', // 发送的文字
      });
    } catch (error) {
      throw new BizException('邮件服务发生故障');
    }
  }

  async sendEMailForRegisterToken(to: string, token: string) {
    // TODO useConfigService get env
    const { hostname, authPrefix } = getCommonConf();

    try {
      await this.nestMailerService.sendMail({
        to, // 要发送的目标邮箱
        // from: 'noreply@nestjs.com', // 自定义发送者的邮箱，默认在mudule已配置了，可以不配置
        subject: 'ITravel 注册激活 ✔', // 标题
        // text: str ? `Test: ${str}` : 'welcome', // 发送的文字
        html: token
          ? `Hi, 欢迎来到 Itravel，请点击链接以激活您的账号: <a href='${authPrefix}?token=${token}'>🔗激活链接</a>
            <p>若点击无法打开访问，请在浏览器中输入链接 <a>${authPrefix}?token=${token}</a> 以激活您的账户</p>
          `
          : 'welcome', // 发送的文字
      });
    } catch (error) {
      console.log(error);
      throw new BizException('邮件服务发生故障');
    }
  }
}
