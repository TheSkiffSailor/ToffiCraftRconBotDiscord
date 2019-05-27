const Discord = require('discord.js');
const client = new Discord.Client();
const Rcon = require('modern-rcon');
const rcon = new Rcon("188.165.137.36", 25513, "6JH1TO92XDRG7CJGI0BH", 3000);
const config = require('./config.json');
var confid = config.blocked;
client.login("NTgyMTk5NTkwMzcyMjQ1NTM4.XOqVww.lDNvD2Tg44fP2VZ1uQ5vX30Kg78");

client.on('ready', ready => {
	client.user.setPresence({
		status: 'online',
		game: {
			name: '/help'
		}
	});
	
	String.prototype.replaceAll = function(search, replacement) {
		var target = this;
		return target.split(search).join(replacement);
	};
	String.prototype.contains = function(search) {
		var target2 = this;
		if(target2.includes(search)) {
			return true;
		} else {
			return false;
		}
	};
});
client.on('message', msg => {
	if(msg.author.bot) return;
	let sEmbed_help = new Discord.RichEmbed()
		.setColor("#ff0000")
		.addField("**Помощь:**", "/cmd - Вывести помощь о команде /cmd", true);
	let sEmbed_cmd = new Discord.RichEmbed()
		.setColor("#ff0000")
		.addField("**Помощь по команде /cmd:**", "Синтаксис: /cmd <Твоя комманда>", true);
	let sEmbed_noperms = new Discord.RichEmbed()
		.setColor("#ff0000")
		.addField("**Недостаточно прав!**", "Чтобы использовать это комманду ты должен иметь специальную роль!", true);
	let sEmbed_overflow = new Discord.RichEmbed()
		.setColor("#ff0000")
		.addField("**Ошибка!**", "Сервер вернул  ответ более 1024 символов, что является не допустимым.", true);
	let sEmbed_blocked = new Discord.RichEmbed()
		.setColor("#ff0000")
		.addField("**Ошибка!**", "Данную комманду нельзя использовать!", true);
	if(msg.content == "/help") {
		msg.reply({ embed: sEmbed_help });
	}
	if(msg.content.startsWith("/cmd")) {
		let args = msg.content.slice(5, msg.length);
		if(args.length > 0) {
			if(msg.member.roles.some(role => role.name === '+')) {
				rcon.connect().then(() => {
					return rcon.send(args);
				}).then(res => {
					if(res == null || res == "") {
						res = "Ответ отсутствует!";
					}
					if(res.length >= 1023) {
						msg.reply({ embed: sEmbed_overflow});
						return;
					}
					var blocked = confid.split(",");
					for(var i = 0; i < blocked.length; i++) {
						if(res.startsWith(blocked[i])) {
							msg.reply({ embed: sEmbed_blocked });
							return;
						}
					}
				let sEmbed_response = new Discord.RichEmbed()
					.setColor("#ff0000")
					.addField("**Ответ от сервера:**", res, true);
				msg.reply({ embed: sEmbed_response });
				}).then(() => {
					return rcon.disconnect();
				});
			} else {
				msg.reply({ embed: sEmbed_noperms });
			}
		} else {
			msg.reply({ embed: sEmbed_cmd });
		}
	}
});
