import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'
// import type IArtigo from '@/Interfaces/artigo-interface'
// import { CategoryEntity, CreateCategoryDto, UpdateCategoryDto } from '@/common/types/category'

class ArtigoService {
  private async handleRequest<T>(
    request: Promise<{ data: T }>,
    errorMessage: string
  ): Promise<T> {
    try {
      const { data } = await request
      return data
    } catch (error: any) {
      handleError(`${errorMessage}: ${error.message}`, error)
      throw error
    }
  }

  getAllArtigos(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/artigo'),
      'Failed to fetch all categories'
    )
  }

  deleteArtigo(id: string): Promise<any> {
    return this.handleRequest(
      apiClient.delete(`/artigo/${id}`,{
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWVhdHoydGEwMDBhcnUwcmM1YTBtMjBmIiwidXNlcklkIjoiY21lYXR6MnRhMDAwYXJ1MHJjNWEwbTIwZiIsInVzZXIiOnsiaWQiOiJjbWVhdHoydGEwMDBhcnUwcmM1YTBtMjBmIiwiZW1haWwiOiJuaWNvbGFzY2FzdGVsYTRAZ21haWwuY29tIiwibm9tZSI6Ik5pY29sYXNDYXN0ZWxhIiwic2VuaGEiOiIkMmIkMTIkQWlncFdXWkJhUjZ6TmJuemEvNU9hT3BRRHBJRlJqRWJQSmIyYVVNcWJEWGR0MjcvajVoYUciLCJhdmF0YXJVcmwiOm51bGwsIm5vbWVJbWFnZW1BdmF0YXIiOm51bGwsImNvbnRlbnRUeXBlQXZhdGFyIjpudWxsLCJtZWRpY29JZCI6bnVsbCwiYXRsZXRhSWQiOm51bGwsImVoQWRtaW4iOnRydWUsImNyZWF0ZWRBdCI6IjIwMjUtMDgtMTRUMDM6MTk6MzAuMDQ3WiIsInVwZGF0ZWRBdCI6IjIwMjUtMDgtMTRUMDM6MTk6MzAuMDQ3WiIsImF0aXZvIjp0cnVlfSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzU1MTQzMDc4LCJleHAiOjE3NTUzMTU4Nzh9.MZ8Dh1wmBlIKA6lHWptIY0vlyOXfbNK-DwlaXO8RUiU'
        },
    }),
      'Failed to delete artigo'
    )
  }

  createArtigo(formData: FormData): Promise<any> {
    return this.handleRequest(
      apiClient.post('/artigo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWVhdHoydGEwMDBhcnUwcmM1YTBtMjBmIiwidXNlcklkIjoiY21lYXR6MnRhMDAwYXJ1MHJjNWEwbTIwZiIsInVzZXIiOnsiaWQiOiJjbWVhdHoydGEwMDBhcnUwcmM1YTBtMjBmIiwiZW1haWwiOiJuaWNvbGFzY2FzdGVsYTRAZ21haWwuY29tIiwibm9tZSI6Ik5pY29sYXNDYXN0ZWxhIiwic2VuaGEiOiIkMmIkMTIkQWlncFdXWkJhUjZ6TmJuemEvNU9hT3BRRHBJRlJqRWJQSmIyYVVNcWJEWGR0MjcvajVoYUciLCJhdmF0YXJVcmwiOm51bGwsIm5vbWVJbWFnZW1BdmF0YXIiOm51bGwsImNvbnRlbnRUeXBlQXZhdGFyIjpudWxsLCJtZWRpY29JZCI6bnVsbCwiYXRsZXRhSWQiOm51bGwsImVoQWRtaW4iOnRydWUsImNyZWF0ZWRBdCI6IjIwMjUtMDgtMTRUMDM6MTk6MzAuMDQ3WiIsInVwZGF0ZWRBdCI6IjIwMjUtMDgtMTRUMDM6MTk6MzAuMDQ3WiIsImF0aXZvIjp0cnVlfSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzU1MTQzMDc4LCJleHAiOjE3NTUzMTU4Nzh9.MZ8Dh1wmBlIKA6lHWptIY0vlyOXfbNK-DwlaXO8RUiU'
        },
      }),
      'Failed to create artigo'
    );
  }
}


export default new ArtigoService()
