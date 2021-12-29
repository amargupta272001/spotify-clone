import { FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, RewindIcon } from "@heroicons/react/solid";
import {SwitchHorizontalIcon, VolumeOffIcon, VolumeUpIcon} from "@heroicons/react/outline";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import {useCallback, useEffect, useState} from "react";

import { debounce } from "lodash";
import { useRecoilState } from "recoil";
import { useSession } from "next-auth/react";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
    const spotifyApi = useSpotify();
    const { data:session, status} = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume,setVolume] = useState(50);
    const [currentTrack,setCurrentTrack] = useState();
    const songInfo = useSongInfo();
    const fetchCurrentSong = () => {
        if(!songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                console.log("current playing:" , data.body);
                setCurrentTrackId(data.body?.item?.id);
                setCurrentTrack(data.body?.item);
            });

            spotifyApi.getMyCurrentPlaybackState().then((data) => {
                console.log("current track:" , data.body?.is_playing);
                setIsPlaying(data.body?.is_playing);
            });
        }
    }
    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data)=>{
            if(data?.body?.is_playing){
                spotifyApi.pause();
                setIsPlaying(false);
            }else{
                spotifyApi.play();
                setIsPlaying(true);
            }
        })
    }

    useEffect(() => {
        // if(spotifyApi.getAccessToken()){
            fetchCurrentSong();
            setVolume(50);
        // }
    }, [currentTrackIdState]);


    useEffect(() => {
        if(volume>0 && volume<100){
            debouncedAdjustVolume(volume);
        }
    }, [volume]);


    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch(err=> console.log(err))
        },500),
        []
    )

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            <div className="flex items-center space-x-4">
                <img className="w-10 h-10 hidden md:inline" src={currentTrack?.album?.images?.[0].url} alt="" />
                <div>
                    <h3>{currentTrack?.name}</h3>
                    <p>{currentTrack?.artists?.[0]?.name}</p>
                </div>
            </div>
           <div className="flex items-center justify-evenly">
               <SwitchHorizontalIcon className="button" />
               <RewindIcon className="button"/>
               {isPlaying ? (
                   <PauseIcon onClick={()=>handlePlayPause()} className="button w-10 h-10"/>
                ):
                    <PlayIcon onClick={()=>handlePlayPause()} className="button w-10 h-10"/>
                }
                <FastForwardIcon className="button"/>
                <ReplyIcon className="button"/>
           </div>
           <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeUpIcon onClick={()=> volume>0 && setVolume(volume-10)} className="button"/>
                <input onChange={(e)=>setVolume(Number(e.target.value))

                } className="w-14 md:w-28" type="range" value={volume} min={0} max={100}/>
                <VolumeUpIcon onClick={()=> volume<100 && setVolume(volume+10)} className="button"/>
           </div>
        </div>
    )
}

export default Player
