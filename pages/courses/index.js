import Card from "@/components/card";
import style from "/styles/course.module.css";
import PlayList_Card from "@/components/playlist-card";
export default function Courses({ data }) {
  return (
    <div className="pad_container">
      <h1 className="title">Courses</h1>

      <div className="course_flexbox">
        {data.length > 0 ? (
          data.map((item) => {
            return (
              <PlayList_Card
                playlist_data={item}
                key={item.id}
                isAdmin={false}
              />
            );
          })
        ) : (
          <h1>Nothing Found</h1>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const apiUrl =
    process.env.NODE_ENV === "production"
      ? `${process.env.Vercel_URL}/api/client/get_client_playlist`
      : "http://localhost:3000/api/client/get_client_playlist";

  const response = await fetch(apiUrl, {
    method: "GET",
    contentType: "application/json",
  });

  const res = await response.json();

  return {
    props: {
      data: res.data,
    },
  };
}
