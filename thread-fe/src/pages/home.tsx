import { Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RightBar } from "../features/thread/component/RightBar";
import { SideBar } from "../features/thread/component/SideBar";
import ThreadCard from "../features/thread/component/ThreadCard";
import { CreatePost } from "../features/thread/component/createPost";
import { API } from "../lib/api";
import { ThreadCardType } from "../types/interface/IType";
import { useSelector } from "react-redux";
import { RootState } from "../stores/types/rootState";

export function Home() {
  const [thread, setThread] = useState<ThreadCardType[]>([]);
  // const user = useSelector((state: RootState) => state.user);

  // console.log("ni data usernya", user);

  async function fetchData() {
    try {
      const res = await API.get("/thread/", {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      });
      setThread(res.data);
    } catch (error) {
      console.error("error");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid h="fit-content" templateColumns="repeat(10, 1fr)" gap={4}>
      <GridItem colSpan={2}>
        <SideBar />
      </GridItem>
      <GridItem
        colSpan={5}
        borderEnd="2px"
        borderLeft="2px"
        borderColor="#2f2f2f"
        p={5}
      >
        <CreatePost />
        {thread.map((item, index) => {
          return (
            <ThreadCard
              key={index}
              id={item.id}
              author_picture={item.user?.profile_picture}
              author_full_name={item.user?.full_name}
              author_username={item.user?.username}
              posted_at={item.posted_at}
              content={item.content}
              image={item.image}
              replies_count={item.replies_count}
              likes_count={item.likes_count}
              // is_liked={item.is_liked}
              liked={item.likes?.likes_count}
              Date={item.Date}
            />
          );
        })}
      </GridItem>
      <GridItem colSpan={3}>
        <RightBar />
      </GridItem>
    </Grid>
  );
}
