import Head from "next/head";
import { getStatus } from "mc-server-status";
import BlockingFont from "../components/BlockingFont";

const Home = ({ isOnline, title, onlinePlayers, maxPlayers, version, favicon, players }) => (
    <div>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>{title}</title>
            <link
                rel="icon"
                type="image/png"
                href={`/favicon-${isOnline ? "online" : "offline"}.png`}
            />
        </Head>
        <BlockingFont family="MinecraftBody" href="MinecraftBody.woff2" format="woff2" />
        <div style={{ verticalAlign: 'middle' }}>
            <img src={favicon}></img>
            {title}
        </div>
        <div>{isOnline ? "Online 🟢" : "Offline 🔴"}</div>
        <div>Players: {isOnline ? onlinePlayers : ""} / {isOnline ? maxPlayers : ""}</div>
        <div>Version: {isOnline ? version : ""}</div>
        <hr></hr>
        <span>Online Players:</span>
        <ul>
            {
                players != null ?
                    players.map((val) => {
                        return <li key={val.id}>{val.name}</li>
                    }) : ''
            }
        </ul>
    </div>
);

export const getStaticProps = async () => {
    const getServerStatus = async () => {
        const response = await getStatus({
            host: "mc.rankofmatrix.com",
        });
        console.info(response)
        return { isOnline: true, title: response.description.extra[0].text, maxPlayers: response.players.max, onlinePlayers: response.players.online, version: response.version.name.split(" ")[1], ping: response.ping, favicon: response.favicon, players: response.players.sample != undefined ? response.players.sample : null };
    };

    const timeout = (interval) => {
        return new Promise((_, reject) => setTimeout(reject, interval));
    };

    const { isOnline, title, maxPlayers, onlinePlayers, version, favicon, players } = await Promise.race([getServerStatus(), timeout(1000)]).catch(
        () => ({
            isOnline: false,
            title: "Server offline",
            onlinePlayers: "",
            maxPlayers: "",
            version: "",
            favicon: "",
            players: null
        })
    );

    return {
        props: {
            isOnline,
            title,
            onlinePlayers,
            maxPlayers,
            version,
            favicon,
            players
        },
    };
};

export default Home;
