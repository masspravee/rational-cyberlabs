import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MainVideo from "@/components/mainVideo";
import SendData from "@/components/sendData";

export default function AdminVideo({ playlistData }) {
  const router = useRouter();
  const { course_id, video_id } = router.query;
  const [comments, setComments] = useState([]);
  const [changeVideoQuery, setChangeVideoQuery] = useState(video_id);
  const getComments = async (course_id, video_id) => {
    setComments([]);
    const response = await SendData("single_playlist_comment", {
      course_id: course_id,
      video_id: video_id,
    });
    if (response.status === 200) {
      console.log(response.commentData);
      setComments(response.commentData);
    } else {
      setComments([]);
    }
  };
  useEffect(() => {
    console.log("video changed");
    router.push(`/courses/${course_id}/video/${changeVideoQuery}`);
    getComments(course_id, changeVideoQuery);
  }, [changeVideoQuery]);

  return (
    <div className="pad_container">
      <MainVideo
        videoData={playlistData}
        course_id={course_id}
        commentData={comments}
        changeComment={setComments}
        currentVideo={changeVideoQuery}
        changeVideoQuery={setChangeVideoQuery}
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { course_id, video_id } = context.query;

  const apiUrl =
    process.env.NODE_ENV === "production"
      ? `${process.env.Vercel_URL}/api/single_playlist`
      : "http://localhost:3000/api/single_playlist";

  const playlistId = { course_id: course_id, video_id: video_id };
  const response = await fetch(apiUrl, {
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify(playlistId),
  });

  const res = await response.json();
  return {
    props: {
      playlistData: res.message,
    },
  };
}
