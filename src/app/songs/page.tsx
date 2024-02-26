"use client";

import React, { useState, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import sdk from "@/lib/spotify-sdk/ClientInstance";
import { Device, SpotifyApi } from "@spotify/web-api-ts-sdk";
import { Track } from "@/lib/trackType";

type Props = {};

const Page = (props: Props) => {
  const session: any = useSession();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [devices, setDevices] = useState<Device>({
    id: "",
    is_active: false,
    is_private_session: false,
    is_restricted: false,
    name: "",
    type: "",
    volume_percent: 59,
  });
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const getDevices = async ({ sdk }: { sdk: SpotifyApi }) => {
      try {
        const devices = await sdk.player.getAvailableDevices();
        console.log(devices, "DEVICES");
        setDevices(devices.devices[0]);
      } catch (error) {
        console.error("Error getting devices:", error);
      }
    };
    getDevices({ sdk });
    const getTracks = async ({ sdk }: { sdk: SpotifyApi }) => {
      try {
        const track = (await sdk.tracks.get(
          "11dFghVXANMlKmJXsNCbNl",
          "ES"
        )) as Track;
        setSelectedTrack(track);
      } catch (error) {
        console.error("Error playing track:", error);
      }
    };
    getTracks({ sdk });

    const getRecommendations = async ({ sdk }: { sdk: SpotifyApi }) => {
      try {
        const recommendations = await sdk.recommendations.get({
          seed_artists: ["4NHQUGzhtTLFvgF5SZesLK"],
        });
        console.log(recommendations, "RECOMmendations");
      } catch (error) {
        console.error("Error getting recommendations:", error);
      }
    };
    getRecommendations({ sdk });

    const getUser = async ({ sdk }: { sdk: SpotifyApi }) => {
      try {
        const user = await sdk.currentUser.topItems(
          "artists",
          "medium_term",
          5
        );
        setUser(user);
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };
    getUser({ sdk });
  }, [session]);
  if (!session || session.status !== "authenticated") {
    return (
      <div>
        <h1>Spotify Web API Typescript SDK in Next.js</h1>
        <button onClick={() => signIn("spotify")}>Sign in with Spotify</button>
      </div>
    );
  }
  // console.log(devices.id);
  //this is how you can get the preview url of the track
  console.log(selectedTrack?.preview_url);
  console.log(user);

  const playTrack = async ({ sdk }: { sdk: SpotifyApi }) => {
    try {
      const isPlaying = await sdk.player.startResumePlayback(
        devices.id,
        selectedTrack?.album.uri
      );
      return isPlaying;
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  const playPreview = () => {
    audioRef.current?.play();
  };

  console.log(devices);
  return (
    <div>
      {selectedTrack && (
        <div>
          <h1>Track: {selectedTrack.name}</h1>
          <p>Artist: {selectedTrack.artists[0].name}</p>
          <p>Album: {selectedTrack.album.name}</p>
          <p>Duration: {selectedTrack.duration_ms}</p>
          <p>Release date: {selectedTrack.album.release_date}</p>
          <img
            src={selectedTrack.album.images[0].url}
            alt={selectedTrack.name}
          />
          <button
            onClick={() => playTrack({ sdk })}
            className="w-[5rem] h-[5rem] bg-green-500 rounded-full"
          >
            Play
          </button>
          <audio src={selectedTrack?.preview_url} ref={audioRef} />
          <button
            onClick={() => playPreview()}
            className="w-[5rem] h-[5rem] bg-green-500 rounded-full"
          >
            Play Preview
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;
