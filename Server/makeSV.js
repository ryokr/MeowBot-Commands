const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
   name: 'make',
   description: 'Make Servers',
   permissions: '0x0000000000000800',
   options: [
      {
         name: 'start',
         description: 'Type a number',
         type: ApplicationCommandOptionType.Integer,
         required: true,
      },
   ],

   run: async (client, interaction) => {
      try {
         await interaction.deferReply({ ephemeral: true })

         const delay = async (ms) => await new Promise((resolve) => setTimeout(resolve, ms))
         const delayTime = 7000
         const numServersToCreate = 4
         const baseServerNumber = interaction.options.getInteger('start')

         const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bot ${client.config.TOKEN}`,
         }

         for (let i = 0; i < numServersToCreate; i++) {
            const serverNumber = baseServerNumber + i
            const serverName = `Server-${serverNumber}`

            const data = {
               name: serverName,
               icon: null,
               channels: [],
               system_channel_id: null,
            }

            await fetch(`https://discord.com/api/v9/guilds`, {
               method: 'POST',
               headers: headers,
               body: JSON.stringify(data),
            })
               .then((response) => {
                  if (!response.ok) {
                     throw new Error('Failed to create server')
                  }
                  return response.json()
               })
               .then((guildData) => {
                  console.log(`Created server: ${serverName} | Server ID: ${guildData.id}`)
               })
               .catch((error) => {
                  console.error(`Error creating server ${serverName}:`, error)
               })

            await delay(delayTime)
         }

         await interaction.editReply('Successfully created servers.')
      } catch (error) {
         console.error('Error creating servers:', error)
         await interaction.editReply('There was an error creating servers.')
      }
   },
}
