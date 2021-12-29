import { HomeIcon, LibraryIcon, PlusCircleIcon, RssIcon, SearchIcon } from '@heroicons/react/outline';
import React, {useEffect, useState} from 'react';
import {signOut, useSession} from "next-auth/react";

import {HeartIcon} from '@heroicons/react/solid';
import {playlistIdState} from "../atoms/playlistAtom"
import { useRecoilState } from "recoil";
import useSpotify from '../hooks/useSpotify';

function Sidebar() {
    const spotifyApi = useSpotify();
    const {data:session , status} = useSession();
    const [playlist, setPlaylist] = useState([]);
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
    useEffect(() => {
       if(spotifyApi.getAccessToken()){
           spotifyApi.getUserPlaylists().then((data)=> {
               console.log('data',data);
               setPlaylist(data.body.items);
           })
       }
    }, [playlistId])

    console.log('playlist',playlist);
    console.log('playlistId',playlistId);
    return (
        <div className='text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex'>
            <div className='space-y-4'>
                <button className='flex items-center space-x-2  hover:text-white' onClick={()=>signOut()}>
                    <p>Logout</p>
                </button>
                <button className='flex items-center space-x-2  hover:text-white'>
                    <HomeIcon className='w-5 h-5'/>
                    <p>Home</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <SearchIcon className='w-5 h-5'/>
                    <p>Search</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <LibraryIcon className='w-5 h-5'/>
                    <p>Your Library</p>
                </button>
               <hr className='border-t-[0.1px] border-gray-900'/>

               <button className='flex items-center space-x-2 hover:text-white'>
                    <PlusCircleIcon className='w-5 h-5'/>
                    <p>Create Playlist</p>
                </button>
                <button className='flex items-center text-blue-500 space-x-2 hover:text-white'>
                    <HeartIcon className='w-5 h-5'/>
                    <p>Liked Songs</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <RssIcon className='text-green-500 w-5 h-5'/>
                    <p>Your episodes</p>
                </button>
                
                <hr className='border-t-[0.1px] border-gray-900'/>

                {playlist.map((list)=>(
                    <p key={list.id}  onClick={()=>setPlaylistId(list.id)} className='cursor-pointer hover:text-white'> {list.name }</p>
                ))}
                
            </div>
        </div>
    )
}

export default Sidebar
