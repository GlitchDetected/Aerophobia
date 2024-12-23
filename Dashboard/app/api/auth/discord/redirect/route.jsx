import { NextResponse } from 'next/server';
import axios from 'axios';
import { serialize, parse } from 'cookie';

async function getUserInfo(accessToken) {
  try {
    const userinfo = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return userinfo.data;
  } catch (error) {
    console.error('Error fetching user info:', error.response?.data || error.message);
    return null;
  }
}

async function getUserGuilds(accessToken) {
  try {
    const guilds = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return guilds.data;
  } catch (error) {
    console.error('Error fetching user guilds:', error.response?.data || error.message);
    return null;
  }
}

async function getBotGuilds(botToken) {
  try {
    const guilds = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bot ${botToken}` },
    });
    return guilds.data;
  } catch (error) {
    console.error('Error fetching bot guilds:', error.response?.data || error.message);
    return null;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = parse(cookieHeader);
  
  let accessToken = cookies.access_token;

  if (!accessToken && code) {
    const formData = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_CLIENTID,
      client_secret: process.env.ClientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECTURI,
    });

    try {
      const output = await axios.post('https://discord.com/api/v10/oauth2/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      accessToken = output.data.access_token;
      const refreshToken = output.data.refresh_token;

      const redirectUrl = new URL('/', request.url);

      return NextResponse.redirect(redirectUrl.toString(), {
        headers: {
          'Set-Cookie': [
            serialize('access_token', accessToken, { httpOnly: true, path: '/', maxAge: 3600 }),
            serialize('refresh_token', refreshToken, { httpOnly: true, path: '/', maxAge: 1209600 }),
          ],
        },
      });
    } catch (error) {
      console.error('Error exchanging code for token:', error.response?.data || error.message);
      return new NextResponse('Error during OAuth process', { status: 500 });
    }
  }

  if (!accessToken) {
    return new NextResponse('Authorization required', { status: 401 });
  }

  const userData = await getUserInfo(accessToken);
  if (!userData) {
    return new NextResponse('Invalid token or token expired', { status: 401 });
  }

  const userGuilds = await getUserGuilds(accessToken);
  if (!userGuilds) {
    return new NextResponse('Error fetching user guilds', { status: 500 });
  }

  // Replace with your bot's access token
  const botToken = process.env.BOT_TOKEN; // Ensure your bot's token is in the environment variables
  const botGuilds = await getBotGuilds(botToken);
  if (!botGuilds) {
    return new NextResponse('Error fetching bot guilds', { status: 500 });
  }

  // Find common guilds where both the user and bot are members
  const commonGuilds = userGuilds.filter(userGuild =>
    botGuilds.some(botGuild => botGuild.id === userGuild.id)
  );

  const avatarUrl = userData.avatar
    ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}${userData.avatar.startsWith('a_') ? '.gif' : '.png'}`
    : 'https://cdn.discordapp.com/embed/avatars/0.png';

  const response = new NextResponse(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>User Guilds</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #f5f5f5;
        }
        .header {
          width: 100%;
          background-color: #6200ea;
          color: white;
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
        }
        .user-info {
          margin-right: 20px;
          display: flex;
          align-items: center;
        }
        .user-info img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .guilds-container {
          margin-top: 70px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          padding: 20px;
        }
        .guild-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin: 10px;
          width: 80px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: transform 0.3s;
        }
        .guild-card img {
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }
        .guild-card:hover {
          transform: scale(1.05);
        }
        button {
          background-color: #ff4757;
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          padding: 10px 15px;
          font-size: 1rem;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #ff6b81;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="user-info">
          <img src="${avatarUrl}" alt="${userData.username}'s Avatar" />
          <span>${userData.username}#${userData.discriminator}</span>
        </div>
        <button onclick="logout()">Logout</button>
      </div>
      <div class="guilds-container">
        ${commonGuilds.map(guild => `
          <div class="guild-card">
            <img src="https://cdn.discordapp.com/icons/${guild.id}/${guild.icon || 'default.png'}" alt="${guild.name}'s Logo" />
          </div>
        `).join('')}
      </div>
      <script>
        function logout() {
          document.cookie = 'access_token=; Max-Age=0; path=/';
          document.cookie = 'refresh_token=; Max-Age=0; path=/';
          window.location.href = '/';
        }
      </script>
    </body>
    </html>`,
    { headers: { 'Content-Type': 'text/html' } },
  );

  return response;
}
