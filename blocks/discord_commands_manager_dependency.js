module.exports = {
    name: "Discord Commands Manager [Dependency]",

    description:
        "Starts the Discord Commands Manager dependency required for other related blocks to work.",

    category: "Dependencies",

    init(DBB, blockName) {
        const { ApplicationCommandOptionType, ApplicationCommandType } = require("discord.js")

        class CommandsTimer {
            constructor(ms, callback) {
                this.commands = []
                this.timer = setTimeout(callback, ms)
            }

            addCommand(command) {
                this.commands.push(command)
            }
        }

        DBB.Core.setDependency("DiscordCommands", blockName, {
            TIMEOUT: 3000,

            _tempData: {
                global: undefined,
                servers: new Map()
            },

            create(data, serverId) {
                if (serverId) {
                    let serverData = this._tempData.servers.get(serverId)
                    if (!serverData) {
                        serverData = new CommandsTimer(this.TIMEOUT, () => {
                            this.sendCommands(serverId)
                            this._tempData.servers.delete(serverId)
                        })
                        this._tempData.servers.set(serverId, serverData)
                    }
                    serverData.addCommand(data)
                } else {
                    const globalData = (this._tempData.global ??= new CommandsTimer(
                        this.TIMEOUT,
                        () => {
                            this.sendCommands()
                            this._tempData.global = undefined
                        }
                    ))
                    globalData.addCommand(data)
                }
            },

            sendCommands(serverId) {
                const commandsTimer = serverId
                    ? this._tempData.servers.get(serverId)
                    : this._tempData.global
                if (!commandsTimer) return

                const discordCommands = DBB.DiscordJS.client.application.commands

                const commands = discordCommands.cache.reduce((map, command) => {
                    const randomId =
                        command.type === ApplicationCommandType.ChatInput ? "" : command.type
                    return map.set(command.name + randomId, command)
                }, new Map())

                for (const command of commandsTimer.commands) {
                    if (
                        command.type !== undefined &&
                        command.type !== ApplicationCommandType.ChatInput
                    ) {
                        commands.set(command.name + command.type, command)
                        continue
                    }

                    const [commandName, subcommandName, subcommandName2] = command.name
                        .trim()
                        .toLowerCase()
                        .split(/\s+/, 3)

                    // Command
                    let existingCommand = commands.get(commandName)
                    if (!existingCommand) {
                        existingCommand = {
                            name: commandName,
                            description: " ឵",
                            options: []
                        }
                        commands.set(commandName, existingCommand)
                    }

                    if (subcommandName) {
                        const { name, description, options, ...rest } = command
                        Object.assign(existingCommand, rest)
                    } else {
                        Object.assign(existingCommand, command)
                        continue
                    }

                    // Subcommand 1
                    let existingSubcommand = existingCommand.options.find(
                        (option) => option.name === subcommandName
                    )
                    if (!existingSubcommand) {
                        existingSubcommand = {
                            name: subcommandName,
                            description: " ឵",
                            options: []
                        }
                        existingCommand.options.push(existingSubcommand)
                    }

                    if (subcommandName2) {
                        existingSubcommand.type = ApplicationCommandOptionType.SubcommandGroup
                    } else {
                        Object.assign(existingSubcommand, command, {
                            name: subcommandName
                        })
                        existingSubcommand.type = ApplicationCommandOptionType.Subcommand
                        continue
                    }

                    // Subcommand 2
                    let existingSubcommand2 = existingSubcommand.options.find(
                        (option) => option.name === subcommandName2
                    )
                    if (!existingSubcommand2) {
                        existingSubcommand2 = {}
                        existingSubcommand.options.push(existingSubcommand2)
                    }

                    Object.assign(existingSubcommand2, command, {
                        name: subcommandName2
                    })
                    existingSubcommand2.type = ApplicationCommandOptionType.Subcommand
                }

                discordCommands.set(Array.from(commands.values()), serverId)
            }
        })
    }
}
