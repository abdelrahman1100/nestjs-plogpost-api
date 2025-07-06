import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(title: string, content: string, user: User): Promise<Post> {
    const post = this.postRepository.create({
      title,
      content,
      author: user,
    });

    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['author'],
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: number, title: string, content: string, user: User): Promise<Post> {
    const post = await this.findOne(id);

    if (post.author.id !== user.id) {
      throw new NotFoundException('You can only update your own posts');
    }

    post.title = title;
    post.content = content;

    return this.postRepository.save(post);
  }

  async remove(id: number, user: User): Promise<void> {
    const post = await this.findOne(id);

    if (post.author.id !== user.id) {
      throw new NotFoundException('You can only delete your own posts');
    }

    await this.postRepository.remove(post);
  }
}