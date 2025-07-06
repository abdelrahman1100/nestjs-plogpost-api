import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';

class CreatePostDto {
  title: string;
  content: string;
}

class UpdatePostDto {
  title: string;
  content: string;
}

@Controller('posts')
@UseGuards(AuthGuard())
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Body(ValidationPipe) createPostDto: CreatePostDto,
    @GetUser() user: User,
  ) {
    return this.postsService.create(createPostDto.title, createPostDto.content, user);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ) {
    return this.postsService.update(+id, updatePostDto.title, updatePostDto.content, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.postsService.remove(+id, user);
  }
}