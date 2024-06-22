module.exports = {
   name: 'view',
   description: 'View Servers',
   permissions: '0x0000000000000800',

   run: async (client, interaction) => {
      try {
         let serverList = '**Server List**\n\n';
         client.guilds.cache.forEach((guild, index) => {
            serverList += `${index + 1}. **Server Name:** ${guild.name} **Server ID:** ${guild.id}\n`;
         });

         // Split the serverList into chunks of 2000 characters or less
         const chunks = splitMessage(serverList, { maxLength: 2000 });

         // Send each chunk as a separate message
         for (const chunk of chunks) {
            await interaction.channel.send(chunk);
         }
      } catch (error) {
         console.error('Error fetching servers:', error);
         await interaction.channel.send('There was an error fetching the server list.');
      }
   },
};

// Function to split message into chunks
function splitMessage(content, options = {}) {
   const maxLen = options.maxLength || 2000;
   const splitRegex = options.charSplit ? null : /\n/;
   const prepend = options.prepend || '';
   const append = options.append || '';
   const prependPlaceholder = options.prependPlaceholder || '';
   const appendPlaceholder = options.appendPlaceholder || '';
   const charSplit = options.charSplit || false;
   const codeBlock = options.codeBlock || false;
   const text = options.text || '';

   if (content.length <= maxLen) return [content];

   if (options.charSplit) {
      return splitText(content, maxLen, {
         prepend,
         append,
         prependPlaceholder,
         appendPlaceholder,
         codeBlock,
         text,
      });
   }

   const messages = content.split(splitRegex);
   const chunks = [];
   let chunk = '';

   for (let i = 0; i < messages.length; i++) {
      if (chunk && (chunk + '\n' + messages[i]).length > maxLen) {
         chunks.push(chunk);
         chunk = '';
      }

      chunk += (chunk && chunk !== '' ? '\n' : '') + messages[i];
   }

   chunks.push(chunk);

   return chunks.map((m, i) => (i === 0 && chunks.length > 1 ? prependPlaceholder + m : (i === chunks.length - 1 ? m + appendPlaceholder : m)));
}
