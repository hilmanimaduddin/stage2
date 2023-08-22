import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./Users";
import { Replies } from "./Replies";
import { Likes } from "./Likes";

@Entity({ name: "threads" })
export class Thread {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  image: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  posted_at: Date;

  @Column({ nullable: true })
  Date: string;

  @ManyToOne(() => User, (user) => user.threads, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;

  @OneToMany(() => Likes, (likes) => likes.thread, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  likes: Likes[];

  @OneToMany(() => Replies, (replies) => replies.thread, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  replies: Replies[];

  // @ManyToOne(() => Replies, (user) => user.id)
  // replies: Replies;

  // @ManyToOne(() => Likes, (likes) => likes.id)
  // likes: Likes;

  // @ManyToOne(() => Followers, (followers) => followers.id)
  // followers: Followers;
}
