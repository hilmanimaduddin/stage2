import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Thread } from "../entities/Thread";

class ThreadsService {
  private readonly threadRepository: Repository<Thread> =
    AppDataSource.getRepository(Thread);

  async find(reg: Request, res: Response) {
    try {
      const threads = await this.threadRepository.find({
        relations: ["user", "replies", "likes"],
        order: {
          id: "DESC",
        },
      });

      let newResponse = [];

      threads.forEach((element) => {
        // element.image = "http://localhost:5000/uploads/" + element.image;
        newResponse.push({
          ...element,
          replies_count: element.replies.length,
          likes_count: element.likes.length,
        });
      });

      return res.status(200).json(newResponse);
    } catch (err) {
      return res.status(500).json({ error: "Error while getting threads" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const filename = req.file.filename;
      const loginSession = res.locals.loginSession;

      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      });

      const cloudinaryResponse = await cloudinary.uploader.upload(
        "./uploads/" + filename
      );

      console.log("cloud Res", cloudinaryResponse);

      const thread = this.threadRepository.create({
        content: data.content,
        image: cloudinaryResponse.secure_url,
        user: {
          id: loginSession.user.id,
        },
      });
      const createThread = this.threadRepository.save(thread);
      return res.status(200).json(createThread);
    } catch (err) {
      return res.status(500).json({ error: "sorry there was an error", err });
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const threads = await this.threadRepository.findOne({
        relations: ["user", "replies", "likes"],
        where: {
          id: id,
        },
      });

      return res.status(200).json(threads);
    } catch (err) {
      return res.status(500).json({ error: "sorry there was an error" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const thread = await this.threadRepository.delete(id);
      return res.status(200).json(thread);
    } catch (err) {
      return res.status(500).json({ error: "sorry there was an error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const thread = await this.threadRepository.findOne({
        where: {
          id: id,
        },
      });
      const data = req.body;

      if (data.content != "") {
        thread.content = data.content;
      }
      if (data.image != "") {
        thread.image = data.image;
      }
      if (data.replies != "") {
        thread.replies = data.replies;
      }
      if (data.likes != "") {
        thread.likes = data.likes;
      }
      if (data.user != "") {
        thread.user = data.user;
      }

      const updateThread = this.threadRepository.save(thread);
      return res.status(200).json(updateThread);
    } catch (err) {
      return res.status(500).json({ error: "sorry there was an error" });
    }
  }
}

export default new ThreadsService();
