import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'
// import { CategoryEntity, CreateCategoryDto, UpdateCategoryDto } from '@/common/types/category'

let tokenSession = sessionStorage.getItem('token')
class CadastroSimplificadoService {
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

  getAllCadastroSimplificado(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/cadastro-simplificado', {
        headers: {
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to fetch all categories'
    )
  }

}


export default new CadastroSimplificadoService()
