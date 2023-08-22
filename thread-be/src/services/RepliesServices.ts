import { Repository } from "typeorm";
import { Replies } from "../entities/Replies";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
// import { threadId } from "worker_threads";

class RepliesServices {
  private readonly repliesRepository: Repository<Replies> =
    AppDataSource.getRepository(Replies);

  async find(reqQuery: any): Promise<any> {
    try {
      const threadId = parseInt(reqQuery.threadId ?? 0);
      const Replies = await this.repliesRepository.find({
        relations: ["user", "thread"],
        where: {
          thread: {
            id: threadId,
          },
        },
        order: {
          id: "DESC",
        },
      });
      return Replies;
    } catch (err) {
      throw new Error("Something error");
    }
  }

  async create(req: any, res: Response): Promise<any> {
    try {
      const data = req.body;
      const loginSession = res.locals.loginSession;

      const replies = this.repliesRepository.create({
        content: data.content,
        thread: data.thread,
        user: {
          id: loginSession.user.id,
        },
      });
      const create = this.repliesRepository.save(replies);
      return res.status(200).json({ create, true: "bener nih" });
    } catch (err) {
      return res.status(500).json({ salah: "ini salah ya", err });
    }
  }
}

export default new RepliesServices();
