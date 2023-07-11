import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';

export default class RenameCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'rename',
      description: "Rename a user's nickname.",
      defaultPermission: true,
      options: [
        {
          type: CommandOptionType.USER,
          name: 'user',
          description: 'Select a user',
          required: true
        },
        {
          type: CommandOptionType.STRING,
          name: 'nickname',
          description: 'Enter new nickname',
          required: true
        }
      ]
    });
  }

  async callAPI(url: string, method: string = 'GET', body?: object) {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`${errorResponse.message}`);
    }

    return response.json();
  }

  async run(ctx: CommandContext) {
    let oldNickname;
    try {
      const userDetails = await this.callAPI(`https://discord.com/api/v8/users/${ctx.options.user}`);
      oldNickname = userDetails.username;

      const guildMemberDetails = await this.callAPI(
        `https://discord.com/api/v8/guilds/${ctx.guildID!}/members/${ctx.options.user}`
      );
      if (guildMemberDetails.nick) {
        oldNickname = guildMemberDetails.nick;
      }

      await this.callAPI(`https://discord.com/api/v8/guilds/${ctx.guildID!}/members/${ctx.options.user}`, 'PATCH', {
        nick: ctx.options.nickname
      });

      const message = `Changed <@${ctx.options.user}> from ${oldNickname} → ${ctx.options.nickname}`;
      await this.callAPI(`https://discord.com/api/v8/channels/${ctx.channelID}/messages`, 'POST', { content: message });
    } catch (e: unknown) {
      if (e instanceof Error) {
        return `Failed to change nickname: ${e.message}`;
      }
    }

    return 'Nickname changed successfully!';
  }
}
