export interface Tag {
  id: string
  name: string
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  published: boolean
  createdAt: string | Date
  updatedAt: string | Date
  tags: Tag[]
} 