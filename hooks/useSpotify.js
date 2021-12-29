import { signIn, useSession } from "next-auth/react";
import {useEffect, useState} from "react";

import SpotifyWebApi from "spotify-web-api-node";

function useSpotify() {
    const {data:session,status} = useSession();
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        // accessToken: session.user.accessToken,
        // refreshToken: session.user.refreshToken,
    });
    spotifyApi.setAccessToken(session.user.accessToken);
    // useEffect(() => {
    //   if(session){
    //     console.log('session',session);

    //       //if refresh access token attempt fails, direct user to login..
    //     if(session.error === "RefreshAccessTokenError"){
    //         signIn();
    //     }
    //     if(spotifyApi.getAccessToken()){
    //         spotifyApi.setAccessToken(session.user.accessToken);
    //     }else{
    //         spotifyApi.setRefreshToken(session.user.refreshToken);
    //     }
    //   }
    // }, [session]);

    return spotifyApi;
}

export default useSpotify;
