export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  published: boolean
  createdAt: Date
  updatedAt: Date
  tags: Tag[]
}

export interface Tag {
  id: string
  name: string
} 