module.exports = {
   name: 'delete',
   description: 'Delete Servers',
   permissions: '0x0000000000000800',

   run: async (client, interaction) => {
      try {
         // Define server IDs and names to delete
         const serversToDelete = [
            { name: 'Server-11', id: '1253986583061987358' },
         ];

         for (const serverInfo of serversToDelete) {
            const guild = client.guilds.cache.get(serverInfo.id)
            if (!guild) {
               console.log(`Server ${serverInfo.name} not found or bot does not have access.`)
               continue
            }

            await guild
               .delete()
               .then(() => {
                  console.log(`Deleted server: ${serverInfo.name} | Server ID: ${serverInfo.id}`)
               })
               .catch((error) => {
                  console.error(`Error deleting server ${serverInfo.name}:`, error)
               })
         }

         interaction.reply('Successfully deleted servers.')
      } catch (error) {
         console.error('Error deleting servers:', error)
         interaction.reply('There was an error deleting servers.')
      }
   },
}