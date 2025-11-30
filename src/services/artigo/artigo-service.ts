import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'
// import type IArtigo from '@/Interfaces/artigo-interface'
// import { CategoryEntity, CreateCategoryDto, UpdateCategoryDto } from '@/common/types/category'




let tokenSession = sessionStorage.getItem('token')
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

   getArtigosById(id:string): Promise<any> {
    return this.handleRequest(
      apiClient.get(`/artigo/${id}`),
      'Failed to fetch all categories'
    )
  }

  deleteArtigo(id: string): Promise<any> {
    return this.handleRequest(
      apiClient.delete(`/artigo/${id}`,{
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${tokenSession}`
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
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to create artigo'
    );
  }

  updateArtigo(id: string, formData: FormData): Promise<any> {
    return this.handleRequest(
      apiClient.patch(`/artigo/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to update artigo'
    );
  }

  getAllCategorias(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/categoria-artigo'),
      'Failed to fetch all categories'
    )
  }

  apagarCategoria(id: string): Promise<any> {
    return this.handleRequest(
      apiClient.delete(`/categoria-artigo/${id}`,{
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${tokenSession}`
        },
    }),
      'Failed to delete category'
    )
  }

  updateCategoria(id: string, data: any): Promise<any> {
    return this.handleRequest(
      apiClient.patch(`/categoria-artigo/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to update category'
    );
  }

  criarCategoria(data: any): Promise<any> {
    return this.handleRequest(
      apiClient.post('/categoria-artigo', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to create category'
    );
  }

}


export default new ArtigoService()
