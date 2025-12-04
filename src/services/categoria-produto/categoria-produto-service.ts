import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'
// import { CategoryEntity, CreateCategoryDto, UpdateCategoryDto } from '@/common/types/category'

let tokenSession = sessionStorage.getItem('token')
class CategoriaProdutoService {
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

  // #TODO - CRIAR INTARFACE PARA CATEGORIA ARTIGO

  getAllCategoriasProduto(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/categoria-produto'),
      'Failed to fetch all categories'
    )
  }

  creatCateforiaProduto(data: any): Promise<any> {
    return this.handleRequest(
      apiClient.post('/categoria-produto', data, {
        headers: {
          'Authorization': `Bearer ${tokenSession}`
        },
     }),
      'Failed to create category'
    )
  }

  editCategoriaProduto(id: string, data: any): Promise<any> {
    return this.handleRequest(
      apiClient.patch(`/categoria-produto/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to update category'
    )
  }

  deleteCategoriaProduto(id: string): Promise<any> {
    return this.handleRequest(
      apiClient.delete(`/categoria-produto/${id}`, {
        headers: {
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to delete category'
    )
  }

}


export default new CategoriaProdutoService()
