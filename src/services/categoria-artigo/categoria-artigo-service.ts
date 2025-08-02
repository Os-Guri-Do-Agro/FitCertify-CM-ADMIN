import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'
// import { CategoryEntity, CreateCategoryDto, UpdateCategoryDto } from '@/common/types/category'

class CategoriaArtigoService {
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

  getAllCategoriasArtigo(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/categoria-artigo'),
      'Failed to fetch all categories'
    )
  }




}


export default new CategoriaArtigoService()
