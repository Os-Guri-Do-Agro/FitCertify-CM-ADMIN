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
      apiClient.delete(`/artigo/${id}`),
      'Failed to delete artigo'
    )
  }

  createArtigo(formData: FormData): Promise<any> {
  return this.handleRequest(
    apiClient.post('/artigo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    'Failed to create artigo'
  );
}
}


export default new ArtigoService()
