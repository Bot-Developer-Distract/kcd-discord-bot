import type * as TDiscord from 'discord.js'
import { isEpicReactDev } from '../utils/roles'
import { getTalkToBotsChannel } from './utils'

export function setup(client: TDiscord.Client) {
	client.on('guildMemberUpdate', async (oldMember, member) => {
		const oldHasEpicReactRole = isEpicReactDev(oldMember)
		const newHasEpicReactRole = isEpicReactDev(member)
		const isNewEpicReactDev = newHasEpicReactRole && !oldHasEpicReactRole

		if (isNewEpicReactDev) {
			await member.setNickname(`${member.displayName} 🚀`)
			return
		}

		if (newHasEpicReactRole) return

		const hasRocket = member.nickname?.includes('🚀')
		if (!hasRocket) return

		await member.setNickname(member.displayName.replace(/🚀/g, '').trim())

		const botsChannel = getTalkToBotsChannel(member.guild)
		await botsChannel?.send(
			`
Hi ${member.user}, I noticed you added a rocket 🚀 to your nickname. I'm afraid you can't do this because your discord account is not connected to your EpicReact.Dev account. Go to <https://epicreact.dev/discord> to make that connection.

If you don't have an https://EpicReact.Dev account, you should check it out. It's pretty great 😉 🚀
			`.trim(),
		)
	})
}
