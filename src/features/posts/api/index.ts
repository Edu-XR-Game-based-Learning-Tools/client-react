/* eslint-disable @typescript-eslint/no-explicit-any */
import { Post } from 'features/posts/types'
import axiosInstance from 'libs/core/configureAxios'

const POSTS_BASE_URL = `/posts`

export const getPosts = (): Promise<Post[]> => axiosInstance.get(POSTS_BASE_URL)

export const createPost = (post: Post): Promise<Post> => axiosInstance.post(POSTS_BASE_URL, post)

export const updatePost = (post: Post): Promise<Post> =>
  axiosInstance.put(`${POSTS_BASE_URL}/${post.id}`, post)

export const deletePost = (post: Post): Promise<Post> =>
  axiosInstance.delete(`${POSTS_BASE_URL}/${post.id}`, { data: post })
