module.exports = {
    name: "Member Role Add [Event]",
    description: "Triggered when a member is given a role.",
    category: "Events",
    auto_execute: true,

    inputs: [],

    options: [
        {
            id: 'unstable_outputs',
            name: 'Unstable Outputs',
            description: 'Use audit logs to detect who added the role (may be inaccurate and laggy).',
            type: 'SELECT',
            options: {
                no: 'No',
                yes: 'Yes (Not Recommended)'
            }
        }
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes next blocks.",
            types: ["action"]
        },
        {
            id: "new_member",
            name: "Member",
            description: "The member after the role was added.",
            types: ["object"]
        },
        {
            id: "role",
            name: "Role",
            description: "The role that was added.",
            types: ["object"]
        },
        {
            id: "user",
            name: "User (UNSTABLE)",
            description: "The user who added the role, if available.",
            types: ["object", "unspecified"]
        },
        {
            id: 'reason',
            name: 'Reason (UNSTABLE)',
            description: 'Reason for adding the role, if available.',
            types: ['text']
        }
    ],

    async code(cache) {
        const unstable_outputs = this.GetOptionValue('unstable_outputs', cache) + '';

        const { Events, PermissionFlagsBits, AuditLogEvent } = require("discord.js");

        this.events.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
            const oldRoles = new Set(oldMember.roles.cache.keys());
            const newRoles = new Set(newMember.roles.cache.keys());

            const addedRoles = [...newRoles].filter(roleId => !oldRoles.has(roleId));

            if (addedRoles.length === 0) return;

            const addedRole = newMember.guild.roles.cache.get(addedRoles[0]);

            let executor = null;
            let reason = '';

            if (unstable_outputs === 'yes' && newMember.guild) {
                const server = newMember.guild;
                const me = await server.members.fetchMe();

                if (me && me.permissions.has(PermissionFlagsBits.ViewAuditLog)) {
                    const current = Date.now() - 10000;

                    const entry = await server
                        .fetchAuditLogs({ limit: 10 })
                        .then(audit =>
                            audit.entries.find(
                                e =>
                                    [AuditLogEvent.MemberUpdate, AuditLogEvent.MemberRoleUpdate].includes(e.action) &&
                                    e.target.id === newMember.id &&
                                    e.createdTimestamp >= current
                            )
                        );

                    if (entry) {
                        executor = entry.executor || null;
                        reason = entry.reason || '';
                    }
                }
            }

            this.StoreOutputValue(newMember, "new_member", cache);
            this.StoreOutputValue(addedRole, "role", cache);
            this.StoreOutputValue(executor, "user", cache);
            this.StoreOutputValue(reason, "reason", cache);
            this.RunNextBlock("action", cache);
        });
    }
};