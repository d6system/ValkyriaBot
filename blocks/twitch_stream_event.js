module.exports = {
  name: "Twitch Stream [Event]",

  description: "Triggers an event when a Twitch channel starts streaming.",

  auto_execute: true,

  category: "Internet Stuff",

  inputs: [],

  options: [
    {
      id: "client_id",
      name: "Client ID",
      type: "TEXT_LINE",
      description: "The Client ID for your Twitch Application. You can get this from the Twitch Developer Console.",
    },
    {
      id: "client_secret",
      name: "Client Secret",
      type: "TEXT_LINE",
      description: "The Client Secret for your Twitch Application. You can get this from the Twitch Developer Console.",
    },
    {
      id: "channel_names",
      name: "Channel Names",
      type: "MULTISELECT",
      allowUserOptions: true,
      duplicates: false,
      description: "The Channels to subscribe to events for. Press enter key to submit each username.",
    },
    {
      id: "aditional_properties",
      name: "Aditional Properties",
      type: "MULTISELECT",
      allowUserOptions: false,
      duplicates: false,
      description: "Select aditional properties to output",
      options: {
        "tags": "Stream Tags [List]",
        "viewers": "Viewer Count [Number]",
        "language": "Language [Text]",
        "startDate": "Stream Started At [Date]",
        "isMature": "Is Mature? [Boolean]",
      }
    },
    {
      id: "persist",
      name: "Persist Streamers?",
      description: "Persist the streamers that have been added with the manager block between restarts.",
      type: "CHECKBOX",
      defaultValue: true,
    }
  ],

  outputs(data) {
    return [    
      {
        id: "stream_start",
        name: "Stream Start",
        description: "Executes the following blocks when the stream starts.",
        types: ["action"],
      },
      {
        id: "stream_end",
        name: "Stream End",
        description: "Ecxecutes the following blocks when the stream ends.",
        types: ["action"],
      },
      {
        id: "already_live",
        name: "Already Live",
        description: "Executes the following blocks if the streamer is live when the bot starts.",
        types: ["action"],
      },
      {
        id: "title",
        name: "Stream Title",
        description: "The Title of the stream.",
        types: ["text", "unspecified"],
      },
      {
        id: "author",
        name: "Channel Name",
        description: "The Name of the channel.",
        types: ["text", "unspecified"],
      },
      {
        id: "profilePic",
        name: "Profile Picture",
        description: "The Profile Picture of the channel.",
        types: ["text", "unspecified"],
      },
      {
        id: "link",
        name: "Link",
        description: "The URL of the stream.",
        types: ["text", "unspecified"],
      },
      {
        id: "game",
        name: "Game",
        description: "The Game that is being played.",
        types: ["text", "unspecified"],
      },
      {
        id: "thumbnailUrl",
        name: "Thumbnail URL",
        description: "The URL of the Thumbnail image.",
        types: ["text", "unspecified"],
      },
      data?.options?.aditional_properties?.includes("tags") ? {
        id: "tags",
        name: "Stream Tags",
        description: "The list of Stream Tags.",
        types: ["list", "unspecified"],
      } : undefined,
      data?.options?.aditional_properties?.includes("viewers") ? {
        id: "viewers",
        name: "Viewer Count",
        description: "The amount of Viewers.",
        types: ["number", "unspecified"],
      } : undefined,
      data?.options?.aditional_properties?.includes("language") ? {
        id: "language",
        name: "Language",
        description: "The Language of the stream.",
        types: ["text", "unspecified"],
      } : undefined,
      data?.options?.aditional_properties?.includes("startDate") ? {
        id: "startDate",
        name: "Stream Started At",
        description: "The time that the Stream Started.",
        types: ["date", "unspecified"],
      } : undefined,
      data?.options?.aditional_properties?.includes("isMature") ? {
        id: "isMature",
        name: "Is Mature?",
        description: "Boolean if the stream is 18+.",
        types: ["boolean", "unspecified"],
      } : undefined,
      {
        id: "ready",
        name: "Ready",
        description: "Executes the following blocks once the block has finished it's initialisation.",
        types: ["action"],
      },
    ]
  },

  async init(DBB) {
    const EventEmitter = require("events");
    DBB.twitch_manager = new EventEmitter();
  },

  async code(cache, DBB) {
    const fetch = await this.require("node-fetch@2");
    const WebSocket = await this.require("ws");
    const fs = await this.require('fs').promises;
    const path = await this.require('path');
    const childProcess = await this.require("child_process")

    const client_id = this.GetOptionValue("client_id", cache);
    const client_secret = this.GetOptionValue("client_secret", cache);

    if (!client_id || !client_secret) {
      let instructions = []
      if (!client_id && !client_secret) {
        instructions.push(`1. Go to the Twitch Developer Console and create a new application or copy the Client ID of your existing app, paste into the "Client ID" field.\n\n2. Copy the Client Secret and paste it into the "Client Secret" field.`)
      } else if  (!client_secret) {
        instructions.push(`Go to the Twitch Developer Console and create a new application or copy the Client ID of your existing app, paste into the "Client ID" field.`)
      } else if (!client_id) {
        instructions.push(`Go to the Twitch Developer Console and create a new application or copy the Client Secret and paste it into the "Client Secret" field.`)
      }

      instructions.push("The developer portal will automatically open in 10 seconds time")
      DBB.Core.console("WARN", instructions.join("\n\n"));
      setTimeout(async() => {
        await childProcess.exec(`start https://dev.twitch.tv/console/apps`)
      }, 10000);
      return Error()
    }

    let channel_names = [];
    if (this.GetOptionValue('persist', cache)) {
        const stored_channels = await readChannels();
        channel_names = [...new Set([...this.GetOptionValue("channel_names", cache) || [], ...stored_channels])];
    } else {
        channel_names = this.GetOptionValue("channel_names", cache) || [];
    }
    let shardCount = 1;
    let conduit = null;
    let ws = null;
    const thiss = this;

    async function safeWriteChannels(channels) {
      const dataPath = path.join(__dirname, '..', 'data', 'twitch_channels.json');
      const tempPath = dataPath + '.tmp';
      
      await fs.writeFile(tempPath, JSON.stringify(channels, null, 2));
      await fs.rename(tempPath, dataPath);
    }

    async function readChannels() {
        const dataPath = path.join(__dirname, '..', 'data', 'twitch_channels.json');
        try {
            const data = await fs.readFile(dataPath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            return [];
        }
    }

    DBB.twitch_manager.on("twitch_channel_manager", async ({ username, mode }) => {
      if (!username) return;
      const uname = username.trim();
      const eventsPerChannel = 2;
      const maxSubsPerShard = 300;
      const accessToken = await getAccessToken();
      const userId = await getUserId(uname, accessToken);

      let profilePicUrl = undefined;
      try {
        const userRes = await fetch(`https://api.twitch.tv/helix/users?id=${userId}` , {
          headers: {
            "Client-ID": client_id,
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userData = await userRes.json();
        if (userData.data && userData.data.length > 0) {
          profilePicUrl = userData.data[0].profile_image_url;
        }
      } catch (e) {
        console.log(e)
        profilePicUrl = undefined;
      }

      if (mode === "add") {
        if (!channel_names.includes(uname)) {
          const newCount = channel_names.length + 1;
          let requiredShards = calculateShardCount(newCount, eventsPerChannel, maxSubsPerShard);
          if (requiredShards > shardCount) {
            try {
              const accessToken = await getAccessToken();
              const patchRes = await fetch("https://api.twitch.tv/helix/eventsub/conduits/shards", {
                  method: "PATCH",
                  headers: {
                      "Client-ID": client_id,
                      Authorization: `Bearer ${accessToken}`,
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ conduit_id: conduit.id, shards: Array.from({length: requiredShards}, (_, i) => ({ id: i.toString(), transport: { method: "websocket", session_id: ws._events.open ? ws._events.open.sessionId : undefined } })) })
              });
              const patchData = await patchRes.json();
              if (!patchRes.ok) {
                  console.error("[Twitch] Failed to add shard:", patchData);
                  return;
              }
              shardCount = requiredShards;
              console.log(`[Twitch] Added new shard. Total shards: ${shardCount}`);
            } catch (e) {
                console.error("[Twitch] Error adding shard:", e);
                return;
            }
          }
          channel_names.push(uname);
          if (this.GetOptionValue('persist', cache)) await safeWriteChannels(channel_names);
          
          DBB.twitch_manager.emit("twitch_channel_managed", { username: uname, url: `https://www.twitch.tv/${uname}`, profilePicUrl: profilePicUrl, mode: "add" });
          try {
            const accessToken = await getAccessToken();
            const userId = await getUserId(uname, accessToken);
            const ok1 = await subscribeToEvent(accessToken, conduit.id, userId, "stream.online");
            const ok2 = await subscribeToEvent(accessToken, conduit.id, userId, "stream.offline");
            if (ok1 && ok2) {
                await getStreamInfo(userId, accessToken, "already_live");
            } else {
                console.error(`[Twitch] Failed to subscribe to events for: ${uname}`);
            }
          } catch (e) {
            console.error(`[Twitch] Error adding user: ${uname}`, e);
          }
        }
      } else if (mode === "remove") {
        const index = channel_names.indexOf(uname);
          DBB.twitch_manager.emit("twitch_channel_managed", { username: uname, url: `https://www.twitch.tv/${uname}`, profilePicUrl: profilePicUrl, mode: "remove" });
        if (index > -1) {
            channel_names.splice(index, 1);
            if (this.GetOptionValue('persist', cache)) await safeWriteChannels(channel_names);
            try {
              const accessToken = await getAccessToken();
              const res = await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
                  headers: {
                      "Client-ID": client_id,
                      Authorization: `Bearer ${accessToken}`,
                  },
              });
              const data = await res.json();
              if (data.data && data.data.length > 0) {
                  for (const sub of data.data) {
                      if (sub.condition && sub.condition.broadcaster_user_id) {
                          const userId = await getUserId(uname, accessToken);
                          if (sub.condition.broadcaster_user_id === userId) {
                              await fetch(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${sub.id}`, {
                                  method: "DELETE",
                                  headers: {
                                      "Client-ID": client_id,
                                      Authorization: `Bearer ${accessToken}`,
                                  },
                              });
                          }
                      }
                  }
              }
          } catch (e) {
            console.error(`[Twitch] Error removing EventSub subscription for: ${uname}`, e);
          }
        }
      }
    })

    DBB.twitch_manager.on("twitch_channel_get_stream_info", async(username) => {
      const accessToken = await getAccessToken();
      getStreamInfo(await getUserId(username, accessToken), accessToken, "request");
    })

    async function getAccessToken() {
      const res = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: client_id,
          client_secret: client_secret,
          grant_type: "client_credentials",
        }),
      });

      const data = await res.json();

      if (!data.access_token) throw new Error("Failed to get access token");
      return data.access_token;
    }

    async function getUserId(username, accessToken) {
      const url = `https://api.twitch.tv/helix/users?login=${username}`;
      const res = await fetch(url, {
        headers: {
          "Client-ID": client_id,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (data.data && data.data.length > 0) return data.data[0].id;
      throw new Error(`User not found: ${username}`);
    }

    async function getStreamInfo(userId, accessToken, type) {
      const url = `https://api.twitch.tv/helix/streams?user_id=${userId}`;
      const res = await fetch(url, {
        headers: {
          "Client-ID": client_id,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      let profilePicUrl = undefined;
      try {
        const userRes = await fetch(`https://api.twitch.tv/helix/users?id=${userId}` , {
          headers: {
            "Client-ID": client_id,
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userData = await userRes.json();
        if (userData.data && userData.data.length > 0) {
          profilePicUrl = userData.data[0].profile_image_url;
        }
      } catch (e) {
        profilePicUrl = undefined;
      }

      if (data.data && data.data.length > 0) {
        switch (type) {
            case "already_live":
                const stream = data.data[0];
                thiss.StoreOutputValue(stream.user_name, "author", cache);
                thiss.StoreOutputValue(stream.title, "title", cache);
                thiss.StoreOutputValue(`https://www.twitch.tv/${stream.user_name}`, "link", cache);
                thiss.StoreOutputValue(stream.game_name, "game", cache);
                thiss.StoreOutputValue(stream.thumbnail_url.replace("{width}x{height}", "1920x1080"), "thumbnailUrl", cache);
                thiss.StoreOutputValue(stream.tags, "tags", cache);
                thiss.StoreOutputValue(stream.viewer_count, "viewers", cache);
                thiss.StoreOutputValue(stream.language, "language", cache);
                thiss.StoreOutputValue(stream.started_at, "startDate", cache);
                thiss.StoreOutputValue(profilePicUrl, "profilePic", cache);
                thiss.StoreOutputValue(stream.is_mature, "isMature", cache);
                thiss.RunNextBlock("already_live", cache);
            break
            case "stream_start":
                const streamStart = data.data[0];
                thiss.StoreOutputValue(streamStart.user_name, "author", cache);
                thiss.StoreOutputValue(streamStart.title, "title", cache);
                thiss.StoreOutputValue(`https://www.twitch.tv/${streamStart.user_name}`, "link", cache);
                thiss.StoreOutputValue(streamStart.game_name, "game", cache);
                thiss.StoreOutputValue(streamStart.thumbnail_url.replace("{width}x{height}", "1920x1080"), "thumbnailUrl", cache);
                thiss.StoreOutputValue(streamStart.tags, "tags", cache);
                thiss.StoreOutputValue(streamStart.viewer_count, "viewers", cache);
                thiss.StoreOutputValue(streamStart.language, "language", cache);
                thiss.StoreOutputValue(streamStart.started_at, "startDate", cache);
                thiss.StoreOutputValue(profilePicUrl, "profilePic", cache);
                thiss.StoreOutputValue(streamStart.is_mature, "isMature", cache);
                thiss.RunNextBlock("stream_start", cache);
            break
            case "request":
              const datas = {}
              const requested_stream = data.data[0];
              datas.title = requested_stream.title
              datas.game_name = requested_stream.game_name
              datas.thumbnail_url = requested_stream.thumbnail_url.replace("{width}x{height}", "1920x1080")
              datas.tags = requested_stream.tags
              datas.viewer_count = requested_stream.viewer_count
              datas.language = requested_stream.language
              datas.started_at = requested_stream.started_at
              datas.profilePicUrl = profilePicUrl
              datas.is_mature = requested_stream.is_mature
              DBB.twitch_manager.emit("twitch_channel_stream_info", ({state: "online", data: datas}))
            default:
            break
        }
      } else if (type === "stream_end") {
        let offlineUsername = undefined;

        try {
          const userRes = await fetch(`https://api.twitch.tv/helix/users?id=${userId}` , {
            headers: {
              "Client-ID": client_id,
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const userData = await userRes.json();
          if (userData.data && userData.data.length > 0) {
            offlineUsername = userData.data[0].login;
            profilePicUrl = userData.data[0].profile_image_url;
          }
        } catch (e) {
          offlineUsername = undefined;
        }

        thiss.StoreOutputValue(offlineUsername, "author", cache);
        thiss.StoreOutputValue(profilePicUrl, "profilePic", cache);
        thiss.StoreOutputValue(undefined, "title", cache);
        thiss.StoreOutputValue(undefined, "link", cache);
        thiss.StoreOutputValue(undefined, "game", cache);
        thiss.StoreOutputValue(undefined, "thumbnailUrl", cache);
        thiss.StoreOutputValue(undefined, "tags", cache);
        thiss.StoreOutputValue(undefined, "viewers", cache);
        thiss.StoreOutputValue(undefined, "language", cache);
        thiss.StoreOutputValue(undefined, "startDate", cache);
        thiss.StoreOutputValue(undefined, "isMature", cache);
        thiss.RunNextBlock("stream_end", cache);
      } else if (type === "request") {
        let offlineUsername = undefined;

        try {
          const userRes = await fetch(`https://api.twitch.tv/helix/users?id=${userId}` , {
            headers: {
              "Client-ID": client_id,
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const userData = await userRes.json();
          if (userData.data && userData.data.length > 0) {
            offlineUsername = userData.data[0].login;
            profilePicUrl = userData.data[0].profile_image_url;
          }
        } catch (e) {
          offlineUsername = undefined;
        }

        const datas = {}
        datas.title = undefined
        datas.game_name = undefined
        datas.thumbnail_url = undefined
        datas.tags = undefined
        datas.viewer_count = undefined
        datas.language = undefined
        datas.started_at = undefined
        datas.profilePicUrl = profilePicUrl
        datas.is_mature = undefined

        DBB.twitch_manager.emit("twitch_channel_stream_info", ({state: "offline", data: datas}))
      }
    }

    function calculateShardCount( channelCount, eventsPerChannel = 2, maxSubsPerShard = 300 ) {
      const totalSubs = channelCount * eventsPerChannel;
      return Math.ceil(totalSubs / maxSubsPerShard) || 1;
    }

    async function createConduit(accessToken, shardCount) {
      const res = await fetch("https://api.twitch.tv/helix/eventsub/conduits", {
        method: "POST",
        headers: {
          "Client-ID": client_id,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shard_count: shardCount }),
      });

      const data = await res.json();
      if (!data.data || !data.data[0])
        throw new Error("Failed to create conduit");
      return data.data[0];
    }

    async function subscribeToEvent(accessToken, conduitId, userId, type) {
      const res = await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
          method: "POST",
          headers: {
            "Client-ID": client_id,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            version: "1",
            condition: { broadcaster_user_id: userId },
            transport: {
              method: "conduit",
              conduit_id: conduitId,
            },
          }),
        }
      );
      const data = await res.json();
      return res.ok;
    }

    async function assignWebSocketSessionToShard( accessToken, conduitId, sessionId ) {
      const shards = [ { id: "0", transport: { method: "websocket", session_id: sessionId } }, ];
      const res = await fetch("https://api.twitch.tv/helix/eventsub/conduits/shards", {
          method: "PATCH",
          headers: {
            "Client-ID": client_id,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ conduit_id: conduitId, shards }),
        }
      );

      const data = await res.json();
      if (!data.data || !data.data[0] || data.data[0].status !== "enabled") {
        console.error("Failed to enable shard or assign session_id:", JSON.stringify(data, null, 2)
        );
        throw new Error("Failed to enable shard or assign session_id");
      }
      return true;
    }

    async function deleteAllSubscriptions(accessToken) {
      const res = await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
          headers: {
            "Client-ID": client_id,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error("Failed to fetch subscriptions:", data);
        return;
      }

      if (!data.data || data.data.length === 0) {
        return;
      }

      console.log(`🗑️ Deleting ${data.data.length} Twitch subscriptions...`);
      const deleted = [];

      for (const sub of data.data) {
        const delRes = await fetch(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${sub.id}`, {
            method: "DELETE",
            headers: {
              "Client-ID": client_id,
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (delRes.ok) {
          deleted.push(
            `${sub.type} for userId ${sub.condition.broadcaster_user_id}`
          );
        } else {
          const delData = await delRes.json();
          console.error(`Failed to delete subscription ${sub.id}:`, delData);
        }
      }
    }

    async function deleteAllConduits(accessToken) {
      const res = await fetch("https://api.twitch.tv/helix/eventsub/conduits", {
        headers: {
          "Client-ID": client_id,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      if (!data.data || data.data.length === 0) {
        return;
      }

      const deleted = [];

      for (const c of data.data) {
        const delRes = await fetch(`https://api.twitch.tv/helix/eventsub/conduits?id=${c.id}`, {
            method: "DELETE",
            headers: {
              "Client-ID": client_id,
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (delRes.ok) {
          deleted.push(c.id);
        } else {
          const delData = await delRes.json();
          console.error(`Failed to delete conduit ${c.id}:`, delData);
        }
      }
    }

    try {
      const accessToken = await getAccessToken();

      await deleteAllSubscriptions(accessToken);
      await deleteAllConduits(accessToken);

      const userIds = await Promise.all(
        channel_names.map((username) => getUserId(username, accessToken))
      );

      shardCount = calculateShardCount(userIds.length);
      conduit = await createConduit(accessToken, shardCount);

      ws = new WebSocket("wss://eventsub.wss.twitch.tv/ws");

      ws.on("open", () => {});
      ws.on("message", async (data) => {
        try {
          const msg = JSON.parse(data);
          if (msg.metadata && msg.metadata.message_type === "session_welcome") {
            const sessionId = msg.payload.session.id;
            
            try {
              await assignWebSocketSessionToShard( accessToken, conduit.id, sessionId );
              
              const successful = [];

              for (let i = 0; i < userIds.length; i++) {
                const userId = userIds[i];
                const username = channel_names[i];
                const ok1 = await subscribeToEvent( accessToken, conduit.id, userId, "stream.online" );
                const ok2 = await subscribeToEvent( accessToken, conduit.id, userId, "stream.offline" );
                if (ok1 && ok2) successful.push(username);
              }

              if (successful.length) {
                console.log( `✅ Subscribed to online/offline events for: ${successful.join(", ")}` );

                for (const userId of userIds) {
                  await getStreamInfo(userId, accessToken, "already_live");
                }
              } else {
                console.log("❌ No successful subscriptions.");
              }
              
              ws.on("message", (eventData) => {
                let eventStr = eventData;

                if (Buffer.isBuffer(eventData)) {
                  eventStr = eventData.toString("utf8");
                }

                try {
                  const eventMsg = JSON.parse(eventStr);
                  if (
                    eventMsg.metadata &&
                    (eventMsg.metadata.message_type === "session_welcome" ||
                      eventMsg.metadata.message_type === "session_keepalive")
                  ) {
                    return;
                  }
                  
                  if (
                    eventMsg.payload &&
                    eventMsg.payload.subscription &&
                    eventMsg.payload.subscription.type === "stream.online" &&
                    eventMsg.payload.event &&
                    eventMsg.payload.event.broadcaster_user_id
                  ) {
                    getStreamInfo( eventMsg.payload.event.broadcaster_user_id, accessToken , "stream_start" );
                  } else if (
                    eventMsg.payload &&
                    eventMsg.payload.subscription &&
                    eventMsg.payload.subscription.type === "stream.offline" &&
                    eventMsg.payload.event &&
                    eventMsg.payload.event.broadcaster_user_id
                  ) {
                    getStreamInfo( eventMsg.payload.event.broadcaster_user_id, accessToken , "stream_end" );
                  }

                } catch (e) {
                  if (!eventStr.includes("session_keepalive")) {
                    console.log("📦 Received non-JSON data:", eventStr);
                  }
                }
              });
            } catch (err) {
              console.error("❌ Failed to assign session_id or enable shard:", err );
              ws.close();
            }
          }
        } catch (e) {
          console.error("❌ Error parsing WebSocket message:", e);
        }
      });
      ws.on("close", () => {});
      ws.on("error", (err) => {
        console.error("❌ WebSocket error:", err);
      });

    } catch (error) {
      console.error("❌ Error in EventSub setup:", error);
    }

    this.RunNextBlock("ready", cache);
  },
};