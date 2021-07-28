import { Context } from 'telegraf';
import { BotCommand, Update } from 'telegraf/typings/core/types/typegram';

export interface IBotCommandHandler {
	botCommand: BotCommand;
	handler(ctx: Context<Update>): Promise<unknown>;
}
